"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";

/** Back arrow for content pages in app chrome; falls back to /you on deep links. */
export function BackButton() {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/you");
  }

  return (
    <button onClick={goBack} aria-label="Back" className="-ml-1 p-1 text-cocoa">
      <ChevronLeftIcon size={24} />
    </button>
  );
}
