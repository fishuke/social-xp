// Email-verification landing. The mailed link is a GET, so this lives in a
// route handler; it burns the token and bounces to the You page with a flag.

import { redirect } from "next/navigation";
import { consumeAuthToken } from "@/lib/account";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const user = await consumeAuthToken(token, "verify");
  if (!user) redirect("/you?verified=0");
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: user.emailVerified ?? new Date() },
  });
  redirect("/you?verified=1");
}
