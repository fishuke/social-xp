import { cookies } from "next/headers";
import type { User } from "@prisma/client";
import { auth } from "./auth";
import { prisma } from "./db";

const ANON_COOKIE = "sx_uid";

/**
 * Resolve the current user: a signed-in account (next-auth JWT) wins,
 * otherwise fall back to the anonymous cookie user.
 */
export async function getSessionUser(): Promise<User | null> {
  const session = await auth();
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (user) return user;
  }
  const store = await cookies();
  const anonId = store.get(ANON_COOKIE)?.value;
  if (!anonId) return null;
  return prisma.user.findUnique({ where: { id: anonId } });
}

// Only call from Server Actions / Route Handlers (mutates cookies).
export async function createSessionUser(data: {
  name?: string;
  goal: string;
  pace: string;
  reminderTime?: string;
  timezone?: string;
  locale?: string;
}) {
  const store = await cookies();
  const existingId = store.get(ANON_COOKIE)?.value;
  if (existingId) {
    const existing = await prisma.user.findUnique({ where: { id: existingId } });
    if (existing) {
      return prisma.user.update({ where: { id: existing.id }, data });
    }
  }
  const user = await prisma.user.create({ data });
  store.set(ANON_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return user;
}
