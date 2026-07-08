"use client";

// Client-side locale context. The server layout renders <I18nProvider locale={lang}>
// (only the locale string crosses the boundary); the dictionary object itself is
// resolved client-side from the bundled map so its interpolation functions work.

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

type I18nValue = { locale: Locale; dict: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, dict: getDictionary(locale) }}>
      {children}
    </I18nContext.Provider>
  );
}

function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

/** Client hook: the active dictionary. */
export function useT(): Dictionary {
  return useI18n().dict;
}

/** Client hook: the active locale. */
export function useLocale(): Locale {
  return useI18n().locale;
}
