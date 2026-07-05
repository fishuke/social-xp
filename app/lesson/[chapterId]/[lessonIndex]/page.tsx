import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getDaily, getProgress, isLessonUnlocked } from "@/lib/game";
import { getChapter, getLesson, getQuote } from "@/lib/content";
import { prisma } from "@/lib/db";
import { LessonFlow } from "./lesson-flow";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ chapterId: string; lessonIndex: string }>;
}) {
  const { chapterId: c, lessonIndex: l } = await params;
  const chapterId = Number(c);
  const lessonIndex = Number(l);

  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  const chapter = getChapter(chapterId);
  const lesson = getLesson(chapterId, lessonIndex);
  const quote = getQuote(chapterId, lessonIndex);
  if (!chapter || !lesson || !quote) redirect("/learn");

  const progress = await getProgress(user);
  if (!isLessonUnlocked(progress, chapterId, lessonIndex)) {
    const p = progress.find((x) => x.chapterId === chapterId);
    redirect(p && !p.unlocked && !user.isPremium ? "/paywall" : "/learn");
  }

  const alreadyCompleted = progress
    .find((x) => x.chapterId === chapterId)!
    .completed.includes(lessonIndex);

  const [daily, collectedBefore] = await Promise.all([
    getDaily(user.id),
    prisma.collectedQuote.count({
      where: { userId: user.id, quoteId: { startsWith: `c${chapterId}-` } },
    }),
  ]);

  return (
    <LessonFlow
      chapterId={chapterId}
      chapterTitle={chapter.title}
      lesson={lesson}
      quote={quote}
      collectedBefore={collectedBefore}
      xpTodayBefore={daily.xpEarnedToday}
      repDoneToday={daily.repDoneToday}
      alreadyCompleted={alreadyCompleted}
    />
  );
}
