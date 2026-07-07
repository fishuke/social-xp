"use server";

// Typed server actions - the only mutation path between client and server.
// Each action: validate input (zod) → resolve session → delegate to lib/game.

import { z } from "zod";
import { AuthError } from "next-auth";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import { prisma } from "./db";
import { credentialsSchema, signIn, signOut } from "./auth";
import { createSessionUser, getSessionUser } from "./session";
import {
  completeChallenge,
  completeLesson,
  isValidTimeZone,
  openPathChest,
  openQuestChest,
  openStreakChest,
  type AwardResult,
  type ChestResult,
  type LessonClaimResult,
} from "./game";
import { deleteSubscription, saveSubscription, sendReminder } from "./push";
import { activeProvider, getProvider } from "./payments";
import { clearRateLimit, consumeAuthToken, createAuthToken, isRateLimited, rateLimit } from "./account";
import { sendPasswordResetMail, sendVerificationMail } from "./mail";
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

const timezoneSchema = z
  .string()
  .max(64)
  .refine(isValidTimeZone, "Unknown timezone")
  .optional();

const onboardingSchema = z.object({
  goal: z.enum(["ease-nerves", "confidence", "listener", "easy-conversation", "approval"]),
  pace: z.enum(["chill", "steady", "beast"]),
  timezone: timezoneSchema,
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export async function submitOnboarding(input: OnboardingInput): Promise<void> {
  const { goal, pace, timezone } = onboardingSchema.parse(input);
  await createSessionUser({ goal, pace, timezone });
}

/* ---------- lesson claim ---------- */

const claimLessonSchema = z.object({
  unitId: z.number().int().positive(),
  lessonIndex: z.number().int().positive(),
  quizFirstTries: z.number().int().min(0),
  feel: z.enum(["crushed", "got-it", "shaky"]).optional(),
  repCommitted: z.boolean(),
  localTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
  timezone: timezoneSchema,
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
    return { ok: false, code: "audio", error: "That recording didn't come through. Try again." };
  }
  if (audio.size > MAX_COACH_AUDIO_BYTES) {
    return { ok: false, code: "audio", error: "That recording is too big. Keep it under a minute." };
  }
  if (!process.env.GEMINI_API_KEY) {
    return { ok: false, code: "config", error: "The coach isn't set up yet. Add GEMINI_API_KEY." };
  }
  if (coachLocked(user, await countSessionsToday(user))) {
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
    return { ok: false, code: "analysis", error: "The coach couldn't hear that one. Give it another go." };
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

/* ---------- premium checkout (lib/payments adapters) ---------- */

const planSchema = z.enum(["monthly", "yearly"]);

export type CheckoutResult =
  | { ok: true; url: string } // redirect to the provider's hosted checkout
  | { ok: true; url: null } // dev fallback - premium flipped directly
  | { ok: false; error: string };

export async function startCheckout(input: { plan: "monthly" | "yearly" }): Promise<CheckoutResult> {
  const user = await requireUser();
  const plan = planSchema.parse(input.plan);
  const provider = activeProvider();

  if (!provider.configured()) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "Payments aren't live yet. Check back soon." };
    }
    // Dev mock: grant premium directly so the flow stays testable without a store.
    await prisma.user.update({ where: { id: user.id }, data: { isPremium: true } });
    return { ok: true, url: null };
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://social-xp.vercel.app";
  try {
    const { url } = await provider.createCheckout({
      userId: user.id,
      email: user.email,
      plan,
      redirectUrl: `${base}/paywall/success`,
    });
    return { ok: true, url };
  } catch (error) {
    console.error("checkout failed:", error);
    return { ok: false, error: "Couldn't start checkout. Try again in a moment." };
  }
}

/** Fresh customer-portal URL for the user's newest subscription (links expire, so one per click). */
export async function getManageSubscriptionUrl(): Promise<string | null> {
  const user = await requireUser();
  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  if (!subscription) return null;
  return getProvider(subscription.provider)?.manageUrl(subscription) ?? null;
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
  const user =
    current && !current.email
      ? // upgrade the anonymous user - progress, XP, and streak are kept
        await prisma.user.update({ where: { id: current.id }, data: { email, passwordHash } })
      : await prisma.user.create({ data: { email, passwordHash } });

  // Best effort: a broken mail provider must never block registration.
  try {
    await sendVerificationMail(email, await createAuthToken(user.id, "verify"));
  } catch (error) {
    console.error("verification mail failed:", error);
  }

  await signIn("credentials", { email, password, redirect: false });
  return { ok: true };
}

const LOGIN_FAILS = 5;
const LOGIN_WINDOW_SEC = 15 * 60;

export async function loginAccount(input: { email: string; password: string }): Promise<AuthResult> {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const throttleKey = `login:${parsed.data.email}`;
  if (await isRateLimited(throttleKey, LOGIN_FAILS)) {
    return { ok: false, error: "Too many attempts. Try again in 15 minutes." };
  }
  try {
    await signIn("credentials", { ...parsed.data, redirect: false });
    await clearRateLimit(throttleKey);
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      await rateLimit(throttleKey, LOGIN_FAILS, LOGIN_WINDOW_SEC); // count the failure
      return { ok: false, error: "Wrong email or password." };
    }
    throw error;
  }
}

/* ---------- password reset / email verification / change password ---------- */

export async function requestPasswordReset(input: { email: string }): Promise<{ ok: true }> {
  const parsed = z.email().transform((e) => e.toLowerCase().trim()).safeParse(input.email);
  // Always report success so account existence can't be probed.
  if (!parsed.success) return { ok: true };
  const email = parsed.data;

  if (!(await rateLimit(`reset:${email}`, 3, 60 * 60))) return { ok: true };

  const user = await prisma.user.findUnique({ where: { email } });
  if (user?.passwordHash) {
    try {
      await sendPasswordResetMail(email, await createAuthToken(user.id, "reset"));
    } catch (error) {
      console.error("reset mail failed:", error);
    }
  }
  return { ok: true };
}

export async function resetPassword(input: { token: string; password: string }): Promise<AuthResult> {
  const password = z.string().min(8, "Password needs at least 8 characters").safeParse(input.password);
  if (!password.success) {
    return { ok: false, error: password.error.issues[0]?.message ?? "Invalid password" };
  }
  const user = await consumeAuthToken(input.token, "reset");
  if (!user?.email) {
    return { ok: false, error: "That reset link is invalid or expired. Request a new one." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hash(password.data, 10),
      emailVerified: user.emailVerified ?? new Date(), // the link proves inbox ownership
    },
  });
  await clearRateLimit(`login:${user.email}`);
  await signIn("credentials", { email: user.email, password: password.data, redirect: false });
  return { ok: true };
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<AuthResult> {
  const user = await requireUser();
  if (!user.email || !user.passwordHash) {
    return { ok: false, error: "Create an account first to set a password." };
  }
  if (!(await rateLimit(`change:${user.id}`, 5, 15 * 60))) {
    return { ok: false, error: "Too many attempts. Try again in 15 minutes." };
  }
  const newPassword = z.string().min(8, "Password needs at least 8 characters").safeParse(input.newPassword);
  if (!newPassword.success) {
    return { ok: false, error: newPassword.error.issues[0]?.message ?? "Invalid password" };
  }
  if (!(await compare(input.currentPassword, user.passwordHash))) {
    return { ok: false, error: "Current password is wrong." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hash(newPassword.data, 10) },
  });
  return { ok: true };
}

export async function resendVerification(): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  if (!user.email) return { ok: false, error: "Create an account first." };
  if (user.emailVerified) return { ok: true };
  if (!(await rateLimit(`verify:${user.id}`, 3, 60 * 60))) {
    return { ok: false, error: "Sent recently. Check spam, or try again in an hour." };
  }
  try {
    await sendVerificationMail(user.email, await createAuthToken(user.id, "verify"));
    return { ok: true };
  } catch (error) {
    console.error("verification mail failed:", error);
    return { ok: false, error: "Couldn't send the email right now. Try again later." };
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false });
  const store = await cookies();
  store.delete("sx_uid"); // fully signed out - next visit starts fresh
}
