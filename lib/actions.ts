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
import { coerceLocale, isLocale, LOCALE_COOKIE, LOCALES, type Locale } from "./i18n/config";
import { getDictionary } from "./i18n/dictionaries";
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

// Locale for user-facing messages returned by actions: the signed-in user's
// saved locale, else the proxy cookie, else the default.
async function currentLocale(): Promise<Locale> {
  const user = await getSessionUser();
  if (user) return coerceLocale(user.locale);
  return coerceLocale((await cookies()).get(LOCALE_COOKIE)?.value);
}

async function errs() {
  return getDictionary(await currentLocale()).errors;
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
  locale: z.enum(LOCALES).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export async function submitOnboarding(input: OnboardingInput): Promise<void> {
  const { goal, pace, timezone, locale } = onboardingSchema.parse(input);
  await createSessionUser({ goal, pace, timezone, locale });
}

/* ---------- language ---------- */

// Persist the chosen UI/content language on the user (if any) and in the
// cookie the proxy reads, so the choice sticks across sessions and devices.
export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return;
  const user = await getSessionUser();
  if (user) await prisma.user.update({ where: { id: user.id }, data: { locale } });
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
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
  const e = getDictionary(coerceLocale(user.locale)).errors;

  const audio = formData.get("audio");
  const duration = coachDurationSchema.safeParse(formData.get("durationSec"));
  if (!(audio instanceof Blob) || audio.size === 0 || !duration.success) {
    return { ok: false, code: "audio", error: e.coachNoRecording };
  }
  if (audio.size > MAX_COACH_AUDIO_BYTES) {
    return { ok: false, code: "audio", error: e.coachTooBig };
  }
  if (!process.env.GEMINI_API_KEY) {
    return { ok: false, code: "config", error: e.coachNotSetUp };
  }
  if (coachLocked(user, await countSessionsToday(user))) {
    return { ok: false, code: "limit", error: e.coachLimitReached };
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
    return { ok: false, code: "analysis", error: e.coachAnalysisFailed };
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
  const locale = coerceLocale(user.locale);
  const e = getDictionary(locale).errors;
  const plan = planSchema.parse(input.plan);
  const provider = activeProvider();

  if (!provider.configured()) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: e.paymentsNotLive };
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
      redirectUrl: `${base}/${locale}/paywall/success`,
    });
    return { ok: true, url };
  } catch (error) {
    console.error("checkout failed:", error);
    return { ok: false, error: e.checkoutFailed };
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
  const e = await errs();
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? e.invalidInput };
  }
  const { email, password } = parsed.data;

  const taken = await prisma.user.findUnique({ where: { email } });
  if (taken) return { ok: false, error: e.emailTaken };

  const current = await getSessionUser();
  const passwordHash = await hash(password, 10);
  const user =
    current && !current.email
      ? // upgrade the anonymous user - progress, XP, and streak are kept
        await prisma.user.update({ where: { id: current.id }, data: { email, passwordHash } })
      : await prisma.user.create({ data: { email, passwordHash } });

  // Best effort: a broken mail provider must never block registration.
  try {
    await sendVerificationMail(email, await createAuthToken(user.id, "verify"), user.locale);
  } catch (error) {
    console.error("verification mail failed:", error);
  }

  await signIn("credentials", { email, password, redirect: false });
  return { ok: true };
}

const LOGIN_FAILS = 5;
const LOGIN_WINDOW_SEC = 15 * 60;

export async function loginAccount(input: { email: string; password: string }): Promise<AuthResult> {
  const e = await errs();
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? e.invalidInput };
  }
  const throttleKey = `login:${parsed.data.email}`;
  if (await isRateLimited(throttleKey, LOGIN_FAILS)) {
    return { ok: false, error: e.tooManyLoginAttempts };
  }
  try {
    await signIn("credentials", { ...parsed.data, redirect: false });
    await clearRateLimit(throttleKey);
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      await rateLimit(throttleKey, LOGIN_FAILS, LOGIN_WINDOW_SEC); // count the failure
      return { ok: false, error: e.wrongCredentials };
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
      await sendPasswordResetMail(email, await createAuthToken(user.id, "reset"), user.locale);
    } catch (error) {
      console.error("reset mail failed:", error);
    }
  }
  return { ok: true };
}

export async function resetPassword(input: { token: string; password: string }): Promise<AuthResult> {
  const e = await errs();
  const password = z.string().min(8).safeParse(input.password);
  if (!password.success) {
    return { ok: false, error: e.passwordMinLength };
  }
  const user = await consumeAuthToken(input.token, "reset");
  if (!user?.email) {
    return { ok: false, error: e.resetLinkInvalid };
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
  const e = await errs();
  if (!user.email || !user.passwordHash) {
    return { ok: false, error: e.createAccountFirstPassword };
  }
  if (!(await rateLimit(`change:${user.id}`, 5, 15 * 60))) {
    return { ok: false, error: e.tooManyChangeAttempts };
  }
  const newPassword = z.string().min(8).safeParse(input.newPassword);
  if (!newPassword.success) {
    return { ok: false, error: e.passwordMinLength };
  }
  if (!(await compare(input.currentPassword, user.passwordHash))) {
    return { ok: false, error: e.currentPasswordWrong };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hash(newPassword.data, 10) },
  });
  return { ok: true };
}

export async function resendVerification(): Promise<{ ok: boolean; error?: string }> {
  const user = await requireUser();
  const e = await errs();
  if (!user.email) return { ok: false, error: e.createAccountFirst };
  if (user.emailVerified) return { ok: true };
  if (!(await rateLimit(`verify:${user.id}`, 3, 60 * 60))) {
    return { ok: false, error: e.verifySentRecently };
  }
  try {
    await sendVerificationMail(user.email, await createAuthToken(user.id, "verify"), user.locale);
    return { ok: true };
  } catch (error) {
    console.error("verification mail failed:", error);
    return { ok: false, error: e.verifySendFailed };
  }
}

export async function logout(): Promise<void> {
  await signOut({ redirect: false });
  const store = await cookies();
  store.delete("sx_uid"); // fully signed out - next visit starts fresh
}
