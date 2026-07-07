import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Terms of Service · Social XP",
  description: "The agreement between you and Social XP.",
};

// TODO: switch to the real support address once the production domain lands
// (docs/ROADMAP.md item 5).
const SUPPORT_EMAIL = "support@social-xp.app";

const SECTIONS = [
  {
    title: "The service",
    body: `Social XP is a training app for social confidence: short lessons, quizzes, real-world challenges, and an AI speaking coach. You need to be at least 13 to use it (or the minimum age in your country), and under 18 you'll need a parent or guardian's OK.`,
  },
  {
    title: "Not therapy",
    body: `Social XP builds confidence through practice. It is not therapy, medical care, or mental-health treatment, and it doesn't replace them. If you're struggling, please reach out to a qualified professional.`,
  },
  {
    title: "Your account",
    body: `You can train anonymously; creating an account keeps your progress safe across devices. You're responsible for keeping your password to yourself. Anonymous progress lives in a cookie and can be lost if you clear it, so claim your account if your streak matters to you.`,
  },
  {
    title: "Subscriptions & billing",
    body: `Social XP+ is sold through Lemon Squeezy, our merchant of record and the legal seller. Plans start with a 7-day free trial, then renew automatically (monthly or yearly) until you cancel. Cancel any time from Manage subscription on the You page; you keep access until the end of the period you paid for. Refund requests go through Lemon Squeezy or ${SUPPORT_EMAIL}.`,
  },
  {
    title: "Fair use",
    body: `Don't abuse the service: no breaking in, scraping, reselling, reverse engineering, or using the coach to process other people's voices without their consent. We can suspend accounts that do.`,
  },
  {
    title: "Our content",
    body: `Lessons, quotes curation, and app design belong to Social XP. They're licensed to you for personal use, not for republishing or building competing courses.`,
  },
  {
    title: "No guarantees",
    body: `We work hard to keep Social XP up and improving, but it's provided as is, without warranties. To the extent the law allows, our liability is limited to what you paid us in the last 12 months.`,
  },
  {
    title: "Changes",
    body: `We may update these terms as the product evolves. If a change is significant we'll flag it in the app. Continuing to train after a change means you accept it.`,
  },
];

export default function TermsPage() {
  return (
    <div className="page-enter flex flex-1 flex-col px-6 pb-10 pt-[58px]">
      <header className="flex items-center gap-2">
        <Link href="/" aria-label="Back" className="-ml-1 p-1 text-cocoa">
          <ChevronLeftIcon size={24} />
        </Link>
        <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
          Terms of service
        </p>
      </header>

      <h1 className="mt-4 font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
        The deal, in plain words.
      </h1>
      <p className="mt-2 font-body text-[15px] font-bold leading-[1.55] text-sec2">
        Short version: train hard, be decent, cancel whenever you like. Last updated July 7, 2026.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {SECTIONS.map((s) => (
          <div key={s.title} className="rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
            <p className="font-display text-[16px] font-semibold text-cocoa">{s.title}</p>
            <p className="mt-1.5 font-body text-[14px] font-bold leading-[1.5] text-sec">{s.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center font-body text-[12px] font-bold leading-[1.5] text-faint2">
        Questions? Email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-coral">
          {SUPPORT_EMAIL}
        </a>
        {" · "}
        <Link href="/privacy" className="text-coral">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
