// components/tasks/ScamChainTask.tsx
import { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import DragIndicator from "@mui/icons-material/DragIndicator";
import type { TaskComponentProps } from "./taskUtils";

interface ChainStep {
  id: string;
  emoji: string;
  title: string;
  text: string;
}

interface ChainAction {
  id: string;
  text: string;
  correct: boolean;
}

type Phase = "order" | "moment" | "action" | "done";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ScamChainTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const correctSteps: ChainStep[] = (content.steps || []) as ChainStep[];
  const storyTitle = (content as any).storyTitle || "Расследование";
  const intro = (content as any).intro || "";
  const correctStepId = (content as any).correctStepId as string;
  const explainer = (content as any).explainer as string | undefined;
  const actions: ChainAction[] = (content as any).actions || [];

  // Перемешанные шаги — фиксируем при монтировании
  const [userOrder, setUserOrder] = useState<ChainStep[]>(() =>
    shuffle(correctSteps),
  );
  const [phase, setPhase] = useState<Phase>("order");
  const [momentId, setMomentId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  // ─── Drag-n-drop state ───
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Сброс при смене задания
  useEffect(() => {
    setUserOrder(shuffle(correctSteps));
    setPhase("order");
    setMomentId(null);
    setActionId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // Проверка порядка
  const orderCorrectCount = useMemo(
    () => userOrder.filter((s, i) => s.id === correctSteps[i]?.id).length,
    [userOrder, correctSteps],
  );
  const totalSteps = correctSteps.length;
  const orderCorrect = orderCorrectCount === totalSteps;

  const momentCorrect = momentId === correctStepId;
  const correctAction = actions.find((a) => a.correct);
  const actionCorrect = actionId === correctAction?.id;

  const totalCorrect =
    orderCorrectCount + (momentCorrect ? 1 : 0) + (actionCorrect ? 1 : 0);
  const totalPossible = totalSteps + 2;

  // ─── Перемещение кнопками ───
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...userOrder];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setUserOrder(next);
  };

  const moveDown = (idx: number) => {
    if (idx === userOrder.length - 1) return;
    const next = [...userOrder];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setUserOrder(next);
  };

  // ─── Завершение ───
  const finish = () => {
    if (!actionId) return;
    setPhase("done");

    const orderDetails = userOrder.map((s, i) => ({
      item_id: s.id,
      item_text: s.title,
      expected: correctSteps[i]?.id,
      chosen: s.id,
      correct: s.id === correctSteps[i]?.id,
    }));

    const momentDetail = {
      scenario_id: "moment",
      title: "Момент кражи",
      expected: correctStepId,
      chosen: momentId,
      correct: momentCorrect,
    };

    const actionDetail = {
      scenario_id: "action",
      title: "Правильное действие",
      expected: correctAction?.id,
      chosen: actionId,
      correct: actionCorrect,
    };

    onChange([
      ...answers.filter((a) => a.key !== "scam_chain_result"),
      {
        key: "scam_chain_result",
        value: {
          orderCorrectCount,
          totalSteps,
          orderCorrect,
          momentId,
          momentCorrect,
          actionId,
          actionCorrect,
          totalCorrect,
          totalPossible,
          isCorrect: totalCorrect === totalPossible,
          details: [...orderDetails, momentDetail, actionDetail],
        },
      },
    ]);
  };

  const handleReset = () => {
    setUserOrder(shuffle(correctSteps));
    setPhase("order");
    setMomentId(null);
    setActionId(null);
    onChange(answers.filter((a) => a.key !== "scam_chain_result"));
  };

  return (
    <Stack spacing={3}>
      {/* ─── Шапка дела ─── */}
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
              background: "linear-gradient(135deg, #EF4444, #EC407A)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            🕵️
          </Box>
          <Box>
            <Typography
              fontSize={11}
              sx={{
                opacity: 0.6,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Дело
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
      </Paper>

      {/* ══════════ ФАЗА 1 — ПОРЯДОК ══════════ */}
      {phase === "order" && (
        <Stack spacing={2}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: "16px",
              backgroundColor: "#F8F9FA",
            }}
          >
            <Typography fontWeight={700} fontSize={15} sx={{ mb: 0.5 }}>
              🔍 Фаза 1: Восстанови хронологию
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Шаги перемешаны. Расставь их в правильном порядке — что было
              раньше, что позже. Перетаскивай карточки мышкой или используй
              стрелки ↑↓.
            </Typography>
          </Paper>

          <Stack data-tutorial="scam-chain" spacing={1.5}>
            {userOrder.map((step, i) => {
              const isDragging = dragIndex === i;
              const isOver =
                overIndex === i && dragIndex !== null && dragIndex !== i;

              return (
                <Paper
                  key={step.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(i));
                    setDragIndex(i);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (overIndex !== i) setOverIndex(i);
                  }}
                  onDragLeave={() => {
                    if (overIndex === i) setOverIndex(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = parseInt(
                      e.dataTransfer.getData("text/plain"),
                      10,
                    );
                    if (!isNaN(from) && from !== i) {
                      setUserOrder((prev) => {
                        const next = [...prev];
                        [next[from], next[i]] = [next[i], next[from]];
                        return next;
                      });
                    }
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: `2px solid ${
                      isOver ? "#7C4DFF" : isDragging ? "#C4B5FD" : "#E5E7EB"
                    }`,
                    backgroundColor: isOver
                      ? "#F1EBFF"
                      : isDragging
                        ? "#FAF5FF"
                        : "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    transition: "all 0.15s ease",
                    opacity: isDragging ? 0.5 : 1,
                    cursor: "grab",
                    transform: isOver ? "scale(1.02)" : "scale(1)",
                    boxShadow: isOver
                      ? "0 8px 24px rgba(124,77,255,0.25)"
                      : "none",
                    "&:active": {
                      cursor: "grabbing",
                    },
                  }}
                >
                  {/* Номер позиции */}
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "#7C4DFF",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </Box>

                  <DragIndicator
                    sx={{ color: "#7C4DFF", fontSize: 22, flexShrink: 0 }}
                  />

                  <Typography fontSize={22} sx={{ flexShrink: 0 }}>
                    {step.emoji}
                  </Typography>

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography fontWeight={700} fontSize={14}>
                      {step.title}
                    </Typography>
                    <Typography
                      fontSize={12.5}
                      color="text.secondary"
                      sx={{ lineHeight: 1.4, mt: 0.25 }}
                    >
                      {step.text}
                    </Typography>
                  </Box>

                  {/* Кнопки ↑↓ — fallback для тача */}
                  <Stack spacing={0.25}>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveUp(i);
                      }}
                      disabled={i === 0}
                      sx={{
                        minWidth: 32,
                        p: 0.25,
                        color: "#6B7280",
                        "&:hover": { color: "#7C4DFF" },
                      }}
                    >
                      <ArrowUpward fontSize="small" />
                    </Button>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveDown(i);
                      }}
                      disabled={i === userOrder.length - 1}
                      sx={{
                        minWidth: 32,
                        p: 0.25,
                        color: "#6B7280",
                        "&:hover": { color: "#7C4DFF" },
                      }}
                    >
                      <ArrowDownward fontSize="small" />
                    </Button>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => setPhase("moment")}
            sx={{
              py: 1.8,
              fontSize: 17,
              fontWeight: 800,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
            }}
          >
            Порядок готов → дальше
          </Button>
        </Stack>
      )}

      {/* ══════════ ФАЗА 2 — МОМЕНТ КРАЖИ ══════════ */}
      {phase === "moment" && (
        <Stack spacing={2}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: "16px",
              backgroundColor: "#F8F9FA",
            }}
          >
            <Typography fontWeight={700} fontSize={15} sx={{ mb: 0.5 }}>
              🎯 Фаза 2: Найди момент кражи
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              В какой момент аккаунт Матвея был украден <b>окончательно</b>?
            </Typography>
          </Paper>

          <Stack spacing={1.5}>
            {userOrder.map((step, i) => {
              const isSelected = momentId === step.id;
              return (
                <Paper
                  key={step.id}
                  onClick={() => setMomentId(step.id)}
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    cursor: "pointer",
                    border: `2px solid ${
                      isSelected ? "#7C4DFF" : "transparent"
                    }`,
                    backgroundColor: isSelected ? "#F1EBFF" : "#FFFFFF",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    "&:hover": {
                      transform: "translateX(4px)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: isSelected ? "#7C4DFF" : "#F1EBFF",
                      color: isSelected ? "#fff" : "#7C4DFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography fontSize={22}>{step.emoji}</Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={700} fontSize={14}>
                      {step.title}
                    </Typography>
                    <Typography fontSize={12.5} color="text.secondary">
                      {step.text}
                    </Typography>
                  </Box>
                  {isSelected && (
                    <CheckCircle sx={{ fontSize: 22, color: "#7C4DFF" }} />
                  )}
                </Paper>
              );
            })}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => setPhase("order")}
              sx={{ borderRadius: "12px", fontWeight: 600 }}
            >
              ← Назад
            </Button>
            <Button
              variant="contained"
              fullWidth
              disabled={!momentId}
              onClick={() => setPhase("action")}
              sx={{
                py: 1.8,
                fontSize: 17,
                fontWeight: 800,
                borderRadius: "14px",
                background: !momentId
                  ? undefined
                  : "linear-gradient(135deg, #7C4DFF, #EC407A)",
              }}
            >
              Дальше →
            </Button>
          </Stack>
        </Stack>
      )}

      {/* ══════════ ФАЗА 3 — ДЕЙСТВИЕ ══════════ */}
      {phase === "action" && (
        <Stack spacing={2}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: "16px",
              backgroundColor: "#F8F9FA",
            }}
          >
            <Typography fontWeight={700} fontSize={15} sx={{ mb: 0.5 }}>
              📜 Фаза 3: Что нужно было сделать?
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Выбери действие, которое <b>спасло бы аккаунт</b>.
            </Typography>
          </Paper>

          <Stack data-tutorial="options" spacing={1.5}>
            {actions.map((a, i) => {
              const isSelected = actionId === a.id;
              return (
                <Paper
                  key={a.id}
                  onClick={() => setActionId(a.id)}
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    cursor: "pointer",
                    border: `2px solid ${isSelected ? "#7C4DFF" : "#E5E7EB"}`,
                    backgroundColor: isSelected ? "#F1EBFF" : "#FFFFFF",
                    transition: "all 0.2s ease",
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    "&:hover": {
                      transform: "translateX(4px)",
                      borderColor: "#7C4DFF",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: isSelected ? "#7C4DFF" : "#F1EBFF",
                      color: isSelected ? "#fff" : "#7C4DFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </Box>
                  <Typography fontSize={14} sx={{ flexGrow: 1 }}>
                    {a.text}
                  </Typography>
                  {isSelected && (
                    <CheckCircle sx={{ fontSize: 22, color: "#7C4DFF" }} />
                  )}
                </Paper>
              );
            })}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => setPhase("moment")}
              sx={{ borderRadius: "12px", fontWeight: 600 }}
            >
              ← Назад
            </Button>
            <Button
              data-tutorial="submit"
              variant="contained"
              fullWidth
              disabled={!actionId}
              onClick={finish}
              sx={{
                py: 1.8,
                fontSize: 17,
                fontWeight: 800,
                borderRadius: "14px",
                background: !actionId
                  ? undefined
                  : "linear-gradient(135deg, #7C4DFF, #EC407A)",
              }}
            >
              Завершить расследование
            </Button>
          </Stack>
        </Stack>
      )}

      {/* ══════════ ФИНАЛ ══════════ */}
      {phase === "done" && (
        <Stack spacing={3}>
          <Paper
            sx={{
              p: 4,
              borderRadius: "20px",
              textAlign: "center",
              background:
                totalCorrect === totalPossible
                  ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
                  : "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
              border: `2px solid ${
                totalCorrect === totalPossible ? "#22C55E" : "#F59E0B"
              }`,
            }}
          >
            <Box sx={{ fontSize: 64, mb: 1 }}>
              {totalCorrect === totalPossible ? "🏆" : "📋"}
            </Box>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                mb: 1,
                color: totalCorrect === totalPossible ? "#166534" : "#92400E",
              }}
            >
              {totalCorrect === totalPossible
                ? "Дело закрыто!"
                : "Расследование завершено"}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mt: 2, mb: 3 }}
            >
              <Chip
                label={`Порядок: ${orderCorrectCount}/${totalSteps}`}
                sx={{
                  bgcolor: orderCorrect ? "#DCFCE7" : "#FEF3C7",
                  color: orderCorrect ? "#166534" : "#92400E",
                  fontWeight: 700,
                }}
              />
              <Chip
                label={
                  momentCorrect
                    ? "Момент кражи найден ✅"
                    : "Момент не найден ❌"
                }
                sx={{
                  bgcolor: momentCorrect ? "#DCFCE7" : "#FEE2E2",
                  color: momentCorrect ? "#166534" : "#991B1B",
                  fontWeight: 700,
                }}
              />
              <Chip
                label={
                  actionCorrect ? "Действие верное ✅" : "Действие неверное ❌"
                }
                sx={{
                  bgcolor: actionCorrect ? "#DCFCE7" : "#FEE2E2",
                  color: actionCorrect ? "#166534" : "#991B1B",
                  fontWeight: 700,
                }}
              />
            </Stack>

            {explainer && (
              <Typography
                fontSize={14}
                sx={{
                  mb: 3,
                  maxWidth: 560,
                  mx: "auto",
                  lineHeight: 1.6,
                  color: "text.secondary",
                }}
              >
                💡 {explainer}
              </Typography>
            )}

            <Button
              variant="contained"
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

          {/* Разбор порядка */}
          <Paper sx={{ p: 3, borderRadius: "16px" }}>
            <Typography fontWeight={800} fontSize={15} sx={{ mb: 2 }}>
              📋 Правильный порядок:
            </Typography>
            <Stack spacing={1}>
              {correctSteps.map((step, i) => {
                const userStep = userOrder[i];
                const ok = userStep?.id === step.id;
                return (
                  <Stack
                    key={step.id}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      backgroundColor: ok ? "#F0FDF4" : "#FEF2F2",
                      border: `1px solid ${ok ? "#86EFAC" : "#FCA5A5"}`,
                    }}
                  >
                    <Typography
                      fontWeight={800}
                      fontSize={14}
                      sx={{ minWidth: 24 }}
                    >
                      {i + 1}.
                    </Typography>
                    <Typography fontSize={18}>{step.emoji}</Typography>
                    <Typography
                      fontWeight={600}
                      fontSize={14}
                      sx={{ flexGrow: 1 }}
                    >
                      {step.title}
                    </Typography>
                    {ok ? (
                      <CheckCircle sx={{ fontSize: 18, color: "#22C55E" }} />
                    ) : (
                      <Cancel sx={{ fontSize: 18, color: "#EF4444" }} />
                    )}
                  </Stack>
                );
              })}
            </Stack>
          </Paper>
        </Stack>
      )}
    </Stack>
  );
}
