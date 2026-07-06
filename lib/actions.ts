"use server";

// Typed server actions — the only mutation path between client and server.
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

/* ---------- premium (mock — replace with StoreKit/Stripe later) ---------- */

export async function startPremiumTrial(): Promise<void> {
  const user = await requireUser();
  await prisma.user.update({ where: { id: user.id }, data: { isPremium: true } });
}

/* ---------- account (optional — upgrades the anonymous user) ---------- */

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function registerAccount(input: { email: string; password: string }): Promise<AuthResult> {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { email, password } = parsed.data;

  const taken = await prisma.user.findUnique({ where: { email } });
  if (taken) return { ok: false, error: "That email already has an account — log in instead." };

  const current = await getSessionUser();
  const passwordHash = await hash(password, 10);
  if (current && !current.email) {
    // upgrade the anonymous user — progress, XP, and streak are kept
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
  store.delete("sx_uid"); // fully signed out — next visit starts fresh
}
