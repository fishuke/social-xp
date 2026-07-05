import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { currentPosition, effectiveStreak, getDaily, getProgress, questState } from "@/lib/game";
import { CHAPTERS } from "@/lib/content";
import { prisma } from "@/lib/db";
import { BookIcon, ChevronRightIcon, DiamondIcon, FlameIcon, XpSquareIcon } from "@/components/icons";
import { StatPill, ProgressBar } from "@/components/ui";
import { QuestsCard } from "@/components/quests-card";
import { LearnPath, type PathNode } from "@/components/learn-path";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  const [progress, daily, quoteCount] = await Promise.all([
    getProgress(user),
    getDaily(user.id),
    prisma.collectedQuote.count({ where: { userId: user.id } }),
  ]);
  const pos = currentPosition(progress);
  const chapter = CHAPTERS.find((c) => c.id === pos.chapterId)!;
  const chapterProgress = progress.find((p) => p.chapterId === chapter.id)!;
  const doneCount = chapterProgress.completed.length;
  const openedChests: string[] = JSON.parse(user.openedChests || "[]");

  const nodes: PathNode[] = [];
  for (const lesson of chapter.lessons) {
    const done = chapterProgress.completed.includes(lesson.index);
    nodes.push({
      kind: "lesson",
      index: lesson.index,
      title: lesson.isCheckpoint ? "Checkpoint" : lesson.title,
      state: done ? "done" : lesson.index === pos.lessonIndex ? "current" : "locked",
      isCheckpoint: lesson.isCheckpoint,
    });
    if (lesson.index === 3) {
      nodes.push({
        kind: "chest",
        reached: [1, 2, 3].every((i) => chapterProgress.completed.includes(i)),
        opened: openedChests.includes(`c${chapter.id}`),
      });
    }
  }

  return (
    <div className="page-enter flex flex-col gap-4 px-5 pt-[58px]">
      <header className="flex items-center justify-between">
        <StatPill icon={<FlameIcon size={20} />} label={String(effectiveStreak(user))} />
        <div className="flex gap-2">
          <StatPill icon={<DiamondIcon size={18} />} label={String(quoteCount)} />
          <StatPill icon={<XpSquareIcon size={18} />} label={user.totalXP.toLocaleString("en-US")} />
        </div>
      </header>

      <Link
        href="/chapters"
        className="block rounded-[20px] p-4 text-white"
        style={{
          background: "linear-gradient(160deg, #FF7A45, #FF5A2C)",
          boxShadow: "0 6px 16px rgba(255,90,44,0.28)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="font-body text-[11px] font-extrabold uppercase tracking-[1.5px] text-white/85">
              {chapter.level} · Chapter {chapter.number} · {doneCount} of {chapter.lessons.length} done
            </p>
            <p className="mt-0.5 font-display text-[21px] font-semibold">{chapter.title}</p>
            <ProgressBar
              percent={(doneCount / chapter.lessons.length) * 100}
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

      <QuestsCard quests={questState(daily)} showRepAction />

      <LearnPath chapterId={chapter.id} nodes={nodes} />
    </div>
  );
}
