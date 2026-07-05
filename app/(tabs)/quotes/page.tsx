import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { currentPosition, getProgress } from "@/lib/game";
import { CHAPTERS, QUOTES } from "@/lib/content";
import { prisma } from "@/lib/db";
import { ProgressBar } from "@/components/ui";
import { QuotesGrid, type QuoteSlot } from "./quotes-grid";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  const [progress, collected] = await Promise.all([
    getProgress(user),
    prisma.collectedQuote.findMany({ where: { userId: user.id }, orderBy: { savedAt: "desc" } }),
  ]);
  const pos = currentPosition(progress);
  const chapter = CHAPTERS.find((c) => c.id === pos.chapterId)!;

  const collectedIds = new Set(collected.map((c) => c.quoteId));
  const newestId = collected[0]?.quoteId ?? null;

  const slots: QuoteSlot[] = chapter.lessons.map((lesson) => {
    const quote = QUOTES.find(
      (q) => q.chapterId === chapter.id && q.lessonIndex === lesson.index
    )!;
    return {
      quote,
      collected: collectedIds.has(quote.id),
      isNew: quote.id === newestId,
    };
  });
  const count = slots.filter((s) => s.collected).length;

  return (
    <div className="page-enter flex flex-col px-5 pb-6 pt-[58px]">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-[26px] font-semibold text-cocoa">Quotes</h1>
        <span className="rounded-full bg-white px-3 py-1.5 font-display text-[15px] font-semibold text-cocoa shadow-[0_2px_0_rgba(0,0,0,0.04)]">
          {count} / {slots.length}
        </span>
      </header>
      <p className="mt-1 font-body text-[14px] font-bold text-sec2">
        Pocket wisdom — one card per lesson.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-[16px] bg-white p-3 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
        <span className="rounded-full bg-ember px-2.5 py-1 font-display text-[11px] font-semibold tracking-[1px] text-white">
          CHAPTER {chapter.id}
        </span>
        <span className="font-display text-[15px] font-semibold text-cocoa">{chapter.title}</span>
        <ProgressBar percent={(count / slots.length) * 100} height={8} className="flex-1" />
      </div>

      <QuotesGrid slots={slots} />
    </div>
  );
}
