// src/components/messenger/MessageRow.tsx
import { Box, Typography } from "@mui/material";
import MessengerAvatar from "./MessengerAvatar";
import TextMessage from "./TextMessage";
import AudioMessage from "./AudioMessage";
import MemeMessage from "./MemeMessage";
import LessonCard from "./LessonCard";
import TransferCard from "./TransferCard";
import RecapCard from "./RecapCard";
import QuizCard from "./QuizCard";
import { hashColor } from "./utils";
import type { Chat, Message } from "../../types/messenger";

interface Props {
  msg: Message;
  chat: Chat;
  onAudioListened?: (messageId: string) => void;
}

export default function MessageRow({ msg, chat, onAudioListened }: Props) {
  if (msg.type === "daysep") {
    return (
      <Box sx={{ alignSelf: "center", my: 0.75 }}>
        <Typography
          sx={{
            bgcolor: "rgba(255,255,255,.55)",
            color: "#3a4552",
            fontSize: 12,
            px: 1.5,
            py: 0.5,
            borderRadius: "20px",
          }}
        >
          {msg.text}
        </Typography>
      </Box>
    );
  }

  if (msg.type === "card") return <LessonCard msg={msg} />;
  if (msg.type === "recap") return <RecapCard msg={msg} />;
  if (msg.type === "quiz") return <QuizCard msg={msg} />;
  if (msg.type === "transfer") return <TransferCard msg={msg} />;

  const from = msg.from;
  const isGroupThem = from === "them" && chat.isGroup;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        maxWidth: "78%",
        alignSelf: from === "me" ? "flex-end" : "flex-start",
        flexDirection: from === "me" ? "row-reverse" : "row",
      }}
    >
      {isGroupThem && (
        <Box sx={{ alignSelf: "flex-end" }}>
          <MessengerAvatar
            name={msg.senderName || ""}
            imgSrc={msg.senderAvatar}
            size={30}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        {isGroupThem && msg.senderName && (
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              ml: 0.5,
              mb: 0.125,
              color: hashColor(msg.senderName),
            }}
          >
            {msg.senderName}
          </Typography>
        )}

        {msg.type === "text" && <TextMessage msg={msg} />}
        {msg.type === "audio" && (
          <AudioMessage
            msg={msg}
            onListened={() => onAudioListened?.(msg.id)}
          />
        )}
        {msg.type === "meme" && <MemeMessage msg={msg} />}
      </Box>
    </Box>
  );
}
