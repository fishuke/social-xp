// Simple geometric SVG icons - 2.2–2.6 stroke, round caps (no icon font).

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

function Svg({
  size = 24,
  className,
  children,
  fill = "none",
}: IconProps & { children: React.ReactNode; fill?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function Logo({ size = 100, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      style={{ filter: "drop-shadow(0 6px 14px rgba(255,90,44,0.28))" }}
      aria-hidden
    >
      <rect width="48" height="48" rx="13" fill="#FF5A2C" />
      <g fill="#FFF6EE">
        <rect x="8.3" y="19" width="4.4" height="10" rx="2.2" />
        <rect x="15.1" y="14" width="4.4" height="20" rx="2.2" />
        <rect x="21.9" y="9" width="4.4" height="30" rx="2.2" />
        <rect x="28.7" y="14" width="4.4" height="20" rx="2.2" />
        <rect x="35.5" y="19" width="4.4" height="10" rx="2.2" />
      </g>
    </svg>
  );
}

export function FlameIcon({ size, color = "#FF5A2C", className }: IconProps) {
  return (
    <Svg size={size} className={className} fill={color}>
      <path d="M12 2.5c.4 2.9 1.9 4.5 3.4 6.1 1.5 1.6 2.9 3.3 2.9 6a6.3 6.3 0 0 1-12.6 0c0-1.9.8-3.3 1.8-4.6.3-.4 1-.2 1.1.3.1.8.4 1.5 1 2 .1-2.7 1-5.2 2.4-7.3.6-.9 1-1.7 1-2.5z" />
    </Svg>
  );
}

export function DiamondIcon({ size, color = "#FF914D", className }: IconProps) {
  return (
    <Svg size={size} className={className} fill={color}>
      <path d="M7 3.5h10a1 1 0 0 1 .83.44l3 4.5a1 1 0 0 1-.07 1.2l-8 9.5a1 1 0 0 1-1.52 0l-8-9.5a1 1 0 0 1-.07-1.2l3-4.5A1 1 0 0 1 7 3.5z" />
      <path d="M8.5 8.7 12 16l3.5-7.3" stroke="#FFF6EE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export function XpSquareIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="6" fill="#FFC24A" />
      <text
        x="12"
        y="12.6"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-fredoka), ui-sans-serif, system-ui, sans-serif"
        fontSize="10"
        fontWeight="700"
        letterSpacing="-0.4"
        fill="#fff"
      >
        XP
      </text>
    </svg>
  );
}

export function ChestIcon({ size, color = "#FFC24A", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M4 8.5A3.5 3.5 0 0 1 7.5 5h9A3.5 3.5 0 0 1 20 8.5V18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8.5z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 11h16" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="10.4" y="9.4" width="3.2" height="4.6" rx="1.2" fill={color} />
    </Svg>
  );
}

export function FlagIcon({ size, color = "#FFC24A", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M6 21V4" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 5h11.5l-2.6 3.5L17.5 12H6" fill={color} stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </Svg>
  );
}

export function LockIcon({ size, color = "#B8A99C", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="3" fill={color} />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function CheckIcon({ size, color = "#fff", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M5 12.5l4.2 4.3L19 7.5" stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PlayIcon({ size, color = "#fff", className }: IconProps) {
  return (
    <Svg size={size} className={className} fill={color}>
      <path d="M8.5 5.8a1.2 1.2 0 0 1 1.83-1.02l9.4 6.2a1.2 1.2 0 0 1 0 2.04l-9.4 6.2A1.2 1.2 0 0 1 8.5 18.2V5.8z" />
    </Svg>
  );
}

export function MicIcon({ size, color = "currentColor", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="9" y="3" width="6" height="11" rx="3" stroke={color} strokeWidth="2.4" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5" stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function BookIcon({ size, color = "#fff", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M12 6.5C10.5 5 8.5 4.5 4.5 4.5v13c4 0 6 .5 7.5 2 1.5-1.5 3.5-2 7.5-2v-13c-4 0-6 .5-7.5 2zM12 6.5v13"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PersonIcon({ size, color = "currentColor", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2.4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function HomeIcon({ size, color = "currentColor", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M4 10.8 12 4l8 6.8V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.2z"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.5 20.5v-6h5v6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GearIcon({ size, color = "currentColor", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2.2" />
      <path
        d="M12 3.5v2.4M12 18.1v2.4M4.9 6.2l1.7 1.7M17.4 16.1l1.7 1.7M3.5 12h2.4M18.1 12h2.4M4.9 17.8l1.7-1.7M17.4 7.9l1.7-1.7"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ChevronRightIcon({ size, color = "currentColor", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M9 5.5 15.5 12 9 18.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size, color = "currentColor", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M15 5.5 8.5 12 15 18.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CloseIcon({ size, color = "currentColor", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </Svg>
  );
}

export function ChatIcon({ size, color = "#fff", className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H9.5L6 20.2A1.2 1.2 0 0 1 4 19.3V8z"
        fill={color}
      />
    </Svg>
  );
}
