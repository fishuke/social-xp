import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
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
  const where = { userId_date: { userId: user.id, date } };
  try {
    return await prisma.dailyState.upsert({
      where,
      create: { userId: user.id, date },
      update: {},
    });
  } catch (err) {
    // Concurrent callers can both race the create (upsert is SELECT-then-INSERT,
    // not atomic). The loser hits the unique constraint; the row now exists, so
    // just read it back.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return prisma.dailyState.findUniqueOrThrow({ where });
    }
    throw err;
  }
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

/** Overall course completion across every unit, clamped so extra completions cannot exceed the total. */
export function courseTotals(progress: UnitProgress[]): { done: number; total: number; percent: number } {
  const total = progress.reduce((sum, p) => sum + p.unit.lessons.length, 0);
  const done = progress.reduce(
    (sum, p) => sum + Math.min(p.completed.length, p.unit.lessons.length),
    0
  );
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
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

// ---------- weekly activity ----------

export type ActivityDay = {
  date: string; // YYYY-MM-DD in the user's timezone
  weekdayMondayIndex: number; // 0 = Monday
  active: boolean; // at least one lesson completed that day
  isToday: boolean;
};

/** The last 7 days (oldest first), each flagged with whether a lesson was completed. */
export async function weeklyActivity(user: TzUser): Promise<ActivityDay[]> {
  const tz = user.timezone;
  const since = new Date(Date.now() - 7 * 86_400_000);
  const rows = await prisma.lessonCompletion.findMany({
    where: { userId: user.id, completedAt: { gte: since } },
    select: { completedAt: true },
  });
  const activeDays = new Set(rows.map((r) => dayString(r.completedAt, tz)));
  const today = dayString(new Date(), tz);
  const days: ActivityDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const at = new Date(Date.now() - i * 86_400_000);
    const date = dayString(at, tz);
    days.push({
      date,
      weekdayMondayIndex: localParts(tz, at).weekdayMondayIndex,
      active: activeDays.has(date),
      isToday: date === today,
    });
  }
  return days;
}

// Calendar day after `day` (both YYYY-MM-DD), computed on the UTC-anchored
// string so it is independent of the user's timezone and DST.
function nextDayString(day: string): string {
  return new Date(new Date(`${day}T00:00:00Z`).getTime() + 86_400_000)
    .toISOString()
    .slice(0, 10);
}

/** Longest run of consecutive local days with at least one lesson completion. */
export async function bestStreak(user: TzUser): Promise<number> {
  const tz = user.timezone;
  const rows = await prisma.lessonCompletion.findMany({
    where: { userId: user.id },
    select: { completedAt: true },
  });
  if (rows.length === 0) return 0;
  const days = [...new Set(rows.map((r) => dayString(r.completedAt, tz)))].sort();
  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = nextDayString(days[i - 1]) === days[i] ? run + 1 : 1;
    if (run > best) best = run;
  }
  return best;
}

export type CollectedQuotes = {
  total: number;
  byUnit: Map<number, number>; // unitId -> quotes collected from that unit
};

/** How many quotes the user has collected, in total and grouped by unit. */
export async function collectedQuotes(user: Pick<User, "id">): Promise<CollectedQuotes> {
  const collected = await prisma.collectedQuote.findMany({
    where: { userId: user.id },
    select: { quoteId: true },
  });
  const byUnit = new Map<number, number>();
  if (collected.length) {
    const quotes = await prisma.quote.findMany({
      where: { id: { in: collected.map((c) => c.quoteId) } },
      select: { id: true, unitId: true },
    });
    const unitOf = new Map(quotes.map((q) => [q.id, q.unitId]));
    for (const c of collected) {
      const unitId = unitOf.get(c.quoteId);
      if (unitId != null) byUnit.set(unitId, (byUnit.get(unitId) ?? 0) + 1);
    }
  }
  return { total: collected.length, byUnit };
}

// ---------- levels (derived purely from totalXP; see lib/levels) ----------

export { levelInfo, type LevelInfo } from "./levels";

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

// ---------- daily goal ----------

/**
 * Lessons the user aims to finish each day, derived from the pace they chose at
 * onboarding (chill = a lesson a day, steady adds a challenge, beast stacks more).
 * This gives that onboarding choice a visible effect on the learn tab.
 */
export function dailyLessonGoal(pace: string): number {
  switch (pace) {
    case "chill":
      return 1;
    case "beast":
      return 3;
    default:
      return 2; // steady
  }
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

export function openedChestKeys(user: User): string[] {
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
