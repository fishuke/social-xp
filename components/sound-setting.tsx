"use client";

// Sound + haptics toggle for settings. The whole app's feedback (quiz chimes,
// reward fanfares, vibration) runs through lib/juice, which reads a localStorage
// flag; this is the switch that flips it. Client-only: the stored value is read
// on mount so the control matches what juice will actually do.

import { useSyncExternalStore } from "react";
import {
  feedbackServerSnapshot,
  isFeedbackEnabled,
  setFeedbackEnabled,
  sfx,
  subscribeFeedback,
} from "@/lib/juice";
import { useT } from "./i18n-provider";

export function SoundSetting() {
  const t = useT();
  const on = useSyncExternalStore(subscribeFeedback, isFeedbackEnabled, feedbackServerSnapshot);

  function toggle() {
    const next = !on;
    setFeedbackEnabled(next);
    if (next) sfx("correct"); // let them hear it come back on
  }

  return (
    <div className="mt-5 flex items-center gap-3 rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
      <span className="text-[22px]">{on ? "🔊" : "🔇"}</span>
      <span className="flex-1">
        <span className="block font-display text-[15px] font-semibold text-cocoa">
          {t.settings.soundTitle}
        </span>
        <span className="block font-body text-[12px] font-bold text-sec2">
          {t.settings.soundSub}
        </span>
      </span>
      <button
        role="switch"
        aria-checked={on}
        aria-label={t.settings.soundTitle}
        onClick={toggle}
        className="relative h-[30px] w-[52px] shrink-0 rounded-full transition-colors"
        style={{ background: on ? "var(--color-go)" : "var(--color-line)" }}
      >
        <span
          className="absolute top-[3px] h-[24px] w-[24px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left]"
          style={{ left: on ? "25px" : "3px" }}
        />
      </button>
    </div>
  );
}
