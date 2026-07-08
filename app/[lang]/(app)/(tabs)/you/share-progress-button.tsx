"use client";

import { shareText } from "@/lib/share";
import { useT } from "@/components/i18n-provider";
import { ShareIcon } from "@/components/icons";

// Share a one-line summary of the user's XP, streak, and collected quotes.
export function ShareProgressButton({
  xp,
  streak,
  quotes,
}: {
  xp: string;
  streak: number;
  quotes: number;
}) {
  const t = useT();
  return (
    <button
      type="button"
      aria-label={t.you.shareProgress}
      onClick={() => shareText(t.you.shareMessage(xp, streak, quotes))}
      className="absolute left-5 top-[58px] rounded-full bg-white/16 p-2 transition-transform active:scale-90"
    >
      <ShareIcon size={20} color="#fff" />
    </button>
  );
}
