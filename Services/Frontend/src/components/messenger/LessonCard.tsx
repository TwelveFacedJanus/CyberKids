// src/components/messenger/messages/LessonCard.tsx
import { Box, Typography, Button } from "@mui/material";
import type { LessonCardMessage } from "../../types/messenger";

interface Props {
  msg: LessonCardMessage;
}

const TONES = {
  green: { bgcolor: "#e7f7ec", border: "1px solid #38b06a", color: "#175c36" },
  red: { bgcolor: "#fdebe9", border: "1px solid #e5443a", color: "#7a201a" },
  blue: { bgcolor: "#e8f1ff", border: "1px solid #2f7bf6", color: "#12377c" },
  gray: { bgcolor: "#fff", border: "1px solid #dfe3e8", color: "#1c1e21" },
};

export default function LessonCard({ msg }: Props) {
  const tone = TONES[msg.tone] || TONES.gray;

  return (
    <Box
      sx={{
        alignSelf: "center",
        maxWidth: "86%",
        width: 420,
        borderRadius: "14px",
        p: 1.75,
        fontSize: 14,
        lineHeight: 1.45,
        my: 0.5,
        ...tone,
      }}
    >
      {(msg.icon || msg.title) && (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.875, mb: 0.5 }}
        >
          {msg.icon && (
            <Typography sx={{ fontSize: 16 }}>{msg.icon}</Typography>
          )}
          {msg.title && (
            <Typography sx={{ fontWeight: 800, fontSize: 14.5 }}>
              {msg.title}
            </Typography>
          )}
        </Box>
      )}

      {msg.text && <Typography sx={{ fontSize: 14 }}>{msg.text}</Typography>}

      {msg.rule && (
        <Box
          sx={{
            mt: 1,
            pt: 1,
            borderTop: "1px dashed rgba(0,0,0,.15)",
            fontSize: 13,
          }}
        >
          <Typography
            sx={{
              fontSize: 11.5,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              opacity: 0.7,
              mb: 0.25,
              fontWeight: 700,
            }}
          >
            {msg.ruleLabel || "Правило"}
          </Typography>
          <Typography sx={{ fontSize: 13 }}>{msg.rule}</Typography>
        </Box>
      )}

      {msg.button && (
        <Button
          onClick={() => {
            const fn = (window as any)[msg.button!.action];
            if (typeof fn === "function") fn();
          }}
          sx={{
            mt: 1.25,
            bgcolor: "#fff",
            color: "#1c1e21",
            border: "1px solid rgba(0,0,0,.15)",
            borderRadius: "10px",
            px: 1.5,
            py: 1,
            fontSize: 13,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { bgcolor: "#f6f7f9" },
          }}
        >
          {msg.button.label}
        </Button>
      )}
    </Box>
  );
}
