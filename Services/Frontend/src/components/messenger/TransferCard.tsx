// src/components/messenger/messages/TransferCard.tsx
import { Box, Typography } from "@mui/material";
import type { TransferMessage } from "../../types/messenger";

interface Props {
  msg: TransferMessage;
}

export default function TransferCard({ msg }: Props) {
  return (
    <Box
      sx={{
        alignSelf: "center",
        width: 260,
        bgcolor: "#fff",
        border: "1px solid #dfe3e8",
        borderRadius: "14px",
        p: 2,
        textAlign: "center",
        my: 0.5,
      }}
    >
      <Typography
        sx={{
          color: "#38b06a",
          fontSize: 13,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.75,
        }}
      >
        💸 Перевод выполнен
      </Typography>
      <Typography
        sx={{ fontSize: 22, fontWeight: 800, color: "#e5443a", mt: 0.75 }}
      >
        −{msg.amount} ₽
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#8a8f98" }}>
        на номер {msg.to}
      </Typography>
    </Box>
  );
}
