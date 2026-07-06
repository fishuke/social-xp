"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { markChallengeDone } from "@/lib/actions";
import { haptic, sfx } from "@/lib/juice";
import type { QuestState } from "@/lib/game";
import { CheckIcon, ChestIcon } from "./icons";
import { ChestOverlay } from "./chest-overlay";
import { QuestRow } from "./quest-row";
import { useChest } from "./use-chest";

export function QuestsCard({
  quests,
  showChallengeAction,
}: {
  quests: QuestState;
  showChallengeAction?: boolean;
}) {
  const router = useRouter();
  const chest = useChest();
  const [busy, setBusy] = useState(false);
  const questsDone = [quests.lessonDone, quests.xpToday >= 30, quests.repDone].filter(Boolean).length;
  const chestReady = quests.allDone && !quests.chestOpened;

  async function completeChallenge() {
    if (busy) return;
    setBusy(true);
    sfx("correct");
    haptic();
    const result = await markChallengeDone();
    if (result.celebrateStreak) {
      router.push(`/streak?n=${result.celebrateStreak}`);
    } else {
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <section className="relative rounded-[18px] bg-white p-4 shadow-[0_3px_0_rgba(0,0,0,0.04)]">
      {chest.reward && <ChestOverlay result={chest.reward} onDone={chest.collect} />}
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
            label="Do today's challenge"
            done={quests.repDone}
            action={
              showChallengeAction && !quests.repDone && quests.lessonDone ? (
                <button
                  onClick={completeChallenge}
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
          onClick={() => chest.open({ type: "quest" })}
          disabled={chest.busy || !chestReady}
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] ${chestReady ? "wiggle" : ""}`}
          style={{ background: quests.chestOpened ? "#EAF8F0" : "#FFF3D6" }}
          aria-label="Quest chest"
        >
          {quests.chestOpened ? <CheckIcon size={26} color="#58C08A" /> : <ChestIcon size={30} />}
        </button>
      </div>
    </section>
  );
}
