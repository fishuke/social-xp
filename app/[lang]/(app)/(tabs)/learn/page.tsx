import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { currentPosition, effectiveStreak, getCourseProgress, getDaily, questState, streakAtRisk } from "@/lib/game";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { coerceLocale, INTL_LOCALE } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { BookIcon, ChevronRightIcon, DiamondIcon, FlameIcon, XpSquareIcon } from "@/components/icons";
import { StatPill, ProgressBar } from "@/components/ui";
import { QuestsCard } from "@/components/quests-card";
import { LearnPath, type PathNode } from "@/components/learn-path";

export const dynamic = "force-dynamic";

export default async function LearnPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = coerceLocale(lang);
  const t = getDictionary(locale);
  const user = await getSessionUser();
  if (!user) redirect(withLocale(locale, "/onboarding"));

  const [progress, daily, quoteCount] = await Promise.all([
    getCourseProgress(user, locale),
    getDaily(user),
    prisma.collectedQuote.count({ where: { userId: user.id } }),
  ]);
  const pos = currentPosition(progress);
  const unitProgress = progress.find((p) => p.unit.id === pos.unitId)!;
  const unit = unitProgress.unit;
  const doneCount = unitProgress.completed.length;
  const openedChests: string[] = JSON.parse(user.openedChests || "[]");
  const streak = effectiveStreak(user);
  const atRisk = streakAtRisk(user);

  const nodes: PathNode[] = [];
  for (const lesson of unit.lessons) {
    const done = unitProgress.completed.includes(lesson.index);
    nodes.push({
      kind: "lesson",
      index: lesson.index,
      title: lesson.isCheckpoint ? t.learn.checkpoint : lesson.title,
      state: done ? "done" : lesson.index === pos.lessonIndex ? "current" : "locked",
      isCheckpoint: lesson.isCheckpoint,
    });
    if (lesson.index === 3) {
      nodes.push({
        kind: "chest",
        reached: [1, 2, 3].every((i) => unitProgress.completed.includes(i)),
        opened: openedChests.includes(`c${unit.id}`),
      });
    }
  }

  return (
    <div className="page-enter flex flex-col gap-4 px-5 pt-[58px]">
      <header className="flex items-center justify-between">
        <Link
          href={withLocale(locale, "/streak")}
          aria-label={atRisk ? t.you.streakAtRisk(streak) : t.you.dayStreak(streak)}
          className="transition-transform active:scale-95"
        >
          <StatPill
            icon={<FlameIcon size={20} color={atRisk ? "#C4B4A6" : undefined} />}
            label={String(streak)}
            className={atRisk ? "text-faint" : undefined}
          />
        </Link>
        <div className="flex gap-2">
          <Link
            href={withLocale(locale, "/quotes")}
            aria-label={t.you.quotesCount(quoteCount)}
            className="transition-transform active:scale-95"
          >
            <StatPill icon={<DiamondIcon size={18} />} label={String(quoteCount)} />
          </Link>
          <Link
            href={withLocale(locale, "/you")}
            aria-label={t.you.totalXp}
            className="transition-transform active:scale-95"
          >
            <StatPill icon={<XpSquareIcon size={18} />} label={user.totalXP.toLocaleString(INTL_LOCALE[locale])} />
          </Link>
        </div>
      </header>

      <Link
        href={withLocale(locale, "/chapters")}
        className="block rounded-[20px] p-4 text-white"
        style={{
          background: "linear-gradient(160deg, #FF7A45, #FF5A2C)",
          boxShadow: "0 6px 16px rgba(255,90,44,0.28)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-body text-[11px] font-extrabold uppercase tracking-[1.5px] text-white/85">
              {t.learn.unitMeta(unit.level, unit.number, doneCount, unit.lessons.length)}
            </p>
            <p className="mt-0.5 font-display text-[21px] font-semibold">{unit.title}</p>
            <ProgressBar
              percent={(doneCount / unit.lessons.length) * 100}
              height={7}
              track="rgba(255,255,255,0.28)"
              fill="#FFC24A"
              className="mt-2.5"
            />
          </div>
          <BookIcon size={26} />
          <ChevronRightIcon size={20} color="#fff" />
        </div>
      </Link>

      <QuestsCard quests={questState(daily)} showChallengeAction />

      <LearnPath chapterId={unit.id} nodes={nodes} />
    </div>
  );
}
