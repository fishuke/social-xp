// AI coach: a ~30s speaking rep against a scenario, analyzed by Gemini
// (audio-native, so pace, pauses, fillers, and vocal energy are heard, not
// inferred from text). Free users get one session per day; XP is awarded for
// the first few reps.

import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import type { User } from "@prisma/client";
import { dailyScenario } from "./coach-scenarios";
import { prisma } from "./db";
import { XP } from "./content";
import { dayString, getDaily, questState, type QuestState, type TzUser } from "./game";
import { type Locale } from "./i18n/config";

const MODEL = "gemini-2.5-flash";
const MODEL_FALLBACK = "gemini-2.5-flash-lite";
export const FREE_SESSIONS_PER_DAY = 1;
export const XP_SESSIONS_PER_DAY = 3; // reps that earn XP each day (anti-farming)

/* ---------- daily scenario ---------- */

export type CoachPrompt = {
  id: string; // scenario id (lib/coach-scenarios.ts)
  title: string;
  setup: string; // scene-setting shown above the line
  text: string; // the character's line the user answers
  sub: string;
};

/**
 * One scenario per calendar day, rolling at the user's local midnight. The
 * pick is locale-independent (same scenario idea worldwide, Wordle-style);
 * `locale` only selects which language's text ships to the UI and the
 * scoring prompt.
 */
export function getDailyPrompt(user: TzUser | null | undefined, locale: Locale): CoachPrompt {
  const scenario = dailyScenario(dayString(new Date(), user?.timezone));
  const text = scenario.text[locale];
  return { id: scenario.id, title: text.title, setup: text.setup, text: text.line, sub: text.sub };
}

/* ---------- analysis (Gemini, structured output) ---------- */

const scoreSchema = z.number().min(0).max(100).transform(Math.round);

const analysisSchema = z.object({
  transcript: z.string(),
  wpm: z.number().min(0).max(400).transform(Math.round),
  fillerWords: z.array(z.object({ word: z.string(), count: z.number().min(1).transform(Math.round) })).max(10),
  scores: z.object({
    confidence: scoreSchema,
    clarity: scoreSchema,
    energy: scoreSchema,
    pace: scoreSchema,
  }),
  paceLabel: z.string(),
  overall: scoreSchema,
  headline: z.string(),
  summary: z.string(),
  strengths: z.array(z.string()).max(3),
  oneThing: z.string(),
  tryNext: z.string(),
});

export type CoachAnalysis = z.infer<typeof analysisSchema>;

// Gemini mirror of analysisSchema — structured output keeps parsing reliable.
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    transcript: { type: Type.STRING },
    wpm: { type: Type.INTEGER },
    fillerWords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: { word: { type: Type.STRING }, count: { type: Type.INTEGER } },
        required: ["word", "count"],
      },
    },
    scores: {
      type: Type.OBJECT,
      properties: {
        confidence: { type: Type.INTEGER },
        clarity: { type: Type.INTEGER },
        energy: { type: Type.INTEGER },
        pace: { type: Type.INTEGER },
      },
      required: ["confidence", "clarity", "energy", "pace"],
    },
    paceLabel: { type: Type.STRING },
    overall: { type: Type.INTEGER },
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    oneThing: { type: Type.STRING },
    tryNext: { type: Type.STRING },
  },
  required: [
    "transcript", "wpm", "fillerWords", "scores", "paceLabel",
    "overall", "headline", "summary", "strengths", "oneThing", "tryNext",
  ],
};

const LANGUAGE_DIRECTIVE: Record<Locale, string> = {
  en: "",
  tr: `

LANGUAGE: Write every text field you return (headline, summary, paceLabel, strengths, oneThing, tryNext) in natural, warm Turkish. Keep the transcript verbatim in whatever language the speaker actually used. Do not use em-dashes.`,
};

function coachInstructions(user: User, prompt: CoachPrompt, durationSec: number, locale: Locale): string {
  const goal = user.goal
    ? ` The situation they signed up to train: ${user.goal.replaceAll("-", " ")}.`
    : "";
  const language = LANGUAGE_DIRECTIVE[locale];
  return `You are the Convozy coach, a warm, upbeat speaking coach inside a social-confidence training app.${language}

${user.name} just recorded a ${durationSec}-second speaking rep against today's scenario.${goal}

The scene: ${prompt.setup}
The other person says to them: "${prompt.text}"
Their brief: ${prompt.sub}

Listen to the recording as if you were the person in the scene hearing this reply. Evaluate the DELIVERY you actually hear (pace, pauses, filler sounds, vocal energy and variety, articulation) AND how well the reply fits the moment: does it actually answer the line, does it match the social register of the scene, would the other person walk away feeling good?

Return JSON:
- transcript: verbatim, including fillers ("um", "uh", "like")
- wpm: words per minute you estimate from the audio
- fillerWords: fillers used with counts (empty array if none)
- scores, each 0-100: confidence (steady, unhurried, no trailing off), clarity (easy to follow, articulate), energy (vocal variety, aliveness), pace (100 = ideal conversational ~140-160 wpm; lower the further off)
- paceLabel: 2-4 words, e.g. "Right on pace", "A touch fast", "A bit slow"
- overall: 0-100 weighing all four plus how well the reply fits the scenario
- headline: max 8 words, warm, e.g. "They'd hire you on the spot. 🔥"
- summary: 1-2 sentences, encouraging first; mention scenario fit
- strengths: 1-2 short, specific strengths you actually heard
- oneThing: THE one thing to try next rep, 2-3 kind, specific sentences. It can be about delivery or about fit for the moment (e.g. "You answered the question but never asked one back. Next rep, end with a question. It hands them the ball.")
- tryNext: one short sentence teeing up another rep

Rules: encouraging first, actionable always, never a stinging grade. Talk to ${user.name} directly ("you"). Normalize imperfection. Calibration: a nervous beginner lands 55-70; reserve 85+ for genuinely strong reps; never exceed 95. If the audio is silent or not speech, set all scores to 0, transcript to "", and say so gently in summary.`;
}

