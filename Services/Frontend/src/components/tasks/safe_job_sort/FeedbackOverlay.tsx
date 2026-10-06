// components/tasks/safe_job_sort/FeedbackOverlay.tsx
import { Box, Paper, Typography } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import HelpOutline from "@mui/icons-material/HelpOutline";

interface Props {
  visible: boolean;
  correct: boolean;
  explanation: string;
  redFlags?: string[];
}

export default function FeedbackOverlay({
  visible,
  correct,
  explanation,
  redFlags,
}: Props) {
  if (!visible) return null;

  const color = correct ? "#22C55E" : "#EF4444";
  const bg = correct ? "#F0FDF4" : "#FEF2F2";
  const Icon = correct ? CheckCircle : HelpOutline;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 80,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1500,
        width: "min(560px, calc(100vw - 32px))",
        animation: "feedbackIn 0.4s cubic-bezier(0.34,1.2,0.64,1) both",
        "@keyframes feedbackIn": {
          "0%": {
            opacity: 0,
            transform: "translateX(-50%) translateY(-20px) scale(0.95)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(-50%) translateY(0) scale(1)",
          },
        },
      }}
    >
      <Paper
        sx={{
          p: 2.5,
          borderRadius: "16px",
          border: `2px solid ${color}`,
          backgroundColor: bg,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          <Icon sx={{ fontSize: 26, color, mt: 0.25, flexShrink: 0 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography fontWeight={800} fontSize={15} color={color}>
              {correct ? "Верно!" : "Проверь ещё раз."}
            </Typography>
            <Typography fontSize={13.5} sx={{ mt: 0.5, lineHeight: 1.5 }}>
              {explanation}
            </Typography>

            {redFlags && redFlags.length > 0 && !correct && (
              <Box sx={{ mt: 1.5 }}>
                <Typography
                  fontSize={11.5}
                  fontWeight={700}
                  color="#991B1B"
                  sx={{ mb: 0.5 }}
                >
                  Признаки мошенничества:
                </Typography>
                {redFlags.map((f, i) => (
                  <Typography key={i} fontSize={12} color="#7F1D1D">
                    • {f}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
