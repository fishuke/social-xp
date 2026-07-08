"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";
import { useT, useLocale } from "@/components/i18n-provider";
import { withLocale } from "@/lib/i18n/routing";

/** Back arrow for content pages in app chrome; falls back to /you on deep links. */
export function BackButton() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push(withLocale(locale, "/you"));
  }

  return (
    <button onClick={goBack} aria-label={t.common.back} className="-ml-1 p-1 text-cocoa">
      <ChevronLeftIcon size={24} />
    </button>
  );
}
