"use client";

// Nudge under the account card while the email is unverified; the resend
// button is rate-limited server-side (3/hour).

import { useState } from "react";
import { resendVerification } from "@/lib/actions";

export function VerifyEmailBanner({ linkFailed }: { linkFailed: boolean }) {
  const [message, setMessage] = useState<string | null>(
    linkFailed ? "That link was invalid or expired. Send a fresh one below." : null
  );
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function resend() {
    setBusy(true);
    const result = await resendVerification();
    setMessage(result.ok ? "Sent! Check your inbox (and spam)." : (result.error ?? null));
    setSent(result.ok);
    setBusy(false);
  }

  return (
    <div className="mt-3 rounded-[18px] border-2 border-dashed border-amber bg-tint-rare p-4">
      <p className="font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-amber-dark">
        Verify your email
      </p>
      <p className="mt-1 font-body text-[13px] font-bold text-sec">
        {message ?? "One click in the email we sent keeps your account recoverable."}
      </p>
      {!sent && (
        <button
          onClick={resend}
          disabled={busy}
          className="mt-2 font-display text-[14px] font-semibold text-coral disabled:opacity-60"
        >
          {busy ? "Sending…" : "Resend the email"}
        </button>
      )}
    </div>
  );
}
