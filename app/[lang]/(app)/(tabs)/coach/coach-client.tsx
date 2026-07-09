"use client";

// AI coach flow: record (dark screen) → processing → feedback.
// Audio is captured with MediaRecorder, re-encoded to 16kHz mono WAV in the
// browser (Gemini-safe format, ~1.9MB/min), and sent to submitCoachSession.

import { useEffect, useRef, useState } from "react";
import { submitCoachSession, type CoachSubmitResult } from "@/lib/actions";
import type { CoachPrompt } from "@/lib/coach";
import { ConfettiBurst } from "@/components/confetti";
import { CountUp } from "@/components/count-up";
import { LocaleLink } from "@/components/locale-link";
import { useT, useLocale } from "@/components/i18n-provider";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { CheckIcon, LockIcon, MicIcon, XpSquareIcon } from "@/components/icons";
import { ProgressBar } from "@/components/ui";

export type CoachHistoryItem = {
  id: string;
  promptText: string;
  overall: number;
  when: string;
};

type Props = {
  name: string;
  prompt: CoachPrompt;
  locked: boolean;
  isPremium: boolean;
  history: CoachHistoryItem[];
};

type Phase = "ready" | "recording" | "processing" | "done";
type CoachSuccess = Extract<CoachSubmitResult, { ok: true }>;

const MAX_SEC = 60;
const MIN_SEC = 5;
const BAR_COUNT = 24;
const BAR_COLORS = ["#FF914D", "#FFC24A", "#FF5A2C"];
// Idle waveform silhouette (design: heights 22–90px, here as 0..1 of 90px).
const IDLE_BARS = Array.from({ length: BAR_COUNT }, (_, i) => 0.24 + 0.5 * Math.abs(Math.sin(i * 0.9)));

