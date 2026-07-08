import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { dayString } from "@/lib/game";

export const dynamic = "force-dynamic";

const PLAN_MONTHLY = 6.99;
const PLAN_YEARLY = 39.99;

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[#E5E0D8] bg-white p-5">
      <p className="font-display text-[30px] font-semibold text-cocoa">{value}</p>
      <p className="mt-1 font-body text-[13px] font-bold text-sec2">{label}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 font-display text-[16px] font-semibold text-cocoa">{children}</h2>;
}

/** Trailing N calendar days (UTC), oldest first, as empty chart buckets. */
function emptyDayBuckets(count: number): { date: string; count: number }[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(now - (count - 1 - i) * 86400_000).toISOString().slice(0, 10),
    count: 0,
  }));
}

export default async function AdminDashboard() {
  await requireAdmin();
  const today = dayString();
  const days = emptyDayBuckets(14);
  const since = new Date(`${days[0].date}T00:00:00`);

  const [
    users,
    accounts,
    premium,
    lessonsToday,
    activeStreaks,
    coachToday,
    recentCompletions,
    feelGroups,
    subscriptions,
    paymentEvents,
    latest,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { email: { not: null } } }),
    prisma.user.count({ where: { isPremium: true } }),
    prisma.lessonCompletion.count({
      where: { completedAt: { gte: new Date(`${today}T00:00:00`) } },
    }),
    prisma.user.count({ where: { lastGoalMetDate: today } }),
    prisma.coachSession.count({ where: { date: today } }),
    prisma.lessonCompletion.findMany({
      where: { completedAt: { gte: since } },
      select: { completedAt: true },
    }),
    prisma.lessonCompletion.groupBy({ by: ["chapterId", "feel"], _count: { _all: true } }),
    prisma.subscription.findMany(),
    prisma.paymentEvent.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  // ----- 14-day activity, bucketed by day -----
  for (const c of recentCompletions) {
    const key = c.completedAt.toISOString().slice(0, 10);
    const bucket = days.find((d) => d.date === key);
    if (bucket) bucket.count++;
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  // ----- feel log per unit -----
  const feelByUnit = new Map<number, { crushed: number; gotIt: number; shaky: number }>();
  for (const g of feelGroups) {
    const row = feelByUnit.get(g.chapterId) ?? { crushed: 0, gotIt: 0, shaky: 0 };
    if (g.feel === "crushed") row.crushed += g._count._all;
    if (g.feel === "got-it") row.gotIt += g._count._all;
    if (g.feel === "shaky") row.shaky += g._count._all;
    feelByUnit.set(g.chapterId, row);
  }
  const feelRows = [...feelByUnit.entries()].sort(([a], [b]) => a - b);

  // ----- revenue -----
  const active = subscriptions.filter((s) => s.status === "active");
  const trialing = subscriptions.filter((s) => s.status === "trialing");
  const churned = subscriptions.filter((s) => s.status === "canceled" || s.status === "expired");
  const mrr =
    active.filter((s) => s.plan === "monthly").length * PLAN_MONTHLY +
    (active.filter((s) => s.plan === "yearly").length * PLAN_YEARLY) / 12;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Users" value={users} />
        <StatCard label="With accounts" value={accounts} />
        <StatCard label="Premium" value={premium} />
        <StatCard label="Lessons today" value={lessonsToday} />
        <StatCard label="Streaks alive today" value={activeStreaks} />
        <StatCard label="Coach reps today" value={coachToday} />
      </div>

      <section>
        <SectionTitle>Lessons completed · last 14 days</SectionTitle>
        <div className="rounded-xl border border-[#E5E0D8] bg-white p-5">
          <div className="flex h-28 items-end gap-1.5">
            {days.map((d) => (
              <div key={d.date} className="group relative flex-1">
                <div
                  className="w-full rounded-t-[4px] bg-coral/80 transition-colors group-hover:bg-coral"
                  style={{ height: `${Math.max(3, (d.count / maxDay) * 100)}%` }}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-cocoa px-1.5 py-0.5 font-body text-[11px] font-bold text-white opacity-0 group-hover:opacity-100">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between font-body text-[11px] font-bold text-faint">
            <span>{days[0].date.slice(5)}</span>
            <span>{days[days.length - 1].date.slice(5)}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <SectionTitle>Revenue</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Est. MRR" value={`$${mrr.toFixed(2)}`} />
            <StatCard label="Active subs" value={active.length} />
            <StatCard label="In trial" value={trialing.length} />
            <StatCard label="Canceled / expired" value={churned.length} />
          </div>
          <div className="mt-4 rounded-xl border border-[#E5E0D8] bg-white">
            <p className="border-b border-[#E5E0D8] px-4 py-2.5 font-body text-[12px] font-bold text-sec2">
              Latest payment events
            </p>
            {paymentEvents.length === 0 ? (
              <p className="px-4 py-4 font-body text-[13px] font-bold text-faint">
                No payment events yet. They appear once the Lemon Squeezy webhook is live.
              </p>
            ) : (
              paymentEvents.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between border-b border-[#F1EDE7] px-4 py-2 last:border-0"
                >
                  <span className="font-body text-[13px] font-bold text-cocoa">{e.eventName}</span>
                  <span className="font-body text-[12px] font-bold text-faint">
                    {e.createdAt.toISOString().replace("T", " ").slice(0, 16)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <SectionTitle>How lessons feel · by unit</SectionTitle>
          <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white">
            <table className="w-full text-left font-body text-[13px]">
              <thead className="border-b border-[#E5E0D8] text-sec2">
                <tr>
                  <th className="px-4 py-2.5 font-bold">Unit</th>
                  <th className="px-4 py-2.5 font-bold">😤 Crushed</th>
                  <th className="px-4 py-2.5 font-bold">🙂 Got it</th>
                  <th className="px-4 py-2.5 font-bold">😬 Shaky</th>
                </tr>
              </thead>
              <tbody>
                {feelRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 font-bold text-faint">
                      No feel data yet.
                    </td>
                  </tr>
                )}
                {feelRows.map(([unitId, f]) => {
                  const total = f.crushed + f.gotIt + f.shaky;
                  const shakyPct = total ? Math.round((f.shaky / total) * 100) : 0;
                  return (
                    <tr key={unitId} className="border-b border-[#F1EDE7] last:border-0">
                      <td className="px-4 py-2.5 font-bold text-cocoa">Unit {unitId}</td>
                      <td className="px-4 py-2.5">{f.crushed}</td>
                      <td className="px-4 py-2.5">{f.gotIt}</td>
                      <td className="px-4 py-2.5">
                        {f.shaky}{" "}
                        {total > 0 && (
                          <span
                            className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              shakyPct >= 30 ? "bg-[#FDE8E4] text-[#C03A1B]" : "bg-[#F1EDE7] text-sec2"
                            }`}
                          >
                            {shakyPct}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 font-body text-[12px] font-bold text-faint">
            Shaky ≥ 30% means the unit probably needs a rewrite.
          </p>
        </section>
      </div>

      <section>
        <SectionTitle>Newest users</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white">
          <table className="w-full text-left font-body text-[13px]">
            <thead className="border-b border-[#E5E0D8] text-sec2">
              <tr>
                <th className="px-4 py-2.5 font-bold">User</th>
                <th className="px-4 py-2.5 font-bold">XP</th>
                <th className="px-4 py-2.5 font-bold">Streak</th>
                <th className="px-4 py-2.5 font-bold">Pace</th>
                <th className="px-4 py-2.5 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {latest.map((u) => (
                <tr key={u.id} className="border-b border-[#F1EDE7] last:border-0">
                  <td className="px-4 py-2.5 font-bold text-cocoa">
                    {u.email ?? <span className="text-faint">anonymous · {u.id.slice(-6)}</span>}
                  </td>
                  <td className="px-4 py-2.5">{u.totalXP}</td>
                  <td className="px-4 py-2.5">{u.streakCount}</td>
                  <td className="px-4 py-2.5">{u.pace}</td>
                  <td className="px-4 py-2.5">{u.createdAt.toISOString().slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
