"use client";

// Live roleplay screens, v4 "a date, not a dashboard": the conversation IS
// the interface. Date-night dark scene, live transcript bubbles, one vibe
// bar, reaction chips instead of metrics, dismissible coach whispers, then a
// scene-end beat that flows into the debrief.
// Design reference: design/Social XP - Roleplay v4.dc.html

import { useEffect, useRef, useState } from "react";
import { submitLiveSession } from "@/lib/actions";
import type { LiveDialogTurn, LiveSessionResult } from "@/lib/coach-live";
import { ConfettiBurst } from "@/components/confetti";
import { CountUp } from "@/components/count-up";
import { useT, useLocale } from "@/components/i18n-provider";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { CheckIcon, MicIcon, ShareIcon, XpSquareIcon } from "@/components/icons";
import { ProgressBar } from "@/components/ui";
import { shareText } from "@/lib/share";
import { useLiveSession, type LiveErrorKind, type LiveSessionState } from "./use-live-session";
import {
  analyzeMoments,
  latestReaction,
  pickWhisper,
  vibeBucket,
  vibeScore,
  type VibeBucket,
  type WhisperKind,
} from "./live-vibe";
import { formatTime, HistoryList, MetricBar, type CoachHistoryItem } from "./coach-client";

export type SceneOption = {
  id: string;
  dread: string;
  title: string;
  setup: string;
  sceneChip: string;
  defaultMentorId: string;
  isDaily: boolean;
};

export type MentorOption = {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
};

type View = "intro" | "live" | "sceneEnd" | "debrief";
type Scoring = "idle" | "pending" | "done" | "failed" | "tooShort";

const SCENE_BG = "linear-gradient(180deg,#241412 0%,#2E1A12 55%,#3A2114 100%)";

const VIBE_STYLES: Record<
  VibeBucket,
  { fill: string; chipColor: string; chipBg: string }
> = {
  dipping: { fill: "linear-gradient(90deg,#FF5A2C,#FF914D)", chipColor: "#FF914D", chipBg: "rgba(255,145,77,0.14)" },
  warming: { fill: "linear-gradient(90deg,#FF914D,#FFC24A)", chipColor: "#FFC24A", chipBg: "rgba(255,194,74,0.12)" },
  working: { fill: "linear-gradient(90deg,#FFC24A,#58C08A)", chipColor: "#58C08A", chipBg: "rgba(88,192,138,0.14)" },
};

