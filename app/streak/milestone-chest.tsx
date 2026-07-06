"use client";

import { ChestOverlay } from "@/components/chest-overlay";
import { ChestIcon } from "@/components/icons";
import { useChest } from "@/components/use-chest";

export function MilestoneChest({ milestone }: { milestone: number }) {
  const chest = useChest();

  return (
    <>
      <button
        onClick={() => chest.open({ type: "streak", milestone })}
        disabled={chest.busy}
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
      {chest.reward && <ChestOverlay result={chest.reward} onDone={chest.collect} />}
    </>
  );
}
