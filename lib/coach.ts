// AI coach — a ~30s speaking rep analyzed by Gemini (audio-native, so pace,
// pauses, fillers, and vocal energy are heard, not inferred from text).
// Free users get one session per day; XP is awarded for the first few reps.

import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import type { User } from "@prisma/client";
import { prisma } from "./db";
import { XP } from "./content";
import { dayString, getDaily, questState, type QuestState, type TzUser } from "./game";
import { coerceLocale, type Locale } from "./i18n/config";

const MODEL = "gemini-2.5-flash";
const MODEL_FALLBACK = "gemini-2.5-flash-lite";
export const FREE_SESSIONS_PER_DAY = 1;
const XP_SESSIONS_PER_DAY = 3; // reps that earn XP each day (anti-farming)

/* ---------- daily prompt ---------- */

export type CoachPrompt = { text: string; sub: string };

// One list per locale; kept index-aligned so the daily prompt is the same
// idea in every language.
const PROMPTS_BY_LOCALE: Record<Locale, CoachPrompt[]> = {
  en: [
    { text: "Introduce yourself like we just met at an event.", sub: "Aim for 30 seconds. No script, just talk." },
    { text: "Tell me about something you're into lately.", sub: "Let your enthusiasm show. 30 seconds." },
    { text: "Describe your ideal Saturday, start to finish.", sub: "Paint the picture. 30 seconds." },
    { text: "Recommend a movie, show, or book, and sell it.", sub: "Make me want it. 30 seconds." },
    { text: "Tell the story of your week in three beats.", sub: "Beginning, middle, end. 30 seconds." },
    { text: "Politely disagree: \"Cold weather is better than warm.\"", sub: "Kind but firm. 30 seconds." },
    { text: "Give a genuine compliment to a friend, out loud.", sub: "Specific beats generic. 30 seconds." },
    { text: "Explain what you do (or study) to a curious stranger.", sub: "No jargon. 30 seconds." },
    { text: "You just won a small award. Give the thank-you speech.", sub: "Have fun with it. 30 seconds." },
    { text: "Describe a place you'd take a visitor in your city.", sub: "Why there? 30 seconds." },
    { text: "Teach me something simple you know how to do.", sub: "One skill, three steps. 30 seconds." },
    { text: "Tell me about a small win you had recently.", sub: "Own it, no downplaying. 30 seconds." },
    { text: "Order for the whole table at your favorite restaurant.", sub: "Confident and clear. 30 seconds." },
    { text: "Invite a friend to something this weekend.", sub: "When, where, why it'll be fun. 30 seconds." },
  ],
  tr: [
    { text: "Bir etkinlikte yeni tanışmışız gibi kendini tanıt.", sub: "30 saniye hedefle. Metin yok, sadece konuş." },
    { text: "Son zamanlarda ilgini çeken bir şeyi anlat.", sub: "Hevesin belli olsun. 30 saniye." },
    { text: "İdeal cumartesini baştan sona anlat.", sub: "Tabloyu gözümde canlandır. 30 saniye." },
    { text: "Bir film, dizi ya da kitap öner ve beni ikna et.", sub: "Canımın istemesini sağla. 30 saniye." },
    { text: "Haftanı üç adımda anlat.", sub: "Başı, ortası, sonu. 30 saniye." },
    { text: "Kibarca karşı çık: \"Soğuk hava sıcaktan iyidir.\"", sub: "Nazik ama net. 30 saniye." },
    { text: "Bir arkadaşına içten bir iltifat et, sesli söyle.", sub: "Somut olsun, genel geçer değil. 30 saniye." },
    { text: "Meraklı bir yabancıya ne iş yaptığını ya da okuduğunu anlat.", sub: "Terim kullanma. 30 saniye." },
    { text: "Küçük bir ödül kazandın. Teşekkür konuşmanı yap.", sub: "Keyfini çıkar. 30 saniye." },
    { text: "Şehrinde bir misafiri götüreceğin yeri anlat.", sub: "Neden orası? 30 saniye." },
    { text: "Yapmayı bildiğin basit bir şeyi bana öğret.", sub: "Tek beceri, üç adım. 30 saniye." },
    { text: "Son zamanlarda yaşadığın küçük bir başarını anlat.", sub: "Sahiplen, küçümseme. 30 saniye." },
    { text: "En sevdiğin restoranda tüm masa için sipariş ver.", sub: "Kendinden emin ve net. 30 saniye." },
    { text: "Bir arkadaşını bu hafta sonu bir şeye davet et.", sub: "Ne zaman, nerede, neden eğlenceli olacak. 30 saniye." },
  ],
};

