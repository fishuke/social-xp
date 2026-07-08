import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { coerceLocale, INTL_LOCALE } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { BackButton } from "@/components/back-button";
import { SignOutButton } from "@/components/sign-out-button";
import { ReminderSetting } from "@/components/push-reminders";
import { VerifyEmailBanner } from "@/components/verify-email-banner";
import { ManageSubscriptionButton } from "@/components/manage-subscription";
import { LanguageSwitcher } from "@/components/language-switcher";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ verified?: string }>;
}) {
  const { lang } = await params;
  const locale = coerceLocale(lang);
  const t = getDictionary(locale);
  const user = await getSessionUser();
  if (!user) redirect(withLocale(locale, "/onboarding"));
  const { verified } = await searchParams;

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  const renewDate = subscription?.renewsAt?.toLocaleDateString(INTL_LOCALE[locale], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endDate = subscription?.endsAt?.toLocaleDateString(INTL_LOCALE[locale], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const subscriptionCopy = !subscription
    ? null
    : subscription.status === "trialing"
      ? t.you.subTrial(renewDate)
      : subscription.status === "active"
        ? t.you.subActive(subscription.plan === "yearly" ? "yearly" : "monthly", renewDate)
        : subscription.status === "past_due"
          ? t.you.subPastDue
          : subscription.status === "canceled"
            ? t.you.subCanceled(endDate)
            : t.you.subNotActive;

  return (
    <div className="page-enter flex flex-col pb-6">
      <div className="flex items-center gap-2 px-5 pt-[58px]">
        <BackButton />
        <h1 className="font-display text-[20px] font-semibold text-cocoa">{t.settings.title}</h1>
      </div>

      <section className="px-5 pt-5">
        {user.email ? (
          <>
            <div className="rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3">
                <span className="text-[22px]">👤</span>
                <span className="flex-1">
                  <span className="block font-display text-[15px] font-semibold text-cocoa">
                    {user.email}
                  </span>
                  <span className="block font-body text-[12px] font-bold text-sec2">
                    {user.emailVerified ? t.you.verifiedSynced : t.you.progressSynced}
                  </span>
                </span>
                <SignOutButton />
              </div>
              <div className="mt-3 border-t border-line pt-3">
                <Link href={withLocale(locale, "/account/password")} className="font-display text-[13px] font-semibold text-coral">
                  {t.you.changePassword}
                </Link>
              </div>
            </div>
            {verified === "1" && user.emailVerified && (
              <div className="mt-3 rounded-[18px] border-2 border-go-border bg-go-tint p-4">
                <p className="font-body text-[13px] font-extrabold text-go-text">
                  {t.you.emailVerifiedBanner}
                </p>
              </div>
            )}
            {!user.emailVerified && <VerifyEmailBanner linkFailed={verified === "0"} />}
          </>
        ) : (
          <Link
            href={withLocale(locale, "/register")}
            className="flex items-center gap-3 rounded-[18px] border-2 border-coral bg-tint-coral p-4"
          >
            <span className="text-[22px]">💾</span>
            <span className="flex-1">
              <span className="block font-display text-[15px] font-semibold text-cocoa">
                {t.you.createAccountTitle}
              </span>
              <span className="block font-body text-[12px] font-bold text-sec2">
                {t.you.createAccountSub}
              </span>
            </span>
            <span className="font-display text-[18px] text-coral">→</span>
          </Link>
        )}

        {subscription && (
          <div className="mt-5 rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <span className="text-[22px]">⭐️</span>
              <span className="flex-1">
                <span className="block font-display text-[15px] font-semibold text-cocoa">
                  {t.you.plusName}
                </span>
                <span className="block font-body text-[12px] font-bold text-sec2">
                  {subscriptionCopy}
                </span>
              </span>
              <ManageSubscriptionButton />
            </div>
          </div>
        )}

        <ReminderSetting />

        <LanguageSwitcher />

        <Link
          href={withLocale(locale, "/method")}
          className="mt-5 flex items-center gap-3 rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]"
        >
          <span className="text-[24px]">🧠</span>
          <span className="flex-1">
            <span className="block font-display text-[15px] font-semibold text-cocoa">
              {t.you.methodCardTitle}
            </span>
            <span className="block font-body text-[12px] font-bold text-sec2">
              {t.you.methodCardSub}
            </span>
          </span>
          <span className="font-display text-[18px] text-faint">→</span>
        </Link>

        <p className="mt-6 text-center font-body text-[12px] font-bold text-faint2">
          <Link href={withLocale(locale, "/terms")}>{t.common.terms}</Link> ·{" "}
          <Link href={withLocale(locale, "/privacy")}>{t.common.privacy}</Link>
        </p>
      </section>
    </div>
  );
}
