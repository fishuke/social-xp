import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { PremiumToggle } from "./premium-toggle";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E5E0D8] bg-white">
      <table className="w-full text-left font-body text-[13px]">
        <thead className="border-b border-[#E5E0D8] text-sec2">
          <tr>
            <th className="px-4 py-2.5 font-bold">User</th>
            <th className="px-4 py-2.5 font-bold">Role</th>
            <th className="px-4 py-2.5 font-bold">XP</th>
            <th className="px-4 py-2.5 font-bold">Streak</th>
            <th className="px-4 py-2.5 font-bold">Shields</th>
            <th className="px-4 py-2.5 font-bold">Joined</th>
            <th className="px-4 py-2.5 font-bold">Premium</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-[#F1EDE7] last:border-0">
              <td className="px-4 py-2.5 font-bold text-cocoa">
                {u.email ?? <span className="text-faint">anonymous · {u.id.slice(-6)}</span>}
              </td>
              <td className="px-4 py-2.5">{u.role}</td>
              <td className="px-4 py-2.5">{u.totalXP}</td>
              <td className="px-4 py-2.5">{u.streakCount}</td>
              <td className="px-4 py-2.5">{u.streakShields}</td>
              <td className="px-4 py-2.5">{u.createdAt.toISOString().slice(0, 10)}</td>
              <td className="px-4 py-2.5">
                <PremiumToggle userId={u.id} isPremium={u.isPremium} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
