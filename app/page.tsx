// Public landing page (full width, outside the phone-frame group). Anyone
// with a session - including anonymous cookie users - goes straight to the
// app; fresh visitors and store reviewers see the pitch.

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { FlameIcon, Logo } from "@/components/icons";

export const dynamic = "force-dynamic";

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
    body: "Chapters climb from surviving small talk to being disliked without dying. One rung at a time.",
  },
  {
    emoji: "💬",
    title: "Judgment-free reps",
    body: "Practice the scary stuff in the app before you take it outside. Nobody's watching you train.",
  },
];

export default async function LandingPage() {
  const user = await getSessionUser();
  if (user) redirect("/learn");

  return (
    <div className="min-h-dvh bg-cream">
      {/* header */}
      <header className="mx-auto flex w-full max-w-[1020px] items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2.5">
          <Logo size={34} />
          <span className="font-display text-[20px] font-semibold text-cocoa">Social XP</span>
        </span>
        <Link
          href="/login"
          className="rounded-full border-2 border-line bg-white px-5 py-2 font-display text-[15px] font-semibold text-cocoa"
        >
          Log in
        </Link>
      </header>

      {/* hero */}
      <section className="mx-auto w-full max-w-[1020px] px-6 pb-16 pt-10 text-center md:pt-16">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-coral px-4 py-1.5 font-body text-[13px] font-extrabold text-coral">
          <FlameIcon size={15} color="#FF5A2C" /> 3 minutes a day
        </span>
        <h1 className="mx-auto mt-5 max-w-[640px] font-display text-[42px] font-semibold leading-[1.1] text-cocoa md:text-[56px]">
          Social confidence is just reps.
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

        {/* fake lesson card */}
        <div className="mx-auto mt-12 w-full max-w-[380px] rounded-[26px] border-2 border-line bg-white p-5 text-left shadow-[0_8px_0_rgba(46,32,24,0.06)]">
          <p className="font-display text-[12px] font-semibold uppercase tracking-[2px] text-coral">
            Chapter 1 · First Contact
          </p>
          <p className="mt-2 font-display text-[19px] font-semibold text-cocoa">
            Someone holds the door for you. What&apos;s the move?
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
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
          <p className="mt-4 text-center font-display text-[14px] font-semibold text-amber-dark">
            +10 XP
          </p>
        </div>
      </section>

      {/* how it works */}
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[36px]">
            One loop. Every day.
          </h2>
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
      <section className="py-16">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[36px]">
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
          <p className="mt-8 text-center font-body text-[14px] font-bold text-sec2">
            Curious about the research?{" "}
            <Link href="/method" className="text-coral underline">
              Read the method
            </Link>
          </p>
        </div>
      </section>

      {/* pricing */}
      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[36px]">
            Free to train. Premium to sprint.
          </h2>
          <div className="mx-auto mt-10 grid max-w-[760px] gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border-2 border-line bg-cream p-7">
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
              <p className="font-body text-[13px] font-bold text-sec2">
                or $39.99/yr (save 52%)
              </p>
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

      {/* footer */}
      <footer className="py-12">
        <div className="mx-auto w-full max-w-[1020px] px-6 text-center">
          <p className="mx-auto max-w-[440px] font-body text-[12px] font-bold leading-[1.5] text-faint2">
            Social XP builds confidence through practice. It&apos;s not therapy or mental-health
            treatment.
          </p>
          <p className="mt-5 font-body text-[13px] font-bold text-sec2">
            <Link href="/method">Method</Link> · <Link href="/terms">Terms</Link> ·{" "}
            <Link href="/privacy">Privacy</Link>
          </p>
          <p className="mt-2 font-body text-[12px] font-bold text-faint">
            © {new Date().getFullYear()} Social XP
          </p>
        </div>
      </footer>
    </div>
  );
}
