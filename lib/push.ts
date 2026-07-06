import "server-only";

// Web-push wrapper: VAPID config, subscription storage, and reminder delivery.
// Called by the reminder cron (app/api/cron/reminders) and the subscribe actions.

import webpush from "web-push";
import type { User } from "@prisma/client";
import { prisma } from "./db";
import { effectiveStreak } from "./game";

let configured = false;

function ensureVapid(): void {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY)");
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:hello@social-xp.app", publicKey, privateKey);
  configured = true;
}

// Shape the browser's PushSubscription serializes to.
export type BrowserSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

type SubscriptionRow = { endpoint: string; p256dh: string; auth: string };

export type NotificationPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

export async function saveSubscription(userId: string, sub: BrowserSubscription): Promise<void> {
  await prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    create: { userId, endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    // an endpoint can migrate to a new user (e.g. anonymous → account) - keep it current
    update: { userId, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
  });
}

export async function deleteSubscription(endpoint: string): Promise<void> {
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
}

/** Streak-aware, never-shaming reminder copy. */
export function reminderCopy(user: User): { title: string; body: string } {
  const streak = effectiveStreak(user);
  if (streak >= 1) {
    return {
      title: `Your ${streak}-day streak 🔥`,
      body: `Keep it alive. Today's 3-minute rep is waiting.`,
    };
  }
  return {
    title: "3 minutes today?",
    body: `Your next lesson is ready, ${user.name}. Small rep, big momentum.`,
  };
}

/** Send one payload to every device the user has subscribed. Prunes dead endpoints. Returns count sent. */
export async function sendToUser(userId: string, payload: NotificationPayload): Promise<number> {
  ensureVapid();
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  const body = JSON.stringify(payload);
  let sent = 0;
  await Promise.all(
    subs.map(async (row: SubscriptionRow) => {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          body
        );
        sent++;
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        // 404/410 = subscription gone (unsubscribed / expired) - clean it up.
        if (status === 404 || status === 410) {
          await deleteSubscription(row.endpoint).catch(() => {});
        } else {
          console.error(
            "web-push send failed",
            status ?? (err as Error).message,
            (err as { body?: string }).body ?? ""
          );
        }
      }
    })
  );
  return sent;
}

export async function sendReminder(user: User): Promise<number> {
  const { title, body } = reminderCopy(user);
  return sendToUser(user.id, { title, body, url: "/learn", tag: "daily-reminder" });
}

/**
 * Users due for a reminder in the given local hour ("HH"): they have a subscription,
 * their reminder time falls in this hour, and they haven't trained today yet.
 * NOTE: reminderTime is compared in server time until per-user timezones land
 * (see docs/ROADMAP.md #4).
 */
export async function getUsersDueForReminder(hourHH: string, today: string): Promise<User[]> {
  return prisma.user.findMany({
    where: {
      reminderTime: { startsWith: `${hourHH}:` },
      // "not today" must include users who never trained: Prisma's `not`
      // excludes NULL rows, so match null explicitly.
      OR: [{ lastGoalMetDate: null }, { lastGoalMetDate: { not: today } }],
      pushSubs: { some: {} },
    },
  });
}
