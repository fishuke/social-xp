import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { coachLocked, countSessionsToday, getDailyPrompt } from "@/lib/coach";
import { CoachClient, type CoachHistoryItem } from "./coach-client";

export const dynamic = "force-dynamic";

export default async function CoachPage() {
  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  const [sessionsToday, recent] = await Promise.all([
    countSessionsToday(user),
    prisma.coachSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, promptText: true, overall: true, createdAt: true },
    }),
  ]);

  const history: CoachHistoryItem[] = recent.map((s) => ({
    id: s.id,
    promptText: s.promptText,
    overall: s.overall,
    when: s.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <CoachClient
      name={user.name}
      prompt={getDailyPrompt(user)}
      locked={coachLocked(user, sessionsToday)}
      isPremium={user.isPremium}
      history={history}
    />
  );
}
