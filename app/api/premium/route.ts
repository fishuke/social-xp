import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

// Mock upgrade — replace with StoreKit/RevenueCat/Stripe later.
export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No session" }, { status: 401 });
  await prisma.user.update({ where: { id: user.id }, data: { isPremium: true } });
  return NextResponse.json({ ok: true });
}
