// Pure helpers for building locale-prefixed app paths. Client-safe.

import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

/**
 * Prefix an internal app path with the locale segment.
 * withLocale("tr", "/learn") -> "/tr/learn"; withLocale("en", "/") -> "/en".
 * Leaves already-prefixed and non-app (http/mailto) paths untouched.
 */
export function withLocale(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path; // external / relative, leave as-is
  const [first] = path.slice(1).split("/", 1);
  if ((LOCALES as readonly string[]).includes(first)) return path; // already prefixed
  const rest = path === "/" ? "" : path;
  return `/${locale}${rest}`;
}

/** Strip a leading locale segment, returning the bare app path ("/tr/learn" -> "/learn"). */
export function stripLocale(path: string): string {
  const segments = path.split("/");
  if ((LOCALES as readonly string[]).includes(segments[1])) {
    const rest = "/" + segments.slice(2).join("/");
    return rest === "/" ? "/" : rest.replace(/\/$/, "");
  }
  return path;
}

/** Best-effort locale from a pathname; falls back to the default locale. */
export function localeFromPath(path: string): Locale {
  const seg = path.split("/")[1];
  return (LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : DEFAULT_LOCALE;
}
