import type { User } from "@prisma/client";
import { prisma } from "./db";
import { XP, type QuizStep, type UnitData } from "./content";
import { getLessonData, getQuoteData, getUnits } from "./catalog";
import { coerceLocale, type Locale } from "./i18n/config";

// ---------- dates (per-user IANA timezone; null falls back to server time) ----------

export type TzUser = Pick<User, "id" | "timezone">;

/** YYYY-MM-DD for the given instant, in the given timezone (server tz when null). */
export function dayString(d = new Date(), timeZone?: string | null): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone ?? undefined,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Local date, hour ("00"-"23"), and Monday-based weekday index for a timezone. */
export function localParts(timeZone?: string | null, d = new Date()): {
  date: string;
  hour: string;
  weekdayMondayIndex: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone ?? undefined,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    hour: get("hour"),
    weekdayMondayIndex: Math.max(0, weekdays.indexOf(get("weekday"))),
  };
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

// n*24h back, formatted in the user's zone. Around a DST switch the boundary
// shifts by an hour at most, which is fine for streak bookkeeping.
function daysAgoString(n: number, timeZone?: string | null): string {
  return dayString(new Date(Date.now() - n * 86_400_000), timeZone);
}

function yesterdayString(timeZone?: string | null): string {
  return daysAgoString(1, timeZone);
}

// ---------- daily state ----------

