// The single place where normalized subscription events turn into premium
// access: upsert the Subscription row, then recompute User.isPremium.

import { prisma } from "../db";
import { grantsPremium, type SubscriptionUpdate } from "./types";

export async function applySubscriptionUpdate(
  provider: string,
  update: SubscriptionUpdate,
): Promise<boolean> {
  const where = {
    provider_providerSubscriptionId: {
      provider,
      providerSubscriptionId: update.providerSubscriptionId,
    },
  };

  // Checkout custom data carries the user id on the first events; renewals and
  // cancellations may omit it - fall back to the row we already stored.
  const existing = await prisma.subscription.findUnique({ where });
  const userId = update.userId ?? existing?.userId;
  if (!userId) return false;
  if (!(await prisma.user.findUnique({ where: { id: userId } }))) return false;

  const data = {
    status: update.status,
    plan: update.plan ?? existing?.plan ?? null,
    customerId: update.customerId ?? existing?.customerId ?? null,
    renewsAt: update.renewsAt,
    endsAt: update.endsAt,
  };
  await prisma.subscription.upsert({
    where,
    create: { userId, provider, providerSubscriptionId: update.providerSubscriptionId, ...data },
    update: data,
  });

  // Premium if ANY of the user's subscriptions still grants it - this keeps a
  // stray late event for an old, replaced subscription from revoking access.
  const subscriptions = await prisma.subscription.findMany({ where: { userId } });
  const isPremium = subscriptions.some((s) => grantsPremium(s.status, s.endsAt));
  await prisma.user.update({ where: { id: userId }, data: { isPremium } });
  return true;
}
