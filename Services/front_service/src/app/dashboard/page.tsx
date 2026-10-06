'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar/Sidebar";
import StatCard from "@/components/StatCard/StatCard";
import TaskCard from "@/components/TaskCard/TaskCard";
import WelcomeModal from "@/components/WelcomeModal/WelcomeModal";
import OnboardingScreen from "@/components/OnboardingScreen/OnboardingScreen";
import { useAuth } from "@/lib/context/AuthContext";
import { api } from "@/lib/api/client";
import type { Task as ApiTask, Result as ApiResult } from "@/lib/types";
import styles from "./page.module.css";

// ================= UI-типы =================
type Level = "Easy" | "Medium" | "Hard";

type UITask = {
  id: string;
  title: string;
  description: string;
  level: Level;
  stars: number;
  done: boolean;
  topic: string;
};

const levels: { id: "all" | Level; label: string }[] = [
  { id: "all", label: "Любой" },
  { id: "Easy", label: "Easy" },
  { id: "Medium", label: "Medium" },
  { id: "Hard", label: "Hard" },
];

// ================= Мапперы =================
function pointsToLevel(points: number): Level {
  if (points <= 1) return "Easy";
  if (points <= 3) return "Medium";
  return "Hard";
}

function pointsToStars(points: number): number {
  return Math.min(3, Math.max(1, points));
}

function formatTopic(topic: string): string {
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
  return map[topic.toLowerCase()] ?? topic;
}

// ================= Компонент =================
export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [tasks, setTasks] = useState<UITask[]>([]);
  const [results, setResults] = useState<ApiResult[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Флаги онбординга и тура ───
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [flagsLoaded, setFlagsLoaded] = useState(false);

  const [category, setCategory] = useState<string>("all");
  const [level, setLevel] = useState<"all" | Level>("all");
  const [onlyUnsolved, setOnlyUnsolved] = useState(false);

  // ===== Защита =====
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  // ===== Флаги из localStorage (после mount, чтобы не ловить SSR-mismatch) =====
  useEffect(() => {
    if (!user) return;

    const onboardingDone = localStorage.getItem("onboardingDone") === "1";
    const tourDone = localStorage.getItem("tourDone") === "1";

    if (!onboardingDone) {
      setShowOnboarding(true);
    } else if (!tourDone) {
      setShowWelcome(true);
    }
    setFlagsLoaded(true);
  }, [user]);

  // ===== Загрузка с API =====
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadData() {
      setDataLoading(true);
      setError(null);
      try {
        const [apiTasks, apiResults] = await Promise.all([
          api.get<ApiTask[]>("/api/tasks"),
          api.get<ApiResult[]>("/api/results/me"),
        ]);

        if (cancelled) return;

        const doneIds = new Set(apiResults.map((r) => r.task_id));

        const uiTasks: UITask[] = apiTasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          level: pointsToLevel(t.points),
          stars: pointsToStars(t.points),
          topic: t.topic,
          done: doneIds.has(t.id),
        }));

        setTasks(uiTasks);
        setResults(apiResults);
      } catch {
        if (!cancelled)
          setError("Не удалось загрузить данные. Проверь соединение с сервером.");
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // ===== Онбординг завершён =====
  const finishOnboarding = () => {
    localStorage.setItem("onboardingDone", "1");
    setShowOnboarding(false);
    // Сразу после онбординга — если тур ещё не пройден, показать его
    if (!localStorage.getItem("tourDone")) {
      setShowWelcome(true);
    }
  };

  // ===== Тур завершён =====
  const closeWelcome = () => {
    localStorage.setItem("tourDone", "1");
    setShowWelcome(false);
  };

  // ===== Динамические категории из задач =====
  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => set.add(t.topic));
    const arr = Array.from(set).sort();
    return [
      { id: "all", label: "Все" },
      ...arr.map((topic) => ({ id: topic, label: formatTopic(topic) })),
    ];
  }, [tasks]);

  // ===== Фильтрация =====
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (category !== "all" && t.topic !== category) return false;
      if (level !== "all" && t.level !== level) return false;
      if (onlyUnsolved && t.done) return false;
      return true;
    });
  }, [tasks, category, level, onlyUnsolved]);

  // ===== Статистика =====
  const solved = useMemo(() => tasks.filter((t) => t.done).length, [tasks]);
  const totalStars = useMemo(() => tasks.reduce((s, t) => s + t.stars, 0), [tasks]);
  const collectedStars = useMemo(
    () => tasks.filter((t) => t.done).reduce((s, t) => s + t.stars, 0),
    [tasks]
  );

  // ===== Экраны загрузки =====
  if (loading || !user) {
    return <div className={styles.loadingScreen}>Загрузка...</div>;
  }
  if (dataLoading || !flagsLoaded) {
    return <div className={styles.loadingScreen}>Загружаем задачи...</div>;
  }
  if (error) {
    return (
      <div className={styles.loadingScreen}>
        <p>{error}</p>
        <button className={styles.retryBtn} onClick={() => window.location.reload()}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <video className={styles.bgVideo} src="/bg.mp4" autoPlay loop muted playsInline />
      <div className={styles.bgOverlay} />

      <Sidebar
        userName={user.full_name || user.username}
        userStars={collectedStars}
        maxStars={totalStars || 1}
      />

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
                category={t.topic}
                delay={i * 60}
              />
            ))
          )}
        </section>
      </main>

      {/* Порядок: онбординг → затем welcome-тур */}
      {showOnboarding && <OnboardingScreen onDone={finishOnboarding} />}
      {!showOnboarding && showWelcome && <WelcomeModal onClose={closeWelcome} />}
    </div>
  );
}
