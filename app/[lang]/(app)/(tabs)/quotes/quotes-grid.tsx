"use client";

import { useState } from "react";
import type { QuoteData } from "@/lib/content";
import { shareText } from "@/lib/share";
import { useT } from "@/components/i18n-provider";
import { CloseIcon, FlagIcon, LockIcon } from "@/components/icons";
import { QuoteCard } from "@/components/quote-card";

export type QuoteSlot = {
  quote: QuoteData;
  collected: boolean;
  isNew: boolean;
};

export function QuotesGrid({ slots }: { slots: QuoteSlot[] }) {
  const t = useT();
  const [open, setOpen] = useState<QuoteSlot | null>(null);
  const collectedCount = slots.filter((s) => s.collected).length;

  const share = (quote: QuoteData) => shareText(t.quotes.shareMessage(quote.text, quote.author));

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {slots.map((slot) => {
          const { quote } = slot;
          if (!slot.collected) {
            const rare = quote.rare;
            return (
              <div
                key={quote.id}
                className="flex min-h-[170px] flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed p-4 text-center"
                style={{
                  borderColor: rare ? "#FFC24A" : "#D8C9B8",
                  background: rare ? "#FFF9EC" : "transparent",
                }}
              >
                {rare ? <FlagIcon size={24} /> : <LockIcon size={24} />}
                <p className="font-body text-[12px] font-extrabold text-faint">
                  {rare ? t.quotes.lockedRare : t.quotes.lockedNormal(quote.lessonIndex)}
                </p>
              </div>
            );
          }
          return (
            <button
              key={quote.id}
              onClick={() => setOpen(slot)}
              className="relative flex min-h-[170px] flex-col rounded-[20px] bg-white p-4 text-left shadow-[0_4px_0_rgba(0,0,0,0.04)]"
              style={slot.isNew ? { border: "2px solid #FF914D" } : undefined}
            >
              {slot.isNew && (
                <span className="absolute -top-2.5 right-3 rounded-full bg-ember px-2 py-0.5 font-display text-[10px] font-semibold tracking-[1px] text-white">
                  {t.quotes.isNew}
                </span>
              )}
              <span aria-hidden className="font-display text-[30px] font-bold leading-none text-ember">
                &ldquo;
              </span>
              <p className="mt-1 flex-1 font-display text-[15px] font-medium leading-[1.35] text-cocoa">
                {quote.text}
              </p>
              <p className="mt-2 font-body text-[12px] font-extrabold text-ink">{quote.author}</p>
              <p className="font-body text-[11px] font-bold text-faint">{t.quotes.lesson(quote.lessonIndex)}</p>
            </button>
          );
        })}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-center px-6"
          style={{ background: "linear-gradient(170deg, #2E2018, #43301F)" }}
        >
          <button
            onClick={() => setOpen(null)}
            aria-label={t.common.close}
            className="absolute right-5 top-[58px] text-ondark"
          >
            <CloseIcon size={26} />
          </button>
          <div className="pop-in">
            <QuoteCard quote={open.quote} collectedInChapter={collectedCount} isNew={open.isNew} />
          </div>
          <div className="mt-6 flex gap-3">
            <button className="btn btn-ghost-dark" onClick={() => share(open.quote)}>
              {t.common.share}
            </button>
            <button className="btn btn-amber" onClick={() => setOpen(null)}>
              {t.common.done}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
