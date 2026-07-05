import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { completeLesson } from "@/lib/game";
import { getLesson } from "@/lib/content";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No session" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const chapterId = Number(body?.chapterId);
  const lessonIndex = Number(body?.lessonIndex);
  if (!chapterId || !lessonIndex) {
    return NextResponse.json({ error: "chapterId and lessonIndex required" }, { status: 400 });
  }
  if (!getLesson(chapterId, lessonIndex)) {
    return NextResponse.json({ error: "Unknown lesson" }, { status: 400 });
  }
  const result = await completeLesson(user, {
    chapterId,
    lessonIndex,
    quizFirstTry: Boolean(body.quizFirstTry),
    feel: typeof body.feel === "string" ? body.feel : undefined,
    repCommitted: Boolean(body.repCommitted),
    localTime: typeof body.localTime === "string" ? body.localTime : undefined,
  });
  return NextResponse.json(result);
}
