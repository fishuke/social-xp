// Public landing page. Anyone with a session - including anonymous cookie
// users - goes straight to the app; fresh visitors and store reviewers see
// the pitch. Header and footer come from the (site) layout.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { FlameIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Social XP · Social confidence in 3 minutes a day",
  description:
    "Bite-size lessons, real-world challenges, and an AI speaking coach. Train talking to people the way Duolingo trains French.",
};

const PROOF_CHIPS = [
  "Behavioral Skills Training",
  "CBT thought work",
  "Graded exposure",
  "CEFR-graded curriculum",
];

const STEPS = [
  {
    emoji: "📖",
    title: "Learn the move",
    body: "A 3-minute lesson: one social skill, a quiz to lock it in, and a thought-reframe for the anxious voice in your head.",
  },
  {
    emoji: "⚡",
    title: "Do the rep",
    body: "Every lesson ends with a small real-world challenge. Order the coffee. Ask the question. That's where confidence actually grows.",
  },
  {
    emoji: "🎙️",
    title: "Get coached",
    body: "Talk to the AI coach for 60 seconds and get scored on confidence, clarity, energy, and pace, plus one thing to try next.",
  },
];

const FEATURES = [
  {
    emoji: "🧠",
    title: "Built on real science",
    body: "Behavioral Skills Training, CBT thought work, and graded exposure. No vibes, no hacks.",
  },
  {
    emoji: "🔥",
    title: "Streaks that forgive",
    body: "Daily quests, XP, and chests keep you coming back. Streak shields save a missed day.",
  },
  {
    emoji: "🪜",
    title: "A ladder, not a lecture",
    body: "Chapters climb from surviving small talk to disagreeing without dying inside. One rung at a time.",
  },
  {
    emoji: "💬",
    title: "Judgment-free reps",
    body: "Practice the scary stuff in the app before you take it outside. Nobody's watching you train.",
  },
];

const FAQ = [
  {
    q: "Is this therapy?",
    a: "No. Social XP is skills training, like a gym for conversations. It borrows methods that clinicians validated (CBT, exposure), but it isn't therapy, diagnosis, or treatment, and it doesn't replace professional care.",
  },
  {
    q: "How much time does it take?",
    a: "About 3 minutes for the daily lesson, plus one small real-world challenge you do on your own time. Streaks reward showing up, not marathon sessions.",
  },
  {
    q: "Do I need an account?",
    a: "No. You can start training immediately; progress saves on your device. Create a free account later to keep your streak safe across devices.",
  },
  {
    q: "What does Social XP+ add?",
    a: "Every chapter unlocked from day one, unlimited AI coach sessions, and streak repair. Plans start with a 7-day free trial: $6.99/month or $39.99/year.",
  },
  {
    q: "How do I cancel?",
    a: "Any time, in two taps: Manage subscription on your profile opens the billing portal. You keep access until the end of the period you paid for.",
  },
];

