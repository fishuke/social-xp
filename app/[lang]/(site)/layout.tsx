// Chrome for the shared content pages (landing, method, privacy, terms).
// Same URLs, two skins: visitors get the marketing header/footer; app users
// (session cookie present) get the 402px phone frame with a back button, so
// in-app links to these pages feel native. Content itself is shared - see
// lib/site-content.ts.

import Link from "next/link";
import { Logo } from "@/components/icons";
import { BackButton } from "@/components/back-button";
import { isAppVisitor } from "@/lib/site-mode";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { coerceLocale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = coerceLocale(lang);
  const t = getDictionary(locale);

  if (await isAppVisitor()) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[402px] flex-col bg-cream shadow-[0_0_48px_rgba(46,32,24,0.12)]">
        <div className="flex items-center gap-2 px-6 pt-[54px]">
          <BackButton />
          <span className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-display text-[16px] font-semibold text-cocoa">Social XP</span>
          </span>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1020px] items-center justify-between px-6 py-4">
          <Link href={withLocale(locale, "/")} className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="font-display text-[19px] font-semibold text-cocoa">Social XP</span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link
              href={withLocale(locale, "/method")}
              className="hidden font-body text-[14px] font-bold text-sec2 sm:block"
            >
              {t.common.method}
            </Link>
            <Link
              href={withLocale(locale, "/#pricing")}
              className="hidden font-body text-[14px] font-bold text-sec2 sm:block"
            >
              {t.common.pricing}
            </Link>
            <Link href={withLocale(locale, "/login")} className="font-body text-[14px] font-bold text-sec2">
              {t.common.logIn}
            </Link>
            <Link
              href={withLocale(locale, "/onboarding")}
              className="rounded-full bg-coral px-4 py-2 font-display text-[14px] font-semibold text-white shadow-[0_3px_0_#D8431B]"
            >
              {t.common.startFree}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line bg-white py-12">
        <div className="mx-auto flex w-full max-w-[1020px] flex-col items-center gap-5 px-6 text-center">
          <span className="flex items-center gap-2">
            <Logo size={26} />
            <span className="font-display text-[16px] font-semibold text-cocoa">Social XP</span>
          </span>
          <p className="max-w-[440px] font-body text-[12px] font-bold leading-[1.5] text-faint2">
            {t.landing.footerDisclaimer}
          </p>
          <p className="font-body text-[13px] font-bold text-sec2">
            <Link href={withLocale(locale, "/method")}>{t.common.method}</Link> ·{" "}
            <Link href={withLocale(locale, "/#pricing")}>{t.common.pricing}</Link> ·{" "}
            <Link href={withLocale(locale, "/terms")}>{t.common.terms}</Link> ·{" "}
            <Link href={withLocale(locale, "/privacy")}>{t.common.privacy}</Link>
          </p>
          <p className="font-body text-[12px] font-bold text-faint">
            {t.landing.footerCopyright(new Date().getFullYear())}
          </p>
        </div>
      </footer>
    </div>
  );
}
