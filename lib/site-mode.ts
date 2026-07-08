import { cookies } from "next/headers";

/**
 * True when the visitor already uses the app (anonymous cookie or next-auth
 * session cookie). Cookie presence only - no DB hit - since this merely picks
 * which chrome wraps the shared content pages.
 */
export async function isAppVisitor(): Promise<boolean> {
  const store = await cookies();
  return (
    store.has("sx_uid") ||
    store.has("authjs.session-token") ||
    store.has("__Secure-authjs.session-token")
  );
}
