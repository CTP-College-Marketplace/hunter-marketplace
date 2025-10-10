"use client";

import { useMemo, useState, useEffect } from "react";

type Square = {
  leftPct: number;   // 0–100
  topPct: number;    // 0–100
  sizeRem: number;   // 4–16
  opacity: number;   // 0.15–0.45
  duration: number;  // 14–28s
  delay: number;     // 0–6s
  angle: number;     // -20–20 deg (drift direction)
};

export default function BackgroundSquares({ count = 10 }: { count?: number }) {
  const [isClient, setIsClient] = useState(false);
  
  const squares: Square[] = useMemo(() => {
    if (!isClient) return [];
    const r = (min: number, max: number) => Math.random() * (max - min) + min;
    return Array.from({ length: count }, () => ({
      leftPct: r(0, 100),
      topPct: r(0, 100),
      sizeRem: r(5, 14),
      opacity: r(0.1, 0.38),
      duration: r(16, 28),
      delay: r(0, 1),
      angle: r(-20, 20),
    }));
  }, [count, isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {squares.map((s, i) => (
        <div
          key={i}
          className="bg-hunter-navy will-change-transform rounded-xl animate-drift"
          style={{
            position: "absolute",
            left: `${s.leftPct}%`,
            top: `${s.topPct}%`,
            width: `${s.sizeRem}rem`,
            height: `${s.sizeRem}rem`,
            transform: `translate(50%, 50%) rotate(${s.angle}deg)`,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            // subtle glow so squares read on full black
            boxShadow: "50px 50px 100px 100px rgba(111, 81, 182, 1)",
          }}
        />
      ))}
    </div>
  );
}
