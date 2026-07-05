import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { getDaily } from "@/lib/game";
import { CheckIcon, FlameIcon } from "@/components/icons";
import { CountUp } from "@/components/count-up";
import { ShareStreakButton } from "./share-button";
import { MilestoneChest } from "./milestone-chest";

export const dynamic = "force-dynamic";

const CONFETTI = [
  { x: "8%", y: "6%", size: 10, color: "#FFC24A", rotate: 18, round: false },
  { x: "22%", y: "13%", size: 8, color: "#58C08A", rotate: -12, round: true },
  { x: "38%", y: "5%", size: 9, color: "#FF914D", rotate: 32, round: false },
  { x: "58%", y: "10%", size: 12, color: "#ffffff", rotate: -24, round: false },
  { x: "76%", y: "6%", size: 8, color: "#FFC24A", rotate: 12, round: true },
  { x: "90%", y: "14%", size: 10, color: "#58C08A", rotate: -30, round: false },
  { x: "12%", y: "26%", size: 8, color: "#ffffff", rotate: 40, round: true },
  { x: "86%", y: "28%", size: 9, color: "#FF914D", rotate: -18, round: false },
  { x: "5%", y: "44%", size: 10, color: "#FFC24A", rotate: 24, round: false },
  { x: "93%", y: "46%", size: 8, color: "#ffffff", rotate: -36, round: true },
  { x: "18%", y: "58%", size: 9, color: "#58C08A", rotate: 15, round: false },
  { x: "82%", y: "60%", size: 10, color: "#FFC24A", rotate: -22, round: false },
];

export default async function StreakPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  const { n } = await searchParams;
  const streak = Math.max(1, Number(n) || user.streakCount || 1);
  const daily = await getDaily(user.id);

  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  // Epic chest every 7 streak days
  const openedChests: string[] = JSON.parse(user.openedChests || "[]");
  const milestone =
    user.streakCount > 0 &&
    user.streakCount % 7 === 0 &&
    !openedChests.includes(`s${user.streakCount}`)
      ? user.streakCount
      : null;
  const daysToChest = milestone ? 0 : (7 - (streak % 7)) % 7 || 7;

  return (
    <div
      className="relative flex flex-1 flex-col items-center px-6 pb-8 pt-[70px] text-center"
      style={{ background: "linear-gradient(180deg, #3A2416, #7A2E14)" }}
    >
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute"
          style={
            {
              left: c.x,
              top: c.y,
              width: c.size,
              height: c.size,
              background: c.color,
              borderRadius: c.round ? 99 : 2,
              opacity: 0.9,
              "--r": `${c.rotate}deg`,
              animation: `sx-drift ${2.6 + (i % 4) * 0.5}s ease-in-out ${i * 0.18}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}

      <p className="font-display text-[15px] font-semibold uppercase tracking-[2px] text-amber">
        Streak extended
      </p>

      <div className="pop-in relative mt-6">
        <svg width="190" height="206" viewBox="0 0 190 206" aria-hidden className="flame-flicker">
          <defs>
            <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FF5A2C" />
              <stop offset="0.55" stopColor="#FF914D" />
              <stop offset="1" stopColor="#FFC24A" />
            </linearGradient>
          </defs>
          <path
            fill="url(#flame)"
            d="M95 4c6 28 21 44 36 60 16 17 30 34 30 61 0 42-30 75-66 75s-66-33-66-75c0-19 8-33 18-46 3-4 10-2 11 3 1 8 4 15 10 20 1-27 10-52 24-73 6-9 3-17 3-25z"
          />
        </svg>
        <span
          className="pop-in absolute inset-x-0 bottom-[38px] font-display text-[58px] font-bold text-white"
          style={{ animationDelay: "250ms" }}
        >
          {streak}
        </span>
      </div>

      <h1 className="mt-4 font-display text-[32px] font-semibold text-white">
        {streak} day streak!
      </h1>
      <p className="mt-2 max-w-[300px] font-body text-[15px] font-bold leading-[1.5] text-ondark">
        You showed up {streak} {streak === 1 ? "day" : "days straight"}. That&apos;s not luck —
        that&apos;s a habit forming.
      </p>

      <div className="mt-6 flex gap-2.5">
        {days.map((d, i) => {
          const isToday = i === todayIndex;
          const daysAgo = todayIndex - i;
          const done = daysAgo > 0 && daysAgo <= streak - 1;
          return (
            <span key={i} className="flex flex-col items-center gap-1.5">
              <span
                className="pop-in flex h-[34px] w-[34px] items-center justify-center rounded-full"
                style={{
                  animationDelay: `${350 + i * 60}ms`,
                  ...(isToday
                    ? { background: "#FFC24A", boxShadow: "0 0 0 4px rgba(255,194,74,0.25)" }
                    : done
                      ? { background: "#FF914D" }
                      : { background: "rgba(255,255,255,0.14)" }),
                }}
              >
                {isToday ? <FlameIcon size={18} color="#7A2E14" /> : done ? <CheckIcon size={16} /> : null}
              </span>
              <span className="font-body text-[11px] font-extrabold text-ondark/70">{d}</span>
            </span>
          );
        })}
      </div>

      <div className="pop-in mt-6 flex w-full gap-3" style={{ animationDelay: "550ms" }}>
        <div className="flex-1 rounded-[18px] bg-white/12 p-4">
          <p className="font-display text-[28px] font-semibold text-amber">
            +<CountUp to={daily.xpEarnedToday} duration={900} />
          </p>
          <p className="font-body text-[13px] font-bold text-ondark">XP today</p>
        </div>
        <div className="flex-1 rounded-[18px] bg-white/12 p-4">
          <p className="font-display text-[28px] font-semibold text-white">
            {daysToChest === 0 ? "🎁" : daysToChest}
          </p>
          <p className="font-body text-[13px] font-bold text-ondark">
            {daysToChest === 0 ? "chest day!" : daysToChest === 1 ? "day to a chest" : "days to a chest"}
          </p>
        </div>
      </div>

      {milestone && <MilestoneChest milestone={milestone} />}

      <div className="mt-auto flex w-full flex-col gap-2 pt-8">
        <Link href="/learn" className="btn btn-amber">
          Keep it going
        </Link>
        <ShareStreakButton streak={streak} />
      </div>
    </div>
  );
}
