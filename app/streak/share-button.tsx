"use client";

export function ShareStreakButton({ streak }: { streak: number }) {
  async function share() {
    const text = `🔥 ${streak}-day streak on Social XP — social skills are just reps.`;
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text);
    }
  }
  return (
    <button className="btn btn-ghost-dark" onClick={share}>
      Share my streak
    </button>
  );
}
