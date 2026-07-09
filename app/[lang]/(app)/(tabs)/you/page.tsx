import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import {
  collectedQuotes,
  courseTotals,
  effectiveStreak,
  getCourseProgress,
  levelInfo,
  streakAtRisk,
  weeklyActivity,
} from "@/lib/game";
import { getCourse } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { coerceLocale, formatNumber } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { CheckIcon, DiamondIcon, FlameIcon, GearIcon, LockIcon } from "@/components/icons";
import { ProgressBar, StatChip } from "@/components/ui";
import { Milestones } from "@/components/milestones";
import { achievements } from "@/lib/achievements";
import { ShareProgressButton } from "./share-progress-button";

export const dynamic = "force-dynamic";

export default async function YouPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = coerceLocale(lang);
  const t = getDictionary(locale);
  const user = await getSessionUser();
  if (!user) redirect(withLocale(locale, "/onboarding"));

  const [progress, quotes, course, week] = await Promise.all([
    getCourseProgress(user, locale),
    collectedQuotes(user),
    getCourse(1, locale),
    weeklyActivity(user),
  ]);
  const quoteCount = quotes.total;
  const activeDays = week.filter((d) => d.active).length;
  const { done: doneLessons, total: totalLessons, percent: coursePercent } = courseTotals(progress);
  const streak = effectiveStreak(user);
  const atRisk = streakAtRisk(user);
  const level = levelInfo(user.totalXP);
  const fmt = (n: number) => formatNumber(locale, n);
  const milestones = achievements({
    lessonsDone: doneLessons,
    level: level.level,
    quotes: quoteCount,
    reps: user.repsCompleted,
  });

  return (
    <div className="page-enter flex flex-col pb-6">
      <header
        className="relative rounded-b-[30px] px-6 pb-7 pt-[58px] text-center text-white"
        style={{ background: "linear-gradient(160deg, #FF7A45, #FF5A2C)" }}
      >
        <ShareProgressButton
          level={level.level}
          xp={fmt(user.totalXP)}
          streak={streak}
          quotes={quoteCount}
        />
        <Link
          href={withLocale(locale, "/settings")}
          aria-label={t.settings.title}
          className="absolute right-5 top-[58px] rounded-full bg-white/16 p-2 transition-transform active:scale-90"
        >
          <GearIcon size={20} color="#fff" />
        </Link>
        <p className="font-body text-[12px] font-extrabold uppercase tracking-[2px] text-white/85">
          {t.you.totalXp}
        </p>
        <p className="font-display text-[46px] font-semibold leading-[1.15]">
          {t.you.totalXpValue(fmt(user.totalXP))}
        </p>
        <div className="mx-auto mt-4 max-w-[300px]">
          <div className="flex items-center justify-between font-display text-[13px] font-semibold">
            <span>{t.you.level(level.level)}</span>
            <span className="text-white/85">
              {t.you.levelProgress(fmt(level.xpIntoLevel), fmt(level.xpForLevel))}
            </span>
          </div>
          <ProgressBar
            percent={level.percent}
            height={9}
            track="rgba(255,255,255,0.25)"
            fill="#fff"
            className="mt-2"
          />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <StatChip
            aria-label={atRisk ? t.you.streakAtRisk(streak) : t.you.dayStreak(streak)}
            className={atRisk ? "text-white/70" : undefined}
            icon={<FlameIcon size={16} color={atRisk ? "#FFD9C2" : "#FFC24A"} />}
          >
            {t.you.dayStreak(streak)}
          </StatChip>
          <StatChip>{t.you.challengesCount(user.repsCompleted)}</StatChip>
          <StatChip icon={<DiamondIcon size={16} color="#FFC24A" />}>
            {t.you.quotesCount(quoteCount)}
          </StatChip>
          {user.streakShields > 0 && (
            <StatChip>{t.you.shieldsCount(user.streakShields)}</StatChip>
          )}
        </div>
      </header>

      <section className="px-5 pt-6">
        <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-sec2">
          {t.you.thisWeek}
        </p>
        <div
          className="mt-3 flex justify-between rounded-[22px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]"
          aria-label={t.you.weekActivitySummary(activeDays)}
        >
          {week.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-2">
              <span className="font-display text-[12px] font-bold text-faint">
                {t.you.weekdayLetters[day.weekdayMondayIndex]}
              </span>
              <span
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-full font-display text-[13px] font-semibold ${
                  day.active ? "text-white" : "text-faint"
                }`}
                style={{
                  background: day.active ? "linear-gradient(160deg, #FF7A45, #FF5A2C)" : "#F2EAE2",
                  boxShadow: day.isToday ? "0 0 0 2px #FF5A2C" : undefined,
                }}
              >
                {day.active ? <FlameIcon size={16} color="#FFC24A" /> : null}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Milestones
        items={milestones}
        labels={{
          title: t.you.milestonesTitle,
          count: t.you.milestoneCount,
          earnedLabel: t.you.milestoneEarned,
          nextLabel: t.you.milestoneNext,
          names: t.you.milestones,
          progress: t.you.milestoneProgress,
        }}
      />

      <section className="px-5 pt-6">
        <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-sec2">
          {t.you.roadTitle(course?.title)}
        </p>
        <div className="mt-3 rounded-[22px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <span className="font-display text-[14px] font-semibold text-cocoa">
              {t.you.lessonsOfTotal(doneLessons, totalLessons)}
            </span>
            <span className="font-display text-[14px] font-semibold text-coral">
              {t.you.courseComplete(coursePercent)}
            </span>
          </div>
          <ProgressBar
            percent={coursePercent}
            height={11}
            fill="linear-gradient(90deg, #FFC24A, #FF914D)"
            className="mt-2.5"
          />
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {progress.map((p) => {
            const chapter = p.unit;
            const active = p.unlocked && !p.complete;
            const percent = (p.completed.length / chapter.lessons.length) * 100;

            if (!p.unlocked) {
              return (
                <div
                  key={chapter.number}
                  className="flex items-center gap-4 rounded-[22px] bg-white p-4 opacity-75"
                >
                  <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-line font-display text-[20px] font-semibold text-muted">
                    {chapter.number}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-[16px] font-semibold text-muted">
                      {chapter.title}
                    </span>
                    <span className="block font-body text-[12px] font-bold text-faint">
                      {chapter.tagline}
                    </span>
                  </span>
                  <LockIcon size={20} />
                </div>
              );
            }

            return (
              <div
                key={chapter.number}
                className="rounded-[22px] bg-white p-4"
                style={active ? { border: "2px solid #FF5A2C" } : undefined}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] font-display text-[20px] font-semibold text-white"
                    style={{
                      background: p.complete
                        ? "#58C08A"
                        : "linear-gradient(160deg, #FF7A45, #FF5A2C)",
                    }}
                  >
                    {chapter.number}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-[16px] font-semibold text-cocoa">
                      {chapter.title}
                    </span>
                    <span className="block font-body text-[12px] font-bold text-sec2">
                      {t.you.lessonsOfTotal(p.completed.length, chapter.lessons.length)}
                    </span>
                  </span>
                </div>
                {p.complete ? (
                  <div className="mt-3 rounded-[14px] bg-go-tint p-3">
                    <p className="font-display text-[11px] font-bold uppercase tracking-[1.5px] text-go-text">
                      {t.you.youLearned}
                    </p>
                    <p className="mt-1 flex items-start gap-2 font-body text-[13px] font-bold text-cocoa">
                      <span className="mt-0.5 shrink-0">
                        <CheckIcon size={15} color="#58C08A" />
                      </span>
                      {chapter.canDo}
                    </p>
                    {(quotes.byUnit.get(chapter.id) ?? 0) > 0 && (
                      <p className="mt-2 flex items-center gap-1.5 font-body text-[12px] font-bold text-go-text">
                        <DiamondIcon size={13} color="#58C08A" />
                        {t.you.quotesFromChapter(quotes.byUnit.get(chapter.id) ?? 0)}
                      </p>
                    )}
                  </div>
                ) : (
                  <ProgressBar
                    percent={percent}
                    height={11}
                    fill="linear-gradient(90deg, #FFC24A, #FF914D)"
                    className="mt-3"
                  />
                )}
              </div>
            );
          })}
        </div>

        <Link
          href={withLocale(locale, "/settings")}
          className="mt-5 flex items-center gap-3 rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]"
        >
          <GearIcon size={22} color="#7A6A5D" />
          <span className="flex-1">
            <span className="block font-display text-[15px] font-semibold text-cocoa">
              {t.you.settingsCardTitle}
            </span>
            <span className="block font-body text-[12px] font-bold text-sec2">
              {t.you.settingsCardSub}
            </span>
          </span>
          <span className="font-display text-[18px] text-faint">→</span>
        </Link>
      </section>
    </div>
  );
}
