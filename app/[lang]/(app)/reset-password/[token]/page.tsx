"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { resetPassword } from "@/lib/actions";
import { Logo } from "@/components/icons";
import { LocaleLink } from "@/components/locale-link";
import { useT, useLocale } from "@/components/i18n-provider";
import { withLocale } from "@/lib/i18n/routing";

const inputClass =
  "w-full rounded-[18px] border-2 border-line bg-white px-5 py-[14px] font-body text-[16px] font-bold text-cocoa placeholder:text-faint focus:border-coral focus:outline-none";

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (password !== confirm) {
      setError(t.errors.passwordsDontMatch);
      return;
    }
    setBusy(true);
    setError(null);
    const result = await resetPassword({ token, password });
    if (result.ok) {
      // resetPassword signs the user in, straight back to training
      router.replace(withLocale(locale, "/learn"));
      router.refresh();
    } else {
      setError(result.error);
      setBusy(false);
    }
  }

  return (
    <div className="page-enter flex flex-1 flex-col px-6 pb-8 pt-[58px]">
      <div className="flex flex-col items-center text-center">
        <Logo size={72} />
        <h1 className="mt-5 font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
          {t.auth.resetTitle}
        </h1>
        <p className="mt-2 max-w-[300px] font-body text-[15px] font-bold text-sec2">
          {t.auth.resetSubtitle}
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={t.auth.newPasswordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder={t.auth.repeatPlaceholder}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
        {error && (
          <p className="rounded-[14px] bg-tint-coral px-4 py-3 font-body text-[13px] font-extrabold text-coral">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-coral mt-2" disabled={busy}>
          {busy ? t.common.oneSec : t.auth.setNewPassword}
        </button>
      </form>

      <div className="mt-auto pt-6 text-center">
        <LocaleLink href="/forgot-password" className="font-display text-[15px] font-medium text-sec2">
          {t.auth.linkExpired}
        </LocaleLink>
      </div>
    </div>
  );
}
