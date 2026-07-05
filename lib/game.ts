import type { User } from "@prisma/client";
import { prisma } from "./db";
import { XP, type QuizStep, type UnitData } from "./content";
import { getLessonData, getQuoteData, getUnits } from "./catalog";

// ---------- dates (local server time; swap for user TZ when auth lands) ----------

export function dayString(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function daysAgoString(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return dayString(d);
}

function yesterdayString(): string {
  return daysAgoString(1);
}

// ---------- daily state ----------

export async function getDaily(userId: string) {
  const date = dayString();
  return prisma.dailyState.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date },
    update: {},
  });
}

// ---------- progress derivation ----------

export type UnitProgress = {
  unit: UnitData;
  completed: number[]; // lesson indexes
  unlocked: boolean;
  complete: boolean;
};

// Progress over the units of the (single, for now) course.
// LessonCompletion.chapterId stores the unit id.
export async function getCourseProgress(user: User): Promise<UnitProgress[]> {
  const [units, rows] = await Promise.all([
    getUnits(1),
    prisma.lessonCompletion.findMany({ where: { userId: user.id } }),
  ]);
  const byUnit = new Map<number, number[]>();
  for (const r of rows) {
    const list = byUnit.get(r.chapterId) ?? [];
    list.push(r.lessonIndex);
    byUnit.set(r.chapterId, list);
  }
  let previousComplete = true; // the first unit is always unlocked
  return units.map((unit) => {
    const completed = (byUnit.get(unit.id) ?? []).sort((a, b) => a - b);
    const complete = completed.length >= unit.lessons.length;
    const unlocked = user.isPremium || previousComplete;
    previousComplete = complete;
    return { unit, completed, unlocked, complete };
  });
}

export function currentPosition(progress: UnitProgress[]): { unitId: number; lessonIndex: number } {
  for (const p of progress) {
    if (!p.unlocked || p.complete) continue;
    const next = p.unit.lessons.find((l) => !p.completed.includes(l.index));
    if (next) return { unitId: p.unit.id, lessonIndex: next.index };
  }
  // course finished (or empty) — park on the first unit
  return { unitId: progress[0]?.unit.id ?? 1, lessonIndex: 1 };
}

export function isLessonUnlocked(
  progress: UnitProgress[],
  unitId: number,
  lessonIndex: number
): boolean {
  const p = progress.find((x) => x.unit.id === unitId);
  if (!p || !p.unlocked) return false;
  for (let i = 1; i < lessonIndex; i++) if (!p.completed.includes(i)) return false;
  return true;
}

// ---------- streak ----------

export function effectiveStreak(user: User): number {
  if (!user.lastGoalMetDate) return 0;
  if (user.lastGoalMetDate === dayString() || user.lastGoalMetDate === yesterdayString()) {
    return user.streakCount;
  }
  // one missed day, but a shield is waiting to absorb it
  if (user.lastGoalMetDate === daysAgoString(2) && user.streakShields > 0) {
    return user.streakCount;
  }
  return 0; // streak reset (gentle copy in UI, never shame)
}

// Duolingo rule: the first lesson of the day keeps the streak alive, on any pace.
// Challenges power the daily quests + chest instead of gating the streak.
function goalMet(daily: { lessonsDoneToday: number }): boolean {
  return daily.lessonsDoneToday >= 1;
}

/** Called after any award. Returns the new streak count if it just extended (fires once/day). */
async function evaluateStreak(user: User): Promise<number | null> {
  const daily = await getDaily(user.id);
  const today = dayString();
  if (!goalMet(daily) || user.lastGoalMetDate === today) return null;

  let newStreak = 1;
  let consumeShield = false;
  if (user.lastGoalMetDate === yesterdayString()) {
    newStreak = user.streakCount + 1;
  } else if (user.lastGoalMetDate === daysAgoString(2) && user.streakShields > 0) {
    newStreak = user.streakCount + 1; // shield absorbs the missed day
    consumeShield = true;
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      streakCount: newStreak,
      lastGoalMetDate: today,
      ...(consumeShield && { streakShields: { decrement: 1 } }),
    },
  });
  return newStreak;
}

