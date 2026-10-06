// src/components/TaskTutorial.tsx
import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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

// Генератор ярких градиентов для фона
const BRIGHT_GRADIENTS = [
  "linear-gradient(135deg, #FF6B9D 0%, #FF8C42 100%)",
  "linear-gradient(135deg, #00D9FF 0%, #A855F7 100%)",
  "linear-gradient(135deg, #FFD93D 0%, #FF6B9D 100%)",
  "linear-gradient(135deg, #A855F7 0%, #00D9FF 100%)",
  "linear-gradient(135deg, #FF8C42 0%, #FFD93D 100%)",
];

export default function TaskTutorial({
  open,
  steps,
  onClose,
  accent = "#00D9FF",
}: Props) {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);

  const cur = steps[step];
  const gradient = BRIGHT_GRADIENTS[step % BRIGHT_GRADIENTS.length];

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

  // Bubble фиксирован по центру экрана
  const bubbleCenterX = window.innerWidth / 2;
  const bubbleCenterY = window.innerHeight / 2;

  // Считаем путь стрелки: от bubble к target
  const arrowPath = targetRect
    ? computeArrowPath(
        bubbleCenterX,
        bubbleCenterY,
        targetRect.x + targetRect.w / 2,
        targetRect.y + targetRect.h / 2,
        accent,
      )
    : null;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        fontFamily: '"Inter", "Nunito", sans-serif',
      }}
    >
      {/* Затемнение */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          animation: "fadeIn 0.5s ease both",
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
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFFFFF" />
            </marker>
          </defs>

          {/* Изогнутая кривая */}
          <path
            d={arrowPath}
            stroke="#FFFFFF"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#tutorial-arrowhead)"
            style={{
              filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.4))",
              strokeDasharray: 2000,
              strokeDashoffset: 2000,
              animation: "drawArrow 1s ease 0.2s forwards",
            }}
          />
        </svg>
      )}

      {/* Bubble — по центру экрана */}
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(680px, calc(100vw - 48px))",
          zIndex: 2,
          animation: "bubbleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        <Box
          sx={{
            background: gradient,
            borderRadius: "32px",
            padding: { xs: "32px 28px", md: "40px 36px" },
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            position: "relative",
            color: "#FFFFFF",
          }}
        >
          {/* Номер шага */}
          <Box
            sx={{
              fontSize: 36,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 900,
              marginBottom: 2,
            }}
          >
            Шаг {step + 1} из {steps.length}
          </Box>

          {/* Текст */}
          <Box
            sx={{
              fontSize: { xs: "1.375rem", md: "1.625rem" },
              lineHeight: 1.65,
              color: "#FFFFFF",
              fontWeight: 600,
              mb: 3,
            }}
          >
            {cur.text}
          </Box>

          {/* Прогресс-точки */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              marginBottom: 3,
              justifyContent: "center",
            }}
          >
            {steps.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: i === step ? 40 : 12,
                  height: 12,
                  borderRadius: 6,
                  background: i === step ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            ))}
          </Box>

          {/* Кнопки навигации */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {step > 0 && (
              <IconButton
                onClick={() => setStep((s) => s - 1)}
                sx={{
                  background: "rgba(255,255,255,0.25)",
                  color: "#FFFFFF",
                  width: 56,
                  height: 56,
                  transition: "all 0.3s",
                  "&:hover": {
                    background: "rgba(255,255,255,0.35)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 28 }} />
              </IconButton>
            )}
            <IconButton
              onClick={() => (isLast ? onClose() : setStep((s) => s + 1))}
              sx={{
                background: "#FFFFFF",
                color: gradient.includes("FF6B9D") ? "#FF6B9D" : "#00D9FF",
                width: 56,
                height: 56,
                transition: "all 0.3s",
                "&:hover": {
                  background: "#FFFFFF",
                  transform: "scale(1.15)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                },
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bubbleIn {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes drawArrow {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </Box>
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
