'use client';

import { useEffect, useRef, useState } from "react";
import styles from "./OnboardingScreen.module.css";

/* ───────────── данные ───────────── */
const THREATS = ["🎣", "🔑", "💳", "🕵️", "🔗", "📱"];

const PARTICLES = [
  { x: "8%", y: "18%", s: 10, c: "#7C4DFF", d: 0 },
  { x: "90%", y: "14%", s: 14, c: "#EC407A", d: 1.2 },
  { x: "16%", y: "72%", s: 12, c: "#FFCA28", d: 2.1 },
  { x: "82%", y: "66%", s: 9, c: "#7C4DFF", d: 0.6 },
  { x: "50%", y: "6%", s: 8, c: "#EC407A", d: 1.8 },
  { x: "70%", y: "88%", s: 13, c: "#FFCA28", d: 2.6 },
  { x: "30%", y: "40%", s: 7, c: "#7C4DFF", d: 3.1 },
  { x: "94%", y: "42%", s: 8, c: "#FFCA28", d: 0.9 },
];

const CONFETTI = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2;
  const r = 110 + (i % 3) * 45;
  return {
    dx: `${Math.round(Math.cos(a) * r)}px`,
    dy: `${Math.round(Math.sin(a) * r)}px`,
    c: ["#7C4DFF", "#EC407A", "#FFCA28", "#26C6DA"][i % 4],
    round: i % 2 === 0,
  };
});

const HERO_SIZES = [
  "clamp(170px, 28vh, 260px)",
  "clamp(140px, 22vh, 210px)",
  "clamp(120px, 18vh, 170px)",
];

const SLIDES = [
  { id: 0, label: "Знакомство" },
  { id: 1, label: "Что тебя ждёт" },
  { id: 2, label: "Поехали!" },
];

/* ───────────── SVG-колба ───────────── */
const FLASK_PATH =
  "M84 12 V92 L28 190 Q18 212 40 222 H160 Q182 212 172 190 L116 92 V12 Z";

