import type { ChestTier } from "@/lib/game";

const TIER_COLORS: Record<ChestTier, { body: string; dark: string; strap: string; latch: string }> = {
  common: { body: "#FFC24A", dark: "#D89E2E", strap: "#B07222", latch: "#FFF3D6" },
  rare: { body: "#FF7A45", dark: "#D8431B", strap: "#A93315", latch: "#FFC24A" },
  epic: { body: "#2E2018", dark: "#171008", strap: "#FFC24A", latch: "#FFC24A" },
};

// Big ceremonial chest — the lid is its own group so it can hinge open.
export function BigChest({ tier, open, size = 160 }: { tier: ChestTier; open: boolean; size?: number }) {
  const c = TIER_COLORS[tier];
  return (
    <svg viewBox="0 0 120 104" width={size} height={(size * 104) / 120} aria-hidden>
      {/* base */}
      <rect x="14" y="46" width="92" height="48" rx="9" fill={c.body} stroke={c.dark} strokeWidth="3.5" />
      <rect x="52" y="46" width="16" height="48" fill={c.strap} />
      <rect x="14" y="46" width="92" height="48" rx="9" fill="none" stroke={c.dark} strokeWidth="3.5" />
      {/* lid — hinges at back-left */}
      <g className={open ? "chest-lid-open" : undefined} style={{ transformOrigin: "14px 46px" }}>
        <path
          d="M14 46 v-13 a17 17 0 0 1 17-17 h58 a17 17 0 0 1 17 17 v13 z"
          fill={c.body}
          stroke={c.dark}
          strokeWidth="3.5"
        />
        <rect x="52" y="16" width="16" height="30" fill={c.strap} />
        <path
          d="M14 46 v-13 a17 17 0 0 1 17-17 h58 a17 17 0 0 1 17 17 v13 z"
          fill="none"
          stroke={c.dark}
          strokeWidth="3.5"
        />
      </g>
      {/* latch */}
      <rect x="53" y="42" width="14" height="18" rx="4" fill={c.latch} stroke={c.dark} strokeWidth="3" />
      <circle cx="60" cy="49" r="2.6" fill={c.dark} />
    </svg>
  );
}
