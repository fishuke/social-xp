"use client";

// Nudge under the account card while the email is unverified; the resend
// button is rate-limited server-side (3/hour).

import { useState } from "react";
import { resendVerification } from "@/lib/actions";
import { useT } from "@/components/i18n-provider";

export function VerifyEmailBanner({ linkFailed }: { linkFailed: boolean }) {
  const t = useT();
  const [message, setMessage] = useState<string | null>(
    linkFailed ? t.verifyEmail.linkFailed : null
  );
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function resend() {
    setBusy(true);
    const result = await resendVerification();
    setMessage(result.ok ? t.verifyEmail.resent : (result.error ?? null));
    setSent(result.ok);
    setBusy(false);
  }

  return (
    <div className="mt-3 rounded-[18px] border-2 border-dashed border-amber bg-tint-rare p-4">
      <p className="font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-amber-dark">
        {t.verifyEmail.title}
      </p>
      <p className="mt-1 font-body text-[13px] font-bold text-sec">
        {message ?? t.verifyEmail.body}
      </p>
      {!sent && (
        <button
          onClick={resend}
          disabled={busy}
          className="mt-2 font-display text-[14px] font-semibold text-coral disabled:opacity-60"
        >
          {busy ? t.verifyEmail.sending : t.verifyEmail.resend}
        </button>
      )}
    </div>
  );
}
