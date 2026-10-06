'use client';

import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import styles from "./Sidebar.module.css";

type Props = {
  userName?: string;
  userStars?: number;
  maxStars?: number;
};

const nav = [
  { id: "home",        label: "Главная" },
  { id: "gaming",      label: "Игровые мошенничества" },
  { id: "fake-friends", label: "Фальшивые друзья" },
  { id: "ai-deepfake", label: "Ловушки с ИИ и дипфейками" },
  { id: "easy-money",  label: "Легкие деньги" },
  { id: "digital-trace", label: "Цифровой след" },
  { id: "school-trap", label: "Школьная ловушка" },
  { id: "cybersec",    label: "Кибербезопасность" },
];

export default function Sidebar({
  userName = "root",
  userStars = 12,
  maxStars = 20,
}: Props) {
  const [active, setActive] = useState("home");
  const { logout } = useAuth();
  const progress = Math.min(100, Math.round((userStars / maxStars) * 100));

  return (
    <aside className={styles.sidebar}>
      {/* ===== Логотип ===== */}
      <div className={styles.brand} data-tour="brand">
        <div className={styles.brandIcon}>
          <svg viewBox="0 0 48 48" className={styles.shield} aria-hidden="true">
            <path
              className={styles.shieldPath}
              d="M24 4 L40 10 V22 C40 32 33 40 24 44 C15 40 8 32 8 22 V10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              className={styles.shieldCheck}
              d="M16 24 L22 30 L33 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.brandPulse} />
        </div>

        <div className={styles.brandText}>
          <span className={styles.brandLine1}>Лаборатория</span>
          <span className={styles.brandLine2}>безопасности</span>
        </div>
      </div>

      {/* ===== Навигация ===== */}
      <nav className={styles.nav} data-tour="nav">
        {nav.map((item, i) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              className={`${styles.navBtn} ${isActive ? styles.active : ""}`}
              style={{ animationDelay: `${150 + i * 60}ms` }}
              onClick={() => setActive(item.id)}
            >
              <span className={styles.navIndicator} />
              <span className={styles.navDot} />
              <span className={styles.navLabel}>{item.label}</span>
              <span className={styles.navChevron}>›</span>
              <span className={styles.navShine} aria-hidden="true" />
            </button>
          );
        })}
      </nav>

      {/* ===== Низ: профиль + выход ===== */}
      <div className={styles.bottom}>
        <div className={styles.profile} data-tour="profile">
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing} />
            <div className={styles.avatar}>
              <span>{userName[0].toUpperCase()}</span>
            </div>
            <span className={styles.status} title="онлайн" />
          </div>

          <div className={styles.userInfo}>
            <p className={styles.userName}>{userName}</p>
            <div className={styles.starsRow}>
              <span className={styles.starIcon}>★</span>
              <span className={styles.starsValue}>
                {userStars}
                <span className={styles.starsMax}> / {maxStars}</span>
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <button className={styles.logout} onClick={logout}>
          <span className={styles.logoutIcon}>⏻</span>
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}
