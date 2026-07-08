import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { LEGAL_UPDATED, SUPPORT_EMAIL, TERMS_SECTIONS } from "@/lib/site-content";
import { coerceLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { withLocale } from "@/lib/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const t = getDictionary(coerceLocale((await params).lang));
  return { title: t.legal.termsMetaTitle, description: t.legal.termsMetaDescription };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = coerceLocale((await params).lang);
  const t = getDictionary(locale);
  return (
    <ContentPage
      kicker={t.legal.termsKicker}
      title={t.legal.termsTitle}
      intro={t.legal.termsIntro(LEGAL_UPDATED[locale])}
      sections={TERMS_SECTIONS[locale]}
      footer={
        <p className="text-center font-body text-[12px] font-bold leading-[1.5] text-faint2">
          {t.legal.questionsEmail}{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-coral">
            {SUPPORT_EMAIL}
          </a>
          {" · "}
          <Link href={withLocale(locale, "/privacy")} className="text-coral">
            {t.legal.privacyPolicy}
          </Link>
        </p>
      }
    />
  );
}
