"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DiamondIcon, HomeIcon, LockIcon, MicIcon, PersonIcon } from "./icons";

const TABS = [
  { href: "/learn", label: "Learn", Icon: HomeIcon },
  { href: "/quotes", label: "Quotes", Icon: DiamondIcon },
  { href: "/coach", label: "Coach", Icon: MicIcon, locked: true },
  { href: "/you", label: "You", Icon: PersonIcon },
] as const;

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-20 border-t-2 border-line2 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {TABS.map(({ href, label, Icon, ...rest }) => {
          const active =
            pathname.startsWith(href) || (href === "/learn" && pathname.startsWith("/chapters"));
          const color = active ? "#FF5A2C" : "#B8A99C";
          const locked = "locked" in rest && rest.locked;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5"
            >
              <span className={active ? "pop-in" : undefined}>
                {href === "/quotes" ? (
                  <DiamondIcon size={26} color={color} />
                ) : (
                  <Icon size={26} color={color} />
                )}
              </span>
              {locked && !active && (
                <span className="absolute right-[22%] top-1.5">
                  <LockIcon size={12} />
                </span>
              )}
              <span
                className="font-body text-[11px] font-extrabold"
                style={{ color, fontWeight: active ? 800 : 700 }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
