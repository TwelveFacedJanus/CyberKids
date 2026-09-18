// src/components/messenger/messages/MemeMessage.tsx
import { Box, Typography } from "@mui/material";
import type { MemeMessage as TMeme } from "../../types/messenger";
import MessageFooter from "./MessageFooter";

interface Props {
  msg: TMeme;
}

export default function MemeMessage({ msg }: Props) {
  return (
    <Box
      sx={{
        px: 1.5,
        pt: 1.125,
        pb: 0.875,
        borderRadius: "16px",
        boxShadow: "0 1px 1px rgba(0,0,0,.04)",
        ...(msg.from === "them"
          ? { bgcolor: "#fff", color: "#1c1e21", borderBottomLeftRadius: "4px" }
          : {
              bgcolor: "#d7ecff",
              color: "#0e2a44",
              border: "1px solid #c3e3ff",
              borderBottomRightRadius: "4px",
            }),
      }}
    >
      <Box
        component="img"
        src={msg.img}
        alt="мем"
        onError={(e) => {
          (e.target as HTMLImageElement).style.background = "#dde3ea";
        }}
        sx={{
          width: 345,
          maxWidth: "100%",
          borderRadius: "12px",
          display: "block",
          bgcolor: "#dde3ea",
          minHeight: 225,
          objectFit: "cover",
        }}
      />
      {msg.caption && (
        <Typography sx={{ fontSize: 13.5, mt: 0.75 }}>{msg.caption}</Typography>
      )}
      <MessageFooter msg={msg} />
    </Box>
  );
}
