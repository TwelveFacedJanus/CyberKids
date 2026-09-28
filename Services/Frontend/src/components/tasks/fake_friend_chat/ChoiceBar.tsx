// components/tasks/fake_friend_chat/ChoiceBar.tsx
import { Box, Button, Stack } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import WarningAmber from "@mui/icons-material/WarningAmber";
import Cancel from "@mui/icons-material/Cancel";

interface Option {
  id: string;
  style: "good" | "neutral" | "bad";
  text: string;
}

interface Props {
  title: string;
  options: Option[];
  onSelect: (style: "good" | "neutral" | "bad", optionId: string) => void;
}

const STYLE = {
  good: {
    color: "#22C55E",
    bg: "#F0FDF4",
    border: "#86EFAC",
    icon: <CheckCircle sx={{ fontSize: 18 }} />,
  },
  neutral: {
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FCD34D",
    icon: <WarningAmber sx={{ fontSize: 18 }} />,
  },
  bad: {
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FCA5A5",
    icon: <Cancel sx={{ fontSize: 18 }} />,
  },
};

export default function ChoiceBar({ title, options, onSelect }: Props) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "16px",
        backgroundColor: "#FAFAFA",
        border: "2px dashed #D1D5DB",
        animation: "choiceIn 0.4s ease both",
        "@keyframes choiceIn": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Box
        sx={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "#7C4DFF",
          fontWeight: 800,
          mb: 0.5,
        }}
      >
        Твой ход
      </Box>
      <Box
        sx={{
          fontSize: 15,
          fontWeight: 700,
          color: "#1A1A2E",
          mb: 2,
        }}
      >
        {title}
      </Box>

      <Stack spacing={1}>
        {options.map((opt) => {
          const s = STYLE[opt.style];
          return (
            <Button
              key={opt.id}
              onClick={() => onSelect(opt.style, opt.id)}
              startIcon={s.icon}
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
                textTransform: "none",
                py: 1.25,
                px: 2,
                borderRadius: "10px",
                backgroundColor: s.bg,
                color: s.color,
                border: `1px solid ${s.border}`,
                fontWeight: 700,
                fontSize: 13.5,
                "&:hover": {
                  backgroundColor: s.bg,
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
                transition: "all 0.2s ease",
              }}
            >
              {opt.text}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