export function CoachClient({ name, prompt, locked, isPremium, history }: Props) {
  const t = useT();
  const locale = useLocale();
  const [phase, setPhase] = useState<Phase>("ready");
  const [seconds, setSeconds] = useState(0);
  const [bars, setBars] = useState<number[]>(IDLE_BARS);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoachSuccess | null>(null);
  const [lockedNow, setLockedNow] = useState(locked);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  useEffect(() => () => teardown(), []);

  function teardown() {
    cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    recorderRef.current = null;
  }

  async function startRecording() {
    setError(null);
    if (typeof MediaRecorder === "undefined") {
      setError(t.errors.coachNoRecorder);
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      setError(t.errors.coachNeedsMic);
      return;
    }
    streamRef.current = stream;

    const mimeType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((t) =>
      MediaRecorder.isTypeSupported(t)
    );
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = recorder;
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => void handleStopped(recorder.mimeType);
    recorder.start();
    startedAtRef.current = Date.now();

    // Live waveform from mic level.
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;
    void ctx.resume().catch(() => {});
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buf = new Uint8Array(analyser.fftSize);
    const tick = () => {
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (const v of buf) sum += ((v - 128) / 128) ** 2;
      const level = Math.min(1, Math.sqrt(sum / buf.length) * 4);
      setBars((prev) => [...prev.slice(1), 0.12 + level * 0.88]);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
      setSeconds(elapsed);
      if (elapsed >= MAX_SEC) stopRecording();
    }, 250);

    setSeconds(0);
    setPhase("recording");
  }

  function stopRecording() {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
  }

  async function handleStopped(recordedType: string) {
    const elapsed = Math.min(Math.round((Date.now() - startedAtRef.current) / 1000), 65);
    const chunks = chunksRef.current;
    teardown();

    if (elapsed < MIN_SEC) {
      setPhase("ready");
      setBars(IDLE_BARS);
      setError(t.errors.coachTooShort);
      return;
    }

    setPhase("processing");
    try {
      const raw = new Blob(chunks, { type: recordedType || "audio/webm" });
      const wav = await toWav16kMono(raw);
      const form = new FormData();
      form.append("audio", wav, "rep.wav");
      form.append("durationSec", String(elapsed));
      form.append("locale", locale);

      const res = await submitCoachSession(form);
      if (res.ok) {
        setResult(res);
        setPhase("done");
        if (!isPremium) setLockedNow(true);
      } else if (res.code === "limit") {
        setLockedNow(true);
        setPhase("ready");
      } else {
        setError(res.error);
        setPhase("ready");
      }
    } catch {
      setError(t.errors.coachGeneric);
      setPhase("ready");
    }
    setBars(IDLE_BARS);
    setSeconds(0);
  }

  function reset() {
    setResult(null);
    setError(null);
    setPhase("ready");
  }

  if (phase === "done" && result) {
    return (
      <FeedbackScreen
        name={name}
        result={result}
        lockedNow={lockedNow && !isPremium}
        history={history}
        onRetry={reset}
        t={t}
      />
    );
  }

  if (lockedNow && phase !== "processing") {
    return <GatedScreen history={history} t={t} />;
  }

  const recording = phase === "recording";
  return (
    <div
      className="page-enter flex flex-1 flex-col items-center px-6 pb-8 pt-[58px] text-center"
      style={{ background: "linear-gradient(180deg, #241A12, #3A2416)" }}
    >
      <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-amber">
        {t.coach.kicker}
      </p>
      <p className="mt-7 font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-faint">
        {t.coach.todaysPrompt}
      </p>
      <h1 className="mt-2 font-display text-[30px] font-semibold leading-[1.15] text-white">
        {prompt.text}
      </h1>
      <p className="mt-2 font-body text-[15px] font-bold text-ondark/75">{prompt.sub}</p>

      <div className="flex min-h-[120px] flex-1 items-center gap-[4px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[5px] rounded-full transition-[height] duration-100"
            style={{
              height: `${Math.round(8 + h * 82)}px`,
              background: BAR_COLORS[i % BAR_COLORS.length],
              opacity: recording ? 1 : 0.45,
            }}
          />
        ))}
      </div>

      {phase === "processing" ? (
        <div className="flex h-[150px] flex-col items-center justify-center gap-3">
          <div className="h-[52px] w-[52px] animate-pulse rounded-full bg-coral/25 p-3">
            <MicIcon size={28} color="#FF5A2C" />
          </div>
          <p className="font-display text-[17px] font-semibold text-white">
            {t.coach.listening}
          </p>
          <p className="font-body text-[13px] font-bold text-ondark/60">
            {t.coach.scoring}
          </p>
        </div>
      ) : (
        <div className="flex h-[150px] flex-col items-center justify-between pb-1">
          <p className="font-display text-[26px] font-semibold tabular-nums text-white">
            {formatTime(seconds)}
          </p>
          <button
            type="button"
            aria-label={recording ? t.coach.stopRecording : t.coach.startRecording}
            onClick={recording ? stopRecording : startRecording}
            className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-[3px] border-coral"
            style={{ background: "rgba(255,90,44,0.18)" }}
          >
            {recording ? (
              <span className="h-[34px] w-[34px] rounded-[10px] bg-coral" />
            ) : (
              <span className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-coral">
                <MicIcon size={28} color="#fff" />
              </span>
            )}
          </button>
          <p className="mt-2 font-body text-[13px] font-bold text-ondark/60">
            {recording ? t.coach.tapToFinish : t.coach.tapToStart}
          </p>
        </div>
      )}

      {error && (
        <p className="mt-3 max-w-[300px] font-body text-[13px] font-bold text-amber">{error}</p>
      )}

      {phase === "ready" && (
        <HistoryList items={history} className="mt-8 w-full max-w-[360px] text-left" dark t={t} />
      )}
    </div>
  );
}

/* ---------- feedback ---------- */

