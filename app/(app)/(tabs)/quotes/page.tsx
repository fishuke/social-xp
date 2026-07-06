import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { currentPosition, getCourseProgress } from "@/lib/game";
import { getUnitQuotes } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { ProgressBar } from "@/components/ui";
import { QuotesGrid, type QuoteSlot } from "./quotes-grid";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  const progress = await getCourseProgress(user);
  const pos = currentPosition(progress);
  const unit = progress.find((p) => p.unit.id === pos.unitId)!.unit;

  const [unitQuotes, collected] = await Promise.all([
    getUnitQuotes(unit.id),
    prisma.collectedQuote.findMany({ where: { userId: user.id }, orderBy: { savedAt: "desc" } }),
  ]);

  const collectedIds = new Set(collected.map((c) => c.quoteId));
  const newestId = collected[0]?.quoteId ?? null;

  const slots: QuoteSlot[] = unitQuotes.map((quote) => ({
    quote,
    collected: collectedIds.has(quote.id),
    isNew: quote.id === newestId,
  }));
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
        Pocket wisdom. One card per lesson.
      </p>

      <div className="mt-4 flex items-center gap-3 rounded-[16px] bg-white p-3 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
        <span className="rounded-full bg-ember px-2.5 py-1 font-display text-[11px] font-semibold tracking-[1px] text-white">
          UNIT {unit.number}
        </span>
        <span className="font-display text-[15px] font-semibold text-cocoa">{unit.title}</span>
        <ProgressBar percent={(count / Math.max(slots.length, 1)) * 100} height={8} className="flex-1" />
      </div>

      <QuotesGrid slots={slots} />
    </div>
  );
}
