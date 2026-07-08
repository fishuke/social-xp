// Locale config shared by the proxy, layouts, dictionaries, and formatting.
// Client-safe: no server-only imports here so client components can read it too.

export const LOCALES = ["en", "tr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string | undefined | null): value is Locale {
  return value != null && (LOCALES as readonly string[]).includes(value);
}

/** Narrow an untrusted string (DB column, param) to a Locale, defaulting safely. */
export function coerceLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

// BCP-47 tags for Intl date/number formatting, keyed by app locale.
export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-US",
  tr: "tr-TR",
};

/** Locale-aware number formatting (e.g. thousands separators per locale). */
export function formatNumber(locale: Locale, value: number): string {
  return value.toLocaleString(INTL_LOCALE[locale]);
}

// Cookie the proxy writes so returning visitors keep their language.
export const LOCALE_COOKIE = "NEXT_LOCALE";
