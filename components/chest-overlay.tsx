"use client";

import { useState } from "react";
import type { ChestResult } from "@/lib/game";
import { haptic, sfx } from "@/lib/juice";
import { BigChest } from "./big-chest";
import { ConfettiBurst } from "./confetti";
import { CountUp } from "./count-up";
import { XpSquareIcon } from "./icons";
import { useT } from "./i18n-provider";

// Full-screen chest ceremony: wiggle → tap → shake & glow → burst open → reveal.
export function ChestOverlay({ result, onDone }: { result: ChestResult; onDone: () => void }) {
  const t = useT();
  const tierLabels = {
    common: t.chest.tierCommon,
    rare: t.chest.tierRare,
    epic: t.chest.tierEpic,
  } as const;
  const [phase, setPhase] = useState<"idle" | "opening" | "revealed">("idle");

  function tap() {
    if (phase !== "idle") return;
    setPhase("opening");
    haptic();
    setTimeout(() => {
      setPhase("revealed");
      sfx("reward");
      haptic([20, 40, 20, 40, 70]);
    }, 950);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.chest.dialogLabel}
      className="overlay-in fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
      style={{ background: "linear-gradient(170deg, rgba(36,26,18,0.96), rgba(67,48,31,0.96))" }}
      onClick={phase === "idle" ? tap : undefined}
    >
      <p className="pop-in mb-8 font-display text-[15px] font-semibold uppercase tracking-[2px] text-amber">
        {tierLabels[result.tier]}
      </p>

      <div className="relative flex items-center justify-center">
        {phase === "revealed" && <div aria-hidden className="sunburst h-[480px] w-[480px]" />}
        <div
          className="chest-glow h-[300px] w-[300px]"
          style={{ opacity: phase === "idle" ? 0.35 : 1 }}
        />
        {phase === "revealed" && <ConfettiBurst height={320} />}
        <div className={phase === "idle" ? "wiggle" : phase === "opening" ? "chest-shaking" : "pop-in"}>
          <BigChest tier={result.tier} open={phase === "revealed"} size={170} />
        </div>
      </div>

      {phase !== "revealed" ? (
        <p className="bob mt-10 font-display text-[18px] font-semibold text-ondark">
          {phase === "idle" ? t.chest.tapToOpen : t.chest.opening}
        </p>
      ) : (
        <div className="float-up mt-8 flex w-full flex-col items-center gap-3">
          <span className="flex items-center gap-2.5 rounded-[18px] bg-white/12 px-6 py-3">
            <XpSquareIcon size={26} />
            <span className="font-display text-[34px] font-bold text-amber">
              +<CountUp to={result.xpAwarded} duration={800} /> XP
            </span>
          </span>
          {result.shield && (
            <span
              className="pop-in flex items-center gap-2 rounded-[16px] border-2 border-amber bg-tint-rare px-4 py-2.5"
              style={{ animationDelay: "500ms" }}
            >
              <span className="text-[22px]">🛡️</span>
              <span className="text-left">
                <span className="block font-display text-[15px] font-semibold text-cocoa">
                  {t.chest.shieldTitle}
                </span>
                <span className="block font-body text-[12px] font-bold text-sec2">
                  {t.chest.shieldBody}
                </span>
              </span>
            </span>
          )}
          <button className="btn btn-amber mt-3 max-w-[280px]" onClick={onDone}>
            {t.chest.collect}
          </button>
        </div>
      )}
    </div>
  );
}
