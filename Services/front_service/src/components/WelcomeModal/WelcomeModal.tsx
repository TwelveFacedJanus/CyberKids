'use client';

import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import styles from "./WelcomeModal.module.css";

type Step = {
  target: string | null;
  title: string;
  text: string;
  position?: "top" | "bottom" | "left" | "right";
};

const steps: Step[] = [
  {
    target: "profile",
    position: "right",
    title: "Профиль",
    text: "Слева — твой профиль. За решение задач получаешь звёзды. Звёзды видны прямо здесь.",
  },
  {
    target: "nav",
    position: "right",
    title: "Навигация",
    text: "Кнопки переключают разделы: задачи, рейтинг, архив, настройки.",
  },
  {
    target: "stats",
    position: "bottom",
    title: "Статистика",
    text: "Здесь — сколько задач решено и сколько звёзд собрано.",
  },
  {
    target: "tasks",
    position: "top",
    title: "Задачи",
    text: "Список активных задач. Кликай на «Открыть» и решай.",
  },
];

type Rect = { top: number; left: number; width: number; height: number };

export default function WelcomeModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const current = steps[step];

  const measure = useCallback(() => {
    if (!current.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector<HTMLElement>(
      `[data-tour="${current.target}"]`
    );
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    const padding = 8;
    const next: Rect = {
      top: r.top - padding,
      left: r.left - padding,
      width: r.width + padding * 2,
      height: r.height + padding * 2,
    };
    setRect(next);

    const gap = 16;
    let top = 0;
    let left = 0;
    switch (current.position) {
      case "right":
        top = next.top;
        left = next.left + next.width + gap;
        break;
      case "left":
        top = next.top;
        left = next.left - 380 - gap;
        break;
      case "bottom":
        top = next.top + next.height + gap;
        left = next.left;
        break;
      case "top":
      default:
        top = next.top - gap - 260;
        left = next.left;
        break;
    }
    left = Math.max(16, Math.min(left, window.innerWidth - 380));
    top = Math.max(16, Math.min(top, window.innerHeight - 280));
    setTooltipPos({ top, left });
  }, [current]);

  useLayoutEffect(() => {
    measure();
    const t = setTimeout(measure, 120);
    return () => clearTimeout(t);
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [measure]);

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else onClose();
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const skip = () => onClose();

  return (
    <div className={styles.overlay}>
      {rect ? (
        <div
          className={styles.spotlight}
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      ) : (
        <div className={styles.fullDark} />
      )}

      <button className={styles.skipGlobal} onClick={skip}>
        Пропустить обучение
      </button>

      <div
        className={styles.modal}
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
        key={step}
      >
        <div className={styles.header}>
          <span className={styles.tag}>&gt; instruction</span>
          <button
            className={styles.close}
            onClick={skip}
            aria-label="Пропустить обучение"
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <h2 className={styles.title}>{current.title}</h2>
          <p className={styles.text}>{current.text}</p>
        </div>

        <div className={styles.dots}>
          {steps.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i === step ? styles.dotActive : ""}`}
            />
          ))}
        </div>

        <div className={styles.actions}>
          {step > 0 && (
            <button className={styles.ghost} onClick={prev}>
              Назад
            </button>
          )}
          <button className={styles.button} onClick={next}>
            {step < steps.length - 1 ? "Далее" : "Продолжить"}
          </button>
        </div>

        {step < steps.length - 1 && (
          <button className={styles.skipInline} onClick={skip}>
            Пропустить обучение
          </button>
        )}
      </div>
    </div>
  );
}
