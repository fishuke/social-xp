"use client";

// Shared chest-opening flow: call the action, hand a real reward to the
// ceremony overlay, refresh when collected. Used by the quests card, the
// path chest, and the streak milestone chest.

import { useRouter } from "next/navigation";
import { useState } from "react";
import { openChest, type ChestRequest } from "@/lib/actions";
import type { ChestResult } from "@/lib/game";

export function useChest() {
  const router = useRouter();
  const [reward, setReward] = useState<ChestResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function open(request: ChestRequest) {
    if (busy) return;
    setBusy(true);
    const result = await openChest(request);
    if (result.xpAwarded > 0) {
      setReward(result); // ceremony overlay takes it from here
    } else {
      router.refresh();
    }
    setBusy(false);
  }

  function collect() {
    setReward(null);
    router.refresh();
  }

  return { reward, busy, open, collect };
}
