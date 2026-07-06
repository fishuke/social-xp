"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="font-display text-[14px] font-semibold text-coral"
      onClick={async () => {
        await logout();
        router.replace("/");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
