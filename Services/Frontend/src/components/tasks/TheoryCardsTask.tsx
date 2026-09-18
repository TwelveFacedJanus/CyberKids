// components/tasks/TheoryCardsTask.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningIcon from "@mui/icons-material/Warning";
import { type TaskComponentProps } from "./taskUtils";

interface TheoryCard {
  id: string;
  emoji: string;
  title: string;
  text: string;
  color: string;
  type?: "warning" | "info" | "success" | "danger"; // 🆕
}

interface TheoryCardsTaskProps extends TaskComponentProps {
  nextTaskId?: string;
}

export default function TheoryCardsTask({
  content,
  answers,
  onChange,
  nextTaskId,
}: TheoryCardsTaskProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>(() => {
    const saved = answers.find((a) => a.key === "theory_progress");
    return saved?.value ? JSON.parse(String(saved.value)) : [];
  });

  const cards: TheoryCard[] = content.cards || [];

  if (cards.length === 0) {
    return <Typography>Нет карточек для отображения</Typography>;
  }

  const currentCard = cards[currentIndex];
  const isCompleted = completed.includes(currentCard.id);
  const allCompleted = cards.every((c) => completed.includes(c.id));
  const progress = (completed.length / cards.length) * 100;

  const handleComplete = () => {
    if (!completed.includes(currentCard.id)) {
      const newCompleted = [...completed, currentCard.id];
      setCompleted(newCompleted);
      onChange([
        ...answers.filter((a) => a.key !== "theory_progress"),
        {
          key: "theory_progress",
          value: JSON.stringify(newCompleted),
        },
      ]);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleGoToPractice = () => {
    onChange([
      ...answers.filter((a) => a.key !== "theory_result"),
      {
        key: "theory_result",
        value: true,
      },
    ]);

    if (nextTaskId) {
      navigate(`/task/${nextTaskId}`);
    } else {
      navigate("/");
    }
  };

  // ✅ Цвета для типов карточек
  const getCardColors = (type?: string) => {
    switch (type) {
      case "danger":
        return { bg: "#FEF2F2", border: "#EF4444", accent: "#EF4444" };
      case "warning":
        return { bg: "#FFFBEB", border: "#F59E0B", accent: "#F59E0B" };
      case "success":
        return { bg: "#F0FDF4", border: "#22C55E", accent: "#22C55E" };
      default:
        return {
          bg: "#FAFAFF",
          border: currentCard.color,
          accent: currentCard.color,
        };
    }
  };

  const cardStyle = getCardColors(currentCard.type);

  return (
    <Stack spacing={3}>
      {/* Прогресс */}
      <Paper sx={{ p: 2, borderRadius: "16px", backgroundColor: "#F8F9FA" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography variant="body2" fontWeight={600}>
            📖 Изучено {completed.length} из {cards.length}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 6, borderRadius: 3, backgroundColor: "#E5E7EB" }}
        />
      </Paper>

      {/* 🔥 НОВАЯ КАРТОЧКА — КАК ИГРОВОЙ БАННЕР */}
      <Card
        sx={{
          borderRadius: "24px",
          border: `4px solid ${cardStyle.border}`,
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${cardStyle.bg}, #FFFFFF)`,
          boxShadow: "0 12px 48px rgba(0,0,0,0.12)",
        }}
      >
        {/* 🏷️ Бейдж-стикер */}
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: cardStyle.accent,
            color: "#fff",
            borderRadius: "20px",
            px: 2,
            py: 0.5,
            fontSize: 13,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            zIndex: 1,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {currentCard.type === "danger" && "🚨 Опасно!"}
          {currentCard.type === "warning" && "⚠️ Внимание!"}
          {currentCard.type === "success" && "✅ Правильно!"}
          {!currentCard.type && `${currentIndex + 1} / ${cards.length}`}
        </Box>

        {/* ✅ Бейдж "Запомнил!" */}
        {isCompleted && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              backgroundColor: "#22C55E",
              color: "#fff",
              borderRadius: "20px",
              px: 2,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 13,
              fontWeight: 700,
              zIndex: 1,
              boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 18 }} />
            Запомнил!
          </Box>
        )}

        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center" sx={{ textAlign: "center" }}>
            {/* 🎯 Большой эмодзи */}
            <Box
              sx={{
                fontSize: 80,
                lineHeight: 1,
                mb: 1,
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.1))",
                animation: "bounce 2s infinite",
                "@keyframes bounce": {
                  "0%,100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-10px)" },
                },
              }}
            >
              {currentCard.emoji}
            </Box>

            {/* 📝 Заголовок */}
            <Typography
              variant="h4"
              fontWeight={900}
              sx={{
                color: cardStyle.accent,
                textShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              {currentCard.title}
            </Typography>

            {/* 📄 Текст с форматированием */}
            <Box
              sx={{
                width: "100%",
                textAlign: "left",
                backgroundColor: "rgba(255,255,255,0.7)",
                borderRadius: "16px",
                p: 3,
                border: `1px solid ${cardStyle.accent}30`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  fontSize: { xs: 15, md: 16 },
                }}
              >
                {currentCard.text}
              </Typography>
            </Box>

            {/* 🎮 Игровая кнопка */}
            <Box sx={{ mt: 2 }}>
              {!isCompleted ? (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleComplete}
                  sx={{
                    borderRadius: "16px",
                    py: 1.5,
                    px: 4,
                    fontSize: 18,
                    fontWeight: 800,
                    backgroundColor: cardStyle.accent,
                    boxShadow: `0 8px 24px ${cardStyle.accent}40`,
                    "&:hover": {
                      backgroundColor: cardStyle.accent,
                      boxShadow: `0 12px 32px ${cardStyle.accent}60`,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  ✅ Запомнил!
                </Button>
              ) : allCompleted ? (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleGoToPractice}
                  sx={{
                    borderRadius: "16px",
                    py: 1.5,
                    px: 6,
                    fontSize: 18,
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #22C55E, #16A34A)",
                    boxShadow: "0 8px 24px rgba(34,197,94,0.4)",
                    "&:hover": {
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: "0 12px 32px rgba(34,197,94,0.5)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  🚀 К практике!
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleNext}
                  sx={{
                    borderRadius: "16px",
                    py: 1.5,
                    px: 4,
                    fontSize: 18,
                    fontWeight: 800,
                    backgroundColor: cardStyle.accent,
                    boxShadow: `0 8px 24px ${cardStyle.accent}40`,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 32px ${cardStyle.accent}60`,
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Следующая карточка →
                </Button>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Навигация */}
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          disabled={currentIndex === 0}
          sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          Назад
        </Button>
        {!allCompleted && (
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1 || !isCompleted}
            sx={{
              color: "text.secondary",
              "&:hover": { color: "primary.main" },
            }}
          >
            Вперёд
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
