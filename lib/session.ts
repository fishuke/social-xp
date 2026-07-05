import { cookies } from "next/headers";
import { prisma } from "./db";

const COOKIE = "sx_uid";

export async function getSessionUser() {
  const store = await cookies();
  const uid = store.get(COOKIE)?.value;
  if (!uid) return null;
  return prisma.user.findUnique({ where: { id: uid } });
}

// Only call from Route Handlers / Server Actions (mutates cookies).
export async function createSessionUser(data: { name?: string; goal: string; pace: string; reminderTime?: string }) {
  const store = await cookies();
  const existingId = store.get(COOKIE)?.value;
  if (existingId) {
    const existing = await prisma.user.findUnique({ where: { id: existingId } });
    if (existing) {
      return prisma.user.update({ where: { id: existing.id }, data });
    }
  }
  const user = await prisma.user.create({ data });
  store.set(COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return user;
}
