"use client";

// Live-scene session hook: owns the mic -> worklet -> transport pipeline, the
// playback queue, live transcription assembly, and the session clock. Screens
// consume the state; wire details live in the transport module.
//
// Lifecycle: start() must run inside the tap gesture (mic permission + audio
// context). Connect failures or an instant close retry once against the
// fallback model (a fresh mint, since the model id is locked in the token).
// On the deadline the mic stops, the character gets up to 10s to finish a
// goodbye turn, then the session ends. An unexpected drop mid-scene salvages
// the dialog when the user already spoke enough turns to judge.

import { useEffect, useRef, useState } from "react";
import { startLiveSession } from "@/lib/actions";
import type { LiveDialogTurn } from "@/lib/coach-live";
import { useLocale } from "@/components/i18n-provider";
import { connectGeminiLive, type LiveTransport } from "./live-transport";
import { createPcmWorkletUrl, PCM_WORKLET_NAME, pcm16ToBase64 } from "./pcm-worklet";

export type LivePhase = "idle" | "connecting" | "live" | "wrapup" | "closed" | "error";
export type LiveErrorKind = "mic" | "unsupported" | "config" | "connect" | "dropped" | "rate";

const MIN_USER_TURNS_TO_SALVAGE = 2; // mirrors LIVE_MIN_USER_TURNS server-side
const WRAPUP_LEAD_SEC = 30;
const FINAL_TURN_GRACE_MS = 10_000;
const INSTANT_CLOSE_MS = 2_000;
const SPEAKING_THRESHOLD = 0.025;
const SPEAKING_HOLD_MS = 350;
const WRAPUP_CONTROL =
  "Time is almost up. Bring the scene to a natural, warm close in your next reply and say goodbye in character.";

export type LiveSessionState = {
  phase: LivePhase;
  errorKind: LiveErrorKind | null;
  dialog: LiveDialogTurn[];
  pendingAi: string; // character caption still being spoken
  pendingYou: string; // user caption still being transcribed
  muted: boolean;
  aiSpeaking: boolean;
  userSpeaking: boolean;
  elapsed: number;
  maxSeconds: number;
  start: () => Promise<void>;
  end: () => void;
  toggleMute: () => void;
};

