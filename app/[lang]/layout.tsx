import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { isLocale, LOCALES, type Locale } from "@/lib/i18n/config";

// latin-ext carries the Turkish glyphs (ğ, ı, İ, ş, and dotless casing).
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin", "latin-ext"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
});

const META: Record<Locale, { title: string; description: string }> = {
  en: { title: "Social XP", description: "Social skills are just reps. 3 minutes a day." },
  tr: {
    title: "Social XP",
    description: "Sosyal beceriler sadece tekrardan ibaret. Günde 3 dakika.",
  },
};

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = META[isLocale(lang) ? lang : "en"];
  return {
    title: meta.title,
    description: meta.description,
    applicationName: "Social XP",
    appleWebApp: { capable: true, title: "Social XP", statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  themeColor: "#FFF6EE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">
        <I18nProvider locale={lang}>{children}</I18nProvider>
      </body>
    </html>
  );
}
