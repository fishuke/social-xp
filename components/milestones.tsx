import type { Achievement, AchievementId } from "@/lib/achievements";
import { BookIcon, DiamondIcon, FlagIcon, MicIcon, PersonIcon } from "@/components/icons";
import { ProgressBar } from "@/components/ui";

const ICONS: Record<AchievementId, (props: { size: number; color?: string }) => React.ReactNode> = {
  firstLesson: FlagIcon,
  risingStar: PersonIcon,
  bookworm: BookIcon,
  quoteCollector: DiamondIcon,
  challenger: MicIcon,
};

export type MilestoneLabels = {
  title: string;
  count: (earned: number, total: number) => string;
  earnedLabel: string;
  nextLabel: string;
  names: Record<AchievementId, { name: string; hint: string }>;
  progress: (current: number, target: number) => string;
};

/** The locked milestone closest to being earned (highest progress ratio, then nearest target). */
function nextMilestoneId(items: Achievement[]): AchievementId | null {
  const locked = items.filter((item) => !item.earned);
  if (locked.length === 0) return null;
  return locked.reduce((best, item) => {
    const ratio = item.current / item.target;
    const bestRatio = best.current / best.target;
    if (ratio !== bestRatio) return ratio > bestRatio ? item : best;
    return item.target < best.target ? item : best;
  }).id;
}

/** Milestone badges on the You tab: earned ones lit, the next one spotlit, the rest dimmed. */
export function Milestones({ items, labels }: { items: Achievement[]; labels: MilestoneLabels }) {
  const earnedCount = items.filter((item) => item.earned).length;
  const nextId = nextMilestoneId(items);
  return (
    <section className="px-5 pt-6">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-sec2">
          {labels.title}
        </p>
        <p className="font-display text-[12px] font-semibold text-faint">
          {labels.count(earnedCount, items.length)}
        </p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = ICONS[item.id];
          const { name, hint } = labels.names[item.id];
          const percent = (item.current / item.target) * 100;
          const isNext = item.id === nextId;
          return (
            <div
              key={item.id}
              className={`rounded-[18px] p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)] ${
                item.earned
                  ? "bg-white"
                  : isNext
                    ? "bg-white ring-2 ring-coral"
                    : "bg-white opacity-70"
              }`}
            >
              {isNext && (
                <p className="mb-1.5 font-display text-[11px] font-semibold uppercase tracking-[1.5px] text-coral">
                  {labels.nextLabel}
                </p>
              )}
              <span
                className="flex h-[42px] w-[42px] items-center justify-center rounded-[13px]"
                style={{
                  background: item.earned
                    ? "linear-gradient(160deg, #FF7A45, #FF5A2C)"
                    : "#F2EAE2",
                }}
              >
                <Icon size={20} color={item.earned ? "#fff" : "#B8A99C"} />
              </span>
              <p className="mt-2.5 font-display text-[14px] font-semibold text-cocoa">{name}</p>
              {item.earned ? (
                <p className="mt-0.5 font-body text-[12px] font-bold text-go-text">
                  {labels.earnedLabel}
                </p>
              ) : (
                <>
                  <p className="mt-0.5 font-body text-[12px] font-bold text-sec2">{hint}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar percent={percent} height={7} className="flex-1" />
                    <span className="font-display text-[11px] font-semibold text-faint">
                      {labels.progress(item.current, item.target)}
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