function errorText(kind: LiveErrorKind, t: Dictionary): string {
  switch (kind) {
    case "mic":
      return t.errors.coachNeedsMic;
    case "unsupported":
      return t.errors.liveUnsupported;
    case "config":
      return t.errors.coachNotSetUp;
    case "rate":
      return t.errors.liveRateLimited;
    case "dropped":
      return t.errors.liveDropped;
    default:
      return t.errors.liveConnectFailed;
  }
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function LiveCoachClient({
  scene,
  mentor,
  name,
  history,
  onExit,
}: {
  scene: SceneOption;
  mentor: MentorOption;
  name: string;
  history: CoachHistoryItem[];
  onExit: () => void;
}) {
  const t = useT();
  const locale = useLocale();

  const [view, setView] = useState<View>("intro");
  const [finished, setFinished] = useState<{
    dialog: LiveDialogTurn[];
    durationSec: number;
    salvage: boolean;
  } | null>(null);
  const [scoring, setScoring] = useState<Scoring>("idle");
  const [result, setResult] = useState<LiveSessionResult | null>(null);

  const session = useLiveSession({
    scenarioId: scene.id,
    mentorId: mentor.id,
    onFinished: (dialog, durationSec, salvage) => {
      setFinished({ dialog, durationSec, salvage });
      setView("sceneEnd");
      if (!salvage) void score(dialog, durationSec);
    },
  });

  async function score(dialog: LiveDialogTurn[], durationSec: number) {
    setScoring("pending");
    try {
      const res = await submitLiveSession({
        scenarioId: scene.id,
        mentorId: mentor.id,
        locale,
        durationSec,
        dialog,
      });
      if (res.ok) {
        setResult(res);
        setScoring("done");
      } else {
        setScoring(res.code === "input" ? "tooShort" : "failed");
      }
    } catch {
      setScoring("failed");
    }
  }

  function reset() {
    setFinished(null);
    setResult(null);
    setScoring("idle");
    setView("intro");
  }

  if (view === "debrief" && result && finished) {
    return (
      <DebriefScreen
        result={result}
        durationSec={finished.durationSec}
        dialog={finished.dialog}
        personaName={mentor.name}
        name={name}
        history={history}
        onRunBack={reset}
        onBack={onExit}
        t={t}
      />
    );
  }

  if (view === "sceneEnd" && finished) {
    return (
      <SceneEndScreen
        scene={scene}
        mentor={mentor}
        finished={finished}
        scoring={scoring}
        result={result}
        onScore={() => void score(finished.dialog, finished.durationSec)}
        onSeeDebrief={() => setView("debrief")}
        onRunBack={reset}
        t={t}
      />
    );
  }

  if (session.phase === "live" || session.phase === "wrapup") {
    return <LiveScreen scene={scene} mentor={mentor} session={session} t={t} />;
  }

  return <IntroScreen scene={scene} mentor={mentor} session={session} onBack={onExit} t={t} />;
}

/* ---------- intro (persona + how it works + the start gesture) ---------- */

function IntroScreen({
  scene,
  mentor,
  session,
  onBack,
  t,
}: {
  scene: SceneOption;
  mentor: MentorOption;
  session: LiveSessionState;
  onBack: () => void;
  t: Dictionary;
}) {
  const connecting = session.phase === "connecting";
  const bullets = [
    { emoji: "🎙️", text: t.coach.liveHow1 },
    { emoji: "⚡", text: t.coach.liveHow2 },
    { emoji: "🧭", text: t.coach.liveHow3 },
  ];

  return (
    <div
      className="page-enter flex flex-1 flex-col px-6 pb-8 pt-[58px]"
      style={{ background: SCENE_BG }}
    >
      <div className="flex items-center">
        <BackButton onClick={onBack} label={t.common.back} />
        <p className="flex-1 text-center font-display text-[13px] font-semibold uppercase tracking-[2px] text-amber">
          {t.coach.liveKicker}
        </p>
        <span className="w-8" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div
          className="flex h-[110px] w-[110px] items-center justify-center rounded-full text-[54px]"
          style={{ background: "#FFEDE4", boxShadow: "0 0 0 3px #FFC24A, 0 0 60px rgba(255,194,74,0.25)" }}
        >
          {mentor.avatar}
        </div>
        <div>
          <h1 className="font-display text-[28px] font-semibold leading-[1.15] text-white">
            {mentor.name}
          </h1>
          <p className="mt-1 font-body text-[13px] font-extrabold text-[#FF914D]">{scene.sceneChip}</p>
        </div>
        <p className="max-w-[300px] font-body text-[15px] font-bold leading-[1.5] text-ondark/75">
          {scene.setup}
        </p>

        <div className="mt-2 flex w-full max-w-[320px] flex-col gap-2 text-left">
          {bullets.map((b) => (
            <div key={b.emoji} className="flex items-center gap-3 rounded-[16px] bg-white/10 px-4 py-3">
              <span className="text-[18px]">{b.emoji}</span>
              <span className="font-body text-[13px] font-bold leading-[1.4] text-ondark/85">{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        {session.errorKind && (
          <p className="max-w-[300px] text-center font-body text-[13px] font-bold text-amber">
            {errorText(session.errorKind, t)}
          </p>
        )}
        <button
          type="button"
          disabled={connecting}
          onClick={() => void session.start()}
          className="btn btn-coral w-full max-w-[320px]"
        >
          {connecting ? t.coach.liveConnecting : t.coach.liveStart}
        </button>
      </div>
    </div>
  );
}

/* ---------- the live scene ---------- */

function LiveScreen({
  scene,
  mentor,
  session,
  t,
}: {
  scene: SceneOption;
  mentor: MentorOption;
  session: LiveSessionState;
  t: Dictionary;
}) {
  const name = mentor.name;
  const pendingYouWords = countWords(session.pendingYou);
  const score = vibeScore(session.dialog, pendingYouWords);
  const bucket = vibeBucket(score);
  const vibe = VIBE_STYLES[bucket];
  const reaction = latestReaction(session.dialog);

  // One whisper at a time, each kind at most once per scene.
  const [whisper, setWhisper] = useState<WhisperKind | null>(null);
  const usedWhispersRef = useRef<Set<WhisperKind>>(new Set());
  useEffect(() => {
    if (whisper) return;
    const kind = pickWhisper(session.dialog, pendingYouWords);
    if (kind && !usedWhispersRef.current.has(kind)) {
      usedWhispersRef.current.add(kind);
      setWhisper(kind);
    }
  }, [session.dialog, pendingYouWords, whisper]);

  const vibeLabel =
    bucket === "dipping" ? t.coach.vibeDipping : bucket === "warming" ? t.coach.vibeWarming : t.coach.vibeWorking;

  const status = session.aiSpeaking
    ? `${t.coach.liveTalking(name)} ${scene.sceneChip}`
    : reaction === "laughed" || bucket === "working"
      ? t.coach.statusLeaning(name)
      : bucket === "dipping"
        ? t.coach.statusDrifting(name)
        : t.coach.statusListening(name);
  const statusColor = session.aiSpeaking
    ? "#FF914D"
    : reaction === "laughed" || bucket === "working"
      ? "#58C08A"
      : bucket === "dipping"
        ? "#C9B7A6"
        : "#F4D8C2";

  const floatEmoji = reaction === "laughed" ? "🤭" : bucket === "dipping" ? "🫤" : null;
  const turns = session.dialog.slice(-4);
  const yourMove = !session.aiSpeaking && !session.userSpeaking && !session.pendingAi;

  const whisperText =
    whisper === "monologue"
      ? t.coach.whisperMonologue
      : whisper === "askBack"
        ? t.coach.whisperAskBack
        : t.coach.whisperShortAnswers;

  return (
    <div className="page-enter flex flex-1 flex-col" style={{ background: SCENE_BG }}>
      {/* scene header */}
      <div className="flex items-center gap-3 px-5 pb-3 pt-[58px]">
        <BackButton onClick={session.end} label={t.coach.liveEndScene} />
        <div className="relative h-11 w-11 shrink-0">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-[24px]"
            style={{
              background: "#FFEDE4",
              boxShadow: session.aiSpeaking ? "0 0 0 2px #FF914D" : "none",
            }}
          >
            {mentor.avatar}
          </div>
          {floatEmoji ? (
            <span
              className="absolute -bottom-2 -right-1.5 text-[18px]"
              style={{ animation: "sx-bob 2s ease-in-out infinite" }}
            >
              {floatEmoji}
            </span>
          ) : (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-go"
              style={{ border: "2.5px solid #2E1A12" }}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[17px] font-semibold text-[#FFF6EE]">{name}</p>
          <p className="truncate font-body text-[12px] font-extrabold" style={{ color: statusColor }}>
            {status}
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1.5 font-display text-[14px] font-semibold tabular-nums text-[#F4D8C2]">
          {formatTime(session.elapsed)}
        </span>
      </div>

      {/* vibe bar */}
      <div className="flex items-center gap-2.5 px-5 pb-3">
        <span className="text-[15px]">😬</span>
        <div className="h-[9px] flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{ width: `${score}%`, background: vibe.fill }}
          />
        </div>
        <span className="text-[15px]">😍</span>
        <span
          className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 font-display text-[12px] font-semibold"
          style={{ color: vibe.chipColor, background: vibe.chipBg }}
        >
          {vibeLabel}
        </span>
      </div>

      {/* transcript */}
      <div className="flex flex-1 flex-col justify-end gap-3 overflow-hidden px-4 pb-2">
        {turns.map((turn, i) => {
          const isLastCommitted = i === turns.length - 1;
          const showReaction =
            reaction === "laughed" && turn.role === "you" && i === turns.length - 2;
          return (
            <div key={`${i}-${turn.text.slice(0, 12)}`} className="flex flex-col gap-1.5">
              <Bubble turn={turn} dim={!isLastCommitted && !showReaction} />
              {showReaction && (
                <span className="self-end rounded-full bg-white/10 px-2.5 py-1 font-body text-[12px] font-extrabold text-[#F4D8C2]">
                  {t.coach.reactionLaughed(name)}
                </span>
              )}
            </div>
          );
        })}

        {session.pendingAi && (
          <div className="flex flex-col gap-1.5">
            <Bubble turn={{ role: "ai", text: session.pendingAi }} />
            <span className="flex items-center gap-2 self-start px-1 font-body text-[12px] font-extrabold text-[rgba(255,246,238,0.5)]">
              <MiniBars />
              {t.coach.liveCaptionsTag(name)}
            </span>
          </div>
        )}

        {session.pendingYou && (
          <div className="flex flex-col gap-1.5">
            <Bubble turn={{ role: "you", text: session.pendingYou }} cursor />
            <span className="self-end rounded-full bg-white/10 px-2.5 py-1 font-body text-[12px] font-extrabold text-[#F4D8C2]">
              {t.coach.liveYouTag}
            </span>
          </div>
        )}

        {whisper && (
          <div
            className="mt-1 flex items-start gap-3 rounded-[20px] px-4 py-4"
            style={{ background: "#2E2018", border: "2px solid #FFC24A", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber text-[20px]">
              🦉
            </span>
            <div className="flex-1">
              <p className="font-display text-[12px] font-semibold uppercase tracking-[1px] text-amber">
                {t.coach.whisperKicker}
              </p>
              <p className="mt-1 font-body text-[14px] font-bold leading-[1.45] text-[#FFF6EE]">
                {whisperText}
              </p>
              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setWhisper(null)}
                  className="rounded-full bg-amber px-3.5 py-1.5 font-display text-[13px] font-semibold text-cocoa"
                >
                  {t.coach.whisperGotIt}
                </button>
                <button
                  type="button"
                  onClick={() => setWhisper(null)}
                  className="rounded-full bg-white/10 px-3.5 py-1.5 font-display text-[13px] font-medium text-[#C9B7A6]"
                >
                  {t.coach.whisperDismiss}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* your move / speaking bar */}
      <div className="flex flex-col items-center gap-3 px-5 pb-9 pt-2">
        <div className="flex h-[46px] items-end justify-center">
          {session.phase === "wrapup" ? (
            <p className="pb-1 font-display text-[14px] font-semibold uppercase tracking-[1px] text-amber">
              {t.coach.liveWrapUp}
            </p>
          ) : session.userSpeaking ? (
            <SpeakBars />
          ) : yourMove ? (
            <p className="pb-1 text-center font-display text-[14px] font-semibold uppercase tracking-[1px] text-amber">
              {t.coach.liveYourMove}
              <span className="mt-0.5 block font-body text-[11px] font-extrabold normal-case tracking-normal text-[rgba(255,246,238,0.45)]">
                {t.coach.liveYourMoveSub(name)}
              </span>
            </p>
          ) : null}
        </div>

        <div className="flex w-full items-center justify-center gap-6">
          <button
            type="button"
            onClick={session.toggleMute}
            aria-label={session.muted ? t.coach.liveUnmute : t.coach.liveMute}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[19px]"
          >
            {session.muted ? "🔇" : "🎙️"}
          </button>

          <div
            aria-hidden
            className="flex h-[76px] w-[76px] items-center justify-center rounded-full"
            style={
              session.userSpeaking
                ? {
                    background: "rgba(255,90,44,0.18)",
                    border: "3px solid #FF5A2C",
                    boxShadow: "0 0 50px rgba(255,90,44,0.3)",
                  }
                : {
                    background: "#FF5A2C",
                    boxShadow: "0 6px 0 #D8431B, 0 0 40px rgba(255,90,44,0.35)",
                  }
            }
          >
            {session.userSpeaking ? (
              <span className="h-7 w-7 rounded-[9px] bg-coral" />
            ) : (
              <MicIcon size={30} color="#fff" />
            )}
          </div>

          <button
            type="button"
            onClick={session.end}
            aria-label={t.coach.liveEndScene}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[17px]"
          >
            🚪
          </button>
        </div>

        <div className="flex w-full items-center justify-center gap-6 font-body text-[11px] font-extrabold text-[rgba(255,246,238,0.45)]">
          <span>{session.muted ? t.coach.liveUnmute : t.coach.liveMute}</span>
          <span>{t.coach.liveListeningSub}</span>
          <span>{t.coach.liveEndScene}</span>
        </div>
      </div>
    </div>
  );
}

function Bubble({ turn, dim, cursor }: { turn: LiveDialogTurn; dim?: boolean; cursor?: boolean }) {
  if (turn.role === "ai") {
    return (
      <div
        className="max-w-[82%] self-start rounded-[22px] rounded-bl-[6px] bg-[#FFF6EE] px-4 py-3"
        style={{ boxShadow: "0 3px 0 rgba(0,0,0,0.25)", opacity: dim ? 0.55 : 1 }}
      >
        <p className="font-body text-[15px] font-semibold leading-[1.5] text-cocoa">{turn.text}</p>
      </div>
    );
  }
  return (
    <div
      className="max-w-[84%] self-end rounded-[22px] rounded-br-[6px] bg-coral px-4 py-3"
      style={{ boxShadow: "0 3px 0 rgba(216,67,27,0.6)", opacity: dim ? 0.55 : 1 }}
    >
      <p className="font-body text-[15px] font-semibold leading-[1.5] text-white">
        {turn.text}
        {cursor && (
          <span className="ml-0.5 inline-block h-[16px] w-[8px] animate-pulse rounded-[2px] bg-white/85 align-text-bottom" />
        )}
      </p>
    </div>
  );
}

function MiniBars() {
  const heights = [8, 14, 10, 16, 7];
  return (
    <span className="flex h-4 items-center gap-[3px]">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-1 rounded-full"
          style={{ height: h, background: i % 2 ? "#FFC24A" : "#FF914D" }}
        />
      ))}
    </span>
  );
}

const SPEAK_BAR_COLORS = ["#FF914D", "#FFC24A", "#FF5A2C"];

function SpeakBars() {
  const [heights, setHeights] = useState<number[]>(() => Array.from({ length: 11 }, () => 18));
  useEffect(() => {
    const id = setInterval(
      () => setHeights(Array.from({ length: 11 }, () => 10 + Math.round(Math.random() * 36))),
      140
    );
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-[46px] items-center gap-1">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[5px] rounded-full transition-[height] duration-100"
          style={{ height: h, background: SPEAK_BAR_COLORS[i % 3] }}
        />
      ))}
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="-ml-1 p-1">
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          d="M15 5l-7 7 7 7"
          fill="none"
          stroke="#F4D8C2"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/* ---------- scene end (straight into the debrief) ---------- */

function SceneEndScreen({
  scene,
  mentor,
  finished,
  scoring,
  result,
  onScore,
  onSeeDebrief,
  onRunBack,
  t,
}: {
  scene: SceneOption;
  mentor: MentorOption;
  finished: { dialog: LiveDialogTurn[]; durationSec: number; salvage: boolean };
  scoring: Scoring;
  result: LiveSessionResult | null;
  onScore: () => void;
  onSeeDebrief: () => void;
  onRunBack: () => void;
  t: Dictionary;
}) {
  const moments = analyzeMoments(finished.dialog);
  const bucket = vibeBucket(vibeScore(finished.dialog, 0));
  const floatEmoji = bucket === "working" ? "🥰" : bucket === "warming" ? "🤭" : "🫤";
  const salvagePending = finished.salvage && scoring === "idle" && !result;

  const chips: { text: string; color: string; bg: string }[] = [
    { text: t.coach.momentHeld(formatTime(finished.durationSec)), color: "#58C08A", bg: "rgba(88,192,138,0.16)" },
  ];
  if (moments.laughs > 0)
    chips.push({ text: t.coach.momentLaughs(moments.laughs), color: "#58C08A", bg: "rgba(88,192,138,0.16)" });
  if (moments.askBacks > 0)
    chips.push({ text: t.coach.momentAskBacks(moments.askBacks), color: "#FFC24A", bg: "rgba(255,194,74,0.14)" });
  if (moments.monologues > 0)
    chips.push({ text: t.coach.momentMonologue(moments.monologues), color: "#FF914D", bg: "rgba(255,145,77,0.14)" });

  return (
    <div
      className="page-enter flex flex-1 flex-col px-6 pb-9 pt-[60px] text-center"
      style={{ background: SCENE_BG }}
    >
      <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-amber">
        {t.coach.sceneKicker(scene.title)}
      </p>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="relative h-[130px] w-[130px]">
          <div
            className="flex h-[130px] w-[130px] items-center justify-center rounded-full text-[64px]"
            style={{ background: "#FFEDE4", boxShadow: "0 0 0 3px #FFC24A, 0 0 60px rgba(255,194,74,0.25)" }}
          >
            {mentor.avatar}
          </div>
          <span
            className="absolute -right-2 -top-1 text-[34px]"
            style={{ animation: "sx-bob 2.4s ease-in-out infinite" }}
          >
            {floatEmoji}
          </span>
        </div>

        {salvagePending ? (
          <>
            <h2 className="max-w-[320px] font-display text-[28px] font-semibold leading-[1.15] text-white">
              {t.coach.salvageTitle}
            </h2>
            <p className="max-w-[300px] font-body text-[15px] font-bold leading-[1.5] text-ondark/70">
              {t.coach.salvageBody}
            </p>
          </>
        ) : (
          <>
            <h2 className="max-w-[320px] font-display text-[30px] font-semibold leading-[1.15] text-white">
              {result ? result.debrief.sceneHeadline : ""}
              {!result && scoring === "pending" && (
                <span className="inline-block animate-pulse font-body text-[16px] font-bold text-ondark/60">
                  {t.coach.sceneScoring}
                </span>
              )}
            </h2>
            {result && (
              <p className="max-w-[300px] font-body text-[15px] font-bold leading-[1.5] text-ondark/70">
                {result.debrief.sceneNote}
              </p>
            )}
          </>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {chips.map((c) => (
            <span
              key={c.text}
              className="rounded-full px-3.5 py-2 font-body text-[13px] font-extrabold"
              style={{ color: c.color, background: c.bg }}
            >
              {c.text}
            </span>
          ))}
        </div>

        {scoring === "failed" && (
          <p className="max-w-[300px] font-body text-[13px] font-bold text-amber">
            {t.errors.liveScoreFailed}
          </p>
        )}
        {scoring === "tooShort" && (
          <p className="max-w-[300px] font-body text-[13px] font-bold text-amber">
            {t.errors.liveTooShort}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {salvagePending ? (
          <button type="button" className="btn btn-coral" onClick={onScore}>
            {t.coach.salvageCta}
          </button>
        ) : scoring === "failed" ? (
          <button type="button" className="btn btn-coral" onClick={onScore}>
            {t.coach.retryScore}
          </button>
        ) : scoring === "tooShort" ? null : (
          <button
            type="button"
            className="btn btn-coral disabled:opacity-60"
            disabled={!result}
            onClick={onSeeDebrief}
          >
            {result ? `${t.coach.sceneCta} →` : t.coach.sceneScoring}
          </button>
        )}
        <button
          type="button"
          onClick={onRunBack}
          className="font-display text-[15px] font-medium text-white/55"
        >
          {t.coach.runItBack}
        </button>
      </div>
    </div>
  );
}

/* ---------- debrief ---------- */

function DebriefScreen({
  result,
  durationSec,
  dialog,
  personaName,
  name,
  history,
  onRunBack,
  onBack,
  t,
}: {
  result: LiveSessionResult;
  durationSec: number;
  dialog: LiveDialogTurn[];
  personaName: string;
  name: string;
  history: CoachHistoryItem[];
  onRunBack: () => void;
  onBack: () => void;
  t: Dictionary;
}) {
  const d = result.debrief;
  const gradeWord = t.coach.grade(d.overall);
  const metrics = [
    { label: t.coach.metricConfidence, value: d.scores.confidence },
    { label: t.coach.metricClarity, value: d.scores.clarity },
    { label: t.coach.metricEnergy, value: d.scores.energy },
  ];

  return (
    <div className="page-enter relative flex flex-1 flex-col pb-8">
      {result.xpAwarded > 0 && <ConfettiBurst />}

      <header
        className="relative px-5 pb-7 pt-[58px]"
        style={{ background: "linear-gradient(135deg, #FF7A45, #FF5A2C)" }}
      >
        <button type="button" onClick={onBack} aria-label={t.common.back} className="-ml-1 p-1">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="#fff"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label={t.coach.shareResult}
          onClick={() => shareText(t.coach.shareMessage(gradeWord, d.overall))}
          className="absolute right-5 top-[58px] rounded-full bg-white/16 p-2 transition-transform active:scale-90"
        >
          <ShareIcon size={20} color="#fff" />
        </button>
        <p className="mt-2 font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-white/80">
          {t.coach.debriefKicker(formatTime(durationSec))}
        </p>
        <h1 className="mt-1 max-w-[280px] font-display text-[26px] font-semibold leading-[1.2] text-white">
          {d.headline}
        </h1>
      </header>

      <div className="-mt-3 flex flex-col px-5">
        <section className="rounded-[20px] bg-white p-5 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <span className="font-display text-[40px] font-bold leading-none text-go">
              <CountUp to={d.overall} />
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
              value={d.scores.pace}
              fill={d.scores.pace < 75 ? "#FFB020" : "#58C08A"}
            />
          </div>

          <p className="mt-4 font-body text-[14px] font-bold leading-[1.5] text-sec2">{d.summary}</p>
        </section>

        {result.rubric.length > 0 && (
          <section className="mt-3 rounded-[20px] bg-white p-5 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
            <p className="font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-sec2">
              {t.coach.rubricTitle}
            </p>
            <div className="mt-3 flex flex-col gap-4">
              {result.rubric.map((row) => (
                <div key={row.key}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-body text-[13px] font-extrabold text-ink">{row.label}</span>
                    <span className="font-body text-[13px] font-extrabold text-sec2">
                      {t.coach.rubricNote(row.score)}
                    </span>
                  </div>
                  <ProgressBar
                    percent={row.score * 20}
                    height={9}
                    fill={row.score >= 3 ? "#58C08A" : "#FFB020"}
                  />
                  <p className="mt-1.5 font-body text-[13px] font-bold leading-[1.45] text-sec2">
                    {row.note}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {d.strengths.length > 0 && (
          <section className="mt-3 rounded-[20px] bg-white p-5 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
            <p className="font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-go-text">
              {t.coach.whatWorked}
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {d.strengths.map((s, i) => (
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

        {d.growthAreas.length > 0 && (
          <section className="mt-3 rounded-[20px] bg-tint-warm p-5">
            <p className="font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-[#C9554A]">
              {t.coach.growthTitle}
            </p>
            <ul className="mt-2 flex flex-col gap-2">
              {d.growthAreas.map((g, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[15px]">⚡</span>
                  <span className="font-body text-[15px] font-bold leading-[1.5] text-ink">{g}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <details className="mt-3 rounded-[20px] bg-white p-5 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
          <summary className="cursor-pointer font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-sec2">
            {t.coach.conversationTitle}
          </summary>
          <div className="mt-3 flex flex-col gap-2">
            {dialog.map((turn, i) => (
              <div key={i} className={`flex flex-col ${turn.role === "you" ? "items-end" : "items-start"}`}>
                <span className="px-1 font-body text-[11px] font-extrabold text-faint">
                  {turn.role === "you" ? t.coach.youLabel : personaName}
                </span>
                <div
                  className={
                    turn.role === "you"
                      ? "max-w-[85%] rounded-[16px] rounded-br-[5px] bg-coral px-3 py-2"
                      : "max-w-[85%] rounded-[16px] rounded-bl-[5px] bg-[#F1E8DE] px-3 py-2"
                  }
                >
                  <p
                    className={`font-body text-[13px] font-semibold leading-[1.45] ${
                      turn.role === "you" ? "text-white" : "text-ink"
                    }`}
                  >
                    {turn.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </details>

        <button type="button" className="btn btn-coral mt-5" onClick={onRunBack}>
          {t.coach.runItBack}
        </button>
        <p className="mt-2 text-center font-body text-[13px] font-bold text-sec2">{d.tryNext}</p>

        <HistoryList items={history} className="mt-6" t={t} />
      </div>
    </div>
  );
}
