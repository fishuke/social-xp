// Reactions, not analytics: pure heuristics that turn the live transcript
// into the v4 scene signals (vibe bar, header status, reaction chips, coach
// whispers, scene-end moment chips). All client-side and honest about being
// derived from the dialog itself; the real judging happens server-side after
// the scene.

import type { LiveDialogTurn } from "@/lib/coach-live";

export type VibeBucket = "dipping" | "warming" | "working";
export type LiveMoments = { laughs: number; askBacks: number; monologues: number };
export type WhisperKind = "monologue" | "askBack" | "short";

// Laughter as it shows up in live transcription, EN + TR.
const LAUGH_RE = /haha|hehe|ahaha|\(laugh|\(chuckl|\(giggl|lol\b|kahkaha|kıkır|gülü[şsy]/i;

const MONOLOGUE_WORDS = 80; // ~35s at conversational pace
const SHORT_TURN_WORDS = 4;

function words(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function youTurns(dialog: LiveDialogTurn[]): LiveDialogTurn[] {
  return dialog.filter((t) => t.role === "you");
}

export function analyzeMoments(dialog: LiveDialogTurn[]): LiveMoments {
  let laughs = 0;
  let askBacks = 0;
  let monologues = 0;
  for (const turn of dialog) {
    if (turn.role === "ai") {
      if (LAUGH_RE.test(turn.text)) laughs++;
    } else {
      if (turn.text.includes("?")) askBacks++;
      if (words(turn.text) >= MONOLOGUE_WORDS) monologues++;
    }
  }
  return { laughs, askBacks, monologues };
}

/** One live read of how it's going, 0-100. Starts warm-ish and moves on signals. */
export function vibeScore(dialog: LiveDialogTurn[], pendingYouWords: number): number {
  const { laughs, askBacks, monologues } = analyzeMoments(dialog);
  let score = 55;
  score += laughs * 8;
  score += askBacks * 6;
  score -= monologues * 12;
  for (const turn of youTurns(dialog)) {
    if (words(turn.text) <= SHORT_TURN_WORDS) score -= 6;
  }
  if (pendingYouWords > MONOLOGUE_WORDS) score -= 10; // rambling right now
  return Math.min(95, Math.max(12, score));
}

export function vibeBucket(score: number): VibeBucket {
  if (score < 45) return "dipping";
  if (score < 70) return "warming";
  return "working";
}

/**
 * The one nudge worth whispering right now, or null. The caller enforces
 * one-at-a-time and once-per-kind; this only ranks the signals.
 */
export function pickWhisper(dialog: LiveDialogTurn[], pendingYouWords: number): WhisperKind | null {
  if (pendingYouWords > MONOLOGUE_WORDS) return "monologue";
  const yours = youTurns(dialog);
  if (yours.length >= 2) {
    const lastTwo = yours.slice(-2);
    if (lastTwo.every((t) => words(t.text) <= SHORT_TURN_WORDS)) return "short";
    if (lastTwo.every((t) => !t.text.includes("?"))) return "askBack";
  }
  return null;
}

/** Reaction chip after the character's latest line, or null. */
export function latestReaction(dialog: LiveDialogTurn[]): "laughed" | null {
  const lastAi = [...dialog].reverse().find((t) => t.role === "ai");
  return lastAi && LAUGH_RE.test(lastAi.text) ? "laughed" : null;
}
