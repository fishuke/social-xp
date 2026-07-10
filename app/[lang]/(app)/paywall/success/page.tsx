// Landing page after the hosted checkout. The webhook flips isPremium, so a
// fast redirect can beat it here - show a "seconds away" state instead of
// pretending something failed.

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { coerceLocale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = coerceLocale(lang);
  const t = getDictionary(locale);

  const user = await getSessionUser();
  if (!user) redirect(withLocale(locale, "/onboarding"));

  return (
    <div className="page-enter flex flex-1 flex-col items-center justify-center px-6 text-center">
      <span className="text-[64px]">🎉</span>
      <h1 className="mt-4 font-display text-[28px] font-semibold text-cocoa">
        {user.isPremium ? t.paywall.successTitlePremium : t.paywall.successTitlePending}
      </h1>
      <p className="mt-2 font-body text-[15px] font-bold text-sec2">
        {user.isPremium ? t.paywall.successBodyPremium : t.paywall.successBodyPending}
      </p>
      <Link href={withLocale(locale, "/coach")} className="btn btn-coral mt-8 w-full">
        {t.paywall.successCta}
      </Link>
    </div>
  );
}
