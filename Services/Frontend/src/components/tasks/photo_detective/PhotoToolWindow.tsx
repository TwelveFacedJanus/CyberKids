// components/tasks/photo_detective/PhotoToolWindow.tsx
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import Close from "@mui/icons-material/Close";
import type { ReactNode } from "react";

interface Props {
  title: string;
  icon: string;
  onClose: () => void;
  children: ReactNode;
  accentColor?: string;
}

export default function PhotoToolWindow({
  title,
  icon,
  onClose,
  children,
  accentColor = "#26C6DA",
}: Props) {
  return (
    <Paper
      sx={{
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #E5E7EB",
        boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
        animation: "windowOpen 0.35s cubic-bezier(0.34,1.2,0.64,1) both",
        "@keyframes windowOpen": {
          "0%": { opacity: 0, transform: "translateY(20px) scale(0.96)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      }}
    >
      {/* Заголовок окна */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Typography fontSize={18}>{icon}</Typography>
        <Typography fontWeight={700} fontSize={14} sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: "#fff",
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
        >
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Paper>
  );
}
