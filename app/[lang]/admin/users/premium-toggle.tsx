"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { togglePremium } from "@/lib/admin-actions";

export function PremiumToggle({ userId, isPremium }: { userId: string; isPremium: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await togglePremium(userId);
        router.refresh();
        setBusy(false);
      }}
      className={`rounded-full px-3 py-1 font-body text-[12px] font-bold ${
        isPremium ? "bg-go-tint text-go-text" : "bg-[#F1EDE7] text-sec2"
      }`}
    >
      {isPremium ? "premium ✓" : "free"}
    </button>
  );
}
