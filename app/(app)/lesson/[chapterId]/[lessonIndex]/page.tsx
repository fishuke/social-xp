import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getCourseProgress, getDaily, isLessonUnlocked } from "@/lib/game";
import { getLessonData, getQuoteData, getUnit } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { LessonFlow } from "./lesson-flow";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ chapterId: string; lessonIndex: string }>;
}) {
  const { chapterId: u, lessonIndex: l } = await params;
  const unitId = Number(u);
  const lessonIndex = Number(l);

  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  const [unit, lesson, quote] = await Promise.all([
    getUnit(unitId),
    getLessonData(unitId, lessonIndex),
    getQuoteData(unitId, lessonIndex),
  ]);
  if (!unit || !lesson || !quote) redirect("/learn");

  const progress = await getCourseProgress(user);
  if (!isLessonUnlocked(progress, unitId, lessonIndex)) {
    const p = progress.find((x) => x.unit.id === unitId);
    redirect(p && !p.unlocked && !user.isPremium ? "/paywall" : "/learn");
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
