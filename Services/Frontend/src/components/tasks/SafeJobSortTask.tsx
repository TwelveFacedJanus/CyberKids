// components/tasks/SafeJobSortTask.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import WorkOutline from "@mui/icons-material/WorkOutline";
import RestartAlt from "@mui/icons-material/RestartAlt";
import type { TaskComponentProps } from "./taskUtils";
import JobCard, { type JobCardData } from "./safe_job_sort/JobCard";
import FeedbackOverlay from "./safe_job_sort/FeedbackOverlay";

type Phase = "moderate" | "reveal";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Decision {
  cardId: string;
  decision: "safe" | "danger";
  correct: boolean;
}

export default function SafeJobSortTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const storyTitle = (content as any).storyTitle || "Биржа подработок";
  const intro = (content as any).intro || "";
  const rawCards: JobCardData[] = (content as any).cards || [];
  const finalRule = (content as any).finalRule as string | undefined;
  const explainer = (content as any).explainer as string | undefined;

  // Перемешиваем карточки один раз при монтировании
  const [cards] = useState<JobCardData[]>(() => shuffle(rawCards));

  const [phase, setPhase] = useState<Phase>("moderate");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState<{
    visible: boolean;
    correct: boolean;
    explanation: string;
    redFlags?: string[];
  }>({ visible: false, correct: false, explanation: "" });

  const current = cards[currentIdx];
  const total = cards.length;
  const progress = (currentIdx / total) * 100;

  // Автоскрытие плашки через 3.5 сек
  useEffect(() => {
    if (!feedback.visible) return;
    const t = window.setTimeout(
      () => setFeedback((f) => ({ ...f, visible: false })),
      3500,
    );
    return () => window.clearTimeout(t);
  }, [feedback.visible]);

  const handleDecide = (decision: "safe" | "danger") => {
    if (!current) return;

    const isCorrect = decision === current.safety;

    setDecisions((prev) => [
      ...prev,
      { cardId: current.id, decision, correct: isCorrect },
    ]);

    // Собираем красные флаги для неверного выбора
    const redFlags =
      !isCorrect && current.safety === "danger"
        ? extractFlags(current)
        : !isCorrect && current.safety === "safe"
          ? [
              "Заказ выглядит нормально: есть история, конкретика, оплата через платформу.",
            ]
          : undefined;

    setFeedback({
      visible: true,
      correct: isCorrect,
      explanation: current.explanation,
      redFlags,
    });

    // Переход к следующей карточке через 2 секунды
    window.setTimeout(() => {
      setFeedback((f) => ({ ...f, visible: false }));
      setExpanded(false);

      if (currentIdx < total - 1) {
        setCurrentIdx(currentIdx + 1);
      } else {
        finish([
          ...decisions,
          { cardId: current.id, decision, correct: isCorrect },
        ]);
      }
    }, 2200);
  };

  const finish = (allDecisions: Decision[]) => {
    setPhase("reveal");

    const correctCount = allDecisions.filter((d) => d.correct).length;

    onChange([
      ...answers.filter((a) => a.key !== "safe_job_sort_result"),
      {
        key: "safe_job_sort_result",
        value: {
          decisions: Object.fromEntries(
            allDecisions.map((d) => [d.cardId, d.decision]),
          ),
          correctCount,
          total,
        },
      },
    ]);
  };

  const handleReset = () => {
    setPhase("moderate");
    setCurrentIdx(0);
    setDecisions([]);
    setExpanded(false);
    setFeedback({ visible: false, correct: false, explanation: "" });
    onChange(answers.filter((a) => a.key !== "safe_job_sort_result"));
  };

  const correctCount = decisions.filter((d) => d.correct).length;

  if (phase === "reveal") {
    const accuracy = Math.round((correctCount / total) * 100);

    return (
      <Stack spacing={3}>
        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            textAlign: "center",
            background:
              accuracy >= 80
                ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
                : accuracy >= 50
                  ? "linear-gradient(135deg, #FFFBEB, #FEF3C7)"
                  : "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
            border: `2px solid ${
              accuracy >= 80
                ? "#22C55E"
                : accuracy >= 50
                  ? "#F59E0B"
                  : "#EF4444"
            }`,
          }}
        >
          <Box sx={{ fontSize: 64, mb: 1 }}>
            {accuracy >= 80 ? "🏆" : accuracy >= 50 ? "📋" : "🚨"}
          </Box>
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              mb: 1,
              color:
                accuracy >= 80
                  ? "#166534"
                  : accuracy >= 50
                    ? "#92400E"
                    : "#991B1B",
            }}
          >
            {accuracy >= 80
              ? "Отличная модерация!"
              : accuracy >= 50
                ? "Неплохо, но есть ошибки"
                : "Много ошибок"}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 2, mb: 3 }}
          >
            <Chip
              label={`✅ Правильно: ${correctCount} из ${total}`}
              sx={{ bgcolor: "#DCFCE7", color: "#166534", fontWeight: 700 }}
            />
            <Chip
              label={`❌ Ошибок: ${total - correctCount}`}
              sx={{ bgcolor: "#FEE2E2", color: "#991B1B", fontWeight: 700 }}
            />
            <Chip
              label={`📊 Точность: ${accuracy}%`}
              sx={{ bgcolor: "#F1EBFF", color: "#5B21B6", fontWeight: 700 }}
            />
          </Stack>

          {finalRule && (
            <Paper
              sx={{
                p: 2.5,
                borderRadius: "14px",
                bgcolor: "#FFFFFF",
                mb: 3,
                maxWidth: 620,
                mx: "auto",
                textAlign: "left",
              }}
            >
               <Typography className="task-heading" fontWeight={800} fontSize={20} sx={{ mb: 1 }}>
                💡 Главное правило:
              </Typography>
               <Typography className="task-copy" fontSize={16} sx={{ lineHeight: 1.6 }}>
                {finalRule}
              </Typography>
            </Paper>
          )}

          {explainer && (
            <Typography
               className="task-copy"
               fontSize={16}
              sx={{
                mb: 3,
                maxWidth: 620,
                mx: "auto",
                lineHeight: 1.6,
                color: "text.secondary",
                textAlign: "left",
              }}
            >
              {explainer}
            </Typography>
          )}

          <Button
            variant="contained"
            startIcon={<RestartAlt />}
            onClick={handleReset}
            sx={{
              borderRadius: "12px",
              fontWeight: 700,
              py: 1.4,
              px: 4,
              background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
            }}
          >
            Пройти заново
          </Button>
        </Paper>
      </Stack>
    );
  }

  // ══════════ ФАЗА МОДЕРАЦИИ ══════════
  return (
    <>
      <FeedbackOverlay
        visible={feedback.visible}
        correct={feedback.correct}
        explanation={feedback.explanation}
        redFlags={feedback.redFlags}
      />

      <Stack spacing={3}>
        {/* Шапка */}
        <Paper
          sx={{
            p: 3,
            borderRadius: "16px",
            background: "linear-gradient(135deg, #1E1E2E, #2A2A3E)",
            color: "#fff",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #FFD54F, #FF7043)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <WorkOutline sx={{ fontSize: 28, color: "#fff" }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                fontSize={11}
                sx={{
                  opacity: 0.6,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Модерация заказов
              </Typography>
              <Typography fontWeight={800} fontSize={16}>
                {storyTitle}
              </Typography>
              {intro && (
                <Typography fontSize={12.5} sx={{ opacity: 0.75, mt: 0.5 }}>
                  {intro}
                </Typography>
              )}
            </Box>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 0.5 }}
            >
              <Typography fontSize={12} sx={{ opacity: 0.8 }}>
                Проверено карточек
              </Typography>
              <Typography fontSize={12} fontWeight={800}>
                {currentIdx} / {total}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.15)",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #FFD54F, #FF7043)",
                  borderRadius: 3,
                  transition: "all 0.5s ease",
                },
              }}
            />
          </Box>
        </Paper>

        {/* Карточка */}
        {current && (
          <JobCard
            card={current}
            expanded={expanded}
            onToggleExpand={() => setExpanded(!expanded)}
            onDecide={handleDecide}
            disabled={feedback.visible}
          />
        )}

        {/* Подсказка */}
        {!expanded && (
          <Typography
               className="task-copy"
               fontSize={16}
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            Раскрой карточку, чтобы увидеть детали, прежде чем решать
          </Typography>
        )}
      </Stack>
    </>
  );
}

// ─── Извлечение флагов из карточки ───
function extractFlags(card: JobCardData): string[] {
  const flags: string[] = [];
  const text = (
    card.fullDescription +
    " " +
    card.chatMessages.map((m) => m.text).join(" ")
  ).toLowerCase();

  if (text.includes("sms") || text.includes("код"))
    flags.push("Просит код из SMS");
  if (text.includes("карт")) flags.push("Просит банковскую карту");
  if (text.includes("паспорт")) flags.push("Просит паспортные данные");
  if (text.includes("за вход") || text.includes("залог"))
    flags.push("Просит оплату «за вход» или залог");
  if (text.includes("срочно") || text.includes("быстрее"))
    flags.push("Давит срочностью");
  if (card.employer.rating < 3) flags.push("Низкий рейтинг заказчика");
  if (
    card.employer.registered.toLowerCase().includes("сегодня") ||
    card.employer.registered.toLowerCase().includes("дн")
  ) {
    flags.push("Заказчик недавно на бирже");
  }

  return flags;
}
