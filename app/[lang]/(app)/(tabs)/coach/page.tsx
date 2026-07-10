import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { coachLocked, countSessionsToday, getDailyPrompt } from "@/lib/coach";
import { getLiveDefaults } from "@/lib/coach-live";
import { dailyPackScenario, SCENARIOS, scenarioById } from "@/lib/coach-scenarios";
import { dayString } from "@/lib/game";
import { coerceLocale, formatDate } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { CoachClient, type CoachHistoryItem } from "./coach-client";
import type { SceneOption } from "./live-client";

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
      live: fb.mode === "live",
      summary: typeof fb.summary === "string" ? fb.summary : undefined,
      strengths: Array.isArray(fb.strengths)
        ? fb.strengths.filter((s): s is string => typeof s === "string")
        : undefined,
      oneThing: typeof fb.oneThing === "string" ? fb.oneThing : undefined,
      growthAreas: Array.isArray(fb.growthAreas)
        ? fb.growthAreas.filter((g): g is string => typeof g === "string")
        : undefined,
      scores: {
        confidence: s.confidence,
        clarity: s.clarity,
        energy: s.energy,
        pace: s.pace,
      },
    };
  });

  const prompt = getDailyPrompt(user, locale);

  // Live roleplay: the user's dread pack scene of the day is the default
  // (their dating pick should never open on a barista); the global daily
  // stays pickable with its badge. Falls back to the daily for old goals.
  const defaultScenario =
    (user.goal ? dailyPackScenario(user.goal, dayString(new Date(), user.timezone)) : undefined) ??
    scenarioById(prompt.id);
  const defaults = defaultScenario ? getLiveDefaults(defaultScenario, locale) : null;
  const scenes: SceneOption[] = SCENARIOS.map((s) => {
    const text = s.text[locale];
    return {
      id: s.id,
      dread: s.dread,
      title: text.title,
      setup: text.setup,
      scene: text.character.scene,
      personaName: text.character.name,
      avatar: s.avatar,
      isDaily: s.id === prompt.id,
    };
  });

  return (
    <CoachClient
      name={user.name}
      prompt={prompt}
      locked={coachLocked(user, sessionsToday)}
      isPremium={user.isPremium}
      history={history}
      live={defaults ? { scenes, defaultId: defaults.scenarioId } : null}
      dread={user.goal}
    />
  );
}
