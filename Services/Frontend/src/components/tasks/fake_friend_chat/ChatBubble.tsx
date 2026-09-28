// components/tasks/fake_friend_chat/ChatBubble.tsx
import { Avatar, Box, Typography } from "@mui/material";

interface Props {
  text: string;
  avatar: string;
  name: string;
  delay?: number;
  visible: boolean;
  isRealFriend?: boolean;
}

export default function ChatBubble({
  text,
  avatar,
  name,
  visible,
  isRealFriend = false,
}: Props) {
  if (!visible) return null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        alignItems: "flex-start",
        animation: "bubbleIn 0.4s cubic-bezier(0.34,1.2,0.64,1) both",
        "@keyframes bubbleIn": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: isRealFriend ? "#22C55E" : "#7C4DFF",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {avatar}
      </Avatar>

      <Box sx={{ minWidth: 0, maxWidth: "80%" }}>
        <Typography
          fontSize={11}
          fontWeight={700}
          sx={{ color: "#6B7280", mb: 0.25, ml: 0.5 }}
        >
          {name}
        </Typography>
        <Box
          sx={{
            px: 2,
            py: 1.25,
            borderRadius: "4px 16px 16px 16px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            border: "1px solid #E5E7EB",
          }}
        >
          <Typography fontSize={14.5} sx={{ lineHeight: 1.5 }}>
            {text}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
