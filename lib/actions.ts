"use server";

// Typed server actions - the only mutation path between client and server.
// Each action: validate input (zod) → resolve session → delegate to lib/game.

import { z } from "zod";
import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import { prisma } from "./db";
import { credentialsSchema, signIn, signOut } from "./auth";
import { createSessionUser, getSessionUser } from "./session";
import {
  completeChallenge,
  completeLesson,
  openPathChest,
  openQuestChest,
  openStreakChest,
  type AwardResult,
  type ChestResult,
  type LessonClaimResult,
} from "./game";
import { deleteSubscription, saveSubscription, sendReminder } from "./push";
import {
  coachLocked,
  completeCoachSession,
  countSessionsToday,
  type CoachSessionResult,
} from "./coach";

async function requireUser(): Promise<User> {
  const user = await getSessionUser();
  if (!user) throw new Error("Not signed in");
  return user;
}

/* ---------- onboarding ---------- */

const onboardingSchema = z.object({
  goal: z.enum(["ease-nerves", "confidence", "listener", "easy-conversation", "approval"]),
  pace: z.enum(["chill", "steady", "beast"]),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export async function submitOnboarding(input: OnboardingInput): Promise<void> {
  const { goal, pace } = onboardingSchema.parse(input);
  await createSessionUser({ goal, pace });
}

/* ---------- lesson claim ---------- */

const claimLessonSchema = z.object({
  unitId: z.number().int().positive(),
  lessonIndex: z.number().int().positive(),
  quizFirstTries: z.number().int().min(0),
  feel: z.enum(["crushed", "got-it", "shaky"]).optional(),
  repCommitted: z.boolean(),
  localTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
});

export type ClaimLessonInput = z.infer<typeof claimLessonSchema>;

export async function claimLesson(input: ClaimLessonInput): Promise<LessonClaimResult> {
  const user = await requireUser();
  return completeLesson(user, claimLessonSchema.parse(input));
}

/* ---------- real-world challenge ---------- */

export async function markChallengeDone(): Promise<AwardResult> {
  const user = await requireUser();
  return completeChallenge(user);
}

/* ---------- chests ---------- */

const chestRequestSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("quest") }),
  z.object({ type: z.literal("path"), unitId: z.number().int().positive() }),
  z.object({ type: z.literal("streak"), milestone: z.number().int().positive() }),
]);

export type ChestRequest = z.infer<typeof chestRequestSchema>;

export async function openChest(input: ChestRequest): Promise<ChestResult> {
  const user = await requireUser();
  const request = chestRequestSchema.parse(input);
  switch (request.type) {
    case "quest":
      return openQuestChest(user);
    case "path":
      return openPathChest(user, request.unitId);
    case "streak":
      return openStreakChest(user, request.milestone);
  }
}

/* ---------- AI coach ---------- */

const coachDurationSchema = z.coerce.number().int().min(5).max(65);
const MAX_COACH_AUDIO_BYTES = 3 * 1024 * 1024; // 60s WAV (16kHz mono PCM16) ≈ 1.9MB

export type CoachSubmitResult =
  | ({ ok: true } & CoachSessionResult)
  | { ok: false; code: "audio" | "limit" | "config" | "analysis"; error: string };

export async function submitCoachSession(formData: FormData): Promise<CoachSubmitResult> {
  const user = await requireUser();

  const audio = formData.get("audio");
  const duration = coachDurationSchema.safeParse(formData.get("durationSec"));
  if (!(audio instanceof Blob) || audio.size === 0 || !duration.success) {
    return { ok: false, code: "audio", error: "That recording didn't come through — try again." };
  }
  if (audio.size > MAX_COACH_AUDIO_BYTES) {
    return { ok: false, code: "audio", error: "That recording is too big — keep it under a minute." };
  }
  if (!process.env.GEMINI_API_KEY) {
    return { ok: false, code: "config", error: "The coach isn't set up yet — add GEMINI_API_KEY." };
  }
  if (coachLocked(user, await countSessionsToday(user.id))) {
    return { ok: false, code: "limit", error: "You've used today's free session." };
  }

  try {
    const result = await completeCoachSession(user, {
      audio: Buffer.from(await audio.arrayBuffer()),
      mimeType: audio.type || "audio/wav",
      durationSec: duration.data,
    });
    return { ok: true, ...result };
  } catch (error) {
    console.error("Coach analysis failed:", error);
    return { ok: false, code: "analysis", error: "The coach couldn't hear that one — give it another go." };
  }
}

/* ---------- reminder push subscriptions ---------- */

const pushSubscriptionSchema = z.object({
  endpoint: z.url(),
  keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }),
});

export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>;

export async function subscribeToReminders(input: PushSubscriptionInput): Promise<void> {
  const user = await requireUser();
  await saveSubscription(user.id, pushSubscriptionSchema.parse(input));
}

export async function unsubscribeFromReminders(endpoint: string): Promise<void> {
  await requireUser(); // must be signed in; endpoint is unique so this is scoped enough
  await deleteSubscription(z.url().parse(endpoint));
}

/** Sends the real streak-aware reminder to the current user - used by the "send a test" button. */
export async function sendTestReminder(): Promise<{ sent: number }> {
  const user = await requireUser();
  return { sent: await sendReminder(user) };
}

/* ---------- premium (mock - replace with StoreKit/Stripe later) ---------- */

export async function startPremiumTrial(): Promise<void> {
  const user = await requireUser();
  await prisma.user.update({ where: { id: user.id }, data: { isPremium: true } });
}

/* ---------- account (optional - upgrades the anonymous user) ---------- */

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function registerAccount(input: { email: string; password: string }): Promise<AuthResult> {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { email, password } = parsed.data;

  const taken = await prisma.user.findUnique({ where: { email } });
  if (taken) return { ok: false, error: "That email already has an account. Log in instead." };

  const current = await getSessionUser();
  const passwordHash = await hash(password, 10);
  if (current && !current.email) {
    // upgrade the anonymous user - progress, XP, and streak are kept
    await prisma.user.update({ where: { id: current.id }, data: { email, passwordHash } });
  } else {
    await prisma.user.create({ data: { email, passwordHash } });
  }

  await signIn("credentials", { email, password, redirect: false });
  return { ok: true };
}

export async function loginAccount(input: { email: string; password: string }): Promise<AuthResult> {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  try {
    await signIn("credentials", { ...parsed.data, redirect: false });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Wrong email or password." };
    }
    throw error;
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false });
  const store = await cookies();
  store.delete("sx_uid"); // fully signed out - next visit starts fresh
}
