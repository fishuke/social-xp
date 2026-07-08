"use client";

import { useRouter } from "next/navigation";
import { useLocale, useT } from "@/components/i18n-provider";
import { withLocale } from "@/lib/i18n/routing";
import { CheckIcon, ChestIcon, FlagIcon, LockIcon, PlayIcon } from "./icons";
import { ChestOverlay } from "./chest-overlay";
import { useChest } from "./use-chest";

export type PathNode =
  | { kind: "lesson"; index: number; title: string; state: "done" | "current" | "locked"; isCheckpoint: boolean }
  | { kind: "chest"; reached: boolean; opened: boolean };

const OFFSETS = [-34, 38, -46, 34, -50, 40, -32, 44];

export function LearnPath({ chapterId, nodes }: { chapterId: number; nodes: PathNode[] }) {
  const chest = useChest();

  return (
    <div className="flex flex-col items-center pb-10 pt-2">
      {chest.reward && <ChestOverlay result={chest.reward} onDone={chest.collect} />}
      {nodes.map((node, i) => {
        const offset = OFFSETS[i % OFFSETS.length];
        const nextOffset = OFFSETS[(i + 1) % OFFSETS.length];
        // Diagonal dashed segment aimed from this node's center to the next one's.
        const gap = 38;
        const dx = nextOffset - offset;
        const length = Math.sqrt(dx * dx + gap * gap);
        const angle = Math.atan2(dx, gap);
        return (
          <div key={i} className="flex w-full flex-col items-center">
            <div style={{ transform: `translateX(${offset}px)` }}>
              {node.kind === "chest" ? (
                <ChestNode node={node} busy={chest.busy} onOpen={() => chest.open({ type: "path", unitId: chapterId })} />
              ) : (
                <LessonNode node={node} chapterId={chapterId} />
              )}
            </div>
            {i < nodes.length - 1 && (
              <div className="relative w-full" style={{ height: gap }}>
                <div
                  className="absolute w-[3px] rounded-full"
                  style={{
                    height: length,
                    left: `calc(50% + ${(offset + nextOffset) / 2}px)`,
                    top: gap / 2,
                    transform: `translate(-50%, -50%) rotate(${-angle}rad)`,
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, #E6D4C4 0 7px, transparent 7px 13px)",
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LessonNode({
  node,
  chapterId,
}: {
  node: Extract<PathNode, { kind: "lesson" }>;
  chapterId: number;
}) {
  const router = useRouter();
  const locale = useLocale();
  const t = useT();

  if (node.state === "current") {
    return (
      <div className="flex flex-col items-center gap-2">
        <span className="bob rounded-full bg-cocoa px-3.5 py-1.5 font-display text-[13px] font-semibold tracking-[0.5px] text-white">
          {t.learn.startPill(20)}
        </span>
        <button
          onClick={() => router.push(withLocale(locale, `/lesson/${chapterId}/${node.index}`))}
          className="node-pulse flex h-[82px] w-[82px] items-center justify-center rounded-full active:translate-y-1"
          style={{
            background: "linear-gradient(160deg, #FF7A45, #FF5A2C)",
            boxShadow: "0 7px 0 #D8431B, 0 0 0 6px rgba(255,90,44,0.18)",
          }}
          aria-label={t.learn.startLessonAria(node.title)}
        >
          <PlayIcon size={36} />
        </button>
        <span className="max-w-[150px] text-center font-display text-[15px] font-semibold text-cocoa">
          {node.title}
        </span>
      </div>
    );
  }

  const isCheckpoint = node.isCheckpoint;
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="flex items-center justify-center rounded-full"
        style={
          node.state === "done"
            ? { width: 56, height: 56, background: "#58C08A", boxShadow: "0 5px 0 #3F9E6E" }
            : isCheckpoint
              ? { width: 60, height: 60, background: "#2E2018", boxShadow: "0 5px 0 #171008" }
              : { width: 56, height: 56, background: "#EADFD5" }
        }
      >
        {node.state === "done" ? (
          <CheckIcon size={28} />
        ) : isCheckpoint ? (
          <FlagIcon size={26} />
        ) : (
          <LockIcon size={24} />
        )}
      </span>
      <span
        className="max-w-[140px] text-center font-body text-[12px] font-extrabold"
        style={{ color: node.state === "locked" && !isCheckpoint ? "#B8A99C" : "#7A6A5C" }}
      >
        {node.title}
      </span>
    </div>
  );
}

function ChestNode({
  node,
  busy,
  onOpen,
}: {
  node: Extract<PathNode, { kind: "chest" }>;
  busy: boolean;
  onOpen: () => void;
}) {
  const t = useT();
  const openable = node.reached && !node.opened;
  const locked = !node.reached && !node.opened;
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={openable ? onOpen : undefined}
        disabled={!openable || busy}
        className={`flex h-[56px] w-[56px] items-center justify-center rounded-full ${busy ? "chest-pending" : openable ? "wiggle" : ""}`}
        style={
          node.opened
            ? { background: "#58C08A", boxShadow: "0 5px 0 #3F9E6E" }
            : locked
              ? { background: "#EADFD5" }
              : { background: "#FFC24A", boxShadow: "0 5px 0 #E0A52F" }
        }
        aria-label={t.learn.rewardChestAria}
      >
        {node.opened ? (
          <CheckIcon size={28} />
        ) : (
          <ChestIcon size={28} color={locked ? "#B8A99C" : "#fff"} />
        )}
      </button>
      <span
        className="font-body text-[12px] font-extrabold"
        style={{ color: locked ? "#B8A99C" : "#C9A23B" }}
      >
        {t.learn.reward}
      </span>
    </div>
  );
}
