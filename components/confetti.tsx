// One-shot confetti burst — deterministic particles, pure CSS animation.

const COLORS = ["#FFC24A", "#58C08A", "#FF914D", "#ffffff", "#FF5A2C"];

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 53 + 11) % 100, // pseudo-scatter
  size: 6 + (i % 4) * 2,
  color: COLORS[i % COLORS.length],
  round: i % 3 === 0,
  delay: (i % 6) * 60,
  duration: 900 + (i % 5) * 160,
  fall: 220 + (i % 4) * 60,
}));

export function ConfettiBurst({ height = 300 }: { height?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-10 overflow-hidden"
      style={{ height }}
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.round ? 99 : 2,
              "--fall": `${p.fall}px`,
              animation: `sx-confetti ${p.duration}ms ease-in ${p.delay}ms both`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
