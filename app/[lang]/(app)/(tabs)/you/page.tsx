import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { effectiveStreak, getCourseProgress } from "@/lib/game";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { coerceLocale, INTL_LOCALE } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { DiamondIcon, FlameIcon, LockIcon } from "@/components/icons";
import { SignOutButton } from "@/components/sign-out-button";
import { ReminderSetting } from "@/components/push-reminders";
import { VerifyEmailBanner } from "@/components/verify-email-banner";
import { ManageSubscriptionButton } from "@/components/manage-subscription";
import { LanguageSwitcher } from "@/components/language-switcher";

export const dynamic = "force-dynamic";

export default async function YouPage({
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

  const [progress, quoteCount, course, subscription] = await Promise.all([
    getCourseProgress(user),
    prisma.collectedQuote.count({ where: { userId: user.id } }),
    prisma.course.findUnique({ where: { id: 1 } }),
    prisma.subscription.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } }),
  ]);
  const streak = effectiveStreak(user);
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
      <header
        className="rounded-b-[30px] px-6 pb-7 pt-[58px] text-center text-white"
        style={{ background: "linear-gradient(160deg, #FF7A45, #FF5A2C)" }}
      >
        <p className="font-body text-[12px] font-extrabold uppercase tracking-[2px] text-white/85">
          {t.you.totalXp}
        </p>
        <p className="font-display text-[46px] font-semibold leading-[1.15]">
          {t.you.totalXpValue(user.totalXP.toLocaleString(INTL_LOCALE[locale]))}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="flex items-center gap-1.5 rounded-[12px] bg-white/16 px-3 py-2 font-display text-[14px] font-semibold">
            <FlameIcon size={16} color="#FFC24A" />
            {t.you.dayStreak(streak)}
          </span>
          <span className="flex items-center gap-1.5 rounded-[12px] bg-white/16 px-3 py-2 font-display text-[14px] font-semibold">
            {t.you.challengesCount(user.repsCompleted)}
          </span>
          <span className="flex items-center gap-1.5 rounded-[12px] bg-white/16 px-3 py-2 font-display text-[14px] font-semibold">
            <DiamondIcon size={16} color="#FFC24A" />
            {t.you.quotesCount(quoteCount)}
          </span>
          {user.streakShields > 0 && (
            <span className="flex items-center gap-1.5 rounded-[12px] bg-white/16 px-3 py-2 font-display text-[14px] font-semibold">
              {t.you.shieldsCount(user.streakShields)}
            </span>
          )}
        </div>
      </header>

      <section className="px-5 pt-6">
        <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-sec2">
          {t.you.roadTitle(course?.title)}
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {progress.map((p) => {
            const chapter = p.unit;
            const active = p.unlocked && !p.complete;
            const percent = (p.completed.length / chapter.lessons.length) * 100;

            if (!p.unlocked) {
              return (
                <div
                  key={chapter.number}
                  className="flex items-center gap-4 rounded-[22px] bg-white p-4 opacity-75"
                >
                  <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-line font-display text-[20px] font-semibold text-muted">
                    {chapter.number}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-[16px] font-semibold text-muted">
                      {chapter.title}
                    </span>
                    <span className="block font-body text-[12px] font-bold text-faint">
                      {chapter.tagline}
                    </span>
                  </span>
                  <LockIcon size={20} />
                </div>
              );
            }

            return (
              <div
                key={chapter.number}
                className="rounded-[22px] bg-white p-4"
                style={active ? { border: "2px solid #FF5A2C" } : undefined}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] font-display text-[20px] font-semibold text-white"
                    style={{
                      background: p.complete
                        ? "#58C08A"
                        : "linear-gradient(160deg, #FF7A45, #FF5A2C)",
                    }}
                  >
                    {chapter.number}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-[16px] font-semibold text-cocoa">
                      {chapter.title}
                    </span>
                    <span className="block font-body text-[12px] font-bold text-sec2">
                      {t.you.lessonsOfTotal(p.completed.length, chapter.lessons.length)}
                    </span>
                  </span>
                </div>
                <div className="mt-3 h-[11px] overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percent}%`,
                      background: "linear-gradient(90deg, #FFC24A, #FF914D)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {user.email ? (
          <>
            <div className="mt-5 rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
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
            className="mt-5 flex items-center gap-3 rounded-[18px] border-2 border-coral bg-tint-coral p-4"
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
