// src/components/TaskTutorial.tsx
import { useEffect, useState } from "react";

export interface TutorialStep {
  /** Текст в bubble */
  text: string;
  /** CSS-селектор элемента, к которому указывает стрелка */
  targetSelector?: string;
  /** Откуда рисовать стрелку: где находится target относительно bubble */
  from?: "top" | "bottom" | "left" | "right";
}

interface Props {
  open: boolean;
  steps: TutorialStep[];
  onClose: () => void;
  accent?: string;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function TaskTutorial({
  open,
  steps,
  onClose,
  accent = "#7C4DFF",
}: Props) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  const cur = steps[step];

  // Измеряем target при смене шага
  useEffect(() => {
    if (!open || !cur) return;
    const measure = () => {
      if (cur.targetSelector) {
        const el = document.querySelector(cur.targetSelector);
        if (el) {
          const r = el.getBoundingClientRect();
          setTargetRect({ x: r.left, y: r.top, w: r.width, h: r.height });
          return;
        }
      }
      setTargetRect(null);
    };
    measure();
    const t = setTimeout(measure, 100);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step, cur]);

  if (!open || !cur) return null;

  const isLast = step === steps.length - 1;

  // Bubble фиксирован внизу по центру
  const bubbleCenterX = window.innerWidth / 2;
  const bubbleTop = window.innerHeight - 220;

  // Считаем путь стрелки: от bubble к target
  const arrowPath = targetRect
    ? computeArrowPath(
        bubbleCenterX,
        bubbleTop,
        targetRect.x + targetRect.w / 2,
        targetRect.y + targetRect.h / 2,
        accent,
      )
    : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        fontFamily: '"Inter", "Nunito", sans-serif',
      }}
    >
      {/* Затемнение (кликабельное — закрывает туториал) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10, 10, 25, 0.6)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          animation: "fadeIn 0.4s ease both",
          cursor: "pointer",
        }}
        onClick={onClose}
      />

      {/* SVG со стрелкой */}
      {arrowPath && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
            overflow: "visible",
          }}
        >
          <defs>
            <marker
              id="tutorial-arrowhead"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={accent} />
            </marker>
          </defs>

          {/* Изогнутая кривая */}
          <path
            d={arrowPath}
            stroke={accent}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#tutorial-arrowhead)"
            style={{
              filter: `drop-shadow(0 4px 16px ${accent}aa)`,
              strokeDasharray: 2000,
              strokeDashoffset: 2000,
              animation: "drawArrow 0.8s ease 0.15s forwards",
            }}
          />
        </svg>
      )}

      {/* Bubble — внизу по центру */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: bubbleTop,
          transform: "translateX(-50%)",
          width: "min(560px, calc(100vw - 32px))",
          zIndex: 2,
          animation: "bubbleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 24,
            padding: "22px 26px",
            boxShadow: `0 24px 64px rgba(0,0,0,0.4), 0 0 0 3px ${accent}`,
            position: "relative",
          }}
        >
          {/* Номер шага */}
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Шаг {step + 1} из {steps.length}
          </div>

          {/* Текст */}
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: "#1A1A2E",
              fontWeight: 500,
            }}
          >
            {cur.text}
          </div>

          {/* Прогресс-точки */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 16,
              marginBottom: 4,
            }}
          >
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === step ? accent : `${accent}44`,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Кнопки */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 14,
            }}
          >
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6B7280",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: "10px 14px",
                  fontFamily: "inherit",
                }}
              >
                ← Назад
              </button>
            )}
            <button
              onClick={() => (isLast ? onClose() : setStep((s) => s + 1))}
              style={{
                background: accent,
                border: "none",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                padding: "10px 22px",
                borderRadius: 12,
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: `0 6px 20px ${accent}77`,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)")
              }
            >
              {isLast ? "Понятно!" : "Дальше →"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bubbleIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(24px) scale(0.95); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes drawArrow {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

/**
 * Возвращает SVG-path изогнутой стрелки от точки (x1,y1) к точке (x2,y2).
 * Изгиб — перпендикулярно прямой.
 */
function computeArrowPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  _accent: string,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Точка, где стрелка заканчивается — чуть не доходя до target
  const endOffset = 30;
  const ratio = Math.max(0, (dist - endOffset) / dist);
  const ex = x1 + dx * ratio;
  const ey = y1 + dy * ratio;

  // Контрольная точка для изгиба: середина + перпендикулярное смещение
  const midX = (x1 + ex) / 2;
  const midY = (y1 + ey) / 2;

  // Перпендикулярное смещение (величина изгиба зависит от расстояния)
  const curve = Math.min(180, dist * 0.35);

  // Перпендикулярный вектор
  const nx = -dy / dist;
  const ny = dx / dist;

  const ctrlX = midX + nx * curve;
  const ctrlY = midY + ny * curve;

  // Квадратичная кривая Безье: M start Q control end
  return `M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${ex} ${ey}`;
}
