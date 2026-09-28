// components/tasks/fake_friend_chat/RealFriendModal.tsx
import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

interface Message {
  from: "me" | "them";
  text: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  messages: Message[];
}

export default function RealFriendModal({ open, onClose, messages }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>
        Чат с настоящим Андреем
      </DialogTitle>
      <DialogContent>
        <Typography fontSize={12} color="text.secondary" sx={{ mb: 2 }}>
          Последние сообщения из вашего прошлого чата:
        </Typography>
        <Stack spacing={1.5}>
          {messages.map((m, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: m.from === "me" ? "flex-end" : "flex-start",
              }}
            >
              <Stack
                direction={m.from === "me" ? "row-reverse" : "row"}
                spacing={1}
                alignItems="flex-end"
              >
                {m.from === "them" && (
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#22C55E",
                      fontSize: 16,
                    }}
                  >
                    🐺
                  </Avatar>
                )}
                <Box
                  sx={{
                    px: 1.75,
                    py: 1,
                    borderRadius:
                      m.from === "me"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    backgroundColor: m.from === "me" ? "#DCF8C6" : "#FFFFFF",
                    border:
                      m.from === "me"
                        ? "1px solid #A5D6A7"
                        : "1px solid #E5E7EB",
                    maxWidth: 320,
                  }}
                >
                  <Typography fontSize={13.5} sx={{ lineHeight: 1.4 }}>
                    {m.text}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
