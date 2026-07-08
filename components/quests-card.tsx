"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { markChallengeDone } from "@/lib/actions";
import { haptic, sfx } from "@/lib/juice";
import type { QuestState } from "@/lib/game";
import { useT, useLocale } from "@/components/i18n-provider";
import { withLocale } from "@/lib/i18n/routing";
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
  const t = useT();
  const locale = useLocale();
  const chest = useChest();
  const [busy, setBusy] = useState(false);
  const questsDone = [quests.lessonDone, quests.xpToday >= 30, quests.repDone].filter(Boolean).length;
  const chestReady = quests.allDone && !quests.chestOpened;
  const allComplete = questsDone === 3;

  async function completeChallenge() {
    if (busy) return;
    setBusy(true);
    sfx("correct");
    haptic();
    const result = await markChallengeDone();
    if (result.celebrateStreak) {
      router.push(withLocale(locale, `/streak?n=${result.celebrateStreak}`));
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
          {t.quests.dailyQuests}
        </p>
        {allComplete ? (
          <p className="font-display text-[13px] font-semibold text-[#58C08A]">{t.quests.allDone}</p>
        ) : (
          <p className="font-display text-[13px] font-semibold text-faint">{t.quests.progress(questsDone, 3)}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-2.5">
          <QuestRow label={t.quests.finishLesson} done={quests.lessonDone} />
          <QuestRow
            label={t.quests.earnXp(30)}
            done={quests.xpToday >= 30}
            progress={{ current: quests.xpToday, target: 30 }}
          />
          <QuestRow
            label={t.quests.doChallenge}
            done={quests.repDone}
            action={
              showChallengeAction && !quests.repDone && quests.lessonDone ? (
                <button
                  onClick={completeChallenge}
                  disabled={busy}
                  className="rounded-full bg-coral px-3 py-1 font-display text-[12px] font-semibold text-white shadow-[0_3px_0_#D8431B] active:translate-y-0.5 active:shadow-[0_1px_0_#D8431B]"
                >
                  {t.quests.markDone}
                </button>
              ) : undefined
            }
          />
        </div>
        <button
          onClick={() => chest.open({ type: "quest" })}
          disabled={chest.busy || !chestReady}
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] ${chest.busy ? "chest-pending" : chestReady ? "wiggle" : ""}`}
          style={{ background: quests.chestOpened ? "#EAF8F0" : chestReady ? "#FFF3D6" : "#EADFD5" }}
          aria-label={t.chest.questChestLabel}
        >
          {quests.chestOpened ? (
            <CheckIcon size={26} color="#58C08A" />
          ) : (
            <ChestIcon size={30} color={chestReady ? undefined : "#B8A99C"} />
          )}
        </button>
      </div>
    </section>
  );
}
