// src/components/messenger/messages/MessageFooter.tsx
import { Box, Typography } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import type {
  TextMessage,
  AudioMessage,
  MemeMessage,
} from "../../types/messenger";

type AnyMessage = TextMessage | AudioMessage | MemeMessage;

interface Props {
  msg: AnyMessage;
}

export default function MessageFooter({ msg }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        justifyContent: msg.from === "me" ? "flex-end" : "flex-start",
        mt: 0.375,
        fontSize: 10.5,
        color: msg.from === "me" ? "#93989f" : "#a7abb1",
      }}
    >
      <Typography sx={{ fontSize: 10.5, color: "inherit" }}>
        {msg.time || ""}
      </Typography>
      {msg.from === "me" && (
        <DoneAllIcon sx={{ fontSize: 14, color: "#2f7bf6" }} />
      )}
    </Box>
  );
}