export async function getDaily(user: TzUser) {
  const date = dayString(new Date(), user.timezone);
  return prisma.dailyState.upsert({
    where: { userId_date: { userId: user.id, date } },
    create: { userId: user.id, date },
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
// LessonCompletion.chapterId stores the unit id. `locale` is the locale being
// viewed (the URL segment), so unit/lesson titles match the surrounding chrome;
// it is not read from user.locale, which is only the stored default.
export async function getCourseProgress(user: User, locale: Locale): Promise<UnitProgress[]> {
  const [units, rows] = await Promise.all([
    getUnits(locale),
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
  // course finished (or empty) - park on the first unit
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
  const tz = user.timezone;
  if (
    user.lastGoalMetDate === dayString(new Date(), tz) ||
    user.lastGoalMetDate === yesterdayString(tz)
  ) {
    return user.streakCount;
  }
  // one missed day, but a shield is waiting to absorb it
  if (user.lastGoalMetDate === daysAgoString(2, tz) && user.streakShields > 0) {
    return user.streakCount;
  }
  return 0; // streak reset (gentle copy in UI, never shame)
}

/** A live streak that has not yet been extended today: still alive, but lost if no lesson today. */
export function streakAtRisk(user: User): boolean {
  return effectiveStreak(user) > 0 && user.lastGoalMetDate !== dayString(new Date(), user.timezone);
}

// ---------- levels (derived purely from totalXP) ----------

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

// Duolingo rule: the first lesson of the day keeps the streak alive, on any pace.
// Challenges power the daily quests + chest instead of gating the streak.
function goalMet(daily: { lessonsDoneToday: number }): boolean {
  return daily.lessonsDoneToday >= 1;
}

/** Called after any award. Returns the new streak count if it just extended (fires once/day). */
async function evaluateStreak(user: User): Promise<number | null> {
  const tz = user.timezone;
  const daily = await getDaily(user);
  const today = dayString(new Date(), tz);
  if (!goalMet(daily) || user.lastGoalMetDate === today) return null;

  let newStreak = 1;
  let consumeShield = false;
  if (user.lastGoalMetDate === yesterdayString(tz)) {
    newStreak = user.streakCount + 1;
  } else if (user.lastGoalMetDate === daysAgoString(2, tz) && user.streakShields > 0) {
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

export type AwardResult = {
  xpAwarded: number;
  totalXP: number;
  celebrateStreak: number | null;
  quests: QuestState;
};

export type LessonClaimResult = AwardResult & { quoteId: string | null };

export type LessonClaimInput = {
  unitId: number;
  lessonIndex: number;
  quizFirstTries: number; // quiz/reframe steps answered right on the first try
  feel?: string;
  repCommitted: boolean;
  localTime?: string; // "HH:MM" in the user's timezone
  timezone?: string; // IANA zone; self-heals users who onboarded before tz capture
};

export async function completeLesson(
  user: User,
  input: LessonClaimInput
): Promise<LessonClaimResult> {
  const lesson = await getLessonData(input.unitId, input.lessonIndex, coerceLocale(user.locale));
  if (!lesson) throw new Error("Unknown lesson");

  // Daily reminder follows the time they actually train; timezone follows the
  // device (both self-adjust on every claim).
  const newTimezone =
    input.timezone && input.timezone !== user.timezone && isValidTimeZone(input.timezone)
      ? input.timezone
      : undefined;
  if (input.localTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(input.localTime)) {
    await prisma.user.update({
      where: { id: user.id },
      data: { reminderTime: input.localTime, ...(newTimezone && { timezone: newTimezone }) },
    });
  } else if (newTimezone) {
    await prisma.user.update({ where: { id: user.id }, data: { timezone: newTimezone } });
  }
  const tz = newTimezone ?? user.timezone;

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
  const quote = await getQuoteData(input.unitId, input.lessonIndex, coerceLocale(user.locale));
  const date = dayString(new Date(), tz);

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

  await getDaily({ id: user.id, timezone: tz }); // ensure row
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

export async function completeChallenge(user: User): Promise<AwardResult> {
  const daily = await getDaily(user);
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

// ---------- chests (variable rewards - the "Hooked" loop's slot machine) ----------

export type ChestTier = "common" | "rare" | "epic";
export type ChestResult = {
  xpAwarded: number;
  shield: boolean;
  tier: ChestTier;
  totalXP: number;
};

const SHIELD_CAP = 2;

function openedChestKeys(user: User): string[] {
  return JSON.parse(user.openedChests || "[]");
}

// [xp, weight] tables per tier - small chance of a big hit keeps opening exciting.
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
  const opened = openedChestKeys(user);
  const fresh = await prisma.user.update({
    where: { id: user.id },
    data: {
      totalXP: { increment: xp },
      ...(shield && { streakShields: { increment: 1 } }),
      ...(markOpened && { openedChests: JSON.stringify([...opened, markOpened]) }),
    },
  });
  await getDaily(user);
  await prisma.dailyState.update({
    where: { userId_date: { userId: user.id, date: dayString(new Date(), user.timezone) } },
    data: { xpEarnedToday: { increment: xp } },
  });
  return { xpAwarded: xp, shield, tier, totalXP: fresh.totalXP };
}

const NO_CHEST: Omit<ChestResult, "totalXP"> = { xpAwarded: 0, shield: false, tier: "common" };

export async function openQuestChest(user: User): Promise<ChestResult> {
  const daily = await getDaily(user);
  const q = questState(daily);
  if (!q.allDone || q.chestOpened) return { ...NO_CHEST, totalXP: user.totalXP };
  await prisma.dailyState.update({
    where: { userId_date: { userId: user.id, date: daily.date } },
    data: { chestOpened: true },
  });
  return grantChest(user, "common");
}

export async function openPathChest(user: User, unitId: number): Promise<ChestResult> {
  const opened = openedChestKeys(user);
  const key = `c${unitId}`;
  if (opened.includes(key)) return { ...NO_CHEST, totalXP: user.totalXP };
  // Locale-independent: only lesson-completion state gates the chest.
  const progress = await getCourseProgress(user, coerceLocale(user.locale));
  const p = progress.find((x) => x.unit.id === unitId);
  const reached = p ? [1, 2, 3].every((i) => p.completed.includes(i)) : false;
  if (!reached) return { ...NO_CHEST, totalXP: user.totalXP };
  return grantChest(user, "rare", key);
}

/** Streak milestone chest - every 7 days of streak, one epic chest. */
export async function openStreakChest(user: User, milestone: number): Promise<ChestResult> {
  const opened = openedChestKeys(user);
  const key = `s${milestone}`;
  const valid =
    milestone > 0 && milestone % 7 === 0 && user.streakCount >= milestone && !opened.includes(key);
  if (!valid) return { ...NO_CHEST, totalXP: user.totalXP };
  return grantChest(user, "epic", key);
}