export function useLiveSession({
  scenarioId,
  onFinished,
}: {
  scenarioId: string;
  onFinished: (dialog: LiveDialogTurn[], durationSec: number, salvage: boolean) => void;
}): LiveSessionState {
  const locale = useLocale();

  const [phase, setPhase] = useState<LivePhase>("idle");
  const [errorKind, setErrorKind] = useState<LiveErrorKind | null>(null);
  const [dialog, setDialog] = useState<LiveDialogTurn[]>([]);
  const [pendingAi, setPendingAi] = useState("");
  const [pendingYou, setPendingYou] = useState("");
  const [muted, setMuted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [maxSeconds, setMaxSeconds] = useState(240);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const workletUrlRef = useRef<string | null>(null);
  const transportRef = useRef<LiveTransport | null>(null);
  const scheduledRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const playCursorRef = useRef(0);

  const dialogRef = useRef<LiveDialogTurn[]>([]);
  const pendingAiRef = useRef("");
  const pendingYouRef = useRef("");

  const mutedRef = useRef(false);
  const endedRef = useRef(false);
  const stopSendingRef = useRef(false);
  const deadlineReachedRef = useRef(false);
  const wrapupSentRef = useRef(false);
  const openedAtRef = useRef(0);
  const startedAtRef = useRef(0);
  const lastVoiceAtRef = useRef(0);
  const attemptRef = useRef<"primary" | "fallback">("primary");
  const maxSecondsRef = useRef(240);
  // Bumped per connection attempt; a dead socket fires late error/close
  // events that must not touch the newer connection (fallback retry race).
  const generationRef = useRef(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const graceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef(0);

  useEffect(() => () => teardown(), []);

  function teardown() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (graceRef.current) clearTimeout(graceRef.current);
    graceRef.current = null;
    cancelAnimationFrame(rafRef.current);
    for (const src of scheduledRef.current) {
      try {
        src.stop();
      } catch {}
    }
    scheduledRef.current.clear();
    playCursorRef.current = 0;
    try {
      transportRef.current?.close();
    } catch {}
    transportRef.current = null;
    workletRef.current?.disconnect();
    workletRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    if (workletUrlRef.current) URL.revokeObjectURL(workletUrlRef.current);
    workletUrlRef.current = null;
  }

  function fail(kind: LiveErrorKind) {
    endedRef.current = true;
    teardown();
    setErrorKind(kind);
    setPhase("error");
  }

  /* ---------- transcript assembly ---------- */

  function commitYou() {
    const text = pendingYouRef.current.trim();
    if (text) dialogRef.current = [...dialogRef.current, { role: "you", text }];
    pendingYouRef.current = "";
    setPendingYou("");
    setDialog(dialogRef.current);
  }

  function commitAi() {
    const text = pendingAiRef.current.trim();
    if (text) dialogRef.current = [...dialogRef.current, { role: "ai", text }];
    pendingAiRef.current = "";
    setPendingAi("");
    setDialog(dialogRef.current);
  }

  function userTurnCount(): number {
    return dialogRef.current.filter((t) => t.role === "you").length;
  }

  /* ---------- playback ---------- */

  function playChunk(pcm: Int16Array, sampleRate: number) {
    const ctx = ctxRef.current;
    if (!ctx || pcm.length === 0 || endedRef.current) return;
    const buffer = ctx.createBuffer(1, pcm.length, sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < pcm.length; i++) channel[i] = pcm[i] / 0x8000;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    const at = Math.max(playCursorRef.current, ctx.currentTime + 0.02);
    src.start(at);
    playCursorRef.current = at + buffer.duration;
    scheduledRef.current.add(src);
    src.onended = () => {
      scheduledRef.current.delete(src);
      if (scheduledRef.current.size === 0) setAiSpeaking(false);
    };
    setAiSpeaking(true);
  }

  function flushPlayback() {
    for (const src of scheduledRef.current) {
      try {
        src.stop();
      } catch {}
    }
    scheduledRef.current.clear();
    playCursorRef.current = 0;
    setAiSpeaking(false);
  }

  /* ---------- session end ---------- */

  function finish(salvage: boolean) {
    if (endedRef.current) return;
    endedRef.current = true;
    commitAi();
    commitYou();
    const durationSec = Math.min(
      270,
      Math.max(10, Math.round((Date.now() - startedAtRef.current) / 1000))
    );
    const finalDialog = dialogRef.current;
    teardown();
    setPhase("closed");
    onFinishedRef.current(finalDialog, durationSec, salvage);
  }

  function handleUnexpectedClose() {
    if (endedRef.current) return;
    // Never reached a stable open: try the fallback model once (fresh mint).
    if (
      phaseRef.current === "connecting" ||
      Date.now() - openedAtRef.current < INSTANT_CLOSE_MS
    ) {
      if (attemptRef.current === "primary") {
        attemptRef.current = "fallback";
        void connectWithModel("fallback");
      } else {
        fail("connect");
      }
      return;
    }
    // Dropped mid-scene: salvage a judgeable dialog, otherwise surface it.
    commitAi();
    commitYou();
    if (userTurnCount() >= MIN_USER_TURNS_TO_SALVAGE) {
      finish(true);
    } else {
      fail("dropped");
    }
  }

  /* ---------- clock ---------- */

  function startClock() {
    startedAtRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (endedRef.current) return;
      const sec = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setElapsed(sec);
      const max = maxSecondsRef.current;
      if (sec >= max - WRAPUP_LEAD_SEC && !wrapupSentRef.current) {
        wrapupSentRef.current = true;
        setPhase("wrapup");
        try {
          transportRef.current?.sendControl(WRAPUP_CONTROL);
        } catch {}
      }
      if (sec >= max && !deadlineReachedRef.current) {
        deadlineReachedRef.current = true;
        stopSendingRef.current = true; // mic off; let the goodbye land
        graceRef.current = setTimeout(() => finish(false), FINAL_TURN_GRACE_MS);
      }
    }, 500);
  }

  /* ---------- connect ---------- */

  async function connectWithModel(choice: "primary" | "fallback") {
    const generation = ++generationRef.current;
    const stale = () => generation !== generationRef.current || endedRef.current;

    let res;
    try {
      res = await startLiveSession({ scenarioId, locale, model: choice });
    } catch {
      if (!stale()) fail("connect");
      return;
    }
    if (stale()) return;
    if (!res.ok) {
      fail(res.code === "config" ? "config" : res.code === "rate" ? "rate" : "connect");
      return;
    }
    maxSecondsRef.current = res.maxSeconds;
    setMaxSeconds(res.maxSeconds);

    try {
      transportRef.current = await connectGeminiLive(
        { token: res.token, model: res.model },
        {
          onOpen: () => {
            if (stale()) return;
            openedAtRef.current = Date.now();
            if (!timerRef.current) startClock();
            setPhase("live");
          },
          onAudioChunk: (pcm, rate) => {
            if (!stale()) playChunk(pcm, rate);
          },
          onInputTranscription: (text) => {
            if (stale()) return;
            pendingYouRef.current += text;
            setPendingYou(pendingYouRef.current);
          },
          onOutputTranscription: (text) => {
            if (stale()) return;
            if (pendingYouRef.current.trim()) commitYou();
            pendingAiRef.current += text;
            setPendingAi(pendingAiRef.current);
          },
          onTurnComplete: () => {
            if (stale()) return;
            commitAi();
            if (deadlineReachedRef.current) finish(false);
          },
          onInterrupted: () => {
            if (stale()) return;
            flushPlayback();
            commitAi();
          },
          onGoAway: () => {
            if (stale()) return;
            if (userTurnCount() >= MIN_USER_TURNS_TO_SALVAGE) finish(true);
            else fail("dropped");
          },
          onError: () => {
            if (!stale()) handleUnexpectedClose();
          },
          onClose: () => {
            if (!stale()) handleUnexpectedClose();
          },
        }
      );
    } catch {
      if (stale()) return;
      if (choice === "primary") {
        attemptRef.current = "fallback";
        await connectWithModel("fallback");
      } else {
        fail("connect");
      }
    }
  }

  /* ---------- public api ---------- */

  async function start() {
    if (phaseRef.current === "connecting" || phaseRef.current === "live") return;
    endedRef.current = false;
    stopSendingRef.current = false;
    deadlineReachedRef.current = false;
    wrapupSentRef.current = false;
    attemptRef.current = "primary";
    dialogRef.current = [];
    pendingAiRef.current = "";
    pendingYouRef.current = "";
    setDialog([]);
    setPendingAi("");
    setPendingYou("");
    setElapsed(0);
    setErrorKind(null);
    setMuted(false);
    mutedRef.current = false;

    if (
      typeof window === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof AudioContext === "undefined" ||
      typeof AudioWorkletNode === "undefined"
    ) {
      setErrorKind("unsupported");
      setPhase("error");
      return;
    }

    setPhase("connecting");

    // Mic first, inside the tap gesture. Echo cancellation is mandatory: the
    // speaker plays the character while the mic keeps streaming.
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      setErrorKind("mic");
      setPhase("error");
      return;
    }
    streamRef.current = stream;

    try {
      const ctx = new AudioContext(); // device rate; Safari ignores 16k hints
      ctxRef.current = ctx;
      await ctx.resume().catch(() => {});
      // iOS suspends the context on route changes; re-resume while live.
      ctx.addEventListener("statechange", () => {
        if (ctx.state === "suspended" && !endedRef.current) void ctx.resume().catch(() => {});
      });

      const url = createPcmWorkletUrl();
      workletUrlRef.current = url;
      await ctx.audioWorklet.addModule(url);

      const source = ctx.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(ctx, PCM_WORKLET_NAME);
      workletRef.current = worklet;
      worklet.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
        if (mutedRef.current || stopSendingRef.current || endedRef.current) return;
        try {
          transportRef.current?.sendAudioChunk(pcm16ToBase64(new Int16Array(event.data)));
        } catch {}
      };
      source.connect(worklet);
      worklet.connect(ctx.destination); // keeps the node processing; outputs silence

      // Mic level -> userSpeaking, same analyser pattern as the solo rep.
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      const tick = () => {
        if (endedRef.current) return;
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += ((v - 128) / 128) ** 2;
        const level = Math.sqrt(sum / buf.length);
        const now = Date.now();
        if (level > SPEAKING_THRESHOLD && !mutedRef.current) lastVoiceAtRef.current = now;
        setUserSpeaking(now - lastVoiceAtRef.current < SPEAKING_HOLD_MS);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      fail("unsupported");
      return;
    }

    await connectWithModel("primary");
  }

  function end() {
    finish(false);
  }

  function toggleMute() {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !next));
    if (next) {
      try {
        transportRef.current?.sendAudioStreamEnd();
      } catch {}
    }
  }

  return {
    phase,
    errorKind,
    dialog,
    pendingAi,
    pendingYou,
    muted,
    aiSpeaking,
    userSpeaking,
    elapsed,
    maxSeconds,
    start,
    end,
    toggleMute,
  };
}
