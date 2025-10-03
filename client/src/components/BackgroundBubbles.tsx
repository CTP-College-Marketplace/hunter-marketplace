"use client";

import { useMemo } from "react";

type Bubble = {
  leftPct: number;   // 0–100
  topPct: number;    // 0–100
  sizeRem: number;   // 8–30
  blurPx: number;    // 24–64
  opacity: number;   // 0.12–0.35
  duration: number;  // 12–22s
  delay: number;     // 0–4s
};

export default function BackgroundBubbles({ count = 6 }: { count?: number }) {
  // Generate once per mount so bubbles don't "jump" on re-render
  const bubbles: Bubble[] = useMemo(() => {
    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
    return Array.from({ length: count }, () => ({
      leftPct: rnd(0, 100),
      topPct: rnd(0, 100),
      sizeRem: rnd(10, 28),         // rem units
      blurPx: rnd(28, 60),
      opacity: rnd(0.14, 0.32),
      duration: rnd(12, 22),
      delay: rnd(0, 4),
    }));
  }, [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            position: "absolute",
            left: `${b.leftPct}%`,
            top: `${b.topPct}%`,
            width: `${b.sizeRem}rem`,
            height: `${b.sizeRem}rem`,
            transform: "translate(-50%, 10%)",
            // Hunter purple glow using rgba
            background:
              "radial-gradient( circle at 30% 30%, rgba(86, 39, 241, 1), rgba(82, 69, 218, 1) 60%, rgba(115, 34, 208, 1) 70% )",
            filter: `blur(${b.blurPx}px)`,
            opacity: b.opacity,
            animation: `floatXY ${b.duration}s ease-in-out ${b.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}
