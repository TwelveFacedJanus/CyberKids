// frontend/src/components/IntroModal.tsx
import { type ReactNode } from "react";
import {
  Box,
  Button,
  Dialog,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface IntroModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  emoji?: string;
  children?: ReactNode;
  confirmLabel?: string;
  accent?: string;
  showCloseIcon?: boolean;
  onDontShowAgain?: () => void;
}

export default function IntroModal({
  open,
  onClose,
  title,
  description,
  emoji = "✨",
  children,
  confirmLabel = "Поехали",
  accent = "#7C4DFF",
  showCloseIcon = true,
  onDontShowAgain,
}: IntroModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          overflow: "hidden",
          p: 0,
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(10, 10, 25, 0.65)",
            backdropFilter: "blur(6px)",
          },
        },
      }}
    >
      {/* Шапка с градиентом */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 60%, ${accent}99 100%)`,
          color: "#fff",
          px: 4,
          pt: 4,
          pb: 3,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {showCloseIcon && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#fff",
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
            aria-label="Закрыть"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}

        <Box
          sx={{
            fontSize: 64,
            lineHeight: 1,
            mb: 2,
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.25))",
            animation: "introPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            "@keyframes introPop": {
              "0%": { transform: "scale(0) rotate(-30deg)", opacity: 0 },
              "60%": { transform: "scale(1.15) rotate(6deg)", opacity: 1 },
              "100%": { transform: "scale(1) rotate(0deg)" },
            },
          }}
        >
          {emoji}
        </Box>

        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "-0.01em",
            lineHeight: 1.25,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            sx={{
              mt: 1.5,
              fontSize: 15,
              opacity: 0.95,
              lineHeight: 1.6,
              maxWidth: 460,
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      {/* Контент */}
      <Box sx={{ px: 4, py: 3 }}>
        {children && <Box sx={{ mb: 3 }}>{children}</Box>}

        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          flexWrap="wrap"
        >
          {onDontShowAgain && (
            <Button
              variant="text"
              size="large"
              onClick={onDontShowAgain}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: "14px",
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.05)",
                },
              }}
            >
              Больше не показывать
            </Button>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={onClose}
            sx={{
              py: 1.5,
              px: 5,
              borderRadius: "14px",
              fontSize: 17,
              fontWeight: 800,
              textTransform: "none",
              background: `linear-gradient(135deg, ${accent}, ${accent}CC)`,
              boxShadow: `0 8px 24px ${accent}55`,
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 32px ${accent}77`,
                background: `linear-gradient(135deg, ${accent}, ${accent}CC)`,
              },
            }}
          >
            {confirmLabel}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
