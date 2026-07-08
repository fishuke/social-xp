"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";
import { useT, useLocale } from "@/components/i18n-provider";
import { withLocale } from "@/lib/i18n/routing";

/**
 * Back arrow for content pages in app chrome.
 * With `to`, always navigates to that path in the current locale (use this when
 * the page has one logical parent, so back never replays a stale-locale history
 * entry). Without it, steps back through history and falls back to /you.
 */
export function BackButton({ to }: { to?: string }) {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();

  function goBack() {
    if (to) {
      router.push(withLocale(locale, to));
      return;
    }
    if (window.history.length > 1) router.back();
    else router.push(withLocale(locale, "/you"));
  }

  return (
    <button onClick={goBack} aria-label={t.common.back} className="-ml-1 p-1 text-cocoa">
      <ChevronLeftIcon size={24} />
    </button>
  );
}
