// Live roleplay: a real multi-turn voice conversation with a scenario
// character (Gemini Live over an ephemeral token), judged afterwards into a
// debrief. The browser talks to Gemini directly through a single-use token
// minted here; GEMINI_API_KEY never leaves the server.
//
// Transport note: the client consumes a transport interface, not Gemini
// directly. Gemini Live is the shipping transport (EN + TR). A self-hosted
// full-duplex engine (NVIDIA PersonaPlex, EN only) is the planned second
// transport; see docs/BACKLOG.md.

import { RUBRICS, type CoachScenario } from "./coach-scenarios";
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
- Messages wrapped in [control]...[/control] are stage directions from the app, not ${userName} speaking. Follow them naturally and never acknowledge them.
- When a stage direction tells you to wrap up, bring the scene to a natural, warm close within one or two replies and say goodbye in character.`;
}
