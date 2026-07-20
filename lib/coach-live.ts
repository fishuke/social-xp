// Live roleplay: a real multi-turn voice conversation with a scenario
// character (Gemini Live over an ephemeral token), judged afterwards into a
// debrief. The browser talks to Gemini directly through a single-use token
// minted here; GEMINI_API_KEY never leaves the server.
//
// Transport note: the client consumes a transport interface, not Gemini
// directly. Gemini Live is the shipping transport (EN + TR). A self-hosted
// full-duplex engine (NVIDIA PersonaPlex, EN only) is the planned second
// transport; see docs/BACKLOG.md.

import { GoogleGenAI, Modality, Type } from "@google/genai";
import { z } from "zod";
import type { User } from "@prisma/client";
import { awardCoachSessionXp, countSessionsToday, XP_SESSIONS_PER_DAY } from "./coach";
import { RUBRICS, type CoachScenario, type RubricDimension } from "./coach-scenarios";
import { XP } from "./content";
import { prisma } from "./db";
import { dayString, type QuestState } from "./game";
import { getDictionary } from "./i18n/dictionaries";
import { type Locale } from "./i18n/config";

/* ---------- constants ---------- */

// Preview model ids live only here; clients receive them via the mint response.
export const LIVE_MODEL = "gemini-3.1-flash-live-preview";
export const LIVE_MODEL_FALLBACK = "gemini-2.5-flash-native-audio-preview-12-2025";
export const LIVE_MAX_SECONDS = 240;
export const LIVE_MIN_USER_TURNS = 2; // fewer than this = not a conversation, no debrief
// null = unlimited during alpha. Flip to a number when revenue gating lands.
export const LIVE_FREE_SESSIONS_PER_DAY: number | null = null;

const LANGUAGE_NAME: Record<Locale, string> = { en: "English", tr: "Turkish" };

/* ---------- character prompt ---------- */

/**
 * System instruction for the live model: play the scenario character, open
 * with the authored line, push back per persona, and treat [control] lines
 * as stage directions. The rubric hints steer the character toward moments
 * the debrief judge can actually score.
 */
export function buildCharacterPrompt(
  scenario: CoachScenario,
  locale: Locale,
  userName: string
): string {
  const text = scenario.text[locale];
  const character = text.character;
  const rubricHints = RUBRICS[scenario.dread].map((r) => `- ${r.judge}`).join("\n");

  return `You are ${character.name}, a character in a live spoken roleplay inside a social-confidence training app. ${userName} is practicing this scene with you.

WHO YOU ARE: ${character.persona}

HOW YOU SOUND: ${scenario.voiceStyle} Keep this delivery in every reply.

THE SCENE: ${text.setup}

YOUR GOAL IN THE SCENE: ${character.objective}

${userName} is practicing these skills. Give natural openings for each, without ever naming them:
${rubricHints}

HARD RULES:
- Stay in character as ${character.name} the entire time. Never mention being an AI, a model, an assistant, or a coach. Never break the scene.
- Speak only ${LANGUAGE_NAME[locale]}, no matter what language you hear.
- This is a spoken conversation. Keep every reply under about 15 seconds: one or two sentences, then let ${userName} talk. Never lecture.
- Open the scene by saying exactly this and nothing else, then wait: "${character.opening}"
- React like a real person: warm up when they engage you well, let flat or evasive replies land awkwardly. Do not grade, teach, or give feedback. You are the scene, not the coach.
- ${userName}'s words reach you through live speech recognition, which occasionally mishears one word as a similar-sounding one. When a word clearly does not fit the sentence or the scene but an obvious near-homophone does (hearing "bow are you doing" when "how are you doing" is plainly meant), silently treat it as the intended word and respond to that meaning. Only do this when the intent is obvious from context. Never rewrite a genuine word choice, and if what you heard is genuinely ambiguous, stay in character and ask ${userName} to repeat or confirm what they meant before moving on.
- Messages wrapped in [control]...[/control] are stage directions from the app, not ${userName} speaking. Follow them naturally and never acknowledge them.
- When a stage direction tells you to wrap up, bring the scene to a natural, warm close within one or two replies and say goodbye in character.`;
}

/* ---------- ephemeral token mint ---------- */

const LANGUAGE_CODE: Record<Locale, string> = { en: "en-US", tr: "tr-TR" };

