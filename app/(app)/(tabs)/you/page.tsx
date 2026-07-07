import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { effectiveStreak, getCourseProgress } from "@/lib/game";
import { prisma } from "@/lib/db";
import { DiamondIcon, FlameIcon, LockIcon } from "@/components/icons";
import { SignOutButton } from "@/components/sign-out-button";
import { ReminderSetting } from "@/components/push-reminders";
import { VerifyEmailBanner } from "@/components/verify-email-banner";
import { ManageSubscriptionButton } from "@/components/manage-subscription";

export const dynamic = "force-dynamic";

export default async function YouPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/onboarding");
  const { verified } = await searchParams;

  const [progress, quoteCount, course, subscription] = await Promise.all([
    getCourseProgress(user),
    prisma.collectedQuote.count({ where: { userId: user.id } }),
    prisma.course.findUnique({ where: { id: 1 } }),
    prisma.subscription.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } }),
  ]);
  const streak = effectiveStreak(user);
  const renewDate = subscription?.renewsAt?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endDate = subscription?.endsAt?.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const subscriptionCopy = !subscription
    ? null
    : subscription.status === "trialing"
      ? `Free trial${renewDate ? ` · first charge ${renewDate}` : ""}`
      : subscription.status === "active"
        ? `${subscription.plan === "yearly" ? "Yearly" : "Monthly"} plan${renewDate ? ` · renews ${renewDate}` : ""}`
        : subscription.status === "past_due"
          ? "Payment issue · update your card"
          : subscription.status === "canceled"
            ? `Canceled${endDate ? ` · access until ${endDate}` : ""}`
            : "Not active";

  return (
    <div className="page-enter flex flex-col pb-6">
      <header
        className="rounded-b-[30px] px-6 pb-7 pt-[58px] text-center text-white"
        style={{ background: "linear-gradient(160deg, #FF7A45, #FF5A2C)" }}
      >
        <p className="font-body text-[12px] font-extrabold uppercase tracking-[2px] text-white/85">
          Your total XP
        </p>
        <p className="font-display text-[46px] font-semibold leading-[1.15]">
          {user.totalXP.toLocaleString("en-US")} XP
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="flex items-center gap-1.5 rounded-[12px] bg-white/16 px-3 py-2 font-display text-[14px] font-semibold">
            <FlameIcon size={16} color="#FFC24A" />
            {streak}-day streak
          </span>
          <span className="flex items-center gap-1.5 rounded-[12px] bg-white/16 px-3 py-2 font-display text-[14px] font-semibold">
            ⚡ {user.repsCompleted} challenges
          </span>
          <span className="flex items-center gap-1.5 rounded-[12px] bg-white/16 px-3 py-2 font-display text-[14px] font-semibold">
            <DiamondIcon size={16} color="#FFC24A" />
            {quoteCount} quotes
          </span>
          {user.streakShields > 0 && (
            <span className="flex items-center gap-1.5 rounded-[12px] bg-white/16 px-3 py-2 font-display text-[14px] font-semibold">
              🛡️ {user.streakShields} shield{user.streakShields > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </header>

      <section className="px-5 pt-6">
        <p className="font-display text-[13px] font-semibold uppercase tracking-[2px] text-sec2">
          The road · {course?.title}
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
                      {p.completed.length} of {chapter.lessons.length} lessons
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
                    {user.emailVerified ? "Verified · progress synced" : "Progress synced to your account"}
                  </span>
                </span>
                <SignOutButton />
              </div>
              <div className="mt-3 border-t border-line pt-3">
                <Link href="/account/password" className="font-display text-[13px] font-semibold text-coral">
                  Change password
                </Link>
              </div>
            </div>
            {verified === "1" && user.emailVerified && (
              <div className="mt-3 rounded-[18px] border-2 border-go-border bg-go-tint p-4">
                <p className="font-body text-[13px] font-extrabold text-go-text">
                  Email verified. You&apos;re all set ✅
                </p>
              </div>
            )}
            {!user.emailVerified && <VerifyEmailBanner linkFailed={verified === "0"} />}
          </>
        ) : (
          <Link
            href="/register"
            className="mt-5 flex items-center gap-3 rounded-[18px] border-2 border-coral bg-tint-coral p-4"
          >
            <span className="text-[22px]">💾</span>
            <span className="flex-1">
              <span className="block font-display text-[15px] font-semibold text-cocoa">
                Create an account
              </span>
              <span className="block font-body text-[12px] font-bold text-sec2">
                Keep your streak &amp; XP safe across devices
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
                  Social XP+
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

        <Link
          href="/method"
          className="mt-5 flex items-center gap-3 rounded-[18px] bg-white p-4 shadow-[0_2px_0_rgba(0,0,0,0.04)]"
        >
          <span className="text-[24px]">🧠</span>
          <span className="flex-1">
            <span className="block font-display text-[15px] font-semibold text-cocoa">
              The method behind the lessons
            </span>
            <span className="block font-body text-[12px] font-bold text-sec2">
              Built on peer-reviewed behavioral science
            </span>
          </span>
          <span className="font-display text-[18px] text-faint">→</span>
        </Link>
      </section>
    </div>
  );
}
