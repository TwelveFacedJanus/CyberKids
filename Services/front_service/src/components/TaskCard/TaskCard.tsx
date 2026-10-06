'use client';

import styles from "./TaskCard.module.css";

type Level = "Easy" | "Medium" | "Hard";
type Category = "web" | "crypto" | "network" | "forensics";

type Props = {
  title: string;
  description: string;
  level: Level;
  stars: number;
  done?: boolean;
  category: Category;
  delay?: number;
};

const categoryLabels: Record<Category, string> = {
  web: "Web",
  crypto: "Крипто",
  network: "Сети",
  forensics: "Форензика",
};

export default function TaskCard({
  title,
  description,
  level,
  stars,
  done,
  category,
  delay = 0,
}: Props) {
  return (
    <article
      className={`${styles.card} ${done ? styles.done : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Светящаяся рамка при hover */}
      <span className={styles.cardGlow} aria-hidden="true" />

      {/* Шапка: категория + уровень + звёзды */}
      <div className={styles.head}>
        <span className={styles.category}>{categoryLabels[category]}</span>
        <span className={`${styles.level} ${styles[level.toLowerCase()]}`}>
          {level}
        </span>
      </div>

      {/* Заголовок + описание */}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      {/* Звёзды сложности */}
      <div className={styles.starsRow}>
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={`${styles.star} ${i < stars ? styles.starOn : styles.starOff}`}
            style={{ animationDelay: `${delay + i * 120}ms` }}
          >
            ★
          </span>
        ))}
        <span className={styles.starsLabel}>
          {stars === 1 ? "легко" : stars === 2 ? "средне" : "сложно"}
        </span>
      </div>

      {/* Футер */}
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
