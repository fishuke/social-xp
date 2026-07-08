import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { LEGAL_UPDATED, PRIVACY_SECTIONS, SUPPORT_EMAIL } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Privacy Policy · Social XP",
  description: "What Social XP collects, why, and the choices you have.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      kicker="Privacy policy"
      title="Your reps stay yours."
      intro={`Social XP collects the minimum needed to run your training. Here's the whole picture, in plain language. Last updated ${LEGAL_UPDATED}.`}
      sections={PRIVACY_SECTIONS}
      footer={
        <p className="text-center font-body text-[12px] font-bold leading-[1.5] text-faint2">
          Questions? Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-coral">
            {SUPPORT_EMAIL}
          </a>
          {" · "}
          <Link href="/terms" className="text-coral">
            Terms of Service
          </Link>
        </p>
      }
    />
  );
}
