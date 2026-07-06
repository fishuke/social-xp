import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { dayString } from "@/lib/game";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-[#E5E0D8] bg-white p-5">
      <p className="font-display text-[30px] font-semibold text-cocoa">{value}</p>
      <p className="mt-1 font-body text-[13px] font-bold text-sec2">{label}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  await requireAdmin();
  const today = dayString();

  const [users, accounts, premium, lessonsTotal, lessonsToday, activeStreaks, latest] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { email: { not: null } } }),
      prisma.user.count({ where: { isPremium: true } }),
      prisma.lessonCompletion.count(),
      prisma.lessonCompletion.count({
        where: { completedAt: { gte: new Date(`${today}T00:00:00`) } },
      }),
      prisma.user.count({ where: { lastGoalMetDate: today } }),
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Users" value={users} />
        <StatCard label="With accounts" value={accounts} />
        <StatCard label="Premium" value={premium} />
        <StatCard label="Lessons done (all time)" value={lessonsTotal} />
        <StatCard label="Lessons today" value={lessonsToday} />
        <StatCard label="Streaks alive today" value={activeStreaks} />
      </div>

      <section>
        <h2 className="mb-3 font-display text-[16px] font-semibold text-cocoa">Newest users</h2>
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
