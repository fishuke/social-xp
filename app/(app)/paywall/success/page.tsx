// Landing page after the hosted checkout. The webhook flips isPremium, so a
// fast redirect can beat it here - show a "seconds away" state instead of
// pretending something failed.

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage() {
  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  return (
    <div className="page-enter flex flex-1 flex-col items-center justify-center px-6 text-center">
      <span className="text-[64px]">🎉</span>
      <h1 className="mt-4 font-display text-[28px] font-semibold text-cocoa">
        {user.isPremium ? "Welcome to Social XP+" : "Payment received"}
      </h1>
      <p className="mt-2 font-body text-[15px] font-bold text-sec2">
        {user.isPremium
          ? "Every chapter is unlocked. Train in any order, as much as you want."
          : "Your upgrade is seconds away - it unlocks as soon as the payment confirms."}
      </p>
      <Link href="/learn" className="btn btn-coral mt-8 w-full">
        Start training
      </Link>
    </div>
  );
}
