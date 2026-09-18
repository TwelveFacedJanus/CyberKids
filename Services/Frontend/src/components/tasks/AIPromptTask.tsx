// components/tasks/AIPromptTask.tsx
import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  LinearProgress,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import { api } from "../../api/client";
import type { TaskComponentProps } from "./taskUtils";

export default function AIPromptTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  const [matchedWords, setMatchedWords] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);
    setMatchPercentage(null);
    setMatchedWords([]);

    try {
      const data = await api.post<{
        response: string;
        success: boolean;
        match_percentage?: number;
        matched_words?: string[];
      }>("/api/run/ai-prompt", { prompt });

      console.log("[FRONT] Ответ от бэкенда:", data);

      setResponse(data.response);

      // ✅ ВСЕГДА сохраняем все данные
      const pct =
        data.match_percentage !== undefined ? data.match_percentage : 0;
      const words = data.matched_words || [];

      setMatchPercentage(pct);
      setMatchedWords(words);

      // ✅ Сохраняем ВСЕ данные в answers
      const newAnswers = [
        ...answers.filter(
          (a) =>
            a.key !== "ai_response" &&
            a.key !== "ai_match_percentage" &&
            a.key !== "ai_matched_words",
        ),
        { key: "ai_response", value: data.response },
        { key: "ai_match_percentage", value: pct },
        { key: "ai_matched_words", value: words },
      ];

      console.log("[FRONT] Новые answers:", newAnswers);
      onChange(newAnswers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 71) return "#22C55E";
    if (pct >= 41) return "#F9A825";
    if (pct >= 21) return "#FF7043";
    return "#EF4444";
  };

  const getLabel = (pct: number) => {
    if (pct >= 71) return "Отлично! 🎉";
    if (pct >= 41) return "Хорошо! 👍";
    if (pct >= 21) return "Можно лучше 💪";
    return "Попробуй ещё раз 🔄";
  };

  const getStars = (pct: number) => {
    if (pct >= 71) return "⭐⭐⭐";
    if (pct >= 41) return "⭐⭐";
    if (pct >= 21) return "⭐";
    return "☆";
  };

  return (
    <Stack spacing={3}>
      {/* Задание */}
      <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid #F1F1F1" }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar sx={{ bgcolor: "#7C4DFF" }}>
            <AutoAwesome />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
              {content.title || "Задание по промптингу"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {content.description ||
                "Напиши промпт для ИИ, чтобы получить нужный результат"}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Примеры */}
      {content.examples && (
        <Paper sx={{ p: 2, borderRadius: "12px", backgroundColor: "#F8F9FA" }}>
          <Typography variant="caption" fontWeight={600} color="text.secondary">
            💡 Примеры хороших промптов:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {content.examples.map((ex: string, i: number) => (
              <Chip
                key={i}
                label={ex}
                size="small"
                sx={{ backgroundColor: "#F1EBFF", fontWeight: 500 }}
                onClick={() => setPrompt(ex)}
              />
            ))}
          </Stack>
        </Paper>
      )}

      {/* Ввод промпта */}
      <Paper sx={{ p: 3, borderRadius: "16px" }}>
        <TextField
          multiline
          fullWidth
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Напиши свой промпт здесь..."
          disabled={isLoading}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#FAFAFF",
            },
          }}
        />
        <Button
          variant="contained"
          size="large"
          endIcon={
            isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )
          }
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
          sx={{ mt: 2, borderRadius: "12px" }}
        >
          {isLoading ? "Отправка..." : "Отправить промпт"}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      {/* Ответ ИИ с оценкой */}
      {response && (
        <Paper
          sx={{
            p: 3,
            borderRadius: "16px",
            backgroundColor:
              matchPercentage !== null && matchPercentage >= 41
                ? "#F0FDF4"
                : "#FFF7ED",
            border: `1px solid ${matchPercentage !== null ? (matchPercentage >= 41 ? "#86EFAC" : "#FDBA74") : "#86EFAC"}`,
          }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            🤖 Ответ ИИ:
          </Typography>
          <Box
            sx={{
              p: 2,
              backgroundColor: "#FFFFFF",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
            }}
          >
            {response}
          </Box>

          {/* Оценка */}
          {matchPercentage !== null && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                📊 Оценка промпта:
              </Typography>

              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={matchPercentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#E5E7EB",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getProgressColor(matchPercentage),
                          borderRadius: 5,
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ minWidth: 50, textAlign: "right" }}
                  >
                    {matchPercentage}%
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Chip
                    label={`${getStars(matchPercentage)} ${getLabel(matchPercentage)}`}
                    size="small"
                    sx={{
                      backgroundColor: getProgressColor(matchPercentage) + "20",
                      color: getProgressColor(matchPercentage),
                      fontWeight: 600,
                    }}
                  />

                  {matchedWords.length > 0 && (
                    <Chip
                      label={`✅ Найдено: ${matchedWords.slice(0, 5).join(", ")}${matchedWords.length > 5 ? ` и ещё ${matchedWords.length - 5}` : ""}`}
                      size="small"
                      sx={{ backgroundColor: "#E0F2E9", fontWeight: 500 }}
                    />
                  )}

                  {matchedWords.length === 0 && (
                    <Chip
                      label="❌ Нет ключевых слов"
                      size="small"
                      sx={{
                        backgroundColor: "#FEE2E2",
                        fontWeight: 500,
                        color: "#991B1B",
                      }}
                    />
                  )}
                </Stack>
              </Stack>
            </Box>
          )}
        </Paper>
      )}
    </Stack>
  );
}