export type LiveTokenGrant = {
  token: string;
  model: string;
  maxSeconds: number;
};

/**
 * Mints a single-use ephemeral token the browser uses to open the Live
 * WebSocket directly with Gemini. Persona, model, voice, and transcription
 * are pinned server-side via liveConnectConstraints, so the client cannot
 * change the character or turn the session into a general assistant.
 *
 * `choice` exists because the model id lives inside the locked constraints:
 * falling back to the second model requires a fresh mint.
 */
export async function mintLiveToken(
  user: Pick<User, "name">,
  scenario: CoachScenario,
  locale: Locale,
  choice: "primary" | "fallback"
): Promise<LiveTokenGrant> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const model = choice === "primary" ? LIVE_MODEL : LIVE_MODEL_FALLBACK;
  // Ephemeral tokens are v1alpha only; both the mint and the browser client
  // must pass apiVersion v1alpha.
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1alpha" } });
  const now = Date.now();

  const token = await ai.authTokens.create({
    config: {
      uses: 1,
      expireTime: new Date(now + 10 * 60_000).toISOString(),
      newSessionExpireTime: new Date(now + 2 * 60_000).toISOString(),
      liveConnectConstraints: {
        model,
        config: {
          systemInstruction: buildCharacterPrompt(scenario, locale, user.name),
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: scenario.voice } },
            languageCode: LANGUAGE_CODE[locale],
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      },
    },
  });

  if (!token.name) throw new Error("Token mint returned no token name");
  return { token: token.name, model, maxSeconds: LIVE_MAX_SECONDS };
}

/* ---------- debrief judge ---------- */

const JUDGE_MODEL = "gemini-2.5-flash";
const JUDGE_MODEL_FALLBACK = "gemini-2.5-flash-lite";

export type LiveDialogTurn = { role: "ai" | "you"; text: string };

const scoreSchema = z.number().min(0).max(100).transform(Math.round);

const liveDebriefSchema = z.object({
  overall: scoreSchema,
  scores: z.object({
    confidence: scoreSchema,
    clarity: scoreSchema,
    energy: scoreSchema,
    pace: scoreSchema,
  }),
  rubric: z
    .array(
      z.object({
        key: z.string(),
        score: z.number().min(0).max(5).transform(Math.round),
        note: z.string(),
      })
    )
    .max(3),
  sceneHeadline: z.string(),
  sceneNote: z.string(),
  headline: z.string(),
  summary: z.string(),
  strengths: z.array(z.string()).max(3),
  growthAreas: z.array(z.string()).max(2),
  tryNext: z.string(),
});

export type LiveDebrief = z.infer<typeof liveDebriefSchema>;

// Gemini mirror of liveDebriefSchema - structured output keeps parsing reliable.
const liveResponseSchema = {
  type: Type.OBJECT,
  properties: {
    overall: { type: Type.INTEGER },
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
    rubric: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          key: { type: Type.STRING },
          score: { type: Type.INTEGER },
          note: { type: Type.STRING },
        },
        required: ["key", "score", "note"],
      },
    },
    sceneHeadline: { type: Type.STRING },
    sceneNote: { type: Type.STRING },
    headline: { type: Type.STRING },
    summary: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
    tryNext: { type: Type.STRING },
  },
  required: [
    "overall", "scores", "rubric", "sceneHeadline", "sceneNote",
    "headline", "summary", "strengths", "growthAreas", "tryNext",
  ],
};

const JUDGE_LANGUAGE_DIRECTIVE: Record<Locale, string> = {
  en: "",
  tr: `

LANGUAGE: Write every text field you return (sceneHeadline, sceneNote, headline, summary, rubric notes, strengths, growthAreas, tryNext) in natural, warm Turkish. Do not use em-dashes.`,
};

