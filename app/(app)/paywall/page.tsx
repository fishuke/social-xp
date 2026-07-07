"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { startCheckout } from "@/lib/actions";
import { CheckIcon, CloseIcon, Logo } from "@/components/icons";

const PERKS = [
  "All chapters unlocked from day one",
  "Skip ahead: train in any order",
  "AI speaking coach & feedback",
  "Streak repair: one slip forgiven",
];

export default function PaywallPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startTrial() {
    setBusy(true);
    setError(null);
    const result = await startCheckout({ plan });
    if (!result.ok) {
      setError(result.error);
      setBusy(false);
      return;
    }
    if (result.url) {
      window.location.assign(result.url); // provider's hosted checkout
      return;
    }
    router.replace("/learn"); // dev fallback - already premium
  }

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-[58px]">
      <button
        onClick={() => router.back()}
        aria-label="Close"
        className="self-end text-sec2"
      >
        <CloseIcon size={26} />
      </button>

      <div className="flex flex-col items-center text-center">
        <Logo size={78} />
        <span
          className="mt-4 rounded-full px-3.5 py-1.5 font-display text-[13px] font-semibold tracking-[1.5px] text-white"
          style={{ background: "linear-gradient(90deg, #FF914D, #FF5A2C)" }}
        >
          SOCIAL XP+
        </span>
        <h1 className="mt-3 font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
          Train as much
          <br />
          as you want.
        </h1>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-3.5">
        {PERKS.map((perk) => (
          <div key={perk} className="flex items-center gap-3">
            <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-go">
              <CheckIcon size={13} />
            </span>
            <span className="font-body text-[16px] font-bold text-ink">{perk}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setPlan("monthly")}
          className="flex-1 rounded-[18px] border-2 bg-white p-4 text-left"
          style={{ borderColor: plan === "monthly" ? "#FF5A2C" : "#EADFD5" }}
        >
          <span className="block font-display text-[15px] font-semibold text-cocoa">Monthly</span>
          <span className="block font-display text-[22px] font-semibold text-cocoa">$6.99</span>
          <span className="block font-body text-[12px] font-bold text-faint">per month</span>
        </button>
        <button
          onClick={() => setPlan("yearly")}
          className="relative flex-1 rounded-[18px] border-2 p-4 text-left"
          style={{
            borderColor: plan === "yearly" ? "#FF5A2C" : "#EADFD5",
            background: plan === "yearly" ? "#FFF0E9" : "#fff",
          }}
        >
          <span className="absolute -top-2.5 right-3 rounded-full bg-coral px-2 py-0.5 font-display text-[10px] font-semibold tracking-[1px] text-white">
            SAVE 52%
          </span>
          <span className="block font-display text-[15px] font-semibold text-cocoa">Yearly</span>
          <span className="block font-display text-[22px] font-semibold text-cocoa">$39.99</span>
          <span className="block font-body text-[12px] font-bold text-faint">per year</span>
        </button>
      </div>

      <button className="btn btn-coral mt-5" onClick={startTrial} disabled={busy}>
        Start 7-day free trial
      </button>
      {error && (
        <p className="mt-2 text-center font-body text-[13px] font-bold text-coral">{error}</p>
      )}
      <p className="mt-2 text-center font-body text-[13px] font-bold text-sec2">
        Then {plan === "yearly" ? "$39.99/yr" : "$6.99/mo"} · cancel anytime
      </p>
      <p className="mt-3 text-center font-body text-[11px] font-bold leading-[1.5] text-faint2">
        Social XP builds confidence through practice. It&apos;s not therapy or mental-health
        treatment.
      </p>
    </div>
  );
}
