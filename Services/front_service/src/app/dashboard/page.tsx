'use client';

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import StatCard from "@/components/StatCard/StatCard";
import TaskCard from "@/components/TaskCard/TaskCard";
import WelcomeModal from "@/components/WelcomeModal/WelcomeModal";
import styles from "./page.module.css";

type Level = "Easy" | "Medium" | "Hard";
type Category = "web" | "crypto" | "network" | "forensics";

type Task = {
  id: number;
  title: string;
  level: Level;
  stars: number;
  done: boolean;
  category: Category;
  description: string;
};

const tasks: Task[] = [
  { id: 1, title: "SQL-инъекция", level: "Easy", stars: 1, done: true,  category: "web",       description: "Найди уязвимый параметр в форме поиска и получи скрытые данные из БД." },
  { id: 2, title: "XSS в комментариях", level: "Medium", stars: 2, done: false, category: "web",       description: "Внедри скрипт в комментарий и укради cookie администратора." },
  { id: 3, title: "CSRF-токен", level: "Hard", stars: 3, done: false, category: "web",       description: "Обойди защиту CSRF и заставь жертву совершить действие." },
  { id: 4, title: "Path Traversal", level: "Medium", stars: 2, done: false, category: "network",   description: "Через параметр загрузки получи доступ к системным файлам сервера." },
  { id: 5, title: "Шифр Цезаря", level: "Easy", stars: 1, done: true,  category: "crypto",    description: "Расшифруй сообщение, сдвинув алфавит на неизвестное число." },
  { id: 6, title: "RSA с малой экспонентой", level: "Hard", stars: 3, done: false, category: "crypto",    description: "Атака кубического корня на RSA с малым e." },
  { id: 7, title: "Анализ трафика", level: "Medium", stars: 2, done: false, category: "network",   description: "Найди в pcap-файле утёкший пароль от почты." },
  { id: 8, title: "Метаданные JPEG", level: "Easy", stars: 1, done: false, category: "forensics", description: "Извлеки скрытую информацию из EXIF-полей картинки." },
  { id: 9, title: "Восстановление файла", level: "Hard", stars: 3, done: false, category: "forensics", description: "Восстанови удалённый документ из образа диска." },
];

const categories: { id: "all" | Category; label: string }[] = [
  { id: "all",       label: "Все" },
  { id: "web",       label: "Web" },
  { id: "crypto",    label: "Крипто" },
  { id: "network",   label: "Сети" },
  { id: "forensics", label: "Форензика" },
];

const levels: { id: "all" | Level; label: string }[] = [
  { id: "all",    label: "Любой" },
  { id: "Easy",   label: "Easy" },
  { id: "Medium", label: "Medium" },
  { id: "Hard",   label: "Hard" },
];

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [category, setCategory] = useState<"all" | Category>("all");
  const [level, setLevel] = useState<"all" | Level>("all");
  const [onlyUnsolved, setOnlyUnsolved] = useState(false);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (level !== "all" && t.level !== level) return false;
      if (onlyUnsolved && t.done) return false;
      return true;
    });
  }, [category, level, onlyUnsolved]);

  const solved = tasks.filter((t) => t.done).length;
  const totalStars = tasks.reduce((s, t) => s + t.stars, 0);
  const collectedStars = tasks.filter((t) => t.done).reduce((s, t) => s + t.stars, 0);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("tourDone")) {
      setShowWelcome(true);
    }
  }, []);

  const closeWelcome = () => {
    localStorage.setItem("tourDone", "1");
    setShowWelcome(false);
  };

  return (
    <div className={styles.dashboard}>
      <video className={styles.bgVideo} src="/bg.mp4" autoPlay loop muted playsInline />
      <div className={styles.bgOverlay} />

      <Sidebar />

      <main className={styles.main}>
        <header className={styles.topbar}>
          <h1 className={styles.pageTitle}>Задачи</h1>

          <div className={styles.statsRow} data-tour="stats">
            <StatCard label="Решено задач" value={solved} suffix={`/ ${tasks.length}`} />
            <StatCard label="Звёзд собрано" value={collectedStars} suffix={`/ ${totalStars}`} />
          </div>
        </header>

        {/* ===== Фильтры ===== */}
        <section className={styles.filters} data-tour="filters">
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Категория</span>
            <div className={styles.chips}>
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`${styles.chip} ${category === c.id ? styles.chipActive : ""}`}
                  onClick={() => setCategory(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Сложность</span>
            <div className={styles.chips}>
              {levels.map((l) => (
                <button
                  key={l.id}
                  className={`${styles.chip} ${level === l.id ? styles.chipActive : ""}`}
                  onClick={() => setLevel(l.id)}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Статус</span>
            <div className={styles.chips}>
              <button
                className={`${styles.chip} ${!onlyUnsolved ? styles.chipActive : ""}`}
                onClick={() => setOnlyUnsolved(false)}
              >
                Все
              </button>
              <button
                className={`${styles.chip} ${onlyUnsolved ? styles.chipActive : ""}`}
                onClick={() => setOnlyUnsolved(true)}
              >
                Не решённые
              </button>
            </div>
          </div>

          <span className={styles.counter}>
            Найдено: <strong>{filtered.length}</strong> из {tasks.length}
          </span>
        </section>

        {/* ===== Сетка задач ===== */}
        <section className={styles.tasksGrid} data-tour="tasks">
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Ничего не найдено</p>
              <p className={styles.emptyText}>Попробуй изменить фильтры</p>
            </div>
          ) : (
            filtered.map((t, i) => (
              <TaskCard
                key={t.id}
                title={t.title}
                description={t.description}
                level={t.level}
                stars={t.stars}
                done={t.done}
                category={t.category}
                delay={i * 60}
              />
            ))
          )}
        </section>
      </main>

      {showWelcome && <WelcomeModal onClose={closeWelcome} />}
    </div>
  );
}
