// src/components/messenger/ChatList.tsx
import { Box, Typography, InputBase, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatItem from "./ChatItem";
import type { Chat, ChatFilter } from "../../types/messenger";

interface Props {
  chats: Record<string, Chat>;
  chatOrder: string[];
  activeChatId: string | null;
  filterMode: ChatFilter;
  onSelectChat: (id: string) => void;
}

export default function ChatList({
  chats,
  chatOrder,
  activeChatId,
  filterMode,
  onSelectChat,
}: Props) {
  return (
    <Box
      sx={{
        width: 320,
        borderRight: "1px solid #e7e9ec",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        bgcolor: "#fff",
        minHeight: 0,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pt: 2.25,
          pb: 1.25,
        }}
      >
        <Typography sx={{ fontSize: 22, fontWeight: 800, letterSpacing: 0.2 }}>
          ALEX
        </Typography>
        <IconButton
          size="small"
          disabled
          sx={{
            width: 34,
            height: 34,
            bgcolor: "#1c1e21",
            color: "#fff",
            "&:hover": { bgcolor: "#1c1e21" },
            "&.Mui-disabled": { bgcolor: "#1c1e21", color: "#fff" },
          }}
        >
          <AddIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <InputBase
          placeholder="Поиск"
          disabled
          fullWidth
          sx={{
            bgcolor: "#f1f2f5",
            borderRadius: "10px",
            px: 1.5,
            py: 1.25,
            fontSize: 14,
            "& input::placeholder": { color: "#8a8f98", opacity: 1 },
          }}
        />
      </Box>

      {/* Chats */}
      <Box sx={{ overflowY: "auto", flex: 1 }}>
        {chatOrder.map((id) => {
          const c = chats[id];
          if (c.hidden) return null;
          if (filterMode === "unread" && c.unread === 0) return null;
          return (
            <ChatItem
              key={id}
              chat={c}
              selected={activeChatId === id}
              onClick={() => onSelectChat(id)}
            />
          );
        })}
      </Box>
    </Box>
  );
}