function judgeInstructions(
  userName: string,
  scenario: CoachScenario,
  locale: Locale,
  dialog: LiveDialogTurn[],
  durationSec: number
): string {
  const text = scenario.text[locale];
  const character = text.character;
  const rubric = RUBRICS[scenario.dread];
  const rubricLines = rubric.map((r) => `- ${r.key}: ${r.judge}`).join("\n");
  const lines = dialog
    .map((turn) => `${turn.role === "ai" ? character.name : userName}: ${turn.text}`)
    .join("\n");

  return `You are the Convozy coach, a warm, upbeat social-skills coach inside a social-confidence training app.${JUDGE_LANGUAGE_DIRECTIVE[locale]}

${userName} just finished a ${durationSec}-second live spoken roleplay. The other character, ${character.name}, was played by the app.

The scene: ${text.setup}
${character.name}'s role: ${character.persona}
What ${userName} was practicing: ${text.sub}

The conversation, transcribed live (${userName}'s lines are what they actually said out loud):
${lines}

${userName}'s lines come from live speech recognition, which occasionally mishears one word as a similar-sounding one. Judge ${userName} on what they clearly intended to say, not on obvious transcription slips: read a word that plainly does not fit the sentence as the word that obviously belongs there, and never lower a score for what is clearly a recognition error rather than something ${userName} actually said. Still judge the genuine article: real word-choice mistakes, rambling, evasiveness, or replies that miss what ${character.name} said.

Judge only ${userName}'s side of the conversation. Return JSON:
- overall: 0-100 for how well they played the moment: did they engage, respond to what was actually said, and move the scene forward?
- scores, each 0-100, judged from the transcript: confidence (direct, owns their words, no over-apologizing or trailing off), clarity (easy to follow, no word salad), energy (alive, engaged, gives the scene something), pace (conversational rhythm: balanced turns, no monologues, no dead one-word replies)
- rubric: one entry per dimension below, score 0-5 and a one-sentence note quoting or referencing a concrete moment:
${rubricLines}
- sceneHeadline: the scene's closing beat from inside the story, max 8 words, honest but kind, e.g. "She asked to split dessert." for a date that warmed up, or "He said he'd think about it." for a pitch that half-landed
- sceneNote: 1-2 short sentences on why that ending beat matters, spoken to ${userName} directly
- headline: max 8 words, warm, for the debrief card
- summary: 1-2 sentences, encouraging first, specific always
- strengths: 1-3 short, specific strengths with a concrete moment each
- growthAreas: 1-2 short, specific growth areas phrased as moves to try, never as flaws
- tryNext: one short sentence teeing up another scene

Rules: encouraging first, actionable always, never a stinging grade. Talk to ${userName} directly ("you"). Normalize imperfection. Calibration: a nervous beginner lands 55-70; reserve 85+ for genuinely strong conversations; never exceed 95. If ${userName}'s lines are empty, off-topic noise, or not a real attempt at the scene, set overall and all scores to 0 and say so gently in summary.`;
}

/**
 * Scores a finished live dialog into a debrief. Unknown rubric keys from the
 * model are dropped and scores re-mapped against the scenario's rubric so the
 * UI only ever renders dimensions it has labels for.
 */
export async function judgeLiveDialog(
  user: User,
  input: { scenario: CoachScenario; locale: Locale; dialog: LiveDialogTurn[]; durationSec: number }
): Promise<LiveDebrief> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const ai = new GoogleGenAI({ apiKey });
  const request = {
    model: JUDGE_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: judgeInstructions(user.name, input.scenario, input.locale, input.dialog, input.durationSec) },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: liveResponseSchema,
      thinkingConfig: { thinkingBudget: 0 }, // fast + cheap; coaching needs no deliberation
    },
  };

  // Same transient-503 story as lib/coach.ts: retry once, then Flash-Lite.
  const attempts = [JUDGE_MODEL, JUDGE_MODEL, JUDGE_MODEL_FALLBACK];
  let lastError: unknown;
  for (let i = 0; i < attempts.length; i++) {
    try {
      const response = await ai.models.generateContent({ ...request, model: attempts[i] });
      const text = response.text;
      if (!text) throw new Error("Empty response from the judge model");
      const debrief = liveDebriefSchema.parse(JSON.parse(text));
      const known = new Set(RUBRICS[input.scenario.dread].map((r) => r.key));
      return { ...debrief, rubric: debrief.rubric.filter((r) => known.has(r.key)) };
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status !== 503 && status !== 429) throw error; // real errors surface immediately
      lastError = error;
      if (i < attempts.length - 1) await new Promise((resolve) => setTimeout(resolve, 2500));
    }
  }
  throw lastError;
}

/* ---------- session persistence ---------- */

export type LiveRubricRow = {
  key: string;
  label: string;
  score: number; // 0-5
  note: string;
};

