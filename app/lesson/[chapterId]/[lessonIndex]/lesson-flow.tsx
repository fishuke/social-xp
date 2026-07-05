"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Lesson, Quote } from "@/lib/content";
import { XP } from "@/lib/content";
import { haptic, sfx } from "@/lib/juice";
import { ChatIcon, CheckIcon, CloseIcon, DiamondIcon, Logo, XpSquareIcon } from "@/components/icons";
import { QuoteCard } from "@/components/quote-card";
import { ConfettiBurst } from "@/components/confetti";
import { CountUp } from "@/components/count-up";

type Props = {
  chapterId: number;
  chapterTitle: string;
  lesson: Lesson;
  quote: Quote;
  collectedBefore: number;
  xpTodayBefore: number;
  repDoneToday: boolean;
  alreadyCompleted: boolean;
};

const FEELS = [
  { id: "crushed", emoji: "😎", label: "Crushed it" },
  { id: "got-it", emoji: "🙂", label: "Got it" },
  { id: "shaky", emoji: "😬", label: "Shaky" },
];

export function LessonFlow(props: Props) {
  const { chapterId, chapterTitle, lesson, quote } = props;
  const router = useRouter();
  const [beat, setBeat] = useState(1);
  const [quizFirstTry, setQuizFirstTry] = useState(true);
  const [repCommitted, setRepCommitted] = useState(false);
  const [feel, setFeel] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);

  const dark = beat === 3;
  const kicker = lesson.isCheckpoint
    ? `Chapter ${chapterId} · Checkpoint`
    : `Chapter ${chapterId} · Lesson ${lesson.index} · ${lesson.title}`;

  function close() {
    if (beat > 1 && !window.confirm("Leave the lesson? Your progress in it won't be saved.")) return;
    router.push("/learn");
  }

  async function claim() {
    if (claiming) return;
    setClaiming(true);
    sfx("claim");
    haptic([20, 30, 20, 30, 40]);
    // Tomorrow's reminder fires when they trained today — send local time (Duolingo-style).
    const now = new Date();
    const localTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const res = await fetch("/api/lesson/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterId,
        lessonIndex: lesson.index,
        quizFirstTry,
        feel,
        repCommitted,
        localTime,
      }),
    });
    const data = await res.json();
    // Let the XP chips land, then move on (streak screen fires once/day max).
    setTimeout(() => {
      router.replace(data.celebrateStreak ? `/streak?n=${data.celebrateStreak}` : "/learn");
    }, 700);
  }

  return (
    <div
      className="relative flex flex-1 flex-col overflow-hidden px-6 pb-8 pt-[58px]"
      style={{
        background: dark
          ? "linear-gradient(170deg, #2E2018, #43301F)"
          : beat === 5
            ? "linear-gradient(180deg, #FFF1D6, #FFF6EE 40%)"
            : "#FFF6EE",
      }}
    >
      {/* shared chrome: close + 5-segment progress */}
      <div className="flex items-center gap-3">
        <button onClick={close} aria-label="Close" style={{ color: dark ? "#F4D8C2" : "#7A6A5C" }}>
          <CloseIcon size={24} />
        </button>
        <div className="flex flex-1 gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className="h-[8px] flex-1 rounded-full"
              style={{
                background:
                  s <= beat
                    ? dark
                      ? "#FFC24A"
                      : "#FF5A2C"
                    : dark
                      ? "rgba(255,255,255,0.18)"
                      : "#EADFD5",
              }}
            />
          ))}
        </div>
      </div>

      <p
        className="mt-5 font-body text-[13px] font-extrabold uppercase tracking-[1px]"
        style={{ color: dark ? "#F4D8C2" : "#7A6A5C" }}
      >
        {kicker}
      </p>

      <div key={beat} className="beat-enter relative flex flex-1 flex-col">
        {beat === 1 && <ConceptBeat lesson={lesson} onNext={() => setBeat(2)} />}
        {beat === 2 && (
          <QuizBeat
            lesson={lesson}
            onFail={() => setQuizFirstTry(false)}
            onNext={() => setBeat(3)}
          />
        )}
        {beat === 3 && (
          <QuoteBeat
            quote={quote}
            chapterTitle={chapterTitle}
            collectedBefore={props.collectedBefore}
            onNext={() => setBeat(4)}
          />
        )}
        {beat === 4 && (
          <RepBeat
            lesson={lesson}
            onCommit={() => {
              setRepCommitted(true);
              setBeat(5);
            }}
            onLater={() => {
              setRepCommitted(false);
              setBeat(5);
            }}
          />
        )}
        {beat === 5 && (
          <ClaimBeat
            {...props}
            quizFirstTry={quizFirstTry}
            feel={feel}
            setFeel={setFeel}
            claiming={claiming}
            onClaim={claim}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- Beat 1 · Concept ---------- */

function ConceptBeat({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const { headline, body, keyPhrase, coachLine } = lesson.concept;
  const [before, after] = body.split(keyPhrase);
  return (
    <>
      <p className="mt-6 font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
        ① The concept
      </p>
      <h2 className="mt-3 font-display text-[36px] font-semibold leading-[1.1] text-cocoa">
        {headline}
      </h2>
      <p className="mt-4 font-body text-[20px] leading-[1.6] text-ink">
        {before}
        <strong className="font-extrabold text-coral">{keyPhrase}</strong>
        {after}
      </p>
      <div className="mt-6 flex items-start gap-3 rounded-[20px] bg-tint-warm p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-coral">
          <ChatIcon size={22} />
        </span>
        <p className="font-body text-[16px] font-bold leading-[1.45]" style={{ color: "#7A5A3E" }}>
          {coachLine}
        </p>
      </div>
      <div className="mt-auto pt-8">
        <button className="btn btn-coral" onClick={onNext}>
          Continue
        </button>
      </div>
    </>
  );
}

/* ---------- Beat 2 · Your call (tap quiz) ---------- */

function QuizBeat({
  lesson,
  onFail,
  onNext,
}: {
  lesson: Lesson;
  onFail: () => void;
  onNext: () => void;
}) {
  const quiz = lesson.quiz;
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);
  const [shaking, setShaking] = useState(false);
  const firstTry = wrongPick === null;

  function pick(i: number) {
    if (resolved) return;
    if (i === quiz.correctIndex) {
      sfx("correct");
      haptic();
      setResolved(true);
      return;
    }
    onFail();
    sfx("wrong");
    haptic([40, 30, 40]);
    setWrongPick(i);
    setShaking(true);
    setTimeout(() => setShaking(false), 420);
    setTimeout(() => setResolved(true), 900); // reveal the correct answer
  }

  return (
    <>
      <p className="mt-6 font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
        ② Your call
      </p>
      <div className="mt-4">
        <p className="mb-1.5 font-body text-[11px] font-extrabold uppercase tracking-[1.5px] text-faint">
          They say
        </p>
        <div className="inline-block rounded-[18px] rounded-bl-[6px] border-2 border-line2 bg-white px-4 py-3 font-body text-[17px] font-bold text-ink">
          “{quiz.theySay}”
        </div>
      </div>
      <h2 className="mt-5 font-display text-[20px] font-semibold text-cocoa">{quiz.question}</h2>
      <div className="mt-4 flex flex-col gap-3">
        {quiz.options.map((option, i) => {
          const isCorrect = i === quiz.correctIndex;
          const showCorrect = resolved && isCorrect;
          const showWrong = wrongPick === i;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className={`flex items-center gap-3 rounded-[18px] border-2 bg-white px-4 py-4 text-left font-body text-[16px] font-bold transition-colors ${showWrong && shaking ? "quiz-shake" : showCorrect ? "pop-in" : ""}`}
              style={{
                borderColor: showCorrect ? "#58C08A" : showWrong ? "#FF5A2C" : "#EADFD5",
                background: showCorrect ? "#EAF8F0" : "#fff",
                color: showCorrect ? "#2E5A44" : resolved ? "#B8A99C" : "#544537",
              }}
            >
              <span className="flex-1">“{option}”</span>
              {showCorrect && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-go">
                  <CheckIcon size={14} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {resolved && (
        <div className="pop-in mt-4 rounded-[16px] border-2 border-go-border bg-go-tint p-4">
          <p className="font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-go-text">
            {quiz.feedbackTitle}
            {firstTry && ` · +${XP.quizFirstTry} XP`}
          </p>
          <p className="mt-1 font-body text-[14px] font-bold text-go-text">{quiz.feedbackBody}</p>
        </div>
      )}
      <div className="mt-auto pt-6">
        <button
          className={`btn ${resolved ? "btn-green" : "btn-coral"}`}
          onClick={onNext}
          disabled={!resolved}
        >
          Continue
        </button>
      </div>
    </>
  );
}

/* ---------- Beat 3 · Quote unlocked (dark) ---------- */

function QuoteBeat({
  quote,
  chapterTitle,
  collectedBefore,
  onNext,
}: {
  quote: Quote;
  chapterTitle: string;
  collectedBefore: number;
  onNext: () => void;
}) {
  const collected = Math.min(collectedBefore + 1, 6);

  async function share() {
    const text = `“${quote.text}” — ${quote.author} · collected on Social XP`;
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text);
    }
  }

  return (
    <>
      <p className="mt-6 text-center font-display text-[13px] font-semibold uppercase tracking-[2px] text-amber">
        ③ Quote unlocked
      </p>
      <div className="flex flex-1 flex-col justify-center">
        <div className="relative">
          <div aria-hidden className="sunburst h-[540px] w-[540px]" />
          <div className="pop-in relative">
            <QuoteCard quote={quote} collectedInChapter={collected} isNew />
          </div>
        </div>
        <p
          className="pop-in mt-5 text-center font-body text-[14px] font-bold text-ondark"
          style={{ animationDelay: "180ms" }}
        >
          Added to your collection · {chapterTitle} set
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="pop-in h-2.5 w-2.5 rounded-full"
              style={{
                background: i < collected ? "#FFC24A" : "rgba(255,255,255,0.22)",
                animationDelay: `${240 + i * 70}ms`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <button className="btn btn-ghost-dark" onClick={share}>
            Save
          </button>
          <button className="btn btn-ghost-dark" onClick={share}>
            Share
          </button>
        </div>
        <button className="btn btn-amber" onClick={onNext}>
          Continue
        </button>
      </div>
    </>
  );
}

/* ---------- Beat 4 · Real-world rep ---------- */

function RepBeat({
  lesson,
  onCommit,
  onLater,
}: {
  lesson: Lesson;
  onCommit: () => void;
  onLater: () => void;
}) {
  return (
    <>
      <p className="mt-6 font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
        ④ Real-world rep
      </p>
      <div className="flex flex-1 flex-col justify-center">
        <div
          className="rounded-[26px] p-6 text-white"
          style={{
            background: "linear-gradient(160deg, #FF7A45, #FF5A2C)",
            boxShadow: "0 12px 26px rgba(255,90,44,0.32)",
          }}
        >
          <h2 className="font-display text-[26px] font-semibold leading-[1.25]">
            {lesson.rep.challenge}
          </h2>
          <p className="mt-3 font-body text-[15px] font-bold text-white/85">{lesson.rep.sub}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/22 px-3 py-1.5 font-display text-[15px] font-semibold">
            <XpSquareIcon size={16} />+{XP.rep} XP
          </span>
        </div>
        <p className="mt-4 text-center font-body text-[14px] font-bold text-sec2">
          Honor system. No recording, no grade — the only person you&apos;d cheat is you.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button className="btn btn-coral" onClick={onCommit}>
          I&apos;m in — let&apos;s go
        </button>
        <button className="btn btn-ghost" onClick={onLater}>
          Remind me tonight
        </button>
      </div>
    </>
  );
}

/* ---------- Beat 5 · Claim ---------- */

function ClaimBeat({
  lesson,
  xpTodayBefore,
  repDoneToday,
  alreadyCompleted,
  quizFirstTry,
  feel,
  setFeel,
  claiming,
  onClaim,
}: Props & {
  quizFirstTry: boolean;
  feel: string | null;
  setFeel: (f: string) => void;
  claiming: boolean;
  onClaim: () => void;
}) {
  const claimXP = alreadyCompleted ? 0 : XP.lessonClaim + (quizFirstTry ? XP.quizFirstTry : 0);
  const xpAfter = xpTodayBefore + claimXP;
  return (
    <>
      <ConfettiBurst height={340} />
      <div className="mt-6 flex flex-col items-center text-center">
        <span className="pop-in flex h-[110px] w-[110px] items-center justify-center rounded-full bg-white shadow-[0_4px_0_rgba(0,0,0,0.05)]">
          <Logo size={64} />
        </span>
        <h2
          className="pop-in mt-4 font-display text-[31px] font-semibold text-cocoa"
          style={{ animationDelay: "120ms" }}
        >
          {lesson.isCheckpoint ? "Checkpoint beaten! 🚩" : "Lesson complete! 💪"}
        </h2>
        <p
          className="pop-in mt-1 font-body text-[16px] font-bold text-sec2"
          style={{ animationDelay: "200ms" }}
        >
          That&apos;s how confidence gets built.
        </p>
        <div className="mt-4 flex gap-3">
          <span
            className="pop-in flex items-center gap-2 rounded-[16px] bg-white px-4 py-2.5 shadow-[0_3px_0_rgba(0,0,0,0.04)]"
            style={{ animationDelay: "300ms" }}
          >
            <XpSquareIcon size={22} />
            <span className="font-display text-[24px] font-semibold text-coral">
              +<CountUp to={claimXP} /> XP
            </span>
          </span>
          {!alreadyCompleted && (
            <span
              className="pop-in flex items-center gap-2 rounded-[16px] bg-white px-4 py-2.5 shadow-[0_3px_0_rgba(0,0,0,0.04)]"
              style={{ animationDelay: "420ms" }}
            >
              <DiamondIcon size={20} />
              <span className="font-display text-[17px] font-semibold text-cocoa">+1 quote</span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-[18px] bg-white p-4 shadow-[0_3px_0_rgba(0,0,0,0.04)]">
        <p className="mb-3 font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-sec2">
          Daily quests
        </p>
        <div className="flex flex-col gap-2.5">
          <ClaimQuestRow label="Finish 1 lesson" done />
          <ClaimQuestRow
            label="Earn 30 XP"
            done={xpAfter >= 30}
            progress={Math.min(xpAfter, 30)}
          />
          <ClaimQuestRow label="Do your real-world rep" done={repDoneToday} />
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-faint">
          How&apos;d it feel?
        </p>
        <div className="mt-2 flex justify-center gap-2.5">
          {FEELS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFeel(f.id)}
              className="rounded-[16px] border-2 px-3.5 py-2 font-body text-[13px] font-extrabold text-ink"
              style={{
                borderColor: feel === f.id ? "#FF5A2C" : "#EADFD5",
                background: feel === f.id ? "#FFF0E9" : "#fff",
              }}
            >
              <span className="mr-1 text-[17px]">{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6">
        <button className="btn btn-coral" onClick={onClaim} disabled={claiming}>
          {claiming ? "Claiming…" : "Claim & continue"}
        </button>
      </div>
    </>
  );
}

function ClaimQuestRow({
  label,
  done,
  progress,
}: {
  label: string;
  done: boolean;
  progress?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-2"
        style={{
          borderColor: done ? "#58C08A" : "#EADFD5",
          background: done ? "#58C08A" : "transparent",
        }}
      >
        {done && <CheckIcon size={10} />}
      </span>
      <span
        className="flex-1 font-body text-[13px] font-extrabold"
        style={{ color: done ? "#2E5A44" : "#544537" }}
      >
        {label}
        {progress !== undefined && !done && (
          <span className="ml-1.5 text-quest-amber">{progress}/30</span>
        )}
      </span>
      {progress !== undefined && !done && (
        <span className="h-[6px] w-16 overflow-hidden rounded-full bg-line">
          <span
            className="block h-full rounded-full bg-quest-amber"
            style={{ width: `${(progress / 30) * 100}%` }}
          />
        </span>
      )}
    </div>
  );
}