async function analyzeRecording(
  user: User,
  input: { audio: Buffer; mimeType: string; durationSec: number; prompt: CoachPrompt; locale: Locale }
): Promise<CoachAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const ai = new GoogleGenAI({ apiKey });
  const request = {
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType: input.mimeType, data: input.audio.toString("base64") } },
          { text: coachInstructions(user, input.prompt, input.durationSec, input.locale) },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema,
      thinkingConfig: { thinkingBudget: 0 }, // fast + cheap; coaching needs no deliberation
    },
  };

  // Free-tier Flash throws transient 503s under load. Retry once, then fall
  // back to Flash-Lite (separate capacity pool, also audio-native) so the
  // user's recording isn't lost to a capacity blip.
  const attempts = [MODEL, MODEL, MODEL_FALLBACK];
  let lastError: unknown;
  for (let i = 0; i < attempts.length; i++) {
    try {
      const response = await ai.models.generateContent({ ...request, model: attempts[i] });
      const text = response.text;
      if (!text) throw new Error("Empty response from the coach model");
      return analysisSchema.parse(JSON.parse(text));
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status !== 503 && status !== 429) throw error; // real errors surface immediately
      lastError = error;
      if (i < attempts.length - 1) await new Promise((resolve) => setTimeout(resolve, 2500));
    }
  }
  throw lastError;
}

/* ---------- session orchestration (gating, persistence, XP) ---------- */

export async function countSessionsToday(user: TzUser): Promise<number> {
  return prisma.coachSession.count({
    where: { userId: user.id, date: dayString(new Date(), user.timezone) },
  });
}

export function coachLocked(user: User, sessionsToday: number): boolean {
  return !user.isPremium && sessionsToday >= FREE_SESSIONS_PER_DAY;
}

export type CoachSessionResult = {
  analysis: CoachAnalysis;
  durationSec: number;
  xpAwarded: number;
  totalXP: number;
  overallDelta: number | null; // vs. the previous rep ("Up 9 points from last time")
  sessionsToday: number;
  quests: QuestState;
};

export async function completeCoachSession(
  user: User,
  input: { audio: Buffer; mimeType: string; durationSec: number; locale: Locale }
): Promise<CoachSessionResult> {
  const date = dayString(new Date(), user.timezone);
  const sessionsBefore = await countSessionsToday(user);
  if (coachLocked(user, sessionsBefore)) throw new Error("Daily free session already used");

  const prompt = getDailyPrompt(user, input.locale);
  const analysis = await analyzeRecording(user, { ...input, prompt });

  const previous = await prisma.coachSession.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { overall: true },
  });

  // Silent / non-speech recordings earn nothing.
  const xpAwarded = sessionsBefore < XP_SESSIONS_PER_DAY && analysis.overall > 0 ? XP.coach : 0;
  const fillerCount = analysis.fillerWords.reduce((sum, f) => sum + f.count, 0);

  await prisma.coachSession.create({
    data: {
      userId: user.id,
      date,
      promptText: prompt.text,
      durationSec: input.durationSec,
      transcript: analysis.transcript,
      wpm: analysis.wpm,
      fillerCount,
      overall: analysis.overall,
      confidence: analysis.scores.confidence,
      clarity: analysis.scores.clarity,
      energy: analysis.scores.energy,
      pace: analysis.scores.pace,
      feedback: {
        scenarioId: prompt.id,
        paceLabel: analysis.paceLabel,
        fillerWords: analysis.fillerWords,
        headline: analysis.headline,
        summary: analysis.summary,
        strengths: analysis.strengths,
        oneThing: analysis.oneThing,
        tryNext: analysis.tryNext,
      },
      xpAwarded,
    },
  });

  const award = await awardCoachSessionXp(user, date, xpAwarded);

  return {
    analysis,
    durationSec: input.durationSec,
    xpAwarded,
    totalXP: award.totalXP,
    overallDelta: previous ? analysis.overall - previous.overall : null,
    sessionsToday: sessionsBefore + 1,
    quests: award.quests,
  };
}

/**
 * Applies a coach rep's XP to the user and today's DailyState. Shared by the
 * solo rep (above) and the live roleplay (lib/coach-live.ts) so both paths
 * write totalXP and xpEarnedToday the same way. xpAwarded of 0 still ensures
 * the daily row and returns fresh quest state.
 */
export async function awardCoachSessionXp(
  user: User,
  date: string,
  xpAwarded: number
): Promise<{ totalXP: number; quests: QuestState }> {
  const fresh = xpAwarded
    ? await prisma.user.update({ where: { id: user.id }, data: { totalXP: { increment: xpAwarded } } })
    : user;

  await getDaily(user); // ensure row
  const daily = xpAwarded
    ? await prisma.dailyState.update({
        where: { userId_date: { userId: user.id, date } },
        data: { xpEarnedToday: { increment: xpAwarded } },
      })
    : await getDaily(user);

  return { totalXP: fresh.totalXP, quests: questState(daily) };
}
