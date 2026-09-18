// components/tasks/ScamDefenderTask.tsx
import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Alert,
  Chip,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import { type TaskComponentProps } from "./taskUtils";

interface DefenderStep {
  id: string;
  title: string;
  description: string;
  correct: number;
  options: string[];
  explanation?: string;
}

export default function ScamDefenderTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const steps: DefenderStep[] = content.steps || [];
  const optionsList: string[][] = content.options || [];

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = steps[currentStep];
  const options = optionsList[currentStep] || [];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleSelect = (index: number) => {
    if (checked) return;
    setSelectedOption(index);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === current.correct;
    setResults([...results, isCorrect]);
    setChecked(true);

    // Сохраняем результат
    onChange([
      ...answers.filter((a) => a.key !== `defender_${current.id}`),
      { key: `defender_${current.id}`, value: isCorrect },
    ]);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setChecked(false);
    } else {
      // Завершение
      const totalCorrect = [
        ...results,
        selectedOption === current.correct,
      ].filter(Boolean).length;
      const allCorrect = totalCorrect === steps.length;
      setCompleted(true);
      onChange([
        ...answers.filter((a) => a.key !== "defender_completed"),
        {
          key: "defender_completed",
          value: { totalCorrect, allCorrect, total: steps.length },
        },
      ]);
    }
  };

  if (completed) {
    const finalResults = [...results, selectedOption === current.correct];
    const correctCount = finalResults.filter(Boolean).length;

    return (
      <Paper
        sx={{
          p: 4,
          borderRadius: "24px",
          textAlign: "center",
          background:
            correctCount === steps.length
              ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
              : "linear-gradient(135deg, #FEF2F2, #FFFBEB)",
          border: `2px solid ${correctCount === steps.length ? "#22C55E" : "#EF4444"}`,
        }}
      >
        <Box sx={{ fontSize: 64, mb: 2 }}>
          {correctCount === steps.length ? "🛡️" : "⚠️"}
        </Box>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
          {correctCount === steps.length
            ? "Ты защищён!"
            : "Есть над чем поработать!"}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {correctCount === steps.length
            ? "Ты правильно ответил на все вопросы! Теперь твой аккаунт в безопасности."
            : `Ты правильно ответил на ${correctCount} из ${steps.length} вопросов.`}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 3 }}
        >
          <Chip
            label={`✅ Правильно: ${correctCount}`}
            sx={{
              backgroundColor: "#DCFCE7",
              color: "#166534",
              fontWeight: 600,
            }}
          />
          <Chip
            label={`❌ Неправильно: ${steps.length - correctCount}`}
            sx={{
              backgroundColor: "#FEE2E2",
              color: "#991B1B",
              fontWeight: 600,
            }}
          />
        </Stack>

        <Button
          variant="contained"
          onClick={() => {
            setCurrentStep(0);
            setSelectedOption(null);
            setResults([]);
            setChecked(false);
            setCompleted(false);
          }}
          sx={{ borderRadius: "16px", py: 1.5, px: 4 }}
        >
          🔄 Пройти заново
        </Button>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Прогресс */}
      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            Вопрос {currentStep + 1} из {steps.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(progress)}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>

      {/* Карточка вопроса */}
      <Card
        sx={{
          borderRadius: "24px",
          border: `2px solid #EF4444`,
          boxShadow: "0 8px 32px rgba(239,68,68,0.15)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Box
              sx={{
                px: 2,
                py: 0.5,
                backgroundColor: "#FEE2E2",
                borderRadius: "12px",
                color: "#991B1B",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              🚨 Защита аккаунта
            </Box>
          </Box>

          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            {current.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, whiteSpace: "pre-wrap" }}
          >
            {current.description}
          </Typography>

          <Stack spacing={2}>
            {options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrect = checked && index === current.correct;
              const isWrong = checked && isSelected && !isCorrect;

              let borderColor = "transparent";
              let bgColor = "#FFFFFF";
              if (checked && isCorrect) {
                borderColor = "#22C55E";
                bgColor = "#F0FDF4";
              } else if (checked && isWrong) {
                borderColor = "#EF4444";
                bgColor = "#FEF2F2";
              } else if (isSelected) {
                borderColor = "#7C4DFF";
                bgColor = "#F1EBFF";
              }

              return (
                <Paper
                  key={index}
                  onClick={() => handleSelect(index)}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    cursor: checked ? "default" : "pointer",
                    border: `2px solid ${borderColor || "#E5E7EB"}`,
                    backgroundColor: bgColor,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: checked ? undefined : "#7C4DFF",
                      transform: checked ? undefined : "scale(1.01)",
                    },
                    position: "relative",
                  }}
                >
                  <Typography fontWeight={500}>
                    {String.fromCharCode(65 + index)}. {option}
                  </Typography>
                  {checked && index === current.correct && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#22C55E",
                        fontSize: 24,
                      }}
                    >
                      ✅
                    </Box>
                  )}
                  {checked && isSelected && !isCorrect && (
                    <Box
                      sx={{
                        position: "absolute",
                        right: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#EF4444",
                        fontSize: 24,
                      }}
                    >
                      ❌
                    </Box>
                  )}
                </Paper>
              );
            })}
          </Stack>

          {checked && current.explanation && (
            <Alert
              severity={
                selectedOption === current.correct ? "success" : "error"
              }
              sx={{ mt: 3, borderRadius: "12px" }}
            >
              {current.explanation}
            </Alert>
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            {!checked ? (
              <Button
                variant="contained"
                fullWidth
                disabled={selectedOption === null}
                onClick={handleCheck}
                sx={{ py: 1.5, borderRadius: "16px", fontSize: 16 }}
              >
                Проверить ответ
              </Button>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={handleNext}
                sx={{
                  py: 1.5,
                  borderRadius: "16px",
                  fontSize: 16,
                  backgroundColor:
                    currentStep === steps.length - 1 ? "#22C55E" : "#7C4DFF",
                  "&:hover": {
                    backgroundColor:
                      currentStep === steps.length - 1 ? "#16A34A" : "#6D28D9",
                  },
                }}
              >
                {currentStep === steps.length - 1 ? "Завершить" : "Дальше →"}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