export default async function LandingPage() {
  const user = await getSessionUser();
  if (user) redirect("/learn");

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-[-160px] h-[480px] w-[720px] -translate-x-1/2 rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, #FFE3D2, transparent)" }}
        />
        <div className="relative mx-auto w-full max-w-[1020px] px-6 pb-16 pt-12 text-center md:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-coral px-4 py-1.5 font-body text-[13px] font-extrabold text-coral">
            <FlameIcon size={15} color="#FF5A2C" /> 3 minutes a day
          </span>
          <h1 className="mx-auto mt-5 max-w-[680px] font-display text-[42px] font-semibold leading-[1.08] text-cocoa md:text-[58px]">
            Social confidence is just&nbsp;reps.
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] font-body text-[17px] font-bold leading-[1.55] text-sec2">
            Bite-size lessons, real-world challenges, and an AI speaking coach. Train talking to
            people the way Duolingo trains French.
          </p>
          <div className="mx-auto mt-8 flex max-w-[340px] flex-col gap-3">
            <Link href="/onboarding" className="btn btn-coral">
              Start training free
            </Link>
            <p className="font-body text-[13px] font-bold text-faint">
              No signup needed. Your first lesson takes 3 minutes.
            </p>
          </div>

          {/* mini app preview */}
          <div className="mx-auto mt-14 w-full max-w-[390px]">
            <div className="rounded-[34px] border-2 border-line bg-white p-4 shadow-[0_12px_0_rgba(46,32,24,0.07)]">
              <div
                className="flex items-center justify-between rounded-[20px] px-4 py-3 text-white"
                style={{ background: "linear-gradient(160deg, #FF7A45, #FF5A2C)" }}
              >
                <span className="flex items-center gap-1.5 font-display text-[14px] font-semibold">
                  <FlameIcon size={15} color="#FFC24A" /> 12-day streak
                </span>
                <span className="font-display text-[14px] font-semibold">1,240 XP</span>
              </div>
              <div className="mt-4 px-1 text-left">
                <p className="font-display text-[12px] font-semibold uppercase tracking-[2px] text-coral">
                  Chapter 1 · First Contact
                </p>
                <p className="mt-2 font-display text-[18px] font-semibold text-cocoa">
                  Someone holds the door for you. What&apos;s the move?
                </p>
                <div className="mt-3.5 flex flex-col gap-2.5">
                  <span className="rounded-[14px] border-2 border-line bg-white px-4 py-3 font-body text-[14px] font-bold text-ink">
                    Stare at the floor and speed-walk through
                  </span>
                  <span className="rounded-[14px] border-2 border-go bg-go-tint px-4 py-3 font-body text-[14px] font-bold text-go-text">
                    Eye contact, smile, &quot;thanks!&quot; ✓
                  </span>
                  <span className="rounded-[14px] border-2 border-line bg-white px-4 py-3 font-body text-[14px] font-bold text-ink">
                    Apologize for existing
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-[14px] font-semibold text-amber-dark">
                    +10 XP
                  </span>
                  <span className="rounded-full bg-go px-5 py-2 font-display text-[14px] font-semibold text-white shadow-[0_3px_0_#3F9E6E]">
                    Continue
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* credibility strip */}
          <div className="mx-auto mt-10 flex max-w-[640px] flex-wrap items-center justify-center gap-2.5">
            {PROOF_CHIPS.map((chip) => (
              <span
                key={chip}
                className="rounded-full border-2 border-line bg-white px-4 py-1.5 font-body text-[12px] font-extrabold text-sec2"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            One loop. Every day.
          </h2>
          <p className="mx-auto mt-3 max-w-[460px] text-center font-body text-[15px] font-bold text-sec2">
            The same loop language apps use, pointed at the skill that actually changes your life.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-[22px] bg-cream p-6">
                <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-coral font-display text-[18px] font-semibold text-white">
                  {i + 1}
                </span>
                <p className="mt-4 font-display text-[20px] font-semibold text-cocoa">
                  <span className="mr-2">{s.emoji}</span>
                  {s.title}
                </p>
                <p className="mt-2 font-body text-[15px] font-bold leading-[1.55] text-sec">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            Made for the quiet ones.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-[22px] border-2 border-line bg-white p-6 shadow-[0_2px_0_rgba(0,0,0,0.04)]"
              >
                <p className="font-display text-[19px] font-semibold text-cocoa">
                  <span className="mr-2">{f.emoji}</span>
                  {f.title}
                </p>
                <p className="mt-2 font-body text-[15px] font-bold leading-[1.55] text-sec">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* science */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-[760px] px-6 text-center">
          <span className="text-[40px]">🔬</span>
          <h2 className="mt-3 font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            Not random lessons.
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] font-body text-[16px] font-bold leading-[1.6] text-sec">
            Every lesson follows Behavioral Skills Training, the best-validated way to teach social
            skills: see the move, practice it, get feedback, use it in the real world. The
            thought-reframes come straight from CBT. The chapter ladder is graded exposure. The
            quizzes are spaced retrieval.
          </p>
          <Link
            href="/method"
            className="mt-6 inline-block rounded-full border-2 border-coral px-6 py-2.5 font-display text-[15px] font-semibold text-coral"
          >
            Read the full method
          </Link>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            Free to train. Premium to sprint.
          </h2>
          <div className="mx-auto mt-10 grid max-w-[760px] gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border-2 border-line bg-white p-7">
              <p className="font-display text-[18px] font-semibold text-cocoa">Free</p>
              <p className="mt-1 font-display text-[34px] font-semibold text-cocoa">$0</p>
              <ul className="mt-4 flex flex-col gap-2 font-body text-[14px] font-bold text-sec">
                <li>✓ Full lessons, chapter by chapter</li>
                <li>✓ Daily real-world challenges</li>
                <li>✓ Streaks, quests &amp; chests</li>
                <li>✓ 1 AI coach rep per day</li>
              </ul>
            </div>
            <div
              className="relative rounded-[24px] border-2 p-7"
              style={{ borderColor: "#FF5A2C", background: "#FFF0E9" }}
            >
              <span className="absolute -top-3 right-5 rounded-full bg-coral px-3 py-1 font-display text-[11px] font-semibold tracking-[1px] text-white">
                7-DAY FREE TRIAL
              </span>
              <p className="font-display text-[18px] font-semibold text-cocoa">Social XP+</p>
              <p className="mt-1 font-display text-[34px] font-semibold text-cocoa">
                $6.99<span className="text-[16px] text-sec2">/mo</span>
              </p>
              <p className="font-body text-[13px] font-bold text-sec2">or $39.99/yr (save 52%)</p>
              <ul className="mt-4 flex flex-col gap-2 font-body text-[14px] font-bold text-sec">
                <li>✓ All chapters unlocked from day one</li>
                <li>✓ Unlimited AI coach reps</li>
                <li>✓ Streak repair: one slip forgiven</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <Link href="/onboarding" className="btn btn-coral mt-6">
                Try it free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-[720px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            Fair questions.
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-[18px] border-2 border-line bg-cream p-5 open:bg-tint-warm"
              >
                <summary className="cursor-pointer list-none font-display text-[17px] font-semibold text-cocoa">
                  {f.q}
                </summary>
                <p className="mt-2.5 font-body text-[14px] font-bold leading-[1.6] text-sec">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <div
            className="rounded-[30px] px-8 py-12 text-center text-white md:py-16"
            style={{ background: "linear-gradient(160deg, #FF7A45, #FF5A2C)" }}
          >
            <h2 className="font-display text-[30px] font-semibold leading-[1.15] md:text-[38px]">
              Your first rep takes 3 minutes.
            </h2>
            <p className="mx-auto mt-3 max-w-[400px] font-body text-[15px] font-bold text-white/85">
              No signup, no credit card. Just the door-hold scenario and a little XP.
            </p>
            <Link
              href="/onboarding"
              className="mt-7 inline-block rounded-[20px] bg-white px-9 py-4 font-display text-[19px] font-semibold text-coral shadow-[0_5px_0_rgba(0,0,0,0.18)]"
            >
              Start training free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
