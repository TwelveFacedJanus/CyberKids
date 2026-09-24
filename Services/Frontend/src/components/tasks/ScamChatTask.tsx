// components/tasks/ScamChatTask.tsx
import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import type { TaskComponentProps } from "./taskUtils";

interface ChatMessage {
  id: string;
  user: string;
  level?: number;
  status?: "online" | "offline" | "idle";
  time?: string;
  avatar: string;
  text: string;
  isScam: boolean;
  explanation?: string;
}

const AVATAR_COLORS = [
  "#7C4DFF",
  "#EC407A",
  "#FF7043",
  "#42A5F5",
  "#66BB6A",
  "#FFCA28",
  "#AB47BC",
  "#26C6DA",
];

function avatarColor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

const STATUS_DOT: Record<string, string> = {
  online: "#22C55E",
  idle: "#F59E0B",
  offline: "#9CA3AF",
};

export default function ScamChatTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const messages: ChatMessage[] = content.messages || [];
  const channelName = (content as any).channelName || "Игровой чат";

  const [selected, setSelected] = useState<string[]>(() => {
    const saved = answers.find((a) => a.key === "scam_chat_result");
    const value = saved?.value as { selectedIds?: string[] } | undefined;
    return value?.selectedIds || [];
  });
  const [checked, setChecked] = useState(false);

  const totalScam = messages.filter((m) => m.isScam).length;

  const toggle = (id: string) => {
    if (checked) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCheck = () => {
    const correctIds = messages.filter((m) => m.isScam).map((m) => m.id);
    const caught = selected.filter((id) => correctIds.includes(id)).length;
    const wrong = selected.filter((id) => !correctIds.includes(id)).length;
    const isCorrect = caught === totalScam && wrong === 0;

    setChecked(true);
    onChange([
      ...answers.filter((a) => a.key !== "scam_chat_result"),
      {
        key: "scam_chat_result",
        value: {
          selectedIds: selected,
          shownIds: messages.map((m) => m.id),
          caught,
          totalScam,
          wrong,
          isCorrect,
        },
      },
    ]);
  };

  const handleReset = () => {
    setSelected([]);
    setChecked(false);
    onChange(answers.filter((a) => a.key !== "scam_chat_result"));
  };

  const caught = messages.filter(
    (m) => m.isScam && selected.includes(m.id),
  ).length;
  const missed = messages.filter(
    (m) => m.isScam && !selected.includes(m.id),
  ).length;
  const falsePositives = selected.filter(
    (id) => !messages.find((m) => m.id === id)?.isScam,
  ).length;

  return (
    <Stack spacing={3}>
      {/* ─── Заголовок канала ─── */}
      <Paper
        sx={{
          p: 2,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #1E1E2E, #2A2A3E)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #FF6B6B, #EC407A)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
          }}
        >
          💬
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography fontWeight={800} fontSize={15}>
            {channelName}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mt: 0.25 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#22C55E",
                boxShadow: "0 0 8px #22C55E",
              }}
            />
            <Typography fontSize={12} sx={{ opacity: 0.7 }}>
              {messages.length} участников · 3 мошенника в чате
            </Typography>
          </Stack>
        </Box>
        <Chip
          label="Модератор"
          size="small"
          sx={{
            bgcolor: "rgba(124,77,255,0.25)",
            color: "#B388FF",
            fontWeight: 700,
            fontSize: 11,
          }}
        />
      </Paper>

      {/* ─── Сообщения ─── */}
      <Stack data-tutorial="scam-chat" spacing={1.5}>
        {messages.map((msg) => {
          const isSelected = selected.includes(msg.id);
          const isCorrectScam = checked && msg.isScam && isSelected;
          const isWrongPick = checked && !msg.isScam && isSelected;
          const isMissed = checked && msg.isScam && !isSelected;

          let borderColor = "transparent";
          let bg = "#FFFFFF";
          if (checked) {
            if (isCorrectScam) {
              borderColor = "#22C55E";
              bg = "#F0FDF4";
            } else if (isWrongPick) {
              borderColor = "#EF4444";
              bg = "#FEF2F2";
            } else if (isMissed) {
              borderColor = "#F59E0B";
              bg = "#FFFBEB";
            }
          } else if (isSelected) {
            borderColor = "#7C4DFF";
            bg = "#F1EBFF";
          }

          return (
            <Paper
              key={msg.id}
              onClick={() => toggle(msg.id)}
              sx={{
                p: 2,
                borderRadius: "16px",
                cursor: checked ? "default" : "pointer",
                border: `2px solid ${borderColor}`,
                backgroundColor: bg,
                transition: "all 0.2s ease",
                position: "relative",
                "&:hover": {
                  transform: checked ? "none" : "translateX(4px)",
                  boxShadow: checked ? "none" : "0 4px 16px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                {/* Аватар */}
                <Box sx={{ position: "relative", flexShrink: 0 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: avatarColor(msg.user),
                      fontSize: 20,
                    }}
                  >
                    {msg.avatar}
                  </Avatar>
                  {msg.status && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: STATUS_DOT[msg.status],
                        border: "2px solid #fff",
                      }}
                    />
                  )}
                </Box>

                {/* Контент */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography fontWeight={700} fontSize={14}>
                      {msg.user}
                    </Typography>
                    {msg.level !== undefined && (
                      <Chip
                        label={`Ур. ${msg.level}`}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 10,
                          fontWeight: 700,
                          bgcolor: "#F1EBFF",
                        }}
                      />
                    )}
                    {msg.time && (
                      <Typography
                        fontSize={11}
                        color="text.secondary"
                        sx={{ ml: "auto" }}
                      >
                        {msg.time}
                      </Typography>
                    )}
                  </Stack>

                  <Typography
                    fontSize={14}
                    sx={{
                      lineHeight: 1.45,
                      color: msg.isScam && checked ? "#7A1A1A" : "#1A1A2E",
                    }}
                  >
                    {msg.text}
                  </Typography>

                  {/* Бейдж статуса после проверки */}
                  {checked && (
                    <Stack
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      {isCorrectScam && (
                        <>
                          <CheckCircle
                            sx={{ fontSize: 16, color: "#22C55E" }}
                          />
                          <Typography
                            fontSize={12}
                            fontWeight={700}
                            color="#166534"
                          >
                            Мошенник пойман!
                          </Typography>
                        </>
                      )}
                      {isWrongPick && (
                        <>
                          <Cancel sx={{ fontSize: 16, color: "#EF4444" }} />
                          <Typography
                            fontSize={12}
                            fontWeight={700}
                            color="#991B1B"
                          >
                            Это обычный игрок
                          </Typography>
                        </>
                      )}
                      {isMissed && (
                        <>
                          <Cancel sx={{ fontSize: 16, color: "#F59E0B" }} />
                          <Typography
                            fontSize={12}
                            fontWeight={700}
                            color="#92400E"
                          >
                            Пропущенный мошенник
                          </Typography>
                        </>
                      )}
                    </Stack>
                  )}
                </Box>

                {/* Иконка выбора до проверки */}
                {!checked && isSelected && (
                  <CheckCircle sx={{ fontSize: 22, color: "#7C4DFF" }} />
                )}
              </Stack>
            </Paper>
          );
        })}
      </Stack>

      {/* ─── Итог ─── */}
      {checked && (
        <Paper
          sx={{
            p: 3,
            borderRadius: "16px",
            background:
              caught === totalScam && falsePositives === 0
                ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
                : "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
            border: `2px solid ${
              caught === totalScam && falsePositives === 0
                ? "#22C55E"
                : "#F59E0B"
            }`,
          }}
        >
          <Typography
            variant="h6"
            fontWeight={900}
            sx={{
              mb: 1,
              color:
                caught === totalScam && falsePositives === 0
                  ? "#166534"
                  : "#92400E",
            }}
          >
            {caught === totalScam && falsePositives === 0
              ? "🏆 Все мошенники пойманы!"
              : "Есть промахи"}
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
            <Chip
              label={`✅ Поймано: ${caught} из ${totalScam}`}
              sx={{ bgcolor: "#DCFCE7", color: "#166534", fontWeight: 700 }}
            />
            {missed > 0 && (
              <Chip
                label={`⚠️ Пропущено: ${missed}`}
                sx={{ bgcolor: "#FEF3C7", color: "#92400E", fontWeight: 700 }}
              />
            )}
            {falsePositives > 0 && (
              <Chip
                label={`❌ Ошибся: ${falsePositives}`}
                sx={{ bgcolor: "#FEE2E2", color: "#991B1B", fontWeight: 700 }}
              />
            )}
          </Stack>

          <Typography fontSize={13.5} color="text.secondary" sx={{ mb: 2 }}>
            💡 Мошенников выдают: просьба дать пароль, обещание бесплатной
            валюты, ссылки на подозрительные сайты, угрозы блокировки аккаунта.
          </Typography>

          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ borderRadius: "12px", fontWeight: 700 }}
          >
            Пройти заново
          </Button>
        </Paper>
      )}

      {/* ─── Кнопка проверки ─── */}
      {!checked && (
        <Button
          data-tutorial="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={selected.length === 0}
          onClick={handleCheck}
          sx={{
            py: 1.8,
            fontSize: 17,
            fontWeight: 800,
            borderRadius: "14px",
            background:
              selected.length === 0
                ? undefined
                : "linear-gradient(135deg, #7C4DFF, #EC407A)",
            "&:hover": {
              background:
                selected.length === 0
                  ? undefined
                  : "linear-gradient(135deg, #6A3EE0, #D6356B)",
            },
          }}
        >
          {selected.length === 0
            ? "Отметь подозрительные сообщения"
            : `Проверить (выбрано ${selected.length})`}
        </Button>
      )}
    </Stack>
  );
}
