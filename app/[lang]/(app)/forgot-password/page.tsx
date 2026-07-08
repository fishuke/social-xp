"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/lib/actions";
import { Logo } from "@/components/icons";
import { LocaleLink } from "@/components/locale-link";
import { useT } from "@/components/i18n-provider";

const inputClass =
  "w-full rounded-[18px] border-2 border-line bg-white px-5 py-[14px] font-body text-[16px] font-bold text-cocoa placeholder:text-faint focus:border-coral focus:outline-none";

export default function ForgotPasswordPage() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    await requestPasswordReset({ email });
    setSent(true);
  }

  return (
    <div className="page-enter flex flex-1 flex-col px-6 pb-8 pt-[58px]">
      <div className="flex flex-col items-center text-center">
        <Logo size={72} />
        <h1 className="mt-5 font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
          {t.auth.forgotTitle}
        </h1>
        <p className="mt-2 max-w-[300px] font-body text-[15px] font-bold text-sec2">
          {t.auth.forgotSubtitle}
        </p>
      </div>

      {sent ? (
        <div className="mt-8 rounded-[18px] border-2 border-go-border bg-go-tint p-5 text-center">
          <p className="font-display text-[17px] font-semibold text-go-text">{t.auth.resetSentTitle}</p>
          <p className="mt-1 font-body text-[14px] font-bold text-go-text">
            {t.auth.resetSentBody}
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder={t.auth.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <button type="submit" className="btn btn-coral mt-2" disabled={busy}>
            {busy ? t.common.oneSec : t.auth.sendResetLink}
          </button>
        </form>
      )}

      <div className="mt-auto pt-6 text-center">
        <LocaleLink href="/login" className="font-display text-[15px] font-medium text-sec2">
          {t.auth.backToLogin}
        </LocaleLink>
      </div>
    </div>
  );
}
