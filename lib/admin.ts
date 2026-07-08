import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { getSessionUser } from "./session";
import { coerceLocale, LOCALE_COOKIE } from "./i18n/config";

/** Admin gate for /admin pages - call at the top of every admin page. */
export async function requireAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    const locale = coerceLocale((await cookies()).get(LOCALE_COOKIE)?.value);
    redirect(`/${locale}/login`);
  }
  return user;
}
