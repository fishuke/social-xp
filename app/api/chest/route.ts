import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { openPathChest, openQuestChest, openStreakChest } from "@/lib/game";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No session" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const result =
    body.type === "path"
      ? await openPathChest(user, Number(body.chapterId) || 1)
      : body.type === "streak"
        ? await openStreakChest(user, Number(body.milestone) || 0)
        : await openQuestChest(user);
  return NextResponse.json(result);
}
