"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { submitOnboarding, type OnboardingInput } from "@/lib/actions";
import { Logo } from "@/components/icons";
import { ProgressBar } from "@/components/ui";
import { useT, useLocale } from "@/components/i18n-provider";
import { withLocale } from "@/lib/i18n/routing";

export default function Onboarding() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<OnboardingInput["goal"]>("ease-nerves");
  const [pace, setPace] = useState<OnboardingInput["pace"]>("steady");
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    // Device timezone makes streaks and reminders reset at the user's midnight.
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
    await submitOnboarding({ goal, pace, timezone, locale });
    router.replace(withLocale(locale, "/learn"));
  }

  if (step === 0) {
    return (
      <div className="flex flex-1 flex-col justify-between px-6 pb-8 pt-[58px] text-center">
        <p className="font-display text-[16px] font-bold uppercase tracking-[2px] text-coral">
          {t.onboarding.brand}
        </p>
        <div className="flex flex-col items-center gap-6">
          <Logo size={100} />
          <h1 className="font-display text-[33px] font-semibold leading-[1.06] tracking-[-0.5px] text-cocoa">
            {t.onboarding.heroTitleLine1}
            <br />
            {t.onboarding.heroTitleLine2}
          </h1>
          <p className="max-w-[300px] font-body text-[18px] leading-[1.5] text-sec">
            {t.onboarding.heroBody}
          </p>
          <a
            href={withLocale(locale, "/method")}
            className="rounded-full border-2 border-line bg-white px-4 py-2 font-body text-[13px] font-extrabold text-sec2"
          >
            {t.onboarding.scienceLink}
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <button className="btn btn-coral" onClick={() => setStep(1)}>
            {t.onboarding.startTraining}
          </button>
          <button className="btn btn-ghost" onClick={() => router.push(withLocale(locale, "/login"))}>
            {t.onboarding.haveAccount}
          </button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="flex flex-1 flex-col px-6 pb-8 pt-[58px]">
        <ProgressBar percent={40} />
        <h2 className="mt-8 font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
          {t.onboarding.goalTitle}
        </h2>
        <p className="mt-2 font-body text-[15px] font-bold text-sec2">
          {t.onboarding.goalSubtitle}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {t.onboarding.goals.map((g) => {
            const selected = goal === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setGoal(g.id as OnboardingInput["goal"])}
                className="flex items-center justify-between rounded-[18px] border-2 px-5 py-[18px] text-left font-display text-[18px] font-medium transition active:scale-[0.98]"
                style={{
                  borderColor: selected ? "#FF5A2C" : "#EADFD5",
                  background: selected ? "#FFEDE4" : "#fff",
                  color: "#2E2018",
                }}
              >
                {g.label}
                <span
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-2"
                  style={{ borderColor: selected ? "#FF5A2C" : "#EADFD5" }}
                >
                  {selected && <span className="h-[13px] w-[13px] rounded-full bg-coral" />}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto pt-6">
          <button className="btn btn-coral" onClick={() => setStep(2)}>
            {t.common.continue}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-[58px]">
      <ProgressBar percent={75} />
      <h2 className="mt-8 text-center font-display text-[30px] font-semibold text-cocoa">
        {t.onboarding.paceTitle}
      </h2>
      <p className="mt-2 text-center font-body text-[15px] font-bold text-sec2">
        {t.onboarding.paceSubtitle}
      </p>
      <div className="flex flex-1 flex-col justify-center gap-3">
        {t.onboarding.paces.map((p) => {
          const selected = pace === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPace(p.id as OnboardingInput["pace"])}
              className="flex items-center gap-4 rounded-[18px] border-2 px-5 py-4 text-left transition active:scale-[0.98]"
              style={{
                borderColor: selected ? "#FF5A2C" : "#EADFD5",
                background: selected ? "#FFF0E9" : "#fff",
              }}
            >
              <span className="text-[28px]">{p.emoji}</span>
              <span className="flex-1">
                <span className="block font-display text-[19px] font-semibold text-cocoa">
                  {p.title}
                </span>
                <span className="block font-body text-[14px] font-bold text-sec2">{p.sub}</span>
              </span>
              {selected && (
                <span className="rounded-full bg-coral px-2.5 py-1 font-display text-[11px] font-semibold tracking-[1px] text-white">
                  {t.onboarding.picked}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mb-5 flex items-center justify-between rounded-[18px] bg-white px-5 py-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
        <span>
          <span className="block font-display text-[16px] font-semibold text-cocoa">
            {t.onboarding.dailyReminder}
          </span>
          <span className="block font-body text-[13px] font-bold text-sec2">
            {t.onboarding.dailyReminderSub}
          </span>
        </span>
        <span className="font-display text-[18px] font-semibold text-coral">
          {t.onboarding.reminderTime}
        </span>
      </div>
      <button className="btn btn-coral" onClick={finish} disabled={saving}>
        {t.onboarding.letsGo}
      </button>
    </div>
  );
}
