// Milestone badges derived purely from monotonic counters (total lessons,
// level, quotes, challenges, best streak). An "earned" badge must never
// un-earn, so streak badges track the personal-best streak (which only ever
// grows), never the current streak (which can reset). No server deps so client
// code can use it.

export type AchievementId =
  | "firstLesson"
  | "risingStar"
  | "bookworm"
  | "quoteCollector"
  | "challenger"
  | "streakMaster";

export type AchievementInput = {
  lessonsDone: number;
  level: number;
  quotes: number;
  reps: number;
  bestStreak?: number;
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
  { id: "streakMaster", metric: "bestStreak", target: 7 },
];

/** Every milestone with its current progress and whether it is earned yet. */
export function achievements(input: AchievementInput): Achievement[] {
  return DEFS.map(({ id, metric, target }) => {
    const value = input[metric] ?? 0;
    const current = Math.min(value, target);
    return { id, target, current, earned: value >= target };
  });
}
