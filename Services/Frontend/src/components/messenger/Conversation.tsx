// src/components/messenger/Conversation.tsx
import { useEffect, useRef } from "react";
import { Box, Typography, IconButton, InputBase } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MessengerAvatar from "./MessengerAvatar";
import MessageRow from "./MessageRow";
import { useMessenger } from "../../context/MessengerContext";
import type { Chat } from "../../types/messenger";

import { SvgIcon } from "@mui/material";
import ChatIcon from "../../../public/ui-icons/message.svg?react";

interface Props {
  chat: Chat | null;
  onBack: () => void;
}

export default function Conversation({ chat, onBack }: Props) {
  const { markMessageListened } = useMessenger();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const s = scrollerRef.current;
    if (s) s.scrollTop = s.scrollHeight;
  }, [chat?.messages.length, chat?.id]);

  if (!chat) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8a8f98",
          fontSize: 14,
          flexDirection: "column",
          gap: 1.25,
        }}
      >
        {/* <ChatIcon
          sx={{ fontSize: 46, color: "#c7cbd1", width: 60, height: 60 }}
        /> */}
        <SvgIcon component={ChatIcon} sx={{ fontSize: 64 }} />
        Выбери чат слева
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid #e7e9ec",
          bgcolor: "#fff",
        }}
      >
        <IconButton
          onClick={onBack}
          sx={{ display: { xs: "flex", sm: "none" } }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <MessengerAvatar name={chat.name} imgSrc={chat.avatarKey} size={38} />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
            {chat.name}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#8a8f98", mt: 0.125 }}>
            {chat.status}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.25 }}>
          {[PhoneIcon, VideocamIcon, SearchIcon].map((Icon, i) => (
            <IconButton
              key={i}
              disabled
              sx={{
                width: 34,
                height: 34,
                bgcolor: "#f1f2f5",
                color: "#1c1e21",
                "&.Mui-disabled": { bgcolor: "#f1f2f5", color: "#1c1e21" },
              }}
            >
              <Icon sx={{ fontSize: 16 }} />
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Scroller */}
      <Box
        ref={scrollerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          px: "6%",
          pt: 2.75,
          pb: 1.75,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          background: `
            radial-gradient(circle at 12% 18%, rgba(255,255,255,.35) 0 2px, transparent 3px),
            radial-gradient(circle at 82% 12%, rgba(255,255,255,.3) 0 2px, transparent 3px),
            radial-gradient(circle at 32% 62%, rgba(255,255,255,.3) 0 2px, transparent 3px),
            radial-gradient(circle at 68% 78%, rgba(255,255,255,.3) 0 2px, transparent 3px),
            radial-gradient(circle at 92% 55%, rgba(255,255,255,.3) 0 2px, transparent 3px),
            radial-gradient(circle at 6% 82%, rgba(255,255,255,.3) 0 2px, transparent 3px),
            radial-gradient(circle at 50% 32%, rgba(255,255,255,.25) 0 2px, transparent 3px),
            linear-gradient(160deg, #a8dee2 0%, #8fc9e6 45%, #7fb3e8 100%)
          `,
          backgroundSize:
            "220px 220px, 260px 260px, 200px 200px, 240px 240px, 210px 210px, 230px 230px, 250px 250px, cover",
        }}
      >
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
            Сегодня
          </Typography>
        </Box>

        {chat.messages.map((m) => (
          <MessageRow
            key={m.id}
            msg={m}
            chat={chat}
            onAudioListened={(messageId) =>
              markMessageListened(chat.id, messageId)
            }
          />
        ))}
      </Box>

      {/* Input bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 2.5,
          py: 1.5,
          borderTop: "1px solid #e7e9ec",
          bgcolor: "#fff",
        }}
      >
        <IconButton disabled sx={{ color: "#9199a3" }}>
          <AttachFileIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <InputBase
          placeholder="Сообщения в этом чате идут по сюжету"
          disabled
          fullWidth
          sx={{
            flex: 1,
            bgcolor: "#f1f2f5",
            borderRadius: "20px",
            px: 2,
            py: 1.25,
            fontSize: 14,
            "& input::placeholder": { color: "#9199a3", opacity: 1 },
          }}
        />

        <IconButton disabled sx={{ color: "#9199a3" }}>
          <SentimentSatisfiedAltIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          disabled
          sx={{
            width: 38,
            height: 38,
            bgcolor: "#2f7bf6",
            color: "#fff",
            opacity: 0.5,
            "&.Mui-disabled": { bgcolor: "#2f7bf6", color: "#fff" },
          }}
        >
          <ArrowUpwardIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Box>
    </Box>
  );
}
