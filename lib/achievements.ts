// Milestone badges derived purely from monotonic counters (total lessons,
// level, quotes, challenges). No streak-based badges: the streak can reset, and
// an "earned" badge must never un-earn. No server deps so client code can use it.

export type AchievementId =
  | "firstLesson"
  | "risingStar"
  | "bookworm"
  | "quoteCollector"
  | "challenger";

export type AchievementInput = {
  lessonsDone: number;
  level: number;
  quotes: number;
  reps: number;
};

export type Achievement = {
  id: AchievementId;
  target: number;
  current: number;
  earned: boolean;
};

const DEFS: { id: AchievementId; metric: keyof AchievementInput; target: number }[] = [
  { id: "firstLesson", metric: "lessonsDone", target: 1 },
  { id: "risingStar", metric: "level", target: 5 },
  { id: "bookworm", metric: "lessonsDone", target: 10 },
  { id: "quoteCollector", metric: "quotes", target: 10 },
  { id: "challenger", metric: "reps", target: 10 },
];

/** Every milestone with its current progress and whether it is earned yet. */
export function achievements(input: AchievementInput): Achievement[] {
  return DEFS.map(({ id, metric, target }) => {
    const current = Math.min(input[metric], target);
    return { id, target, current, earned: input[metric] >= target };
  });
}
