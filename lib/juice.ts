"use client";

// Tiny WebAudio chimes + haptics - Duolingo-style feedback without asset files.
// All calls are fire-and-forget and safe to fail (older browsers, no gesture yet).

let ctx: AudioContext | null = null;

// User preference for sound + haptic feedback, persisted in localStorage so it
// survives reloads. Read lazily and cached; defaults on when never set.
const PREF_KEY = "sxp:feedback";
let enabled: boolean | null = null;
const listeners = new Set<() => void>();

function feedbackOn(): boolean {
  if (enabled !== null) return enabled;
  try {
    enabled = localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    enabled = true;
  }
  return enabled;
}

/** Whether sound + haptic feedback is currently enabled (client value). */
export function isFeedbackEnabled(): boolean {
  return feedbackOn();
}

/** Server snapshot for useSyncExternalStore: default on, no localStorage. */
export function feedbackServerSnapshot(): boolean {
  return true;
}

/** Subscribe to feedback-preference changes (for useSyncExternalStore). */
export function subscribeFeedback(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Turn sound + haptic feedback on or off; persists across reloads. */
export function setFeedbackEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    // storage unavailable - keep the in-memory value
  }
  listeners.forEach((cb) => cb());
}

function audio(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function note(freq: number, at: number, dur = 0.14, type: OscillatorType = "sine", vol = 0.07) {
  const c = audio();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(c.destination);
  const start = c.currentTime + at;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(vol, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.start(start);
  osc.stop(start + dur + 0.03);
}

export function sfx(kind: "correct" | "wrong" | "reward" | "claim") {
  if (!feedbackOn()) return;
  try {
    switch (kind) {
      case "correct": // quick happy third
        note(659, 0);
        note(784, 0.09);
        break;
      case "wrong": // soft low thud
        note(196, 0, 0.16, "triangle", 0.06);
        break;
      case "reward": // chest arpeggio
        note(523, 0);
        note(659, 0.08);
        note(784, 0.16, 0.2);
        break;
      case "claim": // fanfare up
        note(392, 0);
        note(523, 0.09);
        note(659, 0.18, 0.22);
        note(1046, 0.3, 0.28, "sine", 0.05);
        break;
    }
  } catch {
    // audio unavailable - silently skip
  }
}

export function haptic(pattern: number | number[] = 18) {
  if (!feedbackOn()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // no vibration support
  }
}
