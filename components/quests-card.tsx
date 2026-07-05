"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { haptic, sfx } from "@/lib/juice";
import { CheckIcon, ChestIcon } from "./icons";
import { ChestOverlay } from "./chest-overlay";
import type { ChestResult, QuestState } from "@/lib/game";

function QuestRow({
  label,
  done,
  progress,
  action,
}: {
  label: string;
  done: boolean;
  progress?: { current: number; target: number };
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-2"
        style={{
          borderColor: done ? "#58C08A" : "#EADFD5",
          background: done ? "#58C08A" : "transparent",
        }}
      >
        {done && <CheckIcon size={10} />}
      </span>
      <span
        className="flex-1 font-body text-[13px] font-extrabold"
        style={{ color: done ? "#2E5A44" : "#544537" }}
      >
        {label}
        {progress && !done && (
          <span className="ml-1.5 text-quest-amber">
            {Math.min(progress.current, progress.target)}/{progress.target}
          </span>
        )}
      </span>
      {action}
    </div>
  );
}

export function QuestsCard({ quests, showRepAction }: { quests: QuestState; showRepAction?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [reward, setReward] = useState<ChestResult | null>(null);
  const questsDone = [quests.lessonDone, quests.xpToday >= 30, quests.repDone].filter(Boolean).length;

  async function markRepDone() {
    setBusy(true);
    sfx("correct");
    haptic();
    const res = await fetch("/api/rep/complete", { method: "POST" });
    const data = await res.json();
    if (data.celebrateStreak) {
      router.push(`/streak?n=${data.celebrateStreak}`);
    } else {
      router.refresh();
    }
    setBusy(false);
  }

  async function openChest() {
    if (!quests.allDone || quests.chestOpened || busy) return;
    setBusy(true);
    const res = await fetch("/api/chest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "quest" }),
    });
    const data: ChestResult = await res.json();
    if (data.xpAwarded > 0) {
      setReward(data); // ceremony takes it from here
    } else {
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <section className="relative rounded-[18px] bg-white p-4 shadow-[0_3px_0_rgba(0,0,0,0.04)]">
      {reward && (
        <ChestOverlay
          result={reward}
          onDone={() => {
            setReward(null);
            router.refresh();
          }}
        />
      )}
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-[13px] font-semibold uppercase tracking-[1.5px] text-sec2">
          Daily quests
        </p>
        <p className="font-display text-[13px] font-semibold text-faint">{questsDone} / 3</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-2.5">
          <QuestRow label="Finish 1 lesson" done={quests.lessonDone} />
          <QuestRow
            label="Earn 30 XP"
            done={quests.xpToday >= 30}
            progress={{ current: quests.xpToday, target: 30 }}
          />
          <QuestRow
            label="Do your real-world rep"
            done={quests.repDone}
            action={
              showRepAction && !quests.repDone && quests.lessonDone ? (
                <button
                  onClick={markRepDone}
                  disabled={busy}
                  className="rounded-full bg-coral px-3 py-1 font-display text-[12px] font-semibold text-white shadow-[0_3px_0_#D8431B] active:translate-y-0.5 active:shadow-[0_1px_0_#D8431B]"
                >
                  Mark done
                </button>
              ) : undefined
            }
          />
        </div>
        <button
          onClick={openChest}
          disabled={busy || !quests.allDone || quests.chestOpened}
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] ${quests.allDone && !quests.chestOpened ? "wiggle" : ""}`}
          style={{
            background: quests.chestOpened ? "#EAF8F0" : "#FFF3D6",
            opacity: 1,
          }}
          aria-label="Quest chest"
        >
          {quests.chestOpened ? <CheckIcon size={26} color="#58C08A" /> : <ChestIcon size={30} />}
        </button>
      </div>
    </section>
  );
}
