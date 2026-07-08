// Levels derived purely from totalXP. Kept free of server-only imports so both
// server pages and client components (e.g. the lesson claim screen) can use it.

export type LevelInfo = {
  level: number; // 1-based
  xpIntoLevel: number; // XP earned toward the next level
  xpForLevel: number; // XP that spans the current level
  percent: number; // 0..100 progress to the next level
};

/** Cumulative XP required to reach the start of a level. Level 1 starts at 0. */
function xpAtLevelStart(level: number): number {
  return 50 * (level - 1) * level; // L2=100, L3=300, L4=600, L5=1000, ...
}

/** Current level and progress toward the next one, derived from totalXP. */
export function levelInfo(totalXP: number): LevelInfo {
  const xp = Math.max(0, totalXP);
  let level = Math.max(1, Math.floor((1 + Math.sqrt(1 + 0.08 * xp)) / 2));
  // correct any floating-point drift at exact thresholds
  while (xpAtLevelStart(level + 1) <= xp) level += 1;
  while (xpAtLevelStart(level) > xp) level -= 1;
  const start = xpAtLevelStart(level);
  const xpForLevel = xpAtLevelStart(level + 1) - start;
  const xpIntoLevel = xp - start;
  return {
    level,
    xpIntoLevel,
    xpForLevel,
    percent: Math.min(100, (xpIntoLevel / xpForLevel) * 100),
  };
}
