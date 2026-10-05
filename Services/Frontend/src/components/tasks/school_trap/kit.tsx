// components/tasks/school_trap/kit.tsx — общие мелочи для заданий блока «Школьная ловушка»
import { useEffect, useRef, useState } from "react";
import { keyframes } from "@mui/system";

/** Пауза перед автоотправкой результата, чтобы ребёнок успел прочитать итог. 0 — сразу. */
export const AUTO_SUBMIT_DELAY_MS = 3200;

export type SpotState = "found" | "missed" | "ok";

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useCountUp(target: number, ms = 1000) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const a = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      const val = Math.round(a + (target - a) * (1 - Math.pow(1 - p, 3)));
      from.current = val;
      setV(val);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export const fmtTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export const pop = keyframes`from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}`;
export const slideDown = keyframes`from{opacity:0;transform:translateY(-26px)}to{opacity:1;transform:none}`;
export const shake = keyframes`0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}`;
export const slam = keyframes`0%{opacity:0;transform:scale(2.6) rotate(-14deg)}60%{opacity:1;transform:scale(.94) rotate(-8deg)}100%{transform:scale(1) rotate(-8deg)}`;
export const bob = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}`;
export const pulseRed = keyframes`0%,100%{box-shadow:0 0 0 0 rgba(229,72,77,.45)}50%{box-shadow:0 0 0 10px rgba(229,72,77,0)}`;
export const blink = keyframes`0%,100%{opacity:1}50%{opacity:.25}`;
export const dot = keyframes`0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}`;

export const rm = { "@media (prefers-reduced-motion: reduce)": { animation: "none !important" } };