function Flask() {
  return (
    <svg viewBox="0 0 200 240" className={styles.flask} aria-hidden="true">
      <defs>
        <clipPath id="flaskClip">
          <path d={FLASK_PATH} />
        </clipPath>
        <linearGradient id="liq" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7C4DFF" />
          <stop offset="0.6" stopColor="#EC407A" />
          <stop offset="1" stopColor="#FFCA28" />
        </linearGradient>
      </defs>

      <path d={FLASK_PATH} fill="rgba(255,255,255,.55)" />

      <g clipPath="url(#flaskClip)">
        <g className={styles.wave1}>
          <path
            opacity=".55"
            fill="url(#liq)"
            d="M0 138 Q25 126 50 138 T100 138 T150 138 T200 138 T250 138 T300 138 V260 H0 Z"
          />
        </g>
        <g className={styles.wave2}>
          <path
            fill="url(#liq)"
            d="M0 150 Q25 140 50 150 T100 150 T150 150 T200 150 T250 150 T300 150 V260 H0 Z"
          />
        </g>

        {[
          [70, 205, 0],
          [105, 190, 0.8],
          [135, 210, 1.5],
          [90, 175, 2.2],
          [120, 180, 0.4],
        ].map(([x, y, d], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={4 + (i % 3)}
            fill="#fff"
            fillOpacity=".7"
            className={styles.bubble}
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </g>

      <path
        d={FLASK_PATH}
        fill="none"
        stroke="#1A1A2E"
        strokeOpacity=".85"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M76 12 H124"
        stroke="#1A1A2E"
        strokeOpacity=".85"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M96 30 V88"
        stroke="#fff"
        strokeOpacity=".8"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={96 + i * 8}
          cy="8"
          r={4 - i * 0.6}
          fill={["#7C4DFF", "#EC407A", "#FFCA28"][i]}
          className={styles.sparkle}
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
    </svg>
  );
}

/* ───────────── Hero ───────────── */
function Hero({ step }: { step: number }) {
  const size = HERO_SIZES[Math.min(step, 2)];
  return (
    <div className={styles.hero} style={{ width: size, height: size }}>
      <div className={styles.heroGlow} />

      <div className={styles.orbit}>
        {THREATS.map((t, i) => {
          const angle = (360 / THREATS.length) * i;
          return (
            <div
              key={t}
              className={styles.orbitItem}
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <span
                className={styles.orbitEmoji}
                style={{
                  // @ts-expect-error CSS-переменные
                  "--counter-angle": `${-angle}deg`,
                  "--counter-angle-end": `${-angle - 360}deg`,
                }}
              >
                {t}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.flaskWrap}>
        <Flask />
      </div>
    </div>
  );
}

/* ───────────── сам экран ───────────── */
type Props = {
  onDone: () => void;
};

const SWIPE_THRESHOLD = 60;

export default function OnboardingScreen({ onDone }: Props) {
  const [step, setStep] = useState(0);
  const [launching, setLaunching] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const timer = useRef<number | undefined>(undefined);

  // touch-координаты для свайпа
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = SLIDES.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;

  const goNext = () => {
    if (isLast) return;
    setDirection("next");
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const goPrev = () => {
    if (isFirst) return;
    setDirection("prev");
    setStep((s) => Math.max(s - 1, 0));
  };

  const goTo = (i: number) => {
    if (i === step) return;
    setDirection(i > step ? "next" : "prev");
    setStep(Math.max(0, Math.min(i, total - 1)));
  };

  // Клавиатура
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        onDone();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const start = () => {
    if (launching) return;
    setLaunching(true);
    timer.current = window.setTimeout(() => onDone(), 850);
  };

  // Свайпы
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    // Игнорируем вертикальные жесты
    if (Math.abs(dy) > Math.abs(dx)) return;

    if (dx <= -SWIPE_THRESHOLD) goNext();
    else if (dx >= SWIPE_THRESHOLD) goPrev();
  };

  return (
    <div className={styles.screen}>
      <div className={styles.grid} />

      <div className={`${styles.blob} ${styles.blobA}`} />
      <div className={`${styles.blob} ${styles.blobB}`} />

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: p.x,
            top: p.y,
            width: p.s,
            height: p.s,
            borderRadius: i % 2 ? "3px" : "50%",
            background: p.c,
            animationDuration: `${5 + (i % 3)}s`,
            animationDelay: `${p.d}s`,
          }}
        />
      ))}

      <div
        className={styles.stack}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Hero step={step} />

        <div className={styles.sliderViewport}>
          <div
            className={`${styles.slide} ${
              direction === "next" ? styles.slideInRight : styles.slideInLeft
            }`}
            key={step}
          >
            {step === 0 && (
              <h2 className={styles.title}>
                Добро пожаловать в «Лабораторию цифровой безопасности»!
              </h2>
            )}

            {step === 1 && (
              <div className={styles.card}>
                <h5 className={styles.cardTitle}>
                  Сегодня тебе предстоит занятие на{" "}
                  <span className={styles.highlight}>
                    «Тренажёре цифровых угроз»
                  </span>
                  .
                </h5>
                <p className={styles.cardText}>
                  Перед тобой появятся задания, благодаря которым ты научишься
                  выявлять мошеннические схемы.
                </p>
              </div>
            )}

            {step === 2 && (
              <div className={styles.cta}>
                <h4 className={styles.ctaTitle}>
                  Ну что, ты готов? Тогда жми на старт!
                </h4>

                <div className={styles.btnWrap}>
                  {!launching && <span className={styles.btnRing} />}

                  <button
                    type="button"
                    onClick={start}
                    className={styles.startBtn}
                    disabled={launching}
                  >
                    <span
                      className={
                        launching ? styles.rocketLaunching : styles.rocketIdle
                      }
                      aria-hidden="true"
                    >
                      🚀
                    </span>
                    <span>Старт</span>
                  </button>

                  {launching && (
                    <div className={styles.confetti}>
                      {CONFETTI.map((p, i) => (
                        <span
                          key={i}
                          className={styles.confettiPiece}
                          style={{
                            background: p.c,
                            borderRadius: p.round ? "50%" : "2px",
                            // @ts-expect-error CSS-переменные
                            "--dx": p.dx,
                            "--dy": p.dy,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Управление: стрелки + точки */}
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.navArrow}
            onClick={goPrev}
            disabled={isFirst}
            aria-label="Предыдущий слайд"
          >
            ←
          </button>

          <div className={styles.dots} role="tablist" aria-label="Слайды">
            {SLIDES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={s.id === step}
                aria-label={`Слайд ${s.id + 1}: ${s.label}`}
                className={`${styles.dot} ${
                  s.id === step ? styles.dotActive : ""
                } ${s.id < step ? styles.dotPassed : ""}`}
                onClick={() => goTo(s.id)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.navArrow}
            onClick={goNext}
            disabled={isLast}
            aria-label="Следующий слайд"
          >
            →
          </button>
        </div>

        <div className={styles.counter}>
          {step + 1} / {total}
        </div>
      </div>
    </div>
  );
}
