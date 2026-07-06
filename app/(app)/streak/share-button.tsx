"use client";

import { shareText } from "@/lib/share";

export function ShareStreakButton({ streak }: { streak: number }) {
  return (
    <button
      className="btn btn-ghost-dark"
      onClick={() => shareText(`🔥 ${streak}-day streak on Social XP — social skills are just reps.`)}
    >
      Share my streak
    </button>
  );
}
