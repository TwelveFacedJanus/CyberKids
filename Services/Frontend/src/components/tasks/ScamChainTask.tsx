// components/tasks/ScamChainTask.tsx
import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Alert,
  Chip,
} from "@mui/material";
import { type TaskComponentProps } from "./taskUtils";

interface ChainStep {
  id: string;
  emoji: string;
  text: string;
}

export default function ScamChainTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const steps: ChainStep[] = content.steps || [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  // 🔀 Перемешиваем шаги для интерактива
  const shuffled = [...steps].sort(() => Math.random() - 0.5);

  const handleSelect = (id: string) => {
    if (checked) return;
    setSelectedId(id);
  };

  const handleCheck = () => {
    if (!selectedId) return;
    const isCorrect = selectedId === steps[steps.length - 1].id;
    setChecked(true);
    onChange([
      ...answers.filter((a) => a.key !== "scam_chain_result"),
      { key: "scam_chain_result", value: { selectedId, isCorrect } },
    ]);
  };

  return (
    <Paper sx={{ p: 4, borderRadius: "24px", maxWidth: 700, mx: "auto" }}>
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ mb: 2, textAlign: "center" }}
      >
        🔗 Где мошенник украл аккаунт?
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mb: 3 }}
      >
        Нажми на шаг, где произошла кража аккаунта
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {shuffled.map((step) => (
          <Paper
            key={step.id}
            onClick={() => handleSelect(step.id)}
            sx={{
              p: 3,
              borderRadius: "16px",
              cursor: checked ? "default" : "pointer",
              border:
                selectedId === step.id
                  ? "2px solid #7C4DFF"
                  : "1px solid #E5E7EB",
              backgroundColor: selectedId === step.id ? "#F1EBFF" : "#FFFFFF",
              transition: "all 0.2s ease",
              "&:hover": { borderColor: checked ? undefined : "#7C4DFF" },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ fontSize: 32 }}>{step.emoji}</Box>
              <Typography fontWeight={600}>{step.text}</Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {!checked ? (
        <Button
          variant="contained"
          fullWidth
          disabled={!selectedId}
          onClick={handleCheck}
          sx={{ py: 1.5, borderRadius: "16px", fontSize: 16 }}
        >
          Проверить
        </Button>
      ) : (
        <Alert
          severity={
            selectedId === steps[steps.length - 1].id ? "success" : "error"
          }
        >
          {selectedId === steps[steps.length - 1].id
            ? "✅ Верно! Мошенники украли аккаунт когда ты ввёл пароль на поддельном сайте."
            : "❌ Не совсем. Посмотри внимательно — аккаунт крадут именно в момент ввода пароля!"}
        </Alert>
      )}
    </Paper>
  );
}
