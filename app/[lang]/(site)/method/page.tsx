import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { METHOD_SECTIONS } from "@/lib/site-content";
import { isAppVisitor } from "@/lib/site-mode";
import { coerceLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { withLocale } from "@/lib/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const t = getDictionary(coerceLocale((await params).lang));
  return { title: t.method.metaTitle, description: t.method.metaDescription };
}

export default async function MethodPage({ params }: { params: Promise<{ lang: string }> }) {
  const locale = coerceLocale((await params).lang);
  const t = getDictionary(locale);
  const inApp = await isAppVisitor();

  return (
    <ContentPage
      kicker={t.method.kicker}
      title={t.method.title}
      intro={t.method.intro}
      sections={METHOD_SECTIONS[locale]}
      footer={
        <>
          {!inApp && (
            <Link href={withLocale(locale, "/onboarding")} className="btn btn-coral mx-auto max-w-[320px]">
              {t.method.tryFirstLesson}
            </Link>
          )}
          <p className="mt-6 text-center font-body text-[11px] font-bold leading-[1.5] text-faint2">
            {t.method.disclaimer}
          </p>
        </>
      }
    />
  );
}
