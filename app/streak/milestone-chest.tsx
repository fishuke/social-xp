"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChestResult } from "@/lib/game";
import { ChestOverlay } from "@/components/chest-overlay";
import { ChestIcon } from "@/components/icons";

export function MilestoneChest({ milestone }: { milestone: number }) {
  const router = useRouter();
  const [reward, setReward] = useState<ChestResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function open() {
    if (busy) return;
    setBusy(true);
    const res = await fetch("/api/chest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "streak", milestone }),
    });
    const data: ChestResult = await res.json();
    if (data.xpAwarded > 0) setReward(data);
    setBusy(false);
  }

  return (
    <>
      <button
        onClick={open}
        disabled={busy}
        className="wiggle mt-5 flex items-center gap-3 rounded-[20px] border-2 border-amber bg-white/12 px-5 py-3"
      >
        <ChestIcon size={30} />
        <span className="text-left">
          <span className="block font-display text-[16px] font-semibold text-amber">
            {milestone}-day milestone chest!
          </span>
          <span className="block font-body text-[12px] font-bold text-ondark">Tap to open</span>
        </span>
      </button>
      {reward && (
        <ChestOverlay
          result={reward}
          onDone={() => {
            setReward(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
