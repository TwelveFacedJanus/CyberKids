// components/tasks/ScamPhishingTask.tsx
import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import type { TaskComponentProps } from "./taskUtils";

interface Variant {
  text: string;
  correct?: boolean;
}

interface Line {
  id: string;
  label: string;
  variants: Variant[];
}

type Phase = "build" | "done";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function prepareLines(raw: Line[]): Line[] {
  return raw.map((line) => ({
    ...line,
    variants: shuffle(line.variants),
  }));
}

function randomIndices(lines: Line[]): Record<string, number> {
  const init: Record<string, number> = {};
  lines.forEach((l) => {
    init[l.id] = Math.floor(Math.random() * l.variants.length);
  });
  return init;
}

export default function ScamPhishingTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  // Перемешиваем варианты и стартовые индексы — один раз при монтировании
  const [lines, setLines] = useState<Line[]>(() =>
    prepareLines((content.lines || []) as Line[]),
  );
  const [indices, setIndices] = useState<Record<string, number>>(() =>
    randomIndices(lines),
  );

  const storyTitle = (content as any).storyTitle || "Разбор письма";
  const intro = (content as any).intro || "";
  const explainer = (content as any).explainer as string | undefined;
  const imagePath = (content as any).imagePath as string | undefined;

  const [phase, setPhase] = useState<Phase>("build");
  const [activeLineId, setActiveLineId] = useState<string | null>(
    lines[0]?.id ?? null,
  );

  // Активная строка
  const activeIndex = lines.findIndex((l) => l.id === activeLineId);
  const activeLine = activeIndex >= 0 ? lines[activeIndex] : null;
  const activeVariantIndex = activeLine ? (indices[activeLine.id] ?? 0) : 0;

  const shiftVariant = (dir: -1 | 1) => {
    if (phase !== "build" || !activeLine) return;
    const total = activeLine.variants.length;
    setIndices((prev) => {
      const cur = prev[activeLine.id] ?? 0;
      const next = (cur + dir + total) % total;
      return { ...prev, [activeLine.id]: next };
    });
  };

  const selectLine = (id: string) => {
    if (phase !== "build") return;
    setActiveLineId(id);
  };

  // Итоги
  const results = useMemo(
    () =>
      lines.map((line) => {
        const idx = indices[line.id] ?? 0;
        const variant = line.variants[idx];
        return {
          lineId: line.id,
          label: line.label,
          variant,
          idx,
          correct: !!variant?.correct,
        };
      }),
    [lines, indices],
  );

  const correctCount = results.filter((r) => r.correct).length;
  const total = results.length;
  const allCorrect = correctCount === total;

  const finish = () => {
    setPhase("done");
    setActiveLineId(null);

    const details = results.map((r) => ({
      item_id: r.lineId,
      item_text: `${r.label}: ${r.variant?.text ?? ""}`,
      expected: "правильный вариант",
      chosen: r.variant?.text,
      correct: r.correct,
    }));

    onChange([
      ...answers.filter((a) => a.key !== "scam_phishing_result"),
      {
        key: "scam_phishing_result",
        value: {
          indices,
          correctCount,
          total,
          isCorrect: allCorrect,
          totalCorrect: correctCount,
          totalPossible: total,
          details,
        },
      },
    ]);
  };

  const handleReset = () => {
    // Перемешиваем варианты заново
    const reshuffled = prepareLines(lines);
    setLines(reshuffled);
    // Случайные стартовые позиции
    setIndices(randomIndices(reshuffled));
    setPhase("build");
    setActiveLineId(reshuffled[0]?.id ?? null);
    onChange(answers.filter((a) => a.key !== "scam_phishing_result"));
  };

  if (!activeLine && phase === "build") return null;

  return (
    <Stack spacing={3}>
      {/* ─── Шапка ─── */}

      {/* ══════════ ПОЧТОВЫЙ КЛИЕНТ ══════════ */}
      <Box data-tutorial="scam-phishing" sx={{ position: "relative" }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Левая стрелка */}
          <IconButton
            data-tutorial="scam-phishing-arrows"
            onClick={() => shiftVariant(-1)}
            disabled={phase === "done"}
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              bgcolor: phase === "done" ? "#F3F4F6" : "#7C4DFF",
              color: "#fff",
              flexShrink: 0,
              boxShadow:
                phase === "done" ? "none" : "0 8px 20px rgba(124,77,255,0.4)",
              "&:hover": {
                bgcolor: phase === "done" ? "#F3F4F6" : "#6A3EE0",
              },
              "&.Mui-disabled": {
                bgcolor: "#F3F4F6",
                color: "#D1D5DB",
              },
            }}
          >
            <ChevronLeft sx={{ fontSize: 32 }} />
          </IconButton>

          {/* Единое письмо */}
          <Paper
            sx={{
              flexGrow: 1,
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
            }}
          >
            {/* Шапка почты (декоративная) */}
            <Box
              sx={{
                px: 3,
                py: 1.5,
                background: "linear-gradient(135deg, #F8F9FA, #FFFFFF)",
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#FF5F56",
                  }}
                />
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#FFBD2E",
                  }}
                />
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: "#27C93F",
                  }}
                />
              </Box>
              <Typography fontSize={11.5} color="text.secondary" sx={{ ml: 1 }}>
                Новое сообщение
              </Typography>
            </Box>

            {/* Строки письма */}
            <Box sx={{ p: 1 }}>
              {lines.map((line, i) => {
                const isActive = line.id === activeLineId && phase === "build";
                const variantIndex = indices[line.id] ?? 0;
                const variant = line.variants[variantIndex];
                const isDone = phase === "done";
                const isCorrect = !!variant?.correct;

                // Цвета
                let bg = "transparent";
                let borderColor = "transparent";
                if (isDone) {
                  bg = isCorrect ? "#F0FDF4" : "#FEF2F2";
                  borderColor = isCorrect ? "#22C55E" : "#EF4444";
                } else if (isActive) {
                  bg = "#F1EBFF";
                  borderColor = "#7C4DFF";
                }

                return (
                  <Box
                    key={line.id}
                    onClick={() => selectLine(line.id)}
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border: `2px solid ${borderColor}`,
                      backgroundColor: bg,
                      cursor: phase === "build" ? "pointer" : "default",
                      transition: "all 0.2s ease",
                      position: "relative",
                      "&:hover": {
                        backgroundColor:
                          phase === "build" && !isActive ? "#F8F9FA" : bg,
                      },
                    }}
                  >
                    {/* Метка и текст */}
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: "6px",
                          bgcolor: isActive ? "#7C4DFF" : "#F3F4F6",
                          color: isActive ? "#fff" : "#6B7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 12,
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        {i + 1}
                      </Box>

                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          fontSize={10.5}
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            fontWeight: 700,
                            color: "#9CA3AF",
                            mb: 0.25,
                          }}
                        >
                          {line.label}
                        </Typography>
                        <Typography
                          fontSize={14.5}
                          fontWeight={600}
                          sx={{
                            color: isDone
                              ? isCorrect
                                ? "#166534"
                                : "#991B1B"
                              : "#1F2937",
                            lineHeight: 1.45,
                          }}
                        >
                          {variant?.text ?? "—"}
                        </Typography>

                        {/* Точки вариантов — только на активной строке и до проверки */}
                        {isActive && (
                          <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                            {line.variants.map((_, vi) => (
                              <Box
                                key={vi}
                                sx={{
                                  width: vi === variantIndex ? 16 : 6,
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor:
                                    vi === variantIndex ? "#7C4DFF" : "#D1D5DB",
                                  transition: "all 0.25s ease",
                                }}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>

                      {/* Разбор после проверки */}
                      {isDone && (
                        <Box sx={{ flexShrink: 0, mt: 0.25 }}>
                          {isCorrect ? (
                            <CheckCircle
                              sx={{ fontSize: 22, color: "#22C55E" }}
                            />
                          ) : (
                            <Cancel sx={{ fontSize: 22, color: "#EF4444" }} />
                          )}
                        </Box>
                      )}
                    </Stack>
                  </Box>
                );
              })}
            </Box>
          </Paper>

          {/* Правая стрелка */}
          <IconButton
            data-tutorial="scam-phishing-arrows"
            onClick={() => shiftVariant(1)}
            disabled={phase === "done"}
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              bgcolor: phase === "done" ? "#F3F4F6" : "#7C4DFF",
              color: "#fff",
              flexShrink: 0,
              boxShadow:
                phase === "done" ? "none" : "0 8px 20px rgba(124,77,255,0.4)",
              "&:hover": {
                bgcolor: phase === "done" ? "#F3F4F6" : "#6A3EE0",
              },
              "&.Mui-disabled": {
                bgcolor: "#F3F4F6",
                color: "#D1D5DB",
              },
            }}
          >
            <ChevronRight sx={{ fontSize: 32 }} />
          </IconButton>
        </Stack>

        {/* Подсказка про активную строку */}
        {phase === "build" && activeLine && (
          <Typography
            fontSize={12}
            color="text.secondary"
            sx={{ textAlign: "center", mt: 1.5 }}
          >
            Активная строка: <b>{activeLine.label}</b> — вариант{" "}
            {activeVariantIndex + 1} из {activeLine.variants.length}
          </Typography>
        )}
      </Box>

      {/* ─── Кнопка проверки ─── */}
      {phase === "build" && (
        <Button
          data-tutorial="submit"
          variant="contained"
          size="large"
          fullWidth
          onClick={finish}
          sx={{
            py: 1.8,
            fontSize: 17,
            fontWeight: 800,
            borderRadius: "14px",
            background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
          }}
        >
          Проверить письмо
        </Button>
      )}

      {/* ─── Итог ─── */}
      {phase === "done" && (
        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            textAlign: "center",
            background: allCorrect
              ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
              : "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
            border: `2px solid ${allCorrect ? "#22C55E" : "#F59E0B"}`,
          }}
        >
          <Box sx={{ fontSize: 64, mb: 1 }}>{allCorrect ? "🏆" : "📋"}</Box>
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              mb: 1,
              color: allCorrect ? "#166534" : "#92400E",
            }}
          >
            {allCorrect ? "Письмо собрано верно!" : "Письмо собрано"}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2, mb: 3 }}
          >
            <Chip
              label={`Верно: ${correctCount} из ${total}`}
              sx={{
                bgcolor: allCorrect ? "#DCFCE7" : "#FEF3C7",
                color: allCorrect ? "#166534" : "#92400E",
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
      )}
    </Stack>
  );
}
