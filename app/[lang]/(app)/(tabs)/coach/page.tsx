import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { coachLocked, countSessionsToday, getDailyPrompt } from "@/lib/coach";
import { coerceLocale, formatDate } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { CoachClient, type CoachHistoryItem } from "./coach-client";

export const dynamic = "force-dynamic";

export default async function CoachPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = coerceLocale(lang);
  const user = await getSessionUser();
  if (!user) redirect(withLocale(locale, "/onboarding"));

  const [sessionsToday, recent] = await Promise.all([
    countSessionsToday(user),
    prisma.coachSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        promptText: true,
        overall: true,
        createdAt: true,
        feedback: true,
        confidence: true,
        clarity: true,
        energy: true,
        pace: true,
      },
    }),
  ]);

  const history: CoachHistoryItem[] = recent.map((s) => {
    const fb = (s.feedback && typeof s.feedback === "object" ? s.feedback : {}) as Record<
      string,
      unknown
    >;
    return {
      id: s.id,
      promptText: s.promptText,
      overall: s.overall,
      when: formatDate(locale, s.createdAt, { month: "short", day: "numeric" }),
      summary: typeof fb.summary === "string" ? fb.summary : undefined,
      oneThing: typeof fb.oneThing === "string" ? fb.oneThing : undefined,
      scores: {
        confidence: s.confidence,
        clarity: s.clarity,
        energy: s.energy,
        pace: s.pace,
      },
    };
  });

  return (
    <CoachClient
      name={user.name}
      prompt={getDailyPrompt(user, locale)}
      locked={coachLocked(user, sessionsToday)}
      isPremium={user.isPremium}
      history={history}
    />
  );
}
