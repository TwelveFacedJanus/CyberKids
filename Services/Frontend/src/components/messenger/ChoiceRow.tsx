// src/components/messenger/ChoiceRow.tsx
import { Box, Button } from "@mui/material";
import type { Choice } from "../../types/messenger";

interface Props {
  choices: Choice[] | null;
}

const STYLES = {
  good: { color: "#1a7a45" },
  bad: { color: "#c53c30" },
  neutral: { color: "#1f5fd1" },
};

export default function ChoiceRow({ choices }: Props) {
  if (!choices || choices.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        px: "6%",
        pt: 1.25,
      }}
    >
      {choices.map((c, i) => (
        <Button
          key={i}
          onClick={c.action}
          sx={{
            bgcolor: "#fff",
            color: STYLES[c.style].color,
            borderRadius: "22px",
            px: 2,
            py: 1.25,
            fontSize: 13.5,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 2px 6px rgba(20,30,50,.12)",
            "&:hover": { bgcolor: "#fff", transform: "translateY(-1px)" },
          }}
        >
          {c.label}
        </Button>
      ))}
    </Box>
  );
}