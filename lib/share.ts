"use client";

// One share path for quotes, streaks, and anything else: native share sheet
// where available, clipboard otherwise.
export async function shareText(text: string): Promise<void> {
  if (navigator.share) {
    await navigator.share({ text }).catch(() => {});
  } else {
    await navigator.clipboard.writeText(text).catch(() => {});
  }
}

export function quoteShareText(quote: { text: string; author: string }): string {
  return `“${quote.text}” — ${quote.author} · collected on Social XP`;
}
