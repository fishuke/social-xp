import { CheckIcon } from "./icons";

// One daily-quest line — shared by the quests card and the lesson claim screen.
export function QuestRow({
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
  const showProgress = progress && !done;
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
        {showProgress && (
          <span className="ml-1.5 text-quest-amber">
            {Math.min(progress.current, progress.target)}/{progress.target}
          </span>
        )}
      </span>
      {showProgress && (
        <span className="h-[6px] w-16 overflow-hidden rounded-full bg-line">
          <span
            className="block h-full rounded-full bg-quest-amber"
            style={{ width: `${(progress.current / progress.target) * 100}%` }}
          />
        </span>
      )}
      {action}
    </div>
  );
}
