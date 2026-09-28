// components/tasks/fake_friend_chat/FriendProfileModal.tsx
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import WarningAmber from "@mui/icons-material/WarningAmber";

interface Props {
  open: boolean;
  onClose: () => void;
  nickname: string;
  fakeAvatar: string;
  realAvatar: string;
}

export default function FriendProfileModal({
  open,
  onClose,
  nickname,
  fakeAvatar,
  realAvatar,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>Профиль игрока</DialogTitle>
      <DialogContent>
        <Stack spacing={2} alignItems="center" sx={{ pt: 1 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "#7C4DFF",
              fontSize: 52,
            }}
          >
            {fakeAvatar}
          </Avatar>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight={800}>
              {nickname}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Игрок Roblox
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              p: 1.5,
              borderRadius: "10px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FCA5A5",
              display: "flex",
              gap: 1,
              alignItems: "flex-start",
            }}
          >
            <WarningAmber sx={{ color: "#EF4444", fontSize: 20, mt: 0.25 }} />
            <Box>
              <Typography fontSize={12} fontWeight={700} color="#991B1B">
                Недавняя регистрация
              </Typography>
              <Typography fontSize={11} color="#B91C1C">
                Аккаунт создан 2 дня назад
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              p: 1.5,
              borderRadius: "10px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FCA5A5",
              display: "flex",
              gap: 1,
              alignItems: "flex-start",
            }}
          >
            <WarningAmber sx={{ color: "#EF4444", fontSize: 20, mt: 0.25 }} />
            <Box>
              <Typography fontSize={12} fontWeight={700} color="#991B1B">
                Другой аватар
              </Typography>
              <Typography fontSize={11} color="#B91C1C">
                У настоящего Андрея — {realAvatar}, а тут — {fakeAvatar}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography fontSize={18} fontWeight={800}>
                0
              </Typography>
              <Typography fontSize={10} color="text.secondary">
                Общих друзей
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography fontSize={18} fontWeight={800}>
                0
              </Typography>
              <Typography fontSize={10} color="text.secondary">
                Совместных игр
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography fontSize={18} fontWeight={800}>
                2 дн.
              </Typography>
              <Typography fontSize={10} color="text.secondary">
                Регистрация
              </Typography>
            </Box>
          </Stack>

          <Chip
            label="⚠️ Похоже на подделку"
            sx={{
              bgcolor: "#FEE2E2",
              color: "#991B1B",
              fontWeight: 700,
            }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
