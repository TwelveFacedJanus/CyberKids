// components/tasks/ScamChatTask.tsx
import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Avatar,
  Chip,
  Button,
  Alert,
} from "@mui/material";
import { type TaskComponentProps } from "./taskUtils";

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  isScam: boolean;
  explanation?: string;
}

export default function ScamChatTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const messages: ChatMessage[] = content.messages || [];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [scamFound, setScamFound] = useState(false);

  const handleSelect = (id: string) => {
    if (checked) return;
    setSelectedId(id);
  };

  const handleCheck = () => {
    if (!selectedId) return;
    const msg = messages.find((m) => m.id === selectedId);
    if (msg) {
      setScamFound(msg.isScam);
      setChecked(true);
      onChange([
        ...answers.filter((a) => a.key !== "scam_chat_result"),
        {
          key: "scam_chat_result",
          value: { selectedId, isScam: msg.isScam },
        },
      ]);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: "24px", maxWidth: 700, mx: "auto" }}>
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{ mb: 2, textAlign: "center" }}
      >
        💬 Найди мошенника в чате
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 3 }}>
        {messages.map((msg) => {
          const isSelected = selectedId === msg.id;
          const isCorrect = isSelected && msg.isScam;
          const isWrong = isSelected && !msg.isScam;

          return (
            <Paper
              key={msg.id}
              onClick={() => handleSelect(msg.id)}
              sx={{
                p: 2,
                borderRadius: "16px",
                cursor: checked ? "default" : "pointer",
                border: isSelected
                  ? `2px solid ${msg.isScam ? "#EF4444" : "#22C55E"}`
                  : "1px solid #E5E7EB",
                backgroundColor: isSelected
                  ? msg.isScam
                    ? "#FEF2F2"
                    : "#F0FDF4"
                  : "#FFFFFF",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: checked ? undefined : "#7C4DFF",
                  transform: checked ? undefined : "scale(1.01)",
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{ bgcolor: msg.avatar === "🟢" ? "#22C55E" : "#EF4444" }}
                >
                  {msg.avatar}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700}>{msg.user}</Typography>
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
                {checked && isSelected && (
                  <Chip
                    label={msg.isScam ? "🚨 Мошенник!" : "✅ Безопасно"}
                    sx={{
                      backgroundColor: msg.isScam ? "#FEE2E2" : "#DCFCE7",
                      color: msg.isScam ? "#991B1B" : "#166534",
                      fontWeight: 700,
                    }}
                  />
                )}
              </Stack>
            </Paper>
          );
        })}
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
          severity={scamFound ? "success" : "error"}
          sx={{ borderRadius: "12px" }}
        >
          {scamFound
            ? "✅ Правильно! Ты нашёл мошенника!"
            : "❌ Неправильно. Мошенник пытается обмануть тебя!"}
        </Alert>
      )}
    </Paper>
  );
}
