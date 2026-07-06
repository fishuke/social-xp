// Daily-reminder cron. Vercel Cron hits this hourly; we notify users whose
// reminder time falls in the current hour and who haven't trained today.
// Protected by CRON_SECRET (Vercel sends it as `Authorization: Bearer <secret>`).

import { dayString } from "@/lib/game";
import { getUsersDueForReminder, sendReminder } from "@/lib/push";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const hourHH = String(now.getHours()).padStart(2, "0");
  const today = dayString(now);

  const users = await getUsersDueForReminder(hourHH, today);

  let notified = 0;
  let devices = 0;
  for (const user of users) {
    const sent = await sendReminder(user);
    if (sent > 0) notified++;
    devices += sent;
  }

  return Response.json({ hour: hourHH, due: users.length, notified, devices });
}
