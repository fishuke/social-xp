"use client";

import { usePathname } from "next/navigation";
import { LocaleLink } from "@/components/locale-link";
import { stripLocale } from "@/lib/i18n/routing";
import { useT } from "@/components/i18n-provider";
import { DiamondIcon, HomeIcon, MicIcon, PersonIcon } from "./icons";

export function TabBar() {
  const pathname = stripLocale(usePathname());
  const t = useT();
  const TABS = [
    { href: "/learn", label: t.nav.learn, Icon: HomeIcon },
    { href: "/quotes", label: t.nav.quotes, Icon: DiamondIcon },
    { href: "/coach", label: t.nav.coach, Icon: MicIcon },
    { href: "/you", label: t.nav.you, Icon: PersonIcon },
  ] as const;
  return (
    <nav className="sticky bottom-0 z-20 border-t-2 border-line2 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {TABS.map(({ href, label, Icon }) => {
          const active =
            pathname.startsWith(href) || (href === "/learn" && pathname.startsWith("/chapters"));
          const color = active ? "var(--color-coral)" : "var(--color-faint)";
          return (
            <LocaleLink
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-transform duration-100 active:scale-90"
            >
              <span className={active ? "pop-in" : undefined}>
                <Icon size={26} color={color} />
              </span>
              <span
                className="font-body text-[11px] font-extrabold"
                style={{ color, fontWeight: active ? 800 : 700 }}
              >
                {label}
              </span>
            </LocaleLink>
          );
        })}
      </div>
    </nav>
  );
}
