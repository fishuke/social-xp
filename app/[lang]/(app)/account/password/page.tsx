"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { changePassword } from "@/lib/actions";
import { LocaleLink } from "@/components/locale-link";
import { useT, useLocale } from "@/components/i18n-provider";
import { withLocale } from "@/lib/i18n/routing";

const inputClass =
  "w-full rounded-[18px] border-2 border-line bg-white px-5 py-[14px] font-body text-[16px] font-bold text-cocoa placeholder:text-faint focus:border-coral focus:outline-none";

export default function ChangePasswordPage() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (next !== confirm) {
      setError(t.errors.passwordsDontMatch);
      return;
    }
    setBusy(true);
    setError(null);
    const result = await changePassword({ currentPassword: current, newPassword: next });
    if (result.ok) {
      setDone(true);
      setTimeout(() => router.push(withLocale(locale, "/you")), 1200);
    } else {
      setError(result.error);
      setBusy(false);
    }
  }

  return (
    <div className="page-enter flex flex-1 flex-col px-6 pb-8 pt-[58px]">
      <h1 className="font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
        {t.auth.changeTitle}
      </h1>
      <p className="mt-2 font-body text-[15px] font-bold text-sec2">
        {t.auth.changeSubtitle}
      </p>

      {done ? (
        <div className="mt-8 rounded-[18px] border-2 border-go-border bg-go-tint p-5 text-center">
          <p className="font-display text-[17px] font-semibold text-go-text">{t.auth.passwordUpdated}</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder={t.auth.currentPasswordPlaceholder}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder={t.auth.passwordPlaceholderNew}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder={t.auth.repeatNewPlaceholder}
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
            {busy ? t.common.oneSec : t.auth.updatePassword}
          </button>
        </form>
      )}

      <div className="mt-auto pt-6 text-center">
        <LocaleLink href="/you" className="font-display text-[15px] font-medium text-sec2">
          {t.auth.backToProfile}
        </LocaleLink>
      </div>
    </div>
  );
}