function FeedbackScreen({
  name,
  result,
  lockedNow,
  history,
  onRetry,
  t,
}: {
  name: string;
  result: CoachSuccess;
  lockedNow: boolean;
  history: CoachHistoryItem[];
  onRetry: () => void;
  t: Dictionary;
}) {
  const a = result.analysis;
  const gradeWord = t.coach.grade(a.overall);
  const metrics = [
    { label: t.coach.metricConfidence, value: a.scores.confidence },
    { label: t.coach.metricClarity, value: a.scores.clarity },
    { label: t.coach.metricEnergy, value: a.scores.energy },
  ];
  const paceOff = a.scores.pace < 75;

  return (
    <div className="page-enter relative flex flex-1 flex-col pb-8">
      {result.xpAwarded > 0 && <ConfettiBurst />}

      <header
        className="px-5 pb-7 pt-[58px]"
        style={{ background: "linear-gradient(135deg, #FF7A45, #FF5A2C)" }}
      >
        <p className="font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-white/80">
          {t.coach.repHeader(formatTime(result.durationSec))}
        </p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-[1.2] text-white">
          {a.headline}
        </h1>
      </header>

      <div className="-mt-3 flex flex-col px-5">
        <section className="rounded-[20px] bg-white p-5 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <span className="font-display text-[40px] font-bold leading-none text-go">
              <CountUp to={a.overall} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[18px] font-semibold text-cocoa">
                {t.coach.gradeLine(gradeWord, name)}
              </p>
              {result.overallDelta !== null && result.overallDelta > 0 && (
                <p className="font-body text-[13px] font-bold text-go">
                  {t.coach.upFromLast(result.overallDelta)}
                </p>
              )}
            </div>
            {result.xpAwarded > 0 && (
              <span className="flex items-center gap-1 font-display text-[17px] font-semibold text-cocoa">
                <XpSquareIcon size={20} /> +{result.xpAwarded}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {metrics.map((m) => (
              <MetricBar key={m.label} label={m.label} value={m.value} fill="#58C08A" />
            ))}
            <MetricBar
              label={t.coach.metricPace}
              value={a.scores.pace}
              fill={paceOff ? "#FFB020" : "#58C08A"}
              note={a.paceLabel}
            />
          </div>

          <p className="mt-4 font-body text-[14px] font-bold leading-[1.5] text-sec2">
            {a.summary} <span className="text-faint2">{t.coach.summaryWpm(a.wpm)}</span>
          </p>
        </section>

        {a.strengths.length > 0 && (
          <section className="mt-3 rounded-[20px] bg-white p-5 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
            <p className="font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-go-text">
              {t.coach.whatWorked}
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {a.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-go">
                    <CheckIcon size={12} />
                  </span>
                  <span className="font-body text-[14px] font-bold leading-[1.45] text-ink">{s}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-3 rounded-[20px] bg-tint-warm p-5">
          <p className="font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-[#C9554A]">
            {t.coach.oneThingTitle}
          </p>
          <p className="mt-2 font-body text-[15px] font-bold leading-[1.5] text-ink">{a.oneThing}</p>
        </section>

        {a.transcript && (
          <details className="mt-3 rounded-[20px] bg-white p-5 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
            <summary className="cursor-pointer font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-sec2">
              {t.coach.transcript}
            </summary>
            <p className="mt-2 font-body text-[14px] font-bold leading-[1.55] text-sec2">
              &ldquo;{a.transcript}&rdquo;
            </p>
          </details>
        )}

        {lockedNow ? (
          <>
            <LocaleLink href="/paywall" className="btn btn-coral mt-5">
              {t.coach.goUnlimited}
            </LocaleLink>
            <p className="mt-2 text-center font-body text-[13px] font-bold text-faint">
              {t.coach.freeRepUsed}
            </p>
          </>
        ) : (
          <>
            <button type="button" className="btn btn-coral mt-5" onClick={onRetry}>
              {t.coach.tryAgainXp}
            </button>
            <p className="mt-2 text-center font-body text-[13px] font-bold text-sec2">{a.tryNext}</p>
          </>
        )}

        <HistoryList items={history} className="mt-6" t={t} />
      </div>
    </div>
  );
}

function MetricBar({
  label,
  value,
  fill,
  note,
}: {
  label: string;
  value: number;
  fill: string;
  note?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-body text-[13px] font-extrabold text-ink">{label}</span>
        <span className="font-body text-[13px] font-extrabold text-sec2">
          {note ? `${note} · ` : ""}
          {value}
        </span>
      </div>
      <ProgressBar percent={value} height={9} fill={fill} />
    </div>
  );
}

/* ---------- gated (free session used) ---------- */

function GatedScreen({ history, t }: { history: CoachHistoryItem[]; t: Dictionary }) {
  return (
    <div className="page-enter flex flex-1 flex-col items-center px-6 pb-10 pt-[58px] text-center">
      <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
        {t.coach.gatedKicker}
      </p>
      <div className="relative mt-8 flex h-[110px] w-[110px] items-center justify-center rounded-full bg-white shadow-[0_4px_0_rgba(0,0,0,0.05)]">
        <MicIcon size={48} color="#58C08A" />
        <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-amber shadow-[0_3px_0_#D89E2E]">
          <LockIcon size={18} color="#2E2018" />
        </span>
      </div>
      <h1 className="mt-6 font-display text-[28px] font-semibold leading-[1.15] text-cocoa">
        {t.coach.gatedTitle}
      </h1>
      <p className="mt-3 max-w-[300px] font-body text-[15px] font-bold leading-[1.5] text-sec2">
        {t.coach.gatedBody}
      </p>
      <div className="mt-7 w-full max-w-[320px]">
        <LocaleLink href="/paywall" className="btn btn-coral">
          {t.coach.getPlus}
        </LocaleLink>
      </div>
      <HistoryList items={history} className="mt-8 w-full text-left" t={t} />
    </div>
  );
}

/* ---------- shared bits ---------- */

function HistoryList({
  items,
  className,
  dark,
  t,
}: {
  items: CoachHistoryItem[];
  className?: string;
  dark?: boolean;
  t: Dictionary;
}) {
  if (items.length === 0) return null;
  return (
    <section className={className}>
      <p
        className={`font-body text-[12px] font-extrabold uppercase tracking-[1.5px] ${dark ? "text-ondark/60" : "text-sec2"}`}
      >
        {t.coach.recentReps}
      </p>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={
              dark
                ? "flex items-center gap-3 rounded-[16px] bg-white/10 p-3"
                : "flex items-center gap-3 rounded-[16px] bg-white p-3 shadow-[0_2px_0_rgba(0,0,0,0.04)]"
            }
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[15px] font-semibold text-white"
              style={{ background: item.overall >= 75 ? "#58C08A" : item.overall >= 50 ? "#FFB020" : "#FF914D" }}
            >
              {item.overall}
            </span>
            <span
              className={`min-w-0 flex-1 truncate font-body text-[14px] font-bold ${dark ? "text-white" : "text-ink"}`}
            >
              {item.promptText}
            </span>
            <span
              className={`shrink-0 font-body text-[12px] font-bold ${dark ? "text-ondark/60" : "text-faint"}`}
            >
              {item.when}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ---------- audio: browser recording → 16kHz mono WAV ---------- */

async function toWav16kMono(blob: Blob): Promise<Blob> {
  const ctx = new AudioContext();
  const decoded = await ctx.decodeAudioData(await blob.arrayBuffer());
  await ctx.close();

  const rate = 16000;
  const offline = new OfflineAudioContext(1, Math.ceil(decoded.duration * rate), rate);
  const source = offline.createBufferSource();
  source.buffer = decoded; // multi-channel input is downmixed to the mono destination
  source.connect(offline.destination);
  source.start();
  const rendered = await offline.startRendering();
  return encodeWavPcm16(rendered.getChannelData(0), rate);
}

function encodeWavPcm16(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}
