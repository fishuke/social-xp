import type { QuoteData } from "@/lib/content";
import { DiamondIcon } from "./icons";

// The big collectible card - lesson Beat 3 and the Quotes full-screen view.
export function QuoteCard({
  quote,
  collectedInChapter,
  isNew,
}: {
  quote: QuoteData;
  collectedInChapter?: number; // "N of 6"
  isNew?: boolean;
}) {
  return (
    <div className="relative w-full rounded-[24px] bg-cream px-6 pb-6 pt-9 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
      {isNew && (
        <span className="absolute -top-3 right-5 rounded-full bg-coral px-3 py-1 font-display text-[12px] font-semibold tracking-[1px] text-white">
          NEW
        </span>
      )}
      <span aria-hidden className="block font-display text-[64px] font-bold leading-none text-ember">
        &ldquo;
      </span>
      <p className="mt-1 font-display text-[26px] font-medium leading-[1.32] text-cocoa">
        {quote.text}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div
          aria-hidden
          className="h-[50px] w-[38px] rounded-[6px] bg-gradient-to-b from-coral-top to-coral shadow-[0_3px_8px_rgba(255,90,44,0.35)]"
        />
        <div className="flex-1">
          <p className="font-body text-[15px] font-extrabold text-cocoa">{quote.author}</p>
          <p className="font-body text-[13px] font-bold text-sec2">{quote.authorNote}</p>
        </div>
        {collectedInChapter !== undefined && (
          <span className="flex items-center gap-1.5 font-body text-[13px] font-extrabold text-sec2">
            <DiamondIcon size={16} />
            {collectedInChapter} of 6
          </span>
        )}
      </div>
    </div>
  );
}
