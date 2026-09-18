// src/components/messenger/messages/RecapCard.tsx
import { Box, Typography } from "@mui/material";
import type { RecapMessage } from "../../types/messenger";

interface Props {
  msg: RecapMessage;
}

export default function RecapCard({ msg }: Props) {
  return (
    <Box
      sx={{
        alignSelf: "center",
        display: "flex",
        gap: 1.25,
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: "92%",
        my: 0.5,
      }}
    >
      {msg.items.map((it, i) => (
        <Box
          key={i}
          sx={{
            bgcolor: "#fff",
            border: "1px solid #dfe3e8",
            borderRadius: "14px",
            p: 1.75,
            width: 150,
            textAlign: "center",
            fontSize: 13,
          }}
        >
          <Typography sx={{ fontSize: 22 }}>{it.icon}</Typography>
          <Typography sx={{ fontWeight: 800, my: 0.5 }}>{it.title}</Typography>
          <Typography sx={{ fontSize: 13 }}>{it.text}</Typography>
        </Box>
      ))}
    </Box>
  );
}