// ---------- quests ----------

export type QuestState = {
  lessonDone: boolean;
  xpToday: number;
  repDone: boolean;
  repPending: boolean;
  allDone: boolean;
  chestOpened: boolean;
};

export function questState(daily: {
  lessonsDoneToday: number;
  xpEarnedToday: number;
  repDoneToday: boolean;
  repPending: boolean;
  chestOpened: boolean;
}): QuestState {
  const lessonDone = daily.lessonsDoneToday >= 1;
  const repDone = daily.repDoneToday;
  return {
    lessonDone,
    xpToday: daily.xpEarnedToday,
    repDone,
    repPending: daily.repPending,
    allDone: lessonDone && daily.xpEarnedToday >= 30 && repDone,
    chestOpened: daily.chestOpened,
  };
}

// ---------- mutations ----------

export async function completeLesson(
  user: User,
  input: {
    unitId: number;
    lessonIndex: number;
    quizFirstTries: number; // quiz/reframe steps answered right on the first try
    feel?: string;
    repCommitted: boolean;
    localTime?: string; // "HH:MM" in the user's timezone
  }
) {
  const lesson = await getLessonData(input.unitId, input.lessonIndex);
  if (!lesson) throw new Error("Unknown lesson");

  // Daily reminder follows the time they actually train.
  if (input.localTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(input.localTime)) {
    await prisma.user.update({ where: { id: user.id }, data: { reminderTime: input.localTime } });
  }

  const already = await prisma.lessonCompletion.findUnique({
    where: {
      userId_chapterId_lessonIndex: {
        userId: user.id,
        chapterId: input.unitId,
        lessonIndex: input.lessonIndex,
      },
    },
  });

  const quizCount = lesson.steps.filter((s): s is QuizStep => s.type === "quiz").length;
  const firstTries = Math.max(0, Math.min(input.quizFirstTries, quizCount));
  const xpAwarded = already ? 0 : XP.lessonClaim + firstTries * XP.quizFirstTry;
  const quote = await getQuoteData(input.unitId, input.lessonIndex);
  const date = dayString();

  if (!already) {
    await prisma.lessonCompletion.create({
      data: {
        userId: user.id,
        chapterId: input.unitId,
        lessonIndex: input.lessonIndex,
        feel: input.feel,
      },
    });
    if (quote) {
      await prisma.collectedQuote.upsert({
        where: { userId_quoteId: { userId: user.id, quoteId: quote.id } },
        create: { userId: user.id, quoteId: quote.id },
        update: {},
      });
    }
    await prisma.user.update({ where: { id: user.id }, data: { totalXP: { increment: xpAwarded } } });
  }

  await getDaily(user.id); // ensure row
  const daily = await prisma.dailyState.update({
    where: { userId_date: { userId: user.id, date } },
    data: {
      lessonsDoneToday: { increment: 1 },
      xpEarnedToday: { increment: xpAwarded },
      ...(input.repCommitted && { repPending: true }),
    },
  });

  const fresh = (await prisma.user.findUnique({ where: { id: user.id } }))!;
  const celebrateStreak = await evaluateStreak(fresh);

  return {
    xpAwarded,
    totalXP: fresh.totalXP,
    quoteId: already ? null : (quote?.id ?? null),
    celebrateStreak,
    quests: questState(daily),
  };
}

export async function completeRep(user: User) {
  const daily = await getDaily(user.id);
  if (daily.repDoneToday) {
    return { xpAwarded: 0, totalXP: user.totalXP, celebrateStreak: null, quests: questState(daily) };
  }
  const updatedDaily = await prisma.dailyState.update({
    where: { userId_date: { userId: user.id, date: daily.date } },
    data: { repDoneToday: true, repPending: false, xpEarnedToday: { increment: XP.challenge } },
  });
  const fresh = await prisma.user.update({
    where: { id: user.id },
    data: { totalXP: { increment: XP.challenge }, repsCompleted: { increment: 1 } },
  });
  const celebrateStreak = await evaluateStreak(fresh);
  return { xpAwarded: XP.challenge, totalXP: fresh.totalXP, celebrateStreak, quests: questState(updatedDaily) };
}

