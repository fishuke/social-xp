"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAccount, registerAccount, type AuthResult } from "@/lib/actions";
import { Logo } from "./icons";
import { LocaleLink } from "./locale-link";
import { useT, useLocale } from "./i18n-provider";
import { withLocale } from "@/lib/i18n/routing";

const inputClass =
  "w-full rounded-[18px] border-2 border-line bg-white px-5 py-[14px] font-body text-[16px] font-bold text-cocoa placeholder:text-faint focus:border-coral focus:outline-none";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isLogin = mode === "login";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result: AuthResult = isLogin
        ? await loginAccount({ email, password })
        : await registerAccount({ email, password });
      if (result.ok) {
        router.replace(withLocale(locale, "/coach"));
        router.refresh();
      } else {
        setError(result.error);
        setBusy(false);
      }
    } catch {
      // A rejected server action (e.g. a blocked request on a preview
      // deployment) must never leave the button stuck spinning.
      setError(t.errors.somethingWrong);
      setBusy(false);
    }
  }

  return (
    <div className="page-enter flex flex-1 flex-col px-6 pb-8 pt-[58px]">
      <div className="flex flex-col items-center text-center">
        <Logo size={72} />
        <h1 className="mt-5 font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
          {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
        </h1>
        <p className="mt-2 max-w-[300px] font-body text-[15px] font-bold text-sec2">
          {isLogin ? t.auth.loginSubtitle : t.auth.registerSubtitle}
        </p>
      </div>

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
        <input
          type="password"
          required
          minLength={8}
          autoComplete={isLogin ? "current-password" : "new-password"}
          placeholder={isLogin ? t.auth.passwordPlaceholder : t.auth.passwordPlaceholderNew}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        {error && (
          <p className="rounded-[14px] bg-tint-coral px-4 py-3 font-body text-[13px] font-extrabold text-coral">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-coral mt-2" disabled={busy}>
          {busy ? t.common.oneSec : isLogin ? t.auth.logIn : t.auth.createAccount}
        </button>
        {isLogin && (
          <LocaleLink
            href="/forgot-password"
            className="text-center font-body text-[13px] font-extrabold text-sec2"
          >
            {t.auth.forgotPassword}
          </LocaleLink>
        )}
      </form>

      {isLogin && (
        <div className="mt-5 rounded-[18px] border-2 border-dashed border-amber bg-tint-rare p-4">
          <p className="font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-amber-dark">
            {t.auth.demoTitle}
          </p>
          <p className="mt-1 font-body text-[13px] font-bold text-sec">
            {t.auth.demoBody}
          </p>
          <button
            className="mt-3 w-full rounded-[14px] bg-amber py-2.5 font-display text-[15px] font-semibold text-cocoa shadow-[0_3px_0_#D89E2E] active:translate-y-0.5 active:shadow-[0_1px_0_#D89E2E]"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                const result = await loginAccount({ email: "demo@social.xp", password: "password123" });
                if (result.ok) {
                  router.replace(withLocale(locale, "/coach"));
                  router.refresh();
                } else {
                  setError(result.error);
                  setBusy(false);
                }
              } catch {
                setError(t.errors.somethingWrong);
                setBusy(false);
              }
            }}
          >
            {t.auth.useDemo}
          </button>
        </div>
      )}

      <div className="mt-auto pt-6 text-center">
        <LocaleLink
          href={isLogin ? "/register" : "/login"}
          className="font-display text-[15px] font-medium text-sec2"
        >
          {isLogin ? t.auth.switchToRegister : t.auth.switchToLogin}
        </LocaleLink>
      </div>
    </div>
  );
}
