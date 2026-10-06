'use client';

import { useRef } from "react";
import styles from "./TaskCard.module.css";

type Level = "Easy" | "Medium" | "Hard";

type Props = {
  title: string;
  description: string;
  level: Level;
  stars: number;
  done?: boolean;
  category: string;
  delay?: number;
};

function formatCategory(raw: string): string {
  const map: Record<string, string> = {
    web: "Web",
    crypto: "Крипто",
    network: "Сети",
    forensics: "Форензика",
    phishing: "Фишинг",
    social: "Соцсети",
    mobile: "Мобильные",
    ai: "ИИ",
    games: "Игры",
  };
  return map[raw.toLowerCase()] ?? raw;
}

export default function TaskCard({
  title,
  description,
  level,
  stars,
  done,
  category,
  delay = 0,
}: Props) {
  const cardRef = useRef<HTMLElement>(null);

  // Наклон карточки по курсору
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;   // 0..1
    const y = (e.clientY - rect.top) / rect.height;   // 0..1

    // диапазон наклона ±6°
    const rx = (0.5 - y) * 12;
    const ry = (x - 0.5) * 12;

    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };

  return (
    <article
      ref={cardRef}
      className={`${styles.card} ${done ? styles.done : ""}`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* след за курсором */}
      <span className={styles.cardGlow} aria-hidden="true" />
      {/* бегущий блик */}
      <span className={styles.cardShine} aria-hidden="true" />
      {/* градиентная обводка при hover */}
      <span className={styles.cardBorder} aria-hidden="true" />

      <div className={styles.head}>
        <span className={styles.category}>{formatCategory(category)}</span>
        <span className={`${styles.level} ${styles[level.toLowerCase()]}`}>
          {level}
        </span>
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.starsRow}>
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={`${styles.star} ${
              i < stars ? styles.starOn : styles.starOff
            }`}
            style={{ animationDelay: `${delay + i * 120}ms` }}
          >
            ★
          </span>
        ))}
        <span className={styles.starsLabel}>
          {stars === 1 ? "легко" : stars === 2 ? "средне" : "сложно"}
        </span>
      </div>

      <div className={styles.footer}>
        {done ? (
          <span className={styles.statusDone}>
            <span className={styles.checkIcon}>✓</span>
            Решено
          </span>
        ) : (
          <span className={styles.statusOpen}>Не решено</span>
        )}

        <button className={styles.openBtn}>
          <span>{done ? "Пересмотреть" : "Открыть"}</span>
          <span className={styles.arrow}>→</span>
        </button>
      </div>
    </article>
  );
}
