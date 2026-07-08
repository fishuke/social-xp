"use client";

// Portal links are signed and short-lived, so fetch a fresh one per click
// instead of rendering a stale href.

import { useState } from "react";
import { getManageSubscriptionUrl } from "@/lib/actions";
import { useT } from "@/components/i18n-provider";

export function ManageSubscriptionButton() {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function open() {
    setBusy(true);
    setFailed(false);
    const url = await getManageSubscriptionUrl();
    setBusy(false);
    if (url) {
      window.location.assign(url);
    } else {
      setFailed(true);
    }
  }

  return (
    <button
      onClick={open}
      disabled={busy}
      className="font-display text-[13px] font-semibold text-coral disabled:opacity-60"
    >
      {failed ? t.paywall.manageFailed : busy ? t.paywall.opening : t.paywall.manageSubscription}
    </button>
  );
}
