// components/tasks/ScamPhishingTask.tsx
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

interface PhishingSign {
  id: string;
  text: string;
  isSuspicious: boolean;
}

export default function ScamPhishingTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const signs: PhishingSign[] = content.signs || [];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const toggleSign = (id: string) => {
    if (checked) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleCheck = () => {
    const correct = signs.filter((s) => s.isSuspicious).map((s) => s.id);
    const isCorrect =
      selectedIds.length === correct.length &&
      selectedIds.every((id) => correct.includes(id));
    setChecked(true);
    onChange([
      ...answers.filter((a) => a.key !== "scam_phishing_result"),
      { key: "scam_phishing_result", value: { selectedIds, isCorrect } },
    ]);
  };

  return (
    <Paper sx={{ p: 4, borderRadius: "24px", maxWidth: 700, mx: "auto" }}>
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ mb: 2, textAlign: "center" }}
      >
        📧 Найди признаки мошенничества
      </Typography>

      <Box
        sx={{
          p: 3,
          backgroundColor: "#F8F9FA",
          borderRadius: "16px",
          mb: 3,
          border: "1px solid #E5E7EB",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          📨 Письмо от:{" "}
          <strong style={{ color: "#EF4444" }}>support@robux-free.com</strong>
        </Typography>
        <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
          🎁 Ты выиграл 10000 робуксов!
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
          Поздравляем! Ты стал победителем нашего конкурса. Для получения приза
          перейди по ссылке и введи свои данные. Акция действует 5 минут!
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {signs.map((sign) => (
          <Paper
            key={sign.id}
            onClick={() => toggleSign(sign.id)}
            sx={{
              p: 2,
              borderRadius: "12px",
              cursor: checked ? "default" : "pointer",
              border: selectedIds.includes(sign.id)
                ? "2px solid #7C4DFF"
                : "1px solid #E5E7EB",
              backgroundColor: selectedIds.includes(sign.id)
                ? "#F1EBFF"
                : "#FFFFFF",
            }}
          >
            <Typography>{sign.text}</Typography>
          </Paper>
        ))}
      </Stack>

      {!checked ? (
        <Button
          variant="contained"
          fullWidth
          disabled={selectedIds.length === 0}
          onClick={handleCheck}
          sx={{ py: 1.5, borderRadius: "16px", fontSize: 16 }}
        >
          Проверить
        </Button>
      ) : (
        <Alert
          severity={
            selectedIds.every(
              (id) => signs.find((s) => s.id === id)?.isSuspicious,
            )
              ? "success"
              : "error"
          }
        >
          {selectedIds.every(
            (id) => signs.find((s) => s.id === id)?.isSuspicious,
          )
            ? "✅ Ты нашёл все признаки мошенничества!"
            : "❌ Не все признаки найдены. Обрати внимание на адрес отправителя и просьбу ввести пароль!"}
        </Alert>
      )}
    </Paper>
  );
}
