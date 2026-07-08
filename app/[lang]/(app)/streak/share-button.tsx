"use client";

import { shareText } from "@/lib/share";
import { useT } from "@/components/i18n-provider";

export function ShareStreakButton({ streak }: { streak: number }) {
  const t = useT();
  return (
    <button
      className="btn btn-ghost-dark"
      onClick={() => shareText(t.streak.shareMessage(streak))}
    >
      {t.streak.shareMyStreak}
    </button>
  );
}
