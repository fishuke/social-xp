"use client";

// Drop-in <Link> replacement that prefixes internal hrefs with the active locale.
// Use in client components; server components build hrefs with withLocale(lang, ...).

import Link from "next/link";
import type { ComponentProps } from "react";
import { withLocale } from "@/lib/i18n/routing";
import { useLocale } from "./i18n-provider";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function LocaleLink({ href, ...rest }: Props) {
  const locale = useLocale();
  return <Link href={withLocale(locale, href)} {...rest} />;
}