/** One prompt per calendar day, rolling at the user's local midnight. */
export function getDailyPrompt(user?: (TzUser & { locale?: string }) | null): CoachPrompt {
  const prompts = PROMPTS_BY_LOCALE[coerceLocale(user?.locale)];
  const date = dayString(new Date(), user?.timezone);
  let seed = 0;
  for (const c of date) seed = (seed * 31 + c.charCodeAt(0)) % 997;
  return prompts[seed % prompts.length];
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

function coachInstructions(user: User, promptText: string, durationSec: number): string {
  const goal = user.goal ? ` Their goal in the app: ${user.goal.replaceAll("-", " ")}.` : "";
  const language = LANGUAGE_DIRECTIVE[coerceLocale(user.locale)];
  return `You are the Social XP coach — a warm, upbeat speaking coach inside a social-confidence training app.${language}

${user.name} just recorded a ${durationSec}-second speaking rep. Today's prompt was: "${promptText}".${goal}

Listen to the recording and evaluate the DELIVERY you actually hear — pace, pauses, filler sounds, vocal energy and variety, articulation — as well as how easy the content is to follow.

Return JSON:
- transcript: verbatim, including fillers ("um", "uh", "like")
- wpm: words per minute you estimate from the audio
- fillerWords: fillers used with counts (empty array if none)
- scores, each 0-100: confidence (steady, unhurried, no trailing off), clarity (easy to follow, articulate), energy (vocal variety, aliveness), pace (100 = ideal conversational ~140-160 wpm; lower the further off)
- paceLabel: 2-4 words, e.g. "Right on pace", "A touch fast", "A bit slow"
- overall: 0-100 weighing all four
- headline: max 8 words, warm, e.g. "Warm and easy to follow. 🔥"
- summary: 1-2 sentences, encouraging first
- strengths: 1-2 short, specific strengths you actually heard
- oneThing: THE one thing to try next rep — 2-3 kind, specific sentences (e.g. "You said 'um' 6 times — totally normal. Next rep, try pausing instead. Silence reads as confidence.")
- tryNext: one short sentence teeing up another rep

Rules: encouraging first, actionable always, never a stinging grade. Talk to ${user.name} directly ("you"). Normalize imperfection. Calibration: a nervous beginner lands 55-70; reserve 85+ for genuinely strong reps; never exceed 95. If the audio is silent or not speech, set all scores to 0, transcript to "", and say so gently in summary.`;
}

export async function analyzeRecording(
  user: User,
  input: { audio: Buffer; mimeType: string; durationSec: number; promptText: string }
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
          { text: coachInstructions(user, input.promptText, input.durationSec) },
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
  input: { audio: Buffer; mimeType: string; durationSec: number }
): Promise<CoachSessionResult> {
  const date = dayString(new Date(), user.timezone);
  const sessionsBefore = await countSessionsToday(user);
  if (coachLocked(user, sessionsBefore)) throw new Error("Daily free session already used");

  const promptText = getDailyPrompt(user).text;
  const analysis = await analyzeRecording(user, { ...input, promptText });

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
      promptText,
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

  return {
    analysis,
    durationSec: input.durationSec,
    xpAwarded,
    totalXP: fresh.totalXP,
    overallDelta: previous ? analysis.overall - previous.overall : null,
    sessionsToday: sessionsBefore + 1,
    quests: questState(daily),
  };
}
