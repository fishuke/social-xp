// Email-verification landing. The mailed link is a GET, so this lives in a
// route handler; it burns the token and bounces to Settings with a flag.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { consumeAuthToken } from "@/lib/account";
import { prisma } from "@/lib/db";
import { coerceLocale, LOCALE_COOKIE } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const user = await consumeAuthToken(token, "verify");
  if (!user) {
    const locale = coerceLocale((await cookies()).get(LOCALE_COOKIE)?.value);
    redirect(`/${locale}/settings?verified=0`);
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: user.emailVerified ?? new Date() },
  });
  redirect(`/${coerceLocale(user.locale)}/settings?verified=1`);
}