// ---------- chests (variable rewards — the "Hooked" loop's slot machine) ----------

export type ChestTier = "common" | "rare" | "epic";
export type ChestResult = {
  xpAwarded: number;
  shield: boolean;
  tier: ChestTier;
  totalXP: number;
};

const SHIELD_CAP = 2;

// [xp, weight] tables per tier — small chance of a big hit keeps opening exciting.
const CHEST_TABLES: Record<ChestTier, { xp: [number, number][]; shieldChance: number }> = {
  common: { xp: [[20, 40], [30, 30], [40, 20], [60, 10]], shieldChance: 0.05 },
  rare: { xp: [[40, 35], [60, 30], [80, 25], [120, 10]], shieldChance: 0.1 },
  epic: { xp: [[60, 40], [100, 30], [150, 20], [250, 10]], shieldChance: 0.25 },
};

function weightedPick(entries: [number, number][]): number {
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [value, weight] of entries) {
    r -= weight;
    if (r <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

async function grantChest(user: User, tier: ChestTier, markOpened?: string): Promise<ChestResult> {
  const table = CHEST_TABLES[tier];
  const xp = weightedPick(table.xp);
  const shield = user.streakShields < SHIELD_CAP && Math.random() < table.shieldChance;
  const opened: string[] = JSON.parse(user.openedChests || "[]");
  const fresh = await prisma.user.update({
    where: { id: user.id },
    data: {
      totalXP: { increment: xp },
      ...(shield && { streakShields: { increment: 1 } }),
      ...(markOpened && { openedChests: JSON.stringify([...opened, markOpened]) }),
    },
  });
  await getDaily(user.id);
  await prisma.dailyState.update({
    where: { userId_date: { userId: user.id, date: dayString() } },
    data: { xpEarnedToday: { increment: xp } },
  });
  return { xpAwarded: xp, shield, tier, totalXP: fresh.totalXP };
}

const NO_CHEST: Omit<ChestResult, "totalXP"> = { xpAwarded: 0, shield: false, tier: "common" };

export async function openQuestChest(user: User): Promise<ChestResult> {
  const daily = await getDaily(user.id);
  const q = questState(daily);
  if (!q.allDone || q.chestOpened) return { ...NO_CHEST, totalXP: user.totalXP };
  await prisma.dailyState.update({
    where: { userId_date: { userId: user.id, date: daily.date } },
    data: { chestOpened: true },
  });
  return grantChest(user, "common");
}

export async function openPathChest(user: User, unitId: number): Promise<ChestResult> {
  const opened: string[] = JSON.parse(user.openedChests || "[]");
  const key = `c${unitId}`;
  if (opened.includes(key)) return { ...NO_CHEST, totalXP: user.totalXP };
  const progress = await getCourseProgress(user);
  const p = progress.find((x) => x.unit.id === unitId);
  const reached = p ? [1, 2, 3].every((i) => p.completed.includes(i)) : false;
  if (!reached) return { ...NO_CHEST, totalXP: user.totalXP };
  return grantChest(user, "rare", key);
}

/** Streak milestone chest — every 7 days of streak, one epic chest. */
export async function openStreakChest(user: User, milestone: number): Promise<ChestResult> {
  const opened: string[] = JSON.parse(user.openedChests || "[]");
  const key = `s${milestone}`;
  const valid =
    milestone > 0 && milestone % 7 === 0 && user.streakCount >= milestone && !opened.includes(key);
  if (!valid) return { ...NO_CHEST, totalXP: user.totalXP };
  return grantChest(user, "epic", key);
}
