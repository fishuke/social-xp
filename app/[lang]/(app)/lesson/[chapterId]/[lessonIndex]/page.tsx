import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getCourseProgress, getDaily, isLessonUnlocked } from "@/lib/game";
import { getLessonData, getQuoteData, getUnit } from "@/lib/catalog";
import { coerceLocale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { prisma } from "@/lib/db";
import { LessonFlow } from "./lesson-flow";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lang: string; chapterId: string; lessonIndex: string }>;
}) {
  const { lang, chapterId: u, lessonIndex: l } = await params;
  const locale = coerceLocale(lang);
  const unitId = Number(u);
  const lessonIndex = Number(l);

  const user = await getSessionUser();
  if (!user) redirect(withLocale(locale, "/onboarding"));

  const [unit, lesson, quote] = await Promise.all([
    getUnit(unitId, locale),
    getLessonData(unitId, lessonIndex, locale),
    getQuoteData(unitId, lessonIndex, locale),
  ]);
  if (!unit || !lesson || !quote) redirect(withLocale(locale, "/learn"));

  const progress = await getCourseProgress(user);
  if (!isLessonUnlocked(progress, unitId, lessonIndex)) {
    const p = progress.find((x) => x.unit.id === unitId);
    redirect(withLocale(locale, p && !p.unlocked && !user.isPremium ? "/paywall" : "/learn"));
  }

  const alreadyCompleted = progress
    .find((x) => x.unit.id === unitId)!
    .completed.includes(lessonIndex);

  const [daily, collectedBefore] = await Promise.all([
    getDaily(user),
    prisma.collectedQuote.count({
      where: { userId: user.id, quoteId: { startsWith: `u${unitId}-` } },
    }),
  ]);

  return (
    <LessonFlow
      unit={{ id: unit.id, number: unit.number, level: unit.level, title: unit.title }}
      lesson={lesson}
      quote={quote}
      collectedBefore={collectedBefore}
      xpTodayBefore={daily.xpEarnedToday}
      repDoneToday={daily.repDoneToday}
      alreadyCompleted={alreadyCompleted}
    />
  );
}
