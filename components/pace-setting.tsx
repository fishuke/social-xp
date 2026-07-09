"use client";

// Daily-goal (pace) selector for settings. The onboarding pace copy promises
// "you can change this anytime"; this is where that happens. Persists via
// setPace, then refreshes so the learn-tab daily goal updates.

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setPace } from "@/lib/actions";
import { haptic } from "@/lib/juice";
import { useT } from "./i18n-provider";

export function PaceSetting({ current }: { current: string }) {
  const t = useT();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: string) {
    if (next === current || pending) return;
    haptic();
    startTransition(async () => {
      await setPace(next);
      router.refresh();
    });
  }

  return (
    <div className="mt-5 rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
      <p className="font-display text-[15px] font-semibold text-cocoa">{t.settings.paceTitle}</p>
      <p className="mt-0.5 font-body text-[12px] font-bold text-sec2">{t.settings.paceSub}</p>
      <div className="mt-3 flex flex-col gap-2">
        {t.onboarding.paces.map((p) => {
          const active = p.id === current;
          return (
            <button
              key={p.id}
              onClick={() => choose(p.id)}
              disabled={pending}
              aria-pressed={active}
              className="flex items-center gap-3 rounded-[14px] border-2 px-4 py-3 text-left transition-colors"
              style={{
                borderColor: active ? "var(--color-coral)" : "var(--color-line)",
                background: active ? "var(--color-tint-select)" : "#fff",
              }}
            >
              <span className="text-[22px]">{p.emoji}</span>
              <span className="flex-1">
                <span className="block font-display text-[15px] font-semibold text-cocoa">
                  {p.title}
                </span>
                <span className="block font-body text-[12px] font-bold text-sec2">{p.sub}</span>
              </span>
              {active && (
                <span className="rounded-full bg-coral px-2.5 py-1 font-display text-[10px] font-semibold tracking-[1px] text-white">
                  {t.onboarding.picked}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
