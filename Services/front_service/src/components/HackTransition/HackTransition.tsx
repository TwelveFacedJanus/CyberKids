'use client';

import { useEffect, useMemo, useState } from "react";
import styles from "./HackTransition.module.css";

type Props = {
  onComplete: () => void;
  duration?: number; // ms
};

const GLYPHS = "01ABCDEF<>/\\[]{}#$%&*+=-_";

export default function HackTransition({ onComplete, duration = 2200 }: Props) {
  const [phase, setPhase] = useState<"hack" | "flash" | "white">("hack");

  // Строки «падающего кода» — генерируем один раз
  const columns = useMemo(
    () =>
      Array.from({ length: 28 }).map(() =>
        Array.from({ length: 40 })
          .map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
          .join("")
      ),
    []
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flash"), duration - 600);
    const t2 = setTimeout(() => setPhase("white"), duration - 200);
    const t3 = setTimeout(onComplete, duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [duration, onComplete]);

  return (
    <div className={`${styles.overlay} ${styles[phase]}`}>
      {/* Падающий код */}
      <div className={styles.matrix}>
        {columns.map((col, i) => (
          <span key={i} className={styles.column} style={{ animationDelay: `${i * 40}ms` }}>
            {col}
          </span>
        ))}
      </div>

      {/* Прогресс-строка */}
      <div className={styles.hud}>
        <p className={styles.hudText}>
          &gt; establishing secure connection<span className={styles.dots} />
        </p>
        <p className={styles.hudText}>
          &gt; bypassing firewall<span className={styles.dots} />
        </p>
        <p className={styles.hudText}>
          &gt; ACCESS GRANTED
        </p>
        <div className={styles.bar}>
          <div className={styles.barFill} />
        </div>
      </div>

      {/* Белая вспышка */}
      <div className={styles.flash} />
    </div>
  );
}
