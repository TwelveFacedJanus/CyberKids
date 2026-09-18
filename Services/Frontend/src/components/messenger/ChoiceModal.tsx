// src/components/messenger/ChoiceModal.tsx
import {
  Box,
  Dialog,
  Typography,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMessenger } from "../../context/MessengerContext";
import type { Choice } from "../../types/messenger";

const STYLES = {
  good: {
    color: "#1a7a45",
    bgColor: "#e7f7ec",
    hoverBg: "#d1f0da",
    border: "#38b06a",
    icon: "✅",
  },
  bad: {
    color: "#c53c30",
    bgColor: "#fdebe9",
    hoverBg: "#fbd5d0",
    border: "#e5443a",
    icon: "❌",
  },
  neutral: {
    color: "#1f5fd1",
    bgColor: "#e8f1ff",
    hoverBg: "#d4e5ff",
    border: "#2f7bf6",
    icon: "ℹ️",
  },
};

export default function ChoiceModal() {
  const { state, hideChoiceModal } = useMessenger();
  const pending = state.pendingChoice;

  if (!pending) return null;

  return (
    <Dialog
      open={!!pending}
      onClose={hideChoiceModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "32px",
          p: 0,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        },
      }}
    >
      {/* Заголовок с градиентом */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #FF6B35 0%, #F72585 100%)",
          color: "#fff",
          px: 3,
          py: 3,
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          position: "relative",
        }}
      >
        <Box sx={{ flex: 1, pr: 3 }}>
          <Typography
            sx={{
              fontSize: 12,
              opacity: 0.85,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            Твоё решение
          </Typography>
          <Typography
            sx={{ fontSize: 20, fontWeight: 800, mt: 0.5, lineHeight: 1.3 }}
          >
            {pending.title}
          </Typography>
        </Box>

        <IconButton
          onClick={hideChoiceModal}
          sx={{
            color: "#fff",
            position: "absolute",
            top: 12,
            right: 12,
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Описание */}
      {pending.description && (
        <Box sx={{ px: 3, pt: 3 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#4a4d52",
              lineHeight: 1.6,
            }}
          >
            {pending.description}
          </Typography>
        </Box>
      )}

      {/* Опции */}
      <Stack spacing={1.5} sx={{ p: 3 }}>
        {pending.options.map((opt, i) => {
          const s = STYLES[opt.style] || STYLES.neutral;
          return (
            <Box
              key={i}
              onClick={() => {
                hideChoiceModal();
                opt.action();
              }}
              sx={{
                p: 2,
                borderRadius: "14px",
                bgcolor: s.bgColor,
                border: `2px solid ${s.border}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: s.hoverBg,
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 15.5,
                    fontWeight: 700,
                    color: s.color,
                    lineHeight: 1.3,
                  }}
                >
                  {opt.shortLabel || opt.label}
                </Typography>
                {opt.hint && (
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "#8a8f98",
                      mt: 0.5,
                      lineHeight: 1.4,
                    }}
                  >
                    {opt.hint}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  fontSize: 18,
                  color: s.color,
                  opacity: 0.5,
                  flexShrink: 0,
                }}
              >
                →
              </Box>
            </Box>
          );
        })}
      </Stack>

      {/* Подсказка снизу */}
      <Box
        sx={{
          px: 3,
          pb: 3,
          pt: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
        }}
      >
        <Typography sx={{ fontSize: 12, color: "#8a8f98" }}>
          Подумай, что бы сделал ты в реальной жизни
        </Typography>
      </Box>
    </Dialog>
  );
}
