// components/tasks/QuickTestTask.tsx
import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  LinearProgress,
  Chip,
} from "@mui/material";
import { type TaskComponentProps } from "./taskUtils";

interface QuickTestQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export default function QuickTestTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const questions: QuickTestQuestion[] = content.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [checked, setChecked] = useState(false);

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const selected = selectedAnswers[currentIndex];

  const handleSelect = (index: number) => {
    if (checked) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleCheck = () => {
    if (selected === undefined) return;
    setChecked(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setChecked(false);
    } else {
      // Подсчёт результатов
      const correctCount = selectedAnswers.filter(
        (ans, idx) => ans === questions[idx].correct,
      ).length;

      setShowResult(true);
      onChange([
        ...answers.filter((a) => a.key !== "quick_test_result"),
        {
          key: "quick_test_result",
          value: {
            correct: correctCount,
            total: questions.length,
            answers: selectedAnswers,
          },
        },
      ]);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setChecked(false);
  };

  // 📊 Экран результатов
  if (showResult) {
    const correctCount = selectedAnswers.filter(
      (ans, idx) => ans === questions[idx].correct,
    ).length;
    const percent = Math.round((correctCount / questions.length) * 100);

    let resultTitle = "";
    let resultText = "";
    let resultEmoji = "";

    if (percent >= 80) {
      resultTitle = "Все под контролем!";
      resultText =
        "Ты знаешь о кибербезопасности всё или почти всё. Так держать!";
      resultEmoji = "🐻";
    } else if (percent >= 50) {
      resultTitle = "Хорошо, но можно лучше!";
      resultText = "Ты знаешь basics, но есть что подтянуть. Попробуй ещё раз!";
      resultEmoji = "🤔";
    } else {
      resultTitle = "Стоит повторить!";
      resultText =
        "Есть над чем поработать. Пройди наши уроки и попробуй снова!";
      resultEmoji = "📚";
    }

    return (
      <Stack spacing={3}>
        <Paper
          sx={{
            borderRadius: "24px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #00C853, #76FF03)",
            p: 4,
            color: "#fff",
            position: "relative",
            minHeight: 280,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}
          >
            Правильных ответов
          </Typography>
          <Typography variant="h2" fontWeight={900} sx={{ mb: 2 }}>
            {correctCount} из {questions.length}
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ mb: 1 }}>
            {resultTitle}
          </Typography>

          <Box
            sx={{
              position: "absolute",
              right: 20,
              bottom: 0,
              fontSize: 140,
              lineHeight: 1,
              opacity: 0.9,
            }}
          >
            {resultEmoji}
          </Box>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: "16px", backgroundColor: "#F8F9FA" }}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {resultText}
          </Typography>
        </Paper>

        {/* Кнопки */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleRestart}
            sx={{
              py: 2,
              borderRadius: "12px",
              fontSize: 16,
              fontWeight: 700,
              backgroundColor: "#FF5252",
              "&:hover": { backgroundColor: "#FF1744" },
            }}
          >
            Пройти еще раз
          </Button>
        </Stack>
      </Stack>
    );
  }

  // 📝 Экран вопроса
  return (
    <Stack spacing={3}>
      {/* Заголовок теста */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={800} sx={{ color: "#00A651" }}>
          ТЕСТ: «{content.test_title || "Это нормально или опасно?"}»
        </Typography>
        <Typography variant="body1" fontWeight={700} sx={{ color: "#00A651" }}>
          {currentIndex + 1} из {questions.length}
        </Typography>
      </Box>

      {/* Вопрос с градиентом */}
      <Paper
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #00C853, #76FF03)",
          p: 4,
          minHeight: 140,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={800} sx={{ color: "#fff" }}>
          {current.question}
        </Typography>
      </Paper>

      {/* Варианты ответов */}
      <Stack spacing={2}>
        {current.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = checked && index === current.correct;
          const isWrong = checked && isSelected && !isCorrect;

          return (
            <Paper
              key={index}
              onClick={() => handleSelect(index)}
              sx={{
                p: 2,
                borderRadius: "12px",
                cursor: checked ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                border: isCorrect
                  ? "2px solid #22C55E"
                  : isWrong
                    ? "2px solid #EF4444"
                    : isSelected
                      ? "2px solid #00A651"
                      : "2px solid transparent",
                backgroundColor: isCorrect
                  ? "#F0FDF4"
                  : isWrong
                    ? "#FEF2F2"
                    : isSelected
                      ? "#E8F5E9"
                      : "#F8F9FA",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: checked ? undefined : "translateX(4px)",
                  backgroundColor: checked ? undefined : "#E8F5E9",
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #00A651, #00C853)",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 18,
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  flexShrink: 0,
                }}
              >
                {String.fromCharCode(65 + index)}
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {option}
              </Typography>
            </Paper>
          );
        })}
      </Stack>

      {/* Кнопка */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {!checked ? (
          <Button
            variant="contained"
            size="large"
            disabled={selected === undefined}
            onClick={handleCheck}
            sx={{
              py: 1.5,
              px: 6,
              borderRadius: "12px",
              fontSize: 16,
              fontWeight: 700,
              backgroundColor: "#00A651",
              "&:hover": { backgroundColor: "#008C44" },
            }}
          >
            Проверить
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={handleNext}
            sx={{
              py: 1.5,
              px: 6,
              borderRadius: "12px",
              fontSize: 16,
              fontWeight: 700,
              backgroundColor: "#00A651",
              "&:hover": { backgroundColor: "#008C44" },
            }}
          >
            {currentIndex === questions.length - 1 ? "Завершить" : "Далее →"}
          </Button>
        )}
      </Box>

      {/* Точки прогресса */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
        {questions.map((_, idx) => {
          const isAnswered = selectedAnswers[idx] !== undefined;
          const isCorrect =
            isAnswered && selectedAnswers[idx] === questions[idx].correct;

          return (
            <Box
              key={idx}
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: !isAnswered
                  ? "#D1D5DB"
                  : isCorrect
                    ? "#22C55E"
                    : "#EF4444",
                transition: "all 0.2s ease",
                transform: idx === currentIndex ? "scale(1.4)" : "scale(1)",
              }}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
