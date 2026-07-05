import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { completeLesson } from "@/lib/game";
import { getLessonData } from "@/lib/catalog";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No session" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const unitId = Number(body?.unitId);
  const lessonIndex = Number(body?.lessonIndex);
  if (!unitId || !lessonIndex) {
    return NextResponse.json({ error: "unitId and lessonIndex required" }, { status: 400 });
  }
  if (!(await getLessonData(unitId, lessonIndex))) {
    return NextResponse.json({ error: "Unknown lesson" }, { status: 400 });
  }
  const result = await completeLesson(user, {
    unitId,
    lessonIndex,
    quizFirstTries: Number(body.quizFirstTries) || 0,
    feel: typeof body.feel === "string" ? body.feel : undefined,
    repCommitted: Boolean(body.repCommitted),
    localTime: typeof body.localTime === "string" ? body.localTime : undefined,
  });
  return NextResponse.json(result);
}
