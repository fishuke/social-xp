"use client";

// Branded 404 shown for unmatched routes under a locale segment. Rendered inside
// the [lang] root layout, so the I18nProvider is present and copy renders off the
// URL locale (see useT). Client component per the not-found docs: path-derived UI
// must resolve on the client.

import { LocaleLink } from "@/components/locale-link";
import { useT } from "@/components/i18n-provider";

export default function NotFound() {
  const t = useT();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[402px] flex-col items-center justify-center bg-cream px-6 text-center shadow-[0_0_48px_rgba(46,32,24,0.12)]">
      <p className="font-display text-[64px] font-bold leading-none text-coral">
        {t.notFound.code}
      </p>
      <h1 className="mt-4 font-display text-[24px] font-semibold text-ink">
        {t.notFound.title}
      </h1>
      <p className="mt-3 max-w-[280px] text-[16px] leading-relaxed text-sec">
        {t.notFound.body}
      </p>
      <LocaleLink href="/coach" className="btn btn-coral mt-8 rounded-[16px]">
        {t.notFound.backToLearning}
      </LocaleLink>
    </div>
  );
}
