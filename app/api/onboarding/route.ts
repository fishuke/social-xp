import { NextResponse } from "next/server";
import { createSessionUser } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const goals = ["ease-nerves", "confidence", "listener", "easy-conversation", "approval"];
  const paces = ["chill", "steady", "beast"];
  const goal = goals.includes(body.goal) ? body.goal : "confidence";
  const pace = paces.includes(body.pace) ? body.pace : "steady";
  const user = await createSessionUser({ goal, pace, reminderTime: body.reminderTime || "19:30" });
  return NextResponse.json({ ok: true, userId: user.id });
}
