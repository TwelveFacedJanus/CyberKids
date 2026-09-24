// components/tasks/ScamDefenderTask.tsx
import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import WarningAmber from "@mui/icons-material/WarningAmber";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import type { TaskComponentProps } from "./taskUtils";

interface DefenderOption {
  id: string;
  text: string;
  correct: boolean;
  consequence?: string;
}

interface DefenderScenario {
  id: string;
  kind: "alert" | "email" | "friend";
  title: string;
  text: string;
  options: DefenderOption[];
}

interface SecuritySetting {
  id: string;
  text: string;
  description: string;
  correct: boolean;
}

type Phase = "scenarios" | "settings" | "done";

const KIND_ICON: Record<string, React.ReactNode> = {
  alert: <WarningAmber sx={{ fontSize: 26, color: "#fff" }} />,
  email: <EmailOutlined sx={{ fontSize: 26, color: "#fff" }} />,
  friend: <ChatBubbleOutline sx={{ fontSize: 26, color: "#fff" }} />,
};

const KIND_COLOR: Record<string, string> = {
  alert: "linear-gradient(135deg, #EF4444, #EC407A)",
  email: "linear-gradient(135deg, #7C4DFF, #42A5F5)",
  friend: "linear-gradient(135deg, #22C55E, #26C6DA)",
};

