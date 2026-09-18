// src/components/messenger/messages/TextMessage.tsx
import { Box, Typography } from "@mui/material";
import { parseLinks } from "./utils";
import type { TextMessage as TText } from "../../types/messenger";
import MessageFooter from "./MessageFooter";

interface Props {
  msg: TText;
}

export default function TextMessage({ msg }: Props) {
  const parts = parseLinks(msg.text);

  return (
    <Box
      sx={{
        px: 1.5,
        pt: 1.125,
        pb: 0.875,
        borderRadius: "16px",
        fontSize: 14.5,
        lineHeight: 1.42,
        boxShadow: "0 1px 1px rgba(0,0,0,.04)",
        wordBreak: "break-word",
        ...(msg.from === "them"
          ? {
              bgcolor: "#fff",
              color: "#1c1e21",
              borderBottomLeftRadius: "4px",
            }
          : {
              bgcolor: "#d7ecff",
              color: "#0e2a44",
              border: "1px solid #c3e3ff",
              borderBottomRightRadius: "4px",
            }),
      }}
    >
      {parts.map((p, i) =>
        p.type === "link" ? (
          <Typography
            key={i}
            component="span"
            sx={{
              color: "#1f5fd1",
              textDecoration: "underline",
              wordBreak: "break-all",
            }}
          >
            {p.value}
          </Typography>
        ) : (
          <Typography key={i} component="span" sx={{ whiteSpace: "pre-line" }}>
            {p.value}
          </Typography>
        ),
      )}

      <MessageFooter msg={msg} />
    </Box>
  );
}
