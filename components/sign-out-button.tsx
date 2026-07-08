"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions";
import { useT, useLocale } from "@/components/i18n-provider";
import { withLocale } from "@/lib/i18n/routing";

export function SignOutButton() {
  const router = useRouter();
  const t = useT();
  const locale = useLocale();
  return (
    <button
      className="font-display text-[14px] font-semibold text-coral"
      onClick={async () => {
        await logout();
        router.replace(withLocale(locale, "/"));
        router.refresh();
      }}
    >
      {t.you.signOut}
    </button>
  );
}