export type LiveSessionResult = {
  debrief: LiveDebrief;
  rubric: LiveRubricRow[]; // debrief rubric resolved to localized labels
  personaName: string;
  durationSec: number;
  xpAwarded: number;
  totalXP: number;
  overallDelta: number | null;
  sessionsToday: number;
  quests: QuestState;
};

function resolveRubric(dims: RubricDimension[], debrief: LiveDebrief, locale: Locale): LiveRubricRow[] {
  return debrief.rubric.flatMap((row) => {
    const dim = dims.find((d) => d.key === row.key);
    return dim ? [{ key: row.key, label: dim.label[locale], score: row.score, note: row.note }] : [];
  });
}

/**
 * Judges and persists a finished live conversation as a CoachSession row
 * (discriminated by feedback.mode === "live"; no schema change on the shared
 * DB). No daily lock during alpha: sessions are unlimited, XP stays capped at
 * the first XP_SESSIONS_PER_DAY reps of the day, shared with solo reps.
 */
export async function completeLiveSession(
  user: User,
  input: { scenario: CoachScenario; locale: Locale; dialog: LiveDialogTurn[]; durationSec: number }
): Promise<LiveSessionResult> {
  const date = dayString(new Date(), user.timezone);
  const sessionsBefore = await countSessionsToday(user);
  const debrief = await judgeLiveDialog(user, input);

  const text = input.scenario.text[input.locale];
  const youLabel = getDictionary(input.locale).coach.youLabel;
  const transcript = input.dialog
    .map((turn) => `${turn.role === "ai" ? text.character.name : youLabel}: ${turn.text}`)
    .join("\n");

  const userWords = input.dialog
    .filter((turn) => turn.role === "you")
    .map((turn) => turn.text.split(/\s+/).filter(Boolean).length)
    .reduce((sum, n) => sum + n, 0);
  const wpm = Math.min(400, Math.round(userWords / Math.max(input.durationSec / 60, 0.5)));

  const previous = await prisma.coachSession.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { overall: true },
  });

  // Same anti-farming cap as solo reps; empty conversations earn nothing.
  const xpAwarded = sessionsBefore < XP_SESSIONS_PER_DAY && debrief.overall > 0 ? XP.coach : 0;

  await prisma.coachSession.create({
    data: {
      userId: user.id,
      date,
      promptText: text.line,
      durationSec: input.durationSec,
      transcript,
      wpm,
      fillerCount: 0, // text transcripts carry no reliable filler signal
      overall: debrief.overall,
      confidence: debrief.scores.confidence,
      clarity: debrief.scores.clarity,
      energy: debrief.scores.energy,
      pace: debrief.scores.pace,
      feedback: {
        mode: "live",
        scenarioId: input.scenario.id,
        personaName: text.character.name,
        dialog: input.dialog,
        rubric: debrief.rubric,
        sceneHeadline: debrief.sceneHeadline,
        sceneNote: debrief.sceneNote,
        headline: debrief.headline,
        summary: debrief.summary,
        strengths: debrief.strengths,
        growthAreas: debrief.growthAreas,
        tryNext: debrief.tryNext,
      },
      xpAwarded,
    },
  });

  const award = await awardCoachSessionXp(user, date, xpAwarded);

  return {
    debrief,
    rubric: resolveRubric(RUBRICS[input.scenario.dread], debrief, input.locale),
    personaName: text.character.name,
    durationSec: input.durationSec,
    xpAwarded,
    totalXP: award.totalXP,
    overallDelta: previous ? debrief.overall - previous.overall : null,
    sessionsToday: sessionsBefore + 1,
    quests: award.quests,
  };
}

/* ---------- coach tab defaults ---------- */

export type LiveDefaults = {
  scenarioId: string;
  personaName: string;
  avatar: string;
  scene: string;
  title: string;
  setup: string;
};

/**
 * What the coach tab needs to offer today's live scene, or null when the
 * feature is not configured (hides the live CTA entirely).
 */
export function getLiveDefaults(scenario: CoachScenario, locale: Locale): LiveDefaults | null {
  if (!process.env.GEMINI_API_KEY) return null;
  const text = scenario.text[locale];
  return {
    scenarioId: scenario.id,
    personaName: text.character.name,
    avatar: scenario.avatar,
    scene: text.character.scene,
    title: text.title,
    setup: text.setup,
  };
}