export default function ScamDefenderTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const scenarios: DefenderScenario[] = (content.scenarios ||
    []) as DefenderScenario[];
  const securitySettings: SecuritySetting[] = (content.securitySettings ||
    []) as SecuritySetting[];
  const storyTitle = (content as any).storyTitle || "Защита аккаунта";
  const intro = (content as any).intro || "";
  const explainer = (content as any).explainer as string | undefined;

  const [phase, setPhase] = useState<Phase>("scenarios");
  const [currentIdx, setCurrentIdx] = useState(0);
  // Выбранные ответы: { scenarioId: optionId }
  const [choices, setChoices] = useState<Record<string, string>>({});
  // Показан ли фидбек для текущего вопроса
  const [showFeedback, setShowFeedback] = useState(false);
  // Выбранные настройки безопасности
  const [selectedSettings, setSelectedSettings] = useState<string[]>([]);

  // Щит: 100% в начале, 0% при 3 ошибках
  const wrongCount = useMemo(() => {
    return Object.entries(choices).filter(([sid, oid]) => {
      const sc = scenarios.find((s) => s.id === sid);
      const opt = sc?.options.find((o) => o.id === oid);
      return opt && !opt.correct;
    }).length;
  }, [choices, scenarios]);

  const shieldPercent = Math.max(0, 100 - wrongCount * 25);

  const current = scenarios[currentIdx];
  const currentChoice = current ? choices[current.id] : undefined;
  const currentOption = current?.options.find((o) => o.id === currentChoice);

  const selectOption = (optId: string) => {
    if (showFeedback || !current) return;
    setChoices((prev) => ({ ...prev, [current.id]: optId }));
  };

  const submitAnswer = () => {
    if (!currentChoice) return;
    setShowFeedback(true);
  };

  const nextScenario = () => {
    if (currentIdx < scenarios.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowFeedback(false);
    } else {
      setPhase("settings");
    }
  };

  const toggleSetting = (id: string) => {
    setSelectedSettings((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const finish = () => {
    setPhase("done");

    const correctScenarios = scenarios.filter((s) => {
      const chosenId = choices[s.id];
      const opt = s.options.find((o) => o.id === chosenId);
      return opt?.correct;
    }).length;

    const correctSettings = securitySettings.filter(
      (s) => selectedSettings.includes(s.id) === s.correct,
    ).length;

    const totalCorrect = correctScenarios + correctSettings;
    const totalPossible = scenarios.length + securitySettings.length;

    const details = [
      ...scenarios.map((s) => {
        const chosenId = choices[s.id];
        const opt = s.options.find((o) => o.id === chosenId);
        return {
          scenario_id: s.id,
          title: s.title,
          expected: s.options.find((o) => o.correct)?.text,
          chosen: opt?.text,
          correct: !!opt?.correct,
        };
      }),
      ...securitySettings.map((s) => ({
        item_id: s.id,
        item_text: s.text,
        expected: s.correct ? "включить" : "не включать",
        chosen: selectedSettings.includes(s.id) ? "включить" : "не включать",
        correct: selectedSettings.includes(s.id) === s.correct,
      })),
    ];

    onChange([
      ...answers.filter((a) => a.key !== "scam_defender_result"),
      {
        key: "scam_defender_result",
        value: {
          choices,
          selectedSettings,
          correctScenarios,
          correctSettings,
          totalCorrect,
          totalPossible,
          isCorrect: totalCorrect === totalPossible,
          details,
        },
      },
    ]);
  };

  const handleReset = () => {
    setPhase("scenarios");
    setCurrentIdx(0);
    setChoices({});
    setShowFeedback(false);
    setSelectedSettings([]);
    onChange(answers.filter((a) => a.key !== "scam_defender_result"));
  };

  return (
    <Stack spacing={3}>
      {/* ─── Шапка ─── */}
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
              background: "linear-gradient(135deg, #22C55E, #26C6DA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldOutlined sx={{ fontSize: 28, color: "#fff" }} />
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
              Защита
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

        {/* Щит аккаунта */}
        {phase !== "done" && (
          <Box sx={{ mt: 2.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 0.5 }}
            >
              <Typography fontSize={12} sx={{ opacity: 0.8 }}>
                🛡️ Щит аккаунта
              </Typography>
              <Typography fontSize={12} fontWeight={800}>
                {shieldPercent}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={shieldPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.15)",
                "& .MuiLinearProgress-bar": {
                  background:
                    shieldPercent > 60
                      ? "linear-gradient(90deg, #22C55E, #26C6DA)"
                      : shieldPercent > 30
                        ? "linear-gradient(90deg, #F59E0B, #FCD34D)"
                        : "linear-gradient(90deg, #EF4444, #EC407A)",
                  borderRadius: 4,
                  transition: "all 0.4s ease",
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* ══════════ ФАЗА 1 — СИТУАЦИИ ══════════ */}
      {phase === "scenarios" && current && (
        <Stack spacing={2}>
          {/* Прогресс по ситуациям */}
          <Stack direction="row" spacing={1} alignItems="center">
            {scenarios.map((_, i) => (
              <Box
                key={i}
                sx={{
                  flexGrow: 1,
                  height: 4,
                  borderRadius: 2,
                  bgcolor:
                    i < currentIdx
                      ? "#7C4DFF"
                      : i === currentIdx
                        ? "#C4B5FD"
                        : "#E5E7EB",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
            <Typography
              fontSize={12}
              fontWeight={700}
              color="text.secondary"
              sx={{ ml: 1, whiteSpace: "nowrap" }}
            >
              {currentIdx + 1} / {scenarios.length}
            </Typography>
          </Stack>

          {/* Карточка ситуации */}
          <Paper
            data-tutorial="scam-defender"
            sx={{
              p: 3,
              borderRadius: "20px",
              border: "2px solid #E5E7EB",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Заголовок ситуации */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "14px",
                  background:
                    KIND_COLOR[current.kind] ||
                    "linear-gradient(135deg, #7C4DFF, #EC407A)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {KIND_ICON[current.kind]}
              </Box>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ color: "#1A1A2E" }}
              >
                {current.title}
              </Typography>
            </Stack>

            {/* Текст ситуации */}
            <Paper
              sx={{
                p: 2.5,
                borderRadius: "12px",
                backgroundColor: "#F8F9FA",
                mb: 3,
              }}
            >
              <Typography fontSize={14.5} sx={{ lineHeight: 1.6 }}>
                {current.text}
              </Typography>
            </Paper>

            {/* Варианты действий */}
            <Stack spacing={1.5}>
              {current.options.map((opt, i) => {
                const isSelected = currentChoice === opt.id;
                const isCorrect = opt.correct;

                let borderColor = "#E5E7EB";
                let bg = "#FFFFFF";

                if (showFeedback) {
                  if (isCorrect) {
                    borderColor = "#22C55E";
                    bg = "#F0FDF4";
                  } else if (isSelected) {
                    borderColor = "#EF4444";
                    bg = "#FEF2F2";
                  } else {
                    borderColor = "#E5E7EB";
                    bg = "#FAFAFA";
                  }
                } else if (isSelected) {
                  borderColor = "#7C4DFF";
                  bg = "#F1EBFF";
                }

                return (
                  <Paper
                    key={opt.id}
                    onClick={() => selectOption(opt.id)}
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      cursor: showFeedback ? "default" : "pointer",
                      border: `2px solid ${borderColor}`,
                      backgroundColor: bg,
                      transition: "all 0.2s ease",
                      display: "flex",
                      gap: 2,
                      alignItems: "flex-start",
                      opacity:
                        showFeedback && !isSelected && !isCorrect ? 0.5 : 1,
                      "&:hover": {
                        transform: showFeedback ? "none" : "translateX(4px)",
                        boxShadow: showFeedback
                          ? "none"
                          : "0 4px 16px rgba(0,0,0,0.08)",
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
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography fontSize={14.5} fontWeight={600}>
                        {opt.text}
                      </Typography>

                      {/* Последствие */}
                      {showFeedback && isSelected && opt.consequence && (
                        <Box
                          sx={{
                            mt: 1.5,
                            p: 1.5,
                            borderRadius: "8px",
                            backgroundColor: isCorrect ? "#E5F4E5" : "#FDE8E8",
                          }}
                        >
                          <Typography
                            fontSize={12.5}
                            fontWeight={600}
                            color={isCorrect ? "#166534" : "#991B1B"}
                          >
                            {isCorrect ? "✅ " : "⚠️ "}
                            {opt.consequence}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    {showFeedback && isSelected && (
                      <>
                        {isCorrect ? (
                          <CheckCircle
                            sx={{ fontSize: 22, color: "#22C55E" }}
                          />
                        ) : (
                          <Cancel sx={{ fontSize: 22, color: "#EF4444" }} />
                        )}
                      </>
                    )}
                  </Paper>
                );
              })}
            </Stack>
          </Paper>

          {/* Кнопки */}
          <Stack direction="row" spacing={1}>
            {!showFeedback ? (
              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!currentChoice}
                onClick={submitAnswer}
                sx={{
                  py: 1.8,
                  fontSize: 17,
                  fontWeight: 800,
                  borderRadius: "14px",
                  background: !currentChoice
                    ? undefined
                    : "linear-gradient(135deg, #7C4DFF, #EC407A)",
                }}
              >
                {!currentChoice ? "Выбери действие" : "Подтвердить"}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={nextScenario}
                sx={{
                  py: 1.8,
                  fontSize: 17,
                  fontWeight: 800,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
                }}
              >
                {currentIdx < scenarios.length - 1
                  ? "Следующая ситуация →"
                  : "К настройкам →"}
              </Button>
            )}
          </Stack>
        </Stack>
      )}

      {/* ══════════ ФАЗА 2 — НАСТРОЙКИ ══════════ */}
      {phase === "settings" && (
        <Stack spacing={2}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: "16px",
              backgroundColor: "#F8F9FA",
            }}
          >
            <Typography fontWeight={700} fontSize={15} sx={{ mb: 0.5 }}>
              ⚙️ Фаза 2: Настрой защиту
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Включи только те настройки, которые действительно защищают
              аккаунт. Можно выбрать несколько.
            </Typography>
          </Paper>

          <Stack data-tutorial="options" spacing={1.5}>
            {securitySettings.map((s) => {
              const isSelected = selectedSettings.includes(s.id);
              return (
                <Paper
                  key={s.id}
                  onClick={() => toggleSetting(s.id)}
                  sx={{
                    p: 2.5,
                    borderRadius: "14px",
                    cursor: "pointer",
                    border: `2px solid ${isSelected ? "#22C55E" : "#E5E7EB"}`,
                    backgroundColor: isSelected ? "#F0FDF4" : "#FFFFFF",
                    transition: "all 0.2s ease",
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    "&:hover": {
                      transform: "translateX(4px)",
                      borderColor: "#22C55E",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "6px",
                      border: `2px solid ${isSelected ? "#22C55E" : "#D1D5DB"}`,
                      backgroundColor: isSelected ? "#22C55E" : "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && (
                      <CheckCircle sx={{ fontSize: 16, color: "#fff" }} />
                    )}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontSize={14.5} fontWeight={600}>
                      {s.text}
                    </Typography>
                    <Typography
                      fontSize={12.5}
                      color="text.secondary"
                      sx={{ mt: 0.25 }}
                    >
                      {s.description}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => {
                setPhase("scenarios");
                setCurrentIdx(scenarios.length - 1);
                setShowFeedback(true);
              }}
              sx={{ borderRadius: "12px", fontWeight: 600 }}
            >
              ← Назад
            </Button>
            <Button
              data-tutorial="submit"
              variant="contained"
              fullWidth
              disabled={selectedSettings.length === 0}
              onClick={finish}
              sx={{
                py: 1.8,
                fontSize: 17,
                fontWeight: 800,
                borderRadius: "14px",
                background:
                  selectedSettings.length === 0
                    ? undefined
                    : "linear-gradient(135deg, #7C4DFF, #EC407A)",
              }}
            >
              {selectedSettings.length === 0
                ? "Выбери настройки"
                : "Завершить защиту"}
            </Button>
          </Stack>
        </Stack>
      )}

      {/* ══════════ ФИНАЛ ══════════ */}
      {phase === "done" && (
        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            textAlign: "center",
            background:
              shieldPercent >= 60
                ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
                : "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
            border: `2px solid ${shieldPercent >= 60 ? "#22C55E" : "#F59E0B"}`,
          }}
        >
          <Box sx={{ fontSize: 64, mb: 1 }}>
            {shieldPercent >= 60 ? "🛡️" : "⚠️"}
          </Box>
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              mb: 1,
              color: shieldPercent >= 60 ? "#166534" : "#92400E",
            }}
          >
            {shieldPercent >= 60
              ? "Аккаунт защищён!"
              : "Есть над чем поработать"}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mt: 2, mb: 3 }}
          >
            <Chip
              label={`Щит: ${shieldPercent}%`}
              sx={{
                bgcolor: shieldPercent >= 60 ? "#DCFCE7" : "#FEF3C7",
                color: shieldPercent >= 60 ? "#166534" : "#92400E",
                fontWeight: 700,
              }}
            />
            <Chip
              label={`Ситуации: ${
                scenarios.filter((s) => {
                  const opt = s.options.find((o) => o.id === choices[s.id]);
                  return opt?.correct;
                }).length
              }/${scenarios.length}`}
              sx={{ bgcolor: "#F1EBFF", color: "#5B21B6", fontWeight: 700 }}
            />
            <Chip
              label={`Настройки: ${securitySettings.filter((s) => selectedSettings.includes(s.id) === s.correct).length}/${securitySettings.length}`}
              sx={{ bgcolor: "#F1EBFF", color: "#5B21B6", fontWeight: 700 }}
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
      )}
    </Stack>
  );
}
