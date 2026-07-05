import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { getCourse } from "@/lib/content";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No session" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const courseId = Number(body.courseId);
  if (!getCourse(courseId)) {
    return NextResponse.json({ error: "Unknown course" }, { status: 400 });
  }
  await prisma.user.update({ where: { id: user.id }, data: { activeCourseId: courseId } });
  return NextResponse.json({ ok: true });
}
