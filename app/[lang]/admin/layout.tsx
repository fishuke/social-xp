import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { coerceLocale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  await requireAdmin(); // every page re-checks too - this is just the first wall
  const locale = coerceLocale((await params).lang);

  return (
    <div className="min-h-dvh bg-[#F7F5F2]">
      <header className="border-b border-[#E5E0D8] bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
          <Link href={withLocale(locale, "/admin")} className="font-display text-[17px] font-semibold text-cocoa">
            Convozy <span className="text-coral">Admin</span>
          </Link>
          <nav className="flex gap-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={withLocale(locale, item.href)}
                className="font-body text-[14px] font-bold text-sec2 hover:text-cocoa"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href={withLocale(locale, "/learn")} className="ml-auto font-body text-[13px] font-bold text-faint hover:text-sec2">
            ← Back to app
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
