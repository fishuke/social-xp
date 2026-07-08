// Public landing page. Anyone with a session - including anonymous cookie
// users - goes straight to the app; fresh visitors and store reviewers see
// the pitch. Header and footer come from the (site) layout.

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { FlameIcon } from "@/components/icons";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { coerceLocale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(coerceLocale(lang));
  return {
    title: t.landing.metaTitle,
    description: t.landing.metaDescription,
  };
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = coerceLocale(lang);
  const t = getDictionary(locale);

  const user = await getSessionUser();
  if (user) redirect(withLocale(locale, "/learn"));

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-[-160px] h-[480px] w-[720px] -translate-x-1/2 rounded-full opacity-60"
          style={{ background: "radial-gradient(closest-side, #FFE3D2, transparent)" }}
        />
        <div className="relative mx-auto w-full max-w-[1020px] px-6 pb-16 pt-12 text-center md:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-coral px-4 py-1.5 font-body text-[13px] font-extrabold text-coral">
            <FlameIcon size={15} color="#FF5A2C" /> {t.landing.heroChip}
          </span>
          <h1 className="mx-auto mt-5 max-w-[680px] font-display text-[42px] font-semibold leading-[1.08] text-cocoa md:text-[58px]">
            {t.landing.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] font-body text-[17px] font-bold leading-[1.55] text-sec2">
            {t.landing.heroBody}
          </p>
          <div className="mx-auto mt-8 flex max-w-[340px] flex-col gap-3">
            <Link href={withLocale(locale, "/onboarding")} className="btn btn-coral">
              {t.landing.heroCta}
            </Link>
            <p className="font-body text-[13px] font-bold text-faint">
              {t.landing.heroNote}
            </p>
          </div>

          {/* mini app preview */}
          <div className="mx-auto mt-14 w-full max-w-[390px]">
            <div className="rounded-[34px] border-2 border-line bg-white p-4 shadow-[0_12px_0_rgba(46,32,24,0.07)]">
              <div
                className="flex items-center justify-between rounded-[20px] px-4 py-3 text-white"
                style={{ background: "linear-gradient(160deg, #FF7A45, #FF5A2C)" }}
              >
                <span className="flex items-center gap-1.5 font-display text-[14px] font-semibold">
                  <FlameIcon size={15} color="#FFC24A" /> {t.landing.previewStreak}
                </span>
                <span className="font-display text-[14px] font-semibold">{t.landing.previewXp}</span>
              </div>
              <div className="mt-4 px-1 text-left">
                <p className="font-display text-[12px] font-semibold uppercase tracking-[2px] text-coral">
                  {t.landing.previewChapter}
                </p>
                <p className="mt-2 font-display text-[18px] font-semibold text-cocoa">
                  {t.landing.previewQuestion}
                </p>
                <div className="mt-3.5 flex flex-col gap-2.5">
                  <span className="rounded-[14px] border-2 border-line bg-white px-4 py-3 font-body text-[14px] font-bold text-ink">
                    {t.landing.previewOptions[0]}
                  </span>
                  <span className="rounded-[14px] border-2 border-go bg-go-tint px-4 py-3 font-body text-[14px] font-bold text-go-text">
                    {t.landing.previewOptions[1]}
                  </span>
                  <span className="rounded-[14px] border-2 border-line bg-white px-4 py-3 font-body text-[14px] font-bold text-ink">
                    {t.landing.previewOptions[2]}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-[14px] font-semibold text-amber-dark">
                    {t.landing.previewXpChip}
                  </span>
                  <span className="rounded-full bg-go px-5 py-2 font-display text-[14px] font-semibold text-white shadow-[0_3px_0_#3F9E6E]">
                    {t.landing.previewContinue}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* credibility strip */}
          <div className="mx-auto mt-10 flex max-w-[640px] flex-wrap items-center justify-center gap-2.5">
            {t.landing.proofChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border-2 border-line bg-white px-4 py-1.5 font-body text-[12px] font-extrabold text-sec2"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            {t.landing.stepsTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-[460px] text-center font-body text-[15px] font-bold text-sec2">
            {t.landing.stepsSubtitle}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.landing.steps.map((s, i) => (
              <div key={s.title} className="rounded-[22px] bg-cream p-6">
                <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-coral font-display text-[18px] font-semibold text-white">
                  {i + 1}
                </span>
                <p className="mt-4 font-display text-[20px] font-semibold text-cocoa">
                  <span className="mr-2">{s.emoji}</span>
                  {s.title}
                </p>
                <p className="mt-2 font-body text-[15px] font-bold leading-[1.55] text-sec">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            {t.landing.featuresTitle}
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {t.landing.features.map((f) => (
              <div
                key={f.title}
                className="rounded-[22px] border-2 border-line bg-white p-6 shadow-[0_2px_0_rgba(0,0,0,0.04)]"
              >
                <p className="font-display text-[19px] font-semibold text-cocoa">
                  <span className="mr-2">{f.emoji}</span>
                  {f.title}
                </p>
                <p className="mt-2 font-body text-[15px] font-bold leading-[1.55] text-sec">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* science */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-[760px] px-6 text-center">
          <span className="text-[40px]">🔬</span>
          <h2 className="mt-3 font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            {t.landing.scienceTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] font-body text-[16px] font-bold leading-[1.6] text-sec">
            {t.landing.scienceBody}
          </p>
          <Link
            href={withLocale(locale, "/method")}
            className="mt-6 inline-block rounded-full border-2 border-coral px-6 py-2.5 font-display text-[15px] font-semibold text-coral"
          >
            {t.landing.scienceCta}
          </Link>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            {t.landing.pricingTitle}
          </h2>
          <div className="mx-auto mt-10 grid max-w-[760px] gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border-2 border-line bg-white p-7">
              <p className="font-display text-[18px] font-semibold text-cocoa">
                {t.landing.pricing.freeName}
              </p>
              <p className="mt-1 font-display text-[34px] font-semibold text-cocoa">
                {t.landing.pricing.freePrice}
              </p>
              <ul className="mt-4 flex flex-col gap-2 font-body text-[14px] font-bold text-sec">
                {t.landing.pricing.freePerks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
            <div
              className="relative rounded-[24px] border-2 p-7"
              style={{ borderColor: "#FF5A2C", background: "#FFF0E9" }}
            >
              <span className="absolute -top-3 right-5 rounded-full bg-coral px-3 py-1 font-display text-[11px] font-semibold tracking-[1px] text-white">
                {t.landing.pricing.plusBadge}
              </span>
              <p className="font-display text-[18px] font-semibold text-cocoa">
                {t.landing.pricing.plusName}
              </p>
              <p className="mt-1 font-display text-[34px] font-semibold text-cocoa">
                {t.landing.pricing.plusPriceMonthly}
                <span className="text-[16px] text-sec2">{t.landing.pricing.plusPriceUnit}</span>
              </p>
              <p className="font-body text-[13px] font-bold text-sec2">
                {t.landing.pricing.plusPriceYearly}
              </p>
              <ul className="mt-4 flex flex-col gap-2 font-body text-[14px] font-bold text-sec">
                {t.landing.pricing.plusPerks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <Link href={withLocale(locale, "/onboarding")} className="btn btn-coral mt-6">
                {t.landing.pricing.plusCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-[720px] px-6">
          <h2 className="text-center font-display text-[30px] font-semibold text-cocoa md:text-[38px]">
            {t.landing.faqTitle}
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {t.landing.faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-[18px] border-2 border-line bg-cream p-5 open:bg-tint-warm"
              >
                <summary className="cursor-pointer list-none font-display text-[17px] font-semibold text-cocoa">
                  {f.q}
                </summary>
                <p className="mt-2.5 font-body text-[14px] font-bold leading-[1.6] text-sec">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section className="py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1020px] px-6">
          <div
            className="rounded-[30px] px-8 py-12 text-center text-white md:py-16"
            style={{ background: "linear-gradient(160deg, #FF7A45, #FF5A2C)" }}
          >
            <h2 className="font-display text-[30px] font-semibold leading-[1.15] md:text-[38px]">
              {t.landing.finalCtaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-[400px] font-body text-[15px] font-bold text-white/85">
              {t.landing.finalCtaBody}
            </p>
            <Link
              href={withLocale(locale, "/onboarding")}
              className="mt-7 inline-block rounded-[20px] bg-white px-9 py-4 font-display text-[19px] font-semibold text-coral shadow-[0_5px_0_rgba(0,0,0,0.18)]"
            >
              {t.landing.finalCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
