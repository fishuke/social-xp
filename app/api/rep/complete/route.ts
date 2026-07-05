import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { completeRep } from "@/lib/game";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "No session" }, { status: 401 });
  const result = await completeRep(user);
  return NextResponse.json(result);
}
