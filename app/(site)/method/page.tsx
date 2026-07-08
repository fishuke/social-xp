import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { METHOD_SECTIONS } from "@/lib/site-content";
import { isAppVisitor } from "@/lib/site-mode";

export const metadata: Metadata = {
  title: "The Method · Social XP",
  description:
    "Why Social XP works: Behavioral Skills Training, CBT thought work, graded exposure, and spaced retrieval.",
};

export default async function MethodPage() {
  const inApp = await isAppVisitor();

  return (
    <ContentPage
      kicker="The method"
      title="Not random lessons."
      intro="Every lesson in Social XP is built on methods validated in peer-reviewed research on how people actually learn social skills."
      sections={METHOD_SECTIONS}
      footer={
        <>
          {!inApp && (
            <Link href="/onboarding" className="btn btn-coral mx-auto max-w-[320px]">
              Try the first lesson
            </Link>
          )}
          <p className="mt-6 text-center font-body text-[11px] font-bold leading-[1.5] text-faint2">
            Social XP builds confidence through practice. It&apos;s not therapy or mental-health
            treatment.
          </p>
        </>
      }
    />
  );
}
