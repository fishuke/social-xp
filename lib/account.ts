import "server-only";

// Account security primitives: single-use expiring tokens (password reset,
// email verification) and DB-backed sliding-window rate limiting.

import { createHash, randomBytes } from "crypto";
import type { User } from "@prisma/client";
import { prisma } from "./db";

export type TokenType = "reset" | "verify";

const TOKEN_TTL_MS: Record<TokenType, number> = {
  reset: 60 * 60 * 1000, // 1 hour
  verify: 24 * 60 * 60 * 1000, // 24 hours
};

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Mints a token, stores only its hash, and invalidates older ones of the same type. */
export async function createAuthToken(userId: string, type: TokenType): Promise<string> {
  const raw = randomBytes(32).toString("base64url");
  await prisma.authToken.deleteMany({ where: { userId, type } }); // one active token per type
  await prisma.authToken.create({
    data: {
      tokenHash: hashToken(raw),
      userId,
      type,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MS[type]),
    },
  });
  return raw;
}

/** Validates and burns a token. Returns its user, or null when invalid/expired/used. */
export async function consumeAuthToken(raw: string, type: TokenType): Promise<User | null> {
  if (!raw || raw.length > 128) return null;
  const token = await prisma.authToken.findUnique({
    where: { tokenHash: hashToken(raw) },
    include: { user: true },
  });
  if (!token || token.type !== type || token.usedAt || token.expiresAt < new Date()) return null;
  await prisma.authToken.update({
    where: { tokenHash: token.tokenHash },
    data: { usedAt: new Date() },
  });
  return token.user;
}

/**
 * Sliding-window rate limit. Returns true when the action is allowed and
 * counts this attempt; false when the window's budget is exhausted.
 * Survives serverless instances because it lives in the database.
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const now = new Date();
  const row = await prisma.authThrottle.findUnique({ where: { key } });
  if (!row || row.resetAt < now) {
    await prisma.authThrottle.upsert({
      where: { key },
      create: { key, count: 1, resetAt: new Date(now.getTime() + windowSec * 1000) },
      update: { count: 1, resetAt: new Date(now.getTime() + windowSec * 1000) },
    });
    return true;
  }
  if (row.count >= limit) return false;
  await prisma.authThrottle.update({ where: { key }, data: { count: { increment: 1 } } });
  return true;
}

/** True when the key's budget is already exhausted. Does NOT count an attempt. */
export async function isRateLimited(key: string, limit: number): Promise<boolean> {
  const row = await prisma.authThrottle.findUnique({ where: { key } });
  return !!row && row.resetAt >= new Date() && row.count >= limit;
}

/** Clears a throttle key (e.g. after a successful login). */
export async function clearRateLimit(key: string): Promise<void> {
  await prisma.authThrottle.deleteMany({ where: { key } });
}
