"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ConceptStep, LessonData, QuizStep, QuoteData } from "@/lib/content";
import { XP } from "@/lib/content";
import { claimLesson } from "@/lib/actions";
import { levelInfo } from "@/lib/levels";
import { achievements } from "@/lib/achievements";
import { haptic, sfx } from "@/lib/juice";
import { shareText } from "@/lib/share";
import { ChatIcon, CheckIcon, CloseIcon, DiamondIcon, Logo, XpSquareIcon } from "@/components/icons";
import { QuoteCard } from "@/components/quote-card";
import { QuestRow } from "@/components/quest-row";
import { ConfettiBurst } from "@/components/confetti";
import { CountUp } from "@/components/count-up";
import { useT, useLocale } from "@/components/i18n-provider";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { withLocale } from "@/lib/i18n/routing";

type UnitMeta = { id: number; number: number; level: string; title: string };

type Props = {
  unit: UnitMeta;
  lesson: LessonData;
  quote: QuoteData;
  collectedBefore: number;
  totalXPBefore: number;
  xpTodayBefore: number;
  repDoneToday: boolean;
  alreadyCompleted: boolean;
  lessonsDoneBefore: number;
  quotesTotalBefore: number;
  repsCompleted: number;
};

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

export function LessonFlow(props: Props) {
  const { unit, lesson, quote } = props;
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const steps = lesson.steps;
  const totalScreens = steps.length + 3; // steps → quote → challenge → claim
  const [screen, setScreen] = useState(0);
  const [firstTries, setFirstTries] = useState(0);
  const [repCommitted, setRepCommitted] = useState(false);
  const [feel, setFeel] = useState<"crushed" | "got-it" | "shaky" | null>(null);
  const [claiming, setClaiming] = useState(false);

  const phase =
    screen < steps.length
      ? "step"
      : screen === steps.length
        ? "quote"
        : screen === steps.length + 1
          ? "challenge"
          : "claim";
  const dark = phase === "quote";

  const kicker = t.lessonFlow.kicker(unit.level, unit.number, lesson.isCheckpoint, lesson.index);

  function close() {
    if (screen > 0 && !window.confirm(t.lessonFlow.leaveConfirm)) return;
    router.push(withLocale(locale, "/learn"));
  }

  async function claim() {
    if (claiming) return;
    setClaiming(true);
    sfx("claim");
    haptic([20, 30, 20, 30, 40]);
    // Tomorrow's reminder fires when they trained today - send local time (Duolingo-style).
    const now = new Date();
    const localTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const result = await claimLesson({
      unitId: unit.id,
      lessonIndex: lesson.index,
      quizFirstTries: firstTries,
      feel: feel ?? undefined,
      repCommitted,
      localTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
    });
    // Let the XP chips land, then move on (streak screen fires once/day max).
    setTimeout(() => {
      router.replace(
        withLocale(
          locale,
          result.celebrateStreak ? `/streak?n=${result.celebrateStreak}` : "/learn",
        ),
      );
    }, 700);
  }

  const next = () => setScreen((s) => s + 1);

  return (
    <div
      className="relative flex flex-1 flex-col overflow-hidden px-6 pb-8 pt-[58px]"
      style={{
        background: dark
          ? "linear-gradient(170deg, #2E2018, #43301F)"
          : phase === "claim"
            ? "linear-gradient(180deg, #FFF1D6, #FFF6EE 40%)"
            : "#FFF6EE",
      }}
    >
      {/* shared chrome: close + segmented progress */}
      <div className="flex items-center gap-3">
        <button onClick={close} aria-label={t.common.close} style={{ color: dark ? "#F4D8C2" : "#7A6A5C" }}>
          <CloseIcon size={24} />
        </button>
        <div className="flex flex-1 gap-1">
          {Array.from({ length: totalScreens }, (_, s) => (
            <span
              key={s}
              className="h-[8px] flex-1 rounded-full"
              style={{
                background:
                  s <= screen
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
        {kicker} · {lesson.title}
      </p>

      <div key={screen} className="beat-enter relative flex flex-1 flex-col">
        {phase === "step" &&
          (steps[screen].type === "concept" ? (
            <ConceptScreen
              step={steps[screen] as ConceptStep}
              label={conceptLabel(screen, steps.length, t)}
              circled={CIRCLED[screen]}
              onNext={next}
            />
          ) : (
            <QuizScreen
              step={steps[screen] as QuizStep}
              circled={CIRCLED[screen]}
              onFirstTry={() => setFirstTries((n) => n + 1)}
              onNext={next}
            />
          ))}
        {phase === "quote" && (
          <QuoteScreen
            quote={quote}
            unitTitle={unit.title}
            collectedBefore={props.collectedBefore}
            onNext={next}
          />
        )}
        {phase === "challenge" && (
          <ChallengeScreen
            lesson={lesson}
            onCommit={() => {
              setRepCommitted(true);
              next();
            }}
            onLater={() => {
              setRepCommitted(false);
              next();
            }}
          />
        )}
        {phase === "claim" && (
          <ClaimScreen
            {...props}
            firstTries={firstTries}
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

function conceptLabel(index: number, total: number, t: Dictionary): string {
  if (index === 0) return t.lessonFlow.conceptFirst;
  if (index === total - 1) return t.lessonFlow.conceptLast;
  return t.lessonFlow.conceptMiddle;
}

/* ---------- concept screens ---------- */

function ConceptScreen({
  step,
  label,
  circled,
  onNext,
}: {
  step: ConceptStep;
  label: string;
  circled: string;
  onNext: () => void;
}) {
  const t = useT();
  const [before, after] = step.body.split(step.keyPhrase);
  return (
    <>
      <p className="mt-6 font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
        {circled} {label}
      </p>
      <h2 className="mt-3 font-display text-[34px] font-semibold leading-[1.1] text-cocoa">
        {step.headline}
      </h2>
      <p className="mt-4 font-body text-[19px] leading-[1.6] text-ink">
        {before}
        <strong className="font-extrabold text-coral">{step.keyPhrase}</strong>
        {after}
      </p>
      {step.coachLine && (
        <div className="mt-6 flex items-start gap-3 rounded-[20px] bg-tint-warm p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-coral">
            <ChatIcon size={22} />
          </span>
          <p className="font-body text-[16px] font-bold leading-[1.45]" style={{ color: "#7A5A3E" }}>
            {step.coachLine}
          </p>
        </div>
      )}
      <div className="mt-auto pt-8">
        <button className="btn btn-coral" onClick={onNext}>
          {t.common.continue}
        </button>
      </div>
    </>
  );
}

/* ---------- quiz / thought-reframe screens ---------- */

function QuizScreen({
  step,
  circled,
  onFirstTry,
  onNext,
}: {
  step: QuizStep;
  circled: string;
  onFirstTry: () => void;
  onNext: () => void;
}) {
  const t = useT();
  const inner = step.voice === "inner";
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [resolved, setResolved] = useState(false);
  const [shaking, setShaking] = useState(false);

  function pick(i: number) {
    if (resolved) return;
    if (i === step.correctIndex) {
      sfx("correct");
      haptic();
      if (wrongPick === null) onFirstTry();
      setResolved(true);
      return;
    }
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
        {circled} {inner ? t.lessonFlow.quizChallengeThought : t.lessonFlow.quizYourCall}
      </p>
      <div className="mt-4">
        <p className="mb-1.5 font-body text-[11px] font-extrabold uppercase tracking-[1.5px] text-faint">
          {inner ? t.lessonFlow.yourBrainSays : t.lessonFlow.theySay}
        </p>
        <div
          className="inline-block rounded-[18px] rounded-bl-[6px] border-2 px-4 py-3 font-body text-[17px] font-bold"
          style={
            inner
              ? { borderColor: "#E6D4C4", background: "#FFF9EC", color: "#7A5A3E", fontStyle: "italic" }
              : { borderColor: "#F0E4D8", background: "#fff", color: "#544537" }
          }
        >
          “{step.theySay}”
        </div>
      </div>
      <h2 className="mt-5 font-display text-[20px] font-semibold text-cocoa">{step.question}</h2>
      <div className="mt-4 flex flex-col gap-3">
        {step.options.map((option, i) => {
          const isCorrect = i === step.correctIndex;
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
            {step.feedbackTitle}
            {wrongPick === null && t.lessonFlow.firstTryBonus(XP.quizFirstTry)}
          </p>
          <p className="mt-1 font-body text-[14px] font-bold text-go-text">{step.feedbackBody}</p>
        </div>
      )}
      <div className="mt-auto pt-6">
        <button className={`btn ${resolved ? "btn-green" : "btn-coral"}`} onClick={onNext} disabled={!resolved}>
          {t.common.continue}
        </button>
      </div>
    </>
  );
}

/* ---------- quote unlocked (dark) ---------- */

function QuoteScreen({
  quote,
  unitTitle,
  collectedBefore,
  onNext,
}: {
  quote: QuoteData;
  unitTitle: string;
  collectedBefore: number;
  onNext: () => void;
}) {
  const t = useT();
  const collected = Math.min(collectedBefore + 1, 6);

  // Unlocking a quote is a reward beat like the chest/level-up, so give it its
  // own sound + haptic, timed to the card popping in.
  useEffect(() => {
    const id = setTimeout(() => {
      sfx("reward");
      haptic([20, 30, 40]);
    }, 120);
    return () => clearTimeout(id);
  }, []);

  const share = () => shareText(t.quotes.shareMessage(quote.text, quote.author));

  return (
    <>
      <p className="mt-6 text-center font-display text-[13px] font-semibold uppercase tracking-[2px] text-amber">
        {t.lessonFlow.quoteUnlocked}
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
          {t.lessonFlow.addedToCollection(unitTitle)}
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
            {t.common.save}
          </button>
          <button className="btn btn-ghost-dark" onClick={share}>
            {t.common.share}
          </button>
        </div>
        <button className="btn btn-amber" onClick={onNext}>
          {t.common.continue}
        </button>
      </div>
    </>
  );
}

/* ---------- real-world challenge ---------- */

function ChallengeScreen({
  lesson,
  onCommit,
  onLater,
}: {
  lesson: LessonData;
  onCommit: () => void;
  onLater: () => void;
}) {
  const t = useT();
  return (
    <>
      <p className="mt-6 font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
        {t.lessonFlow.challengeKicker}
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
            {lesson.challenge.text}
          </h2>
          <p className="mt-3 font-body text-[15px] font-bold text-white/85">{lesson.challenge.sub}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/22 px-3 py-1.5 font-display text-[15px] font-semibold">
            <XpSquareIcon size={16} />
            {t.lessonFlow.challengeXp(XP.challenge)}
          </span>
        </div>
        <p className="mt-4 text-center font-body text-[14px] font-bold text-sec2">
          {t.lessonFlow.honorSystem}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button className="btn btn-coral" onClick={onCommit}>
          {t.lessonFlow.imIn}
        </button>
        <button className="btn btn-ghost" onClick={onLater}>
          {t.lessonFlow.remindTonight}
        </button>
      </div>
    </>
  );
}

/* ---------- claim ---------- */

function ClaimScreen({
  lesson,
  totalXPBefore,
  xpTodayBefore,
  repDoneToday,
  alreadyCompleted,
  lessonsDoneBefore,
  quotesTotalBefore,
  repsCompleted,
  firstTries,
  feel,
  setFeel,
  claiming,
  onClaim,
}: Props & {
  firstTries: number;
  feel: string | null;
  setFeel: (f: "crushed" | "got-it" | "shaky") => void;
  claiming: boolean;
  onClaim: () => void;
}) {
  const t = useT();
  const claimXP = alreadyCompleted ? 0 : XP.lessonClaim + firstTries * XP.quizFirstTry;
  const xpAfter = xpTodayBefore + claimXP;
  const newLevel = levelInfo(totalXPBefore + claimXP).level;
  const leveledUp = newLevel > levelInfo(totalXPBefore).level;

  // A first-time claim advances lesson + quote counters; surface any milestone it just earned.
  const gained = alreadyCompleted ? 0 : 1;
  const earnedBefore = achievements({
    lessonsDone: lessonsDoneBefore,
    level: levelInfo(totalXPBefore).level,
    quotes: quotesTotalBefore,
    reps: repsCompleted,
  });
  const earnedAfter = achievements({
    lessonsDone: lessonsDoneBefore + gained,
    level: newLevel,
    quotes: quotesTotalBefore + gained,
    reps: repsCompleted,
  });
  const unlockedMilestone = earnedAfter.find(
    (a) => a.earned && !earnedBefore.find((b) => b.id === a.id)?.earned,
  );

  // A level-up deserves its own reward beat, timed to the pill appearing.
  useEffect(() => {
    if (!leveledUp) return;
    const id = setTimeout(() => {
      sfx("reward");
      haptic([30, 40, 30, 40, 90]);
    }, 560);
    return () => clearTimeout(id);
  }, [leveledUp]);

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
          {lesson.isCheckpoint ? t.lessonFlow.checkpointBeaten : t.lessonFlow.lessonComplete}
        </h2>
        <p
          className="pop-in mt-1 font-body text-[16px] font-bold text-sec2"
          style={{ animationDelay: "200ms" }}
        >
          {t.lessonFlow.confidenceBuilt}
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
              <span className="font-display text-[17px] font-semibold text-cocoa">{t.lessonFlow.quoteChip}</span>
            </span>
          )}
        </div>
        {leveledUp && (
          <div className="relative mt-4 flex items-center justify-center">
            <div aria-hidden className="sunburst h-[190px] w-[190px]" />
            <span
              className="pop-in relative rounded-full px-5 py-2.5 font-display text-[16px] font-semibold text-white shadow-[0_3px_0_rgba(255,90,44,0.35)]"
              style={{
                animationDelay: "540ms",
                background: "linear-gradient(160deg, #FF7A45, #FF5A2C)",
              }}
            >
              {t.lessonFlow.levelUp(newLevel)}
            </span>
          </div>
        )}
        {unlockedMilestone && (
          <span
            className="pop-in mt-4 rounded-full px-5 py-2.5 font-display text-[16px] font-semibold text-white shadow-[0_3px_0_rgba(224,165,47,0.35)]"
            style={{
              animationDelay: leveledUp ? "620ms" : "540ms",
              background: "linear-gradient(160deg, #FFC24A, #E0A52F)",
            }}
          >
            {t.lessonFlow.milestoneUnlocked(t.you.milestones[unlockedMilestone.id].name)}
          </span>
        )}
      </div>

      <div
        className="pop-in mt-6 rounded-[18px] bg-white p-4 shadow-[0_3px_0_rgba(0,0,0,0.04)]"
        style={{ animationDelay: "480ms" }}
      >
        <p className="mb-3 font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-sec2">
          {t.lessonFlow.dailyQuests}
        </p>
        <div className="flex flex-col gap-2.5">
          <QuestRow label={t.lessonFlow.questFinishLesson} done />
          <QuestRow label={t.lessonFlow.questEarnXp(30)} done={xpAfter >= 30} progress={{ current: xpAfter, target: 30 }} />
          <QuestRow label={t.lessonFlow.questDoChallenge} done={repDoneToday} />
        </div>
      </div>

      <div className="pop-in mt-5 text-center" style={{ animationDelay: "600ms" }}>
        <p className="font-body text-[12px] font-extrabold uppercase tracking-[1.5px] text-faint">
          {t.lessonFlow.howdItFeel}
        </p>
        <div className="mt-2 flex justify-center gap-2.5">
          {t.lessonFlow.feels.map((f) => (
            <button
              key={f.id}
              onClick={() => setFeel(f.id as "crushed" | "got-it" | "shaky")}
              className="rounded-[16px] border-2 px-3.5 py-2 font-body text-[13px] font-extrabold text-ink transition active:scale-[0.94]"
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
          {claiming ? t.lessonFlow.claiming : t.lessonFlow.claimAndContinue}
        </button>
      </div>
    </>
  );
}
