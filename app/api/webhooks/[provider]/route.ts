// Generic payment-webhook endpoint (/api/webhooks/lemonsqueezy, ...).
// The adapter verifies the signature against the RAW body before anything is
// trusted; every verified payload is archived in PaymentEvent.

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getProvider } from "@/lib/payments";
import { applySubscriptionUpdate } from "@/lib/payments/subscriptions";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
): Promise<Response> {
  const provider = getProvider((await params).provider);
  if (!provider) {
    return Response.json({ error: "Unknown provider" }, { status: 404 });
  }

  const rawBody = await request.text();
  const result = await provider.parseWebhook(rawBody, request.headers);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  await prisma.paymentEvent.create({
    data: {
      provider: provider.id,
      eventName: result.eventName,
      payload: result.payload as Prisma.InputJsonValue,
    },
  });

  const applied = result.update ? await applySubscriptionUpdate(provider.id, result.update) : false;
  return Response.json({ received: true, applied });
}
