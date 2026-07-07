// Provider registry. The active provider (checkouts) comes from
// PAYMENT_PROVIDER, defaulting to Lemon Squeezy; webhooks resolve providers by
// URL segment so several can coexist during a migration.

import type { PaymentProvider } from "./types";
import { lemonSqueezy } from "./lemonsqueezy";

const providers: Record<string, PaymentProvider> = {
  [lemonSqueezy.id]: lemonSqueezy,
};

export function getProvider(id: string): PaymentProvider | null {
  return providers[id] ?? null;
}

export function activeProvider(): PaymentProvider {
  const id = process.env.PAYMENT_PROVIDER ?? lemonSqueezy.id;
  const provider = providers[id];
  if (!provider) throw new Error(`Unknown PAYMENT_PROVIDER "${id}"`);
  return provider;
}
