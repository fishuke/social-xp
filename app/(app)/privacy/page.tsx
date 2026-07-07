import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Privacy Policy · Social XP",
  description: "What Social XP collects, why, and the choices you have.",
};

// TODO: switch to the real support address once the production domain lands
// (docs/ROADMAP.md item 5).
const SUPPORT_EMAIL = "support@social-xp.app";

const SECTIONS = [
  {
    title: "What we collect",
    body: `Your progress: XP, streaks, completed lessons, quiz results, saved quotes, and how a lesson felt. If you create an account, also your email address and a securely hashed password. During onboarding we ask for your goal, pace, and timezone so daily resets happen on your calendar day. Everything works without an account; progress is then tied to an anonymous ID stored in a cookie on your device.`,
  },
  {
    title: "Voice recordings",
    body: `Coach recordings are sent to Google's Gemini API for analysis and are not stored by us. We keep only the written transcript and the scores so you can see your progress. Don't say anything in a rep you wouldn't want written down.`,
  },
  {
    title: "Payments",
    body: `Subscriptions are sold through Lemon Squeezy, our merchant of record. They are the legal seller and handle your payment details; we never see your card number. We store your subscription status (plan, renewal date) to unlock premium features.`,
  },
  {
    title: "Notifications",
    body: `If you turn on daily reminders, we store a push subscription for your browser or device. Turn it off any time on the You page, or revoke the permission in your browser.`,
  },
  {
    title: "Cookies",
    body: `We use cookies only to keep you signed in and to remember anonymous progress. No advertising cookies, no third-party trackers, no selling data. Ever.`,
  },
  {
    title: "Who processes data for us",
    body: `Vercel (hosting), Neon (database), Resend (transactional email like password resets), Google Gemini (voice analysis), and Lemon Squeezy (payments). Each receives only what it needs to do its job.`,
  },
  {
    title: "Your choices",
    body: `You can use Social XP without an account, opt out of reminders, and cancel your subscription any time. To access or delete your data, email ${SUPPORT_EMAIL} and we'll handle it within 30 days.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="page-enter flex flex-1 flex-col px-6 pb-10 pt-[58px]">
      <header className="flex items-center gap-2">
        <Link href="/" aria-label="Back" className="-ml-1 p-1 text-cocoa">
          <ChevronLeftIcon size={24} />
        </Link>
        <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
          Privacy policy
        </p>
      </header>

      <h1 className="mt-4 font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
        Your reps stay yours.
      </h1>
      <p className="mt-2 font-body text-[15px] font-bold leading-[1.55] text-sec2">
        Social XP collects the minimum needed to run your training. Here&apos;s the whole picture,
        in plain language. Last updated July 7, 2026.
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
        <Link href="/terms" className="text-coral">
          Terms of Service
        </Link>
      </p>
    </div>
  );
}
