// Lemon Squeezy adapter (merchant of record - docs/BACKLOG.md, "Payments go-live").
// API: JSON:API over https://api.lemonsqueezy.com/v1 with Bearer auth.
// Webhooks: X-Signature header = HMAC-SHA256 hex digest of the raw body.

import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import type { Subscription } from "@prisma/client";
import type { PaymentProvider, PlanId, SubscriptionStatus, WebhookResult } from "./types";

const API = "https://api.lemonsqueezy.com/v1";

function env() {
  return {
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
    storeId: process.env.LEMONSQUEEZY_STORE_ID,
    webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    variants: {
      monthly: process.env.LEMONSQUEEZY_VARIANT_MONTHLY,
      yearly: process.env.LEMONSQUEEZY_VARIANT_YEARLY,
    } satisfies Record<PlanId, string | undefined>,
  };
}

function apiHeaders(apiKey: string) {
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${apiKey}`,
  };
}

// LS statuses → normalized. "unpaid" means dunning is exhausted, so access ends.
const STATUS_MAP: Record<string, SubscriptionStatus> = {
  on_trial: "trialing",
  active: "active",
  past_due: "past_due",
  unpaid: "expired",
  cancelled: "canceled",
  paused: "paused",
  expired: "expired",
};

// Only the fields we consume; the verbatim payload is archived in PaymentEvent.
const subscriptionEventSchema = z.object({
  meta: z.object({
    event_name: z.string(),
    custom_data: z.record(z.string(), z.unknown()).optional(),
  }),
  data: z.object({
    type: z.literal("subscriptions"),
    id: z.string(),
    attributes: z.object({
      status: z.string(),
      customer_id: z.coerce.string().nullish(),
      variant_id: z.coerce.string().nullish(),
      renews_at: z.coerce.date().nullish(),
      ends_at: z.coerce.date().nullish(),
    }),
  }),
});

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const digest = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const given = Buffer.from(signature);
  return digest.length === given.length && timingSafeEqual(digest, given);
}

export const lemonSqueezy: PaymentProvider = {
  id: "lemonsqueezy",

  configured() {
    const { apiKey, storeId, webhookSecret, variants } = env();
    return Boolean(apiKey && storeId && webhookSecret && variants.monthly && variants.yearly);
  },

  async createCheckout({ userId, email, plan, redirectUrl }) {
    const { apiKey, storeId, variants } = env();
    const variantId = variants[plan];
    if (!apiKey || !storeId || !variantId) throw new Error("Lemon Squeezy is not configured");

    const res = await fetch(`${API}/checkouts`, {
      method: "POST",
      headers: apiHeaders(apiKey),
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: { ...(email ? { email } : {}), custom: { user_id: userId } },
            product_options: { redirect_url: redirectUrl, enabled_variants: [Number(variantId)] },
          },
          relationships: {
            store: { data: { type: "stores", id: storeId } },
            variant: { data: { type: "variants", id: variantId } },
          },
        },
      }),
    });
    if (!res.ok) {
      throw new Error(`Lemon Squeezy checkout failed (${res.status}): ${await res.text()}`);
    }
    const url = (await res.json())?.data?.attributes?.url;
    if (typeof url !== "string") throw new Error("Lemon Squeezy checkout response had no URL");
    return { url };
  },

  async manageUrl(subscription: Subscription) {
    const { apiKey } = env();
    if (!apiKey) return null;
    const res = await fetch(`${API}/subscriptions/${subscription.providerSubscriptionId}`, {
      headers: apiHeaders(apiKey),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const url = (await res.json())?.data?.attributes?.urls?.customer_portal;
    return typeof url === "string" ? url : null;
  },

  async parseWebhook(rawBody, headers): Promise<WebhookResult> {
    const { webhookSecret, variants } = env();
    if (!webhookSecret) {
      return { ok: false, status: 500, error: "LEMONSQUEEZY_WEBHOOK_SECRET not configured" };
    }
    const signature = headers.get("x-signature");
    if (!signature || !verifySignature(rawBody, signature, webhookSecret)) {
      return { ok: false, status: 401, error: "Invalid signature" };
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return { ok: false, status: 400, error: "Invalid JSON" };
    }
    const eventName = headers.get("x-event-name") ?? "unknown";

    // Only subscription_* events carry the subscription object. Orders and
    // invoice events are still archived upstream, they just don't gate access.
    const parsed = subscriptionEventSchema.safeParse(payload);
    if (!parsed.success) return { ok: true, eventName, payload };

    const { meta, data } = parsed.data;
    const status = STATUS_MAP[data.attributes.status];
    if (!status) return { ok: true, eventName: meta.event_name, payload };

    const plan = (Object.entries(variants).find(([, id]) => id && id === data.attributes.variant_id)?.[0] ??
      null) as PlanId | null;
    const customUserId = meta.custom_data?.user_id;

    return {
      ok: true,
      eventName: meta.event_name,
      payload,
      update: {
        userId: typeof customUserId === "string" ? customUserId : null,
        providerSubscriptionId: data.id,
        customerId: data.attributes.customer_id ?? null,
        status,
        plan,
        renewsAt: data.attributes.renews_at ?? null,
        endsAt: data.attributes.ends_at ?? null,
      },
    };
  },
};
