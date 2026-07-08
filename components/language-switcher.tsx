"use client";

// Language toggle. Persists the choice (User.locale + cookie) via setLocale,
// then navigates to the same page under the new locale prefix.

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { stripLocale, withLocale } from "@/lib/i18n/routing";
import { setLocale } from "@/lib/actions";
import { useLocale } from "./i18n-provider";

const LABELS: Record<Locale, string> = { en: "English", tr: "Türkçe" };

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale || pending) return;
    const bare = stripLocale(pathname);
    startTransition(async () => {
      await setLocale(next);
      router.push(withLocale(next, bare));
      router.refresh();
    });
  }

  return (
    <div className="mt-5 rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3">
        <span className="text-[22px]">🌐</span>
        <div className="flex flex-1 gap-2">
          {LOCALES.map((l) => {
            const active = l === locale;
            return (
              <button
                key={l}
                onClick={() => choose(l)}
                disabled={pending}
                aria-pressed={active}
                className="flex-1 rounded-[14px] border-2 py-2.5 font-display text-[14px] font-semibold transition-colors"
                style={{
                  borderColor: active ? "#FF5A2C" : "#EADFD5",
                  background: active ? "#FFEDE4" : "#fff",
                  color: active ? "#FF5A2C" : "#7A6A5D",
                }}
              >
                {LABELS[l]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
