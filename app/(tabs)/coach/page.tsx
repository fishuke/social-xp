import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { LockIcon, MicIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

// V2 feature — MVP ships the locked state only.
export default async function CoachPage() {
  const user = await getSessionUser();
  if (!user) redirect("/onboarding");

  return (
    <div className="page-enter flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
      <div className="relative flex h-[110px] w-[110px] items-center justify-center rounded-full bg-white shadow-[0_4px_0_rgba(0,0,0,0.05)]">
        <MicIcon size={48} color="#B8A99C" />
        <span className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-amber shadow-[0_3px_0_#D89E2E]">
          <LockIcon size={18} color="#2E2018" />
        </span>
      </div>
      <p className="mt-6 font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral">
        AI Coach · coming in v2
      </p>
      <h1 className="mt-2 font-display text-[30px] font-semibold leading-[1.15] text-cocoa">
        Practice out loud.
        <br />
        Get real feedback.
      </h1>
      <p className="mt-3 max-w-[300px] font-body text-[16px] font-bold leading-[1.5] text-sec2">
        Daily speaking prompts, a 30-second rep, and a coach that scores your confidence, clarity
        and energy — encouraging first, actionable always.
      </p>
      <div className="mt-8 w-full max-w-[320px]">
        <Link href="/paywall" className="btn btn-coral">
          Get Social XP+
        </Link>
      </div>
      <p className="mt-3 font-body text-[13px] font-bold text-faint">
        Members get the coach the day it lands.
      </p>
    </div>
  );
}
