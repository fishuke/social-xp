// Chrome for the shared content pages (landing, method, privacy, terms).
// Same URLs, two skins: visitors get the marketing header/footer; app users
// (session cookie present) get the 402px phone frame with a back button, so
// in-app links to these pages feel native. Content itself is shared - see
// lib/site-content.ts.

import Link from "next/link";
import { Logo } from "@/components/icons";
import { BackButton } from "@/components/back-button";
import { isAppVisitor } from "@/lib/site-mode";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
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
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="font-display text-[19px] font-semibold text-cocoa">Social XP</span>
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/method" className="hidden font-body text-[14px] font-bold text-sec2 sm:block">
              Method
            </Link>
            <Link href="/#pricing" className="hidden font-body text-[14px] font-bold text-sec2 sm:block">
              Pricing
            </Link>
            <Link href="/login" className="font-body text-[14px] font-bold text-sec2">
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="rounded-full bg-coral px-4 py-2 font-display text-[14px] font-semibold text-white shadow-[0_3px_0_#D8431B]"
            >
              Start free
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
            Social XP builds confidence through practice. It&apos;s not therapy or mental-health
            treatment, and it doesn&apos;t replace professional care.
          </p>
          <p className="font-body text-[13px] font-bold text-sec2">
            <Link href="/method">Method</Link> · <Link href="/#pricing">Pricing</Link> ·{" "}
            <Link href="/terms">Terms</Link> · <Link href="/privacy">Privacy</Link>
          </p>
          <p className="font-body text-[12px] font-bold text-faint">
            © {new Date().getFullYear()} Social XP
          </p>
        </div>
      </footer>
    </div>
  );
}
