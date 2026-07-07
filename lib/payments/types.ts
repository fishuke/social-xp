// Provider-agnostic payment contracts. Each provider (Lemon Squeezy today,
// Stripe/StoreKit later) implements PaymentProvider; the rest of the app only
// touches these types plus the shared apply logic in subscriptions.ts.

import type { Subscription } from "@prisma/client";

export type PlanId = "monthly" | "yearly";

/** Subscription lifecycle, normalized across providers. */
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due" // payment retry window - access stays on
  | "canceled" // won't renew, but paid up until endsAt
  | "paused"
  | "expired";

/** Whether a subscription in this state keeps premium switched on. */
export function grantsPremium(status: string, endsAt: Date | null): boolean {
  if (status === "trialing" || status === "active" || status === "past_due") return true;
  if (status === "canceled") return endsAt === null || endsAt.getTime() > Date.now();
  return false;
}

/** A provider webhook event normalized to the fields we store. */
export type SubscriptionUpdate = {
  /** From checkout custom data; null when the event omits it (then resolved via providerSubscriptionId). */
  userId: string | null;
  providerSubscriptionId: string;
  customerId: string | null;
  status: SubscriptionStatus;
  plan: PlanId | null;
  renewsAt: Date | null;
  endsAt: Date | null;
};

export type WebhookResult =
  /** Signature or payload failure - respond with `status`, change nothing. */
  | { ok: false; status: number; error: string }
  /** Verified. `update` is present only for events that change subscription state. */
  | { ok: true; eventName: string; payload: unknown; update?: SubscriptionUpdate };

export interface PaymentProvider {
  readonly id: string;

  /** False until the provider's env vars are set - callers fall back to the dev mock. */
  configured(): boolean;

  /** Create a hosted-checkout session; the client redirects to the returned URL. */
  createCheckout(input: {
    userId: string;
    email: string | null;
    plan: PlanId;
    redirectUrl: string;
  }): Promise<{ url: string }>;

  /** Fresh customer-portal URL (portal links are signed and expire, so fetch one per click). */
  manageUrl(subscription: Subscription): Promise<string | null>;

  /** Verify a webhook against the RAW body and normalize it. Never throws. */
  parseWebhook(rawBody: string, headers: Headers): Promise<WebhookResult>;
}
