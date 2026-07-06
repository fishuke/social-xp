import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { getSessionUser } from "./session";

/** Admin gate for /admin pages - call at the top of every admin page. */
export async function requireAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/login");
  return user;
}
