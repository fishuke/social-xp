"use client";

import { useEffect, useState } from "react";

export function CountUp({ to, duration = 700 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    // Respect reduced-motion: skip the roll-up and show the final value at once.
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      raf = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3)))); // ease-out cubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return <>{value}</>;
}
