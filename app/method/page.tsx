import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";

const METHODS = [
  {
    emoji: "🔁",
    title: "Behavioral Skills Training",
    body: "The best-validated way to teach social skills: instruction → modeling → rehearsal → feedback. It's why every lesson shows you the move, quizzes you on it, then sends you out to try it for real.",
  },
  {
    emoji: "🌍",
    title: "Real-world reps",
    body: "Decades of CBT research agree: practice between sessions is what actually changes behavior. The daily rep isn't a bonus — it's the whole point. The lesson just loads the move.",
  },
  {
    emoji: "📶",
    title: "Graded courage",
    body: "Confidence is built like exposure therapy builds it — starting small, stepping up gradually, and collecting evidence that the scary thing was survivable. Levels A1 → A2 → B1 follow that ladder.",
  },
  {
    emoji: "🧩",
    title: "Spaced practice & retrieval",
    body: "Quizzes make you retrieve, not re-read — the single most reliable memory effect in learning science. Streaks and daily quests apply habit research: small, visible, daily beats big and rare.",
  },
];

export default function MethodPage() {
  return (
    <div className="page-enter flex flex-1 flex-col px-6 pb-10 pt-[58px]">
      <header className="flex items-center gap-2">
        <Link href="/you" aria-label="Back" className="-ml-1 p-1 text-cocoa">
          <ChevronLeftIcon size={24} />
        </Link>
        <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
          The method
        </p>
      </header>

      <h1 className="mt-4 font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
        Not random lessons.
      </h1>
      <p className="mt-2 font-body text-[15px] font-bold leading-[1.55] text-sec2">
        Every lesson in Social XP is built on methods validated in peer-reviewed research on how
        people actually learn social skills.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {METHODS.map((m) => (
          <div key={m.title} className="rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
            <p className="font-display text-[16px] font-semibold text-cocoa">
              <span className="mr-2">{m.emoji}</span>
              {m.title}
            </p>
            <p className="mt-1.5 font-body text-[14px] font-bold leading-[1.5] text-sec">{m.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[18px] bg-tint-warm p-4">
        <p className="font-body text-[14px] font-bold leading-[1.5]" style={{ color: "#7A5A3E" }}>
          We&apos;re building an expert board of psychologists and social scientists to review every
          unit — and we re-tune lessons continuously from real learner results.
        </p>
      </div>

      <p className="mt-6 text-center font-body text-[11px] font-bold leading-[1.5] text-faint2">
        Social XP builds confidence through practice. It&apos;s not therapy or mental-health
        treatment.
      </p>
    </div>
  );
}
