// src/components/messenger/ChatItem.tsx
import { Box, Typography } from "@mui/material";
import MessengerAvatar from "./MessengerAvatar";
import type { Chat, Message } from "../../types/messenger";

interface Props {
  chat: Chat;
  selected: boolean;
  onClick: () => void;
}

function previewText(m: Message): string {
  switch (m.type) {
    case "text":
      return m.text.replace(/\n/g, " ");
    case "audio":
      return "🎤 Голосовое сообщение";
    case "meme":
      return "📎 " + (m.caption || "Изображение");
    case "transfer":
      return "💸 Перевод";
    case "card":
      return m.title || "Сообщение";
    case "recap":
      return "🏆 Итоги";
    case "quiz":
      return "❓ Вопрос";
    case "daysep":
      return "";
    default:
      return "...";
  }
}

export default function ChatItem({ chat, selected, onClick }: Props) {
  const last = chat.messages[chat.messages.length - 1];
  const preview = last ? previewText(last) : "Нет сообщений";
  const time =
    last?.type !== "daysep" && "time" in (last || {}) ? (last as any).time : "";

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.25,
        cursor: "pointer",
        borderLeft: "3px solid transparent",
        bgcolor: selected ? "#f1f6ff" : "transparent",
        borderLeftColor: selected ? "#2f7bf6" : "transparent",
        transition: "background 0.15s",
        "&:hover": { bgcolor: selected ? "#f1f6ff" : "#f7f8fa" },
      }}
    >
      <MessengerAvatar name={chat.name} imgSrc={chat.avatarKey} size={44} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <Typography
            sx={{
              fontSize: 14.5,
              fontWeight: chat.unread ? 800 : 600,
              color: "#1c1e21",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {chat.name}
          </Typography>
          <Typography
            sx={{ fontSize: 11.5, color: "#8a8f98", flexShrink: 0, ml: 0.75 }}
          >
            {time}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 0.25,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              color: chat.unread ? "#3a3d42" : "#8a8f98",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {preview}
          </Typography>

          {chat.unread > 0 && (
            <Box
              sx={{
                bgcolor: "#2f7bf6",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                minWidth: 19,
                height: 19,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 0.625,
                flexShrink: 0,
              }}
            >
              {chat.unread}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
