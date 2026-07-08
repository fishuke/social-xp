import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { PremiumToggle } from "./premium-toggle";

export const dynamic = "force-dynamic";

export default async function AdminUsers({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { email: { contains: query, mode: "insensitive" } },
            { id: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      _count: { select: { lessons: true, coachSessions: true } },
      subscriptions: { orderBy: { updatedAt: "desc" }, take: 1 },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <form method="get" className="flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search email or user id…"
          className="w-full max-w-[320px] rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 font-body text-[13px] font-bold text-cocoa outline-none focus:border-coral"
        />
        <button
          type="submit"
          className="rounded-lg bg-cocoa px-4 py-2 font-body text-[13px] font-bold text-white"
        >
          Search
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white">
        <table className="w-full text-left font-body text-[13px]">
          <thead className="border-b border-[#E5E0D8] text-sec2">
            <tr>
              <th className="px-4 py-2.5 font-bold">User</th>
              <th className="px-4 py-2.5 font-bold">Role</th>
              <th className="px-4 py-2.5 font-bold">XP</th>
              <th className="px-4 py-2.5 font-bold">Streak</th>
              <th className="px-4 py-2.5 font-bold">Lessons</th>
              <th className="px-4 py-2.5 font-bold">Coach</th>
              <th className="px-4 py-2.5 font-bold">Subscription</th>
              <th className="px-4 py-2.5 font-bold">Joined</th>
              <th className="px-4 py-2.5 font-bold">Premium</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-5 font-bold text-faint">
                  No users match &quot;{query}&quot;.
                </td>
              </tr>
            )}
            {users.map((u) => {
              const sub = u.subscriptions[0];
              return (
                <tr key={u.id} className="border-b border-[#F1EDE7] last:border-0">
                  <td className="px-4 py-2.5 font-bold text-cocoa">
                    {u.email ? (
                      <>
                        {u.email}
                        {u.emailVerified && <span className="ml-1 text-go" title="verified">✓</span>}
                      </>
                    ) : (
                      <span className="text-faint">anonymous · {u.id.slice(-6)}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">{u.role}</td>
                  <td className="px-4 py-2.5">{u.totalXP}</td>
                  <td className="px-4 py-2.5">{u.streakCount}</td>
                  <td className="px-4 py-2.5">{u._count.lessons}</td>
                  <td className="px-4 py-2.5">{u._count.coachSessions}</td>
                  <td className="px-4 py-2.5">
                    {sub ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          sub.status === "active" || sub.status === "trialing"
                            ? "bg-go-tint text-go-text"
                            : "bg-[#F1EDE7] text-sec2"
                        }`}
                      >
                        {sub.status}
                        {sub.plan ? ` · ${sub.plan}` : ""}
                      </span>
                    ) : (
                      <span className="text-faint">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">{u.createdAt.toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-2.5">
                    <PremiumToggle userId={u.id} isPremium={u.isPremium} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="font-body text-[12px] font-bold text-faint">
        Showing up to 100 users, newest first. The premium toggle is for comping accounts; paid
        access is driven by webhooks.
      </p>
    </div>
  );
}
