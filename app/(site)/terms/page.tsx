import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { LEGAL_UPDATED, SUPPORT_EMAIL, TERMS_SECTIONS } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Terms of Service · Social XP",
  description: "The agreement between you and Social XP.",
};

export default function TermsPage() {
  return (
    <ContentPage
      kicker="Terms of service"
      title="The deal, in plain words."
      intro={`Short version: train hard, be decent, cancel whenever you like. Last updated ${LEGAL_UPDATED}.`}
      sections={TERMS_SECTIONS}
      footer={
        <p className="text-center font-body text-[12px] font-bold leading-[1.5] text-faint2">
          Questions? Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-coral">
            {SUPPORT_EMAIL}
          </a>
          {" · "}
          <Link href="/privacy" className="text-coral">
            Privacy Policy
          </Link>
        </p>
      }
    />
  );
}
