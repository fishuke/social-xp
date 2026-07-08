export function ProgressBar({
  percent,
  height = 8,
  track = "#EADFD5",
  fill = "#FF5A2C",
  className,
}: {
  percent: number;
  height?: number;
  track?: string;
  fill?: string;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ height, background: track, borderRadius: 99, overflow: "hidden" }}
    >
      <div
        className="bar-grow"
        style={{
          width: `${Math.min(100, Math.max(0, percent))}%`,
          height: "100%",
          background: fill,
          borderRadius: 99,
          transition: "width 300ms ease",
        }}
      />
    </div>
  );
}

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-body text-[13px] font-extrabold uppercase tracking-[1.5px] text-sec2 ${className ?? ""}`}>
      {children}
    </p>
  );
}

export function BeatLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-display text-[13px] font-semibold uppercase tracking-[2px] text-coral ${className ?? ""}`}>
      {children}
    </p>
  );
}

export function StatPill({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[14px] bg-white px-3 py-2 font-display text-[17px] font-semibold text-cocoa shadow-[0_2px_0_rgba(0,0,0,0.04)] ${className ?? ""}`}
    >
      {icon}
      {label}
    </span>
  );
}

export function StatChip({
  icon,
  children,
  className,
  "aria-label": ariaLabel,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <span
      aria-label={ariaLabel}
      className={`flex items-center gap-1.5 rounded-[12px] bg-white/16 px-3 py-2 font-display text-[14px] font-semibold ${className ?? ""}`}
    >
      {icon}
      {children}
    </span>
  );
}
