// components/tasks/ScamBannerTask.tsx
import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  TextField,
  Alert,
  Modal,
  Card,
  CardContent,
} from "@mui/material";
import { type TaskComponentProps } from "./taskUtils";
import { getAnswer, setAnswer } from "./taskUtils";

export default function ScamBannerTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const [step, setStep] = useState<"banner" | "form" | "result">("banner");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleBannerClick = () => {
    setStep("form");
  };

  const handleSubmit = () => {
    if (login && password) {
      // Сохраняем ответ (мок-данные)
      onChange([
        ...answers.filter((a) => a.key !== "scam_data"),
        {
          key: "scam_data",
          value: { login, password, timestamp: new Date().toISOString() },
        },
      ]);
      setStep("result");
      setShowModal(true);
    }
  };

  // Баннер
  if (step === "banner") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Paper
          data-tutorial="scam-banner"
          onClick={handleBannerClick}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 4,
            borderRadius: "24px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #FF6B6B, #EE5A24)",
            color: "#fff",
            textAlign: "center",
            boxShadow: "0 12px 48px rgba(238, 90, 36, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0 16px 64px rgba(238, 90, 36, 0.6)",
            },
          }}
        >
          <Box sx={{ fontSize: 64, mb: 2 }}>🎁</Box>
          <Typography variant="h4" fontWeight={900} gutterBottom>
            ПОЛУЧИ 10000 РОБУКСОВ!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
            🔥 ТОЛЬКО СЕГОДНЯ!
          </Typography>
          <Box
            sx={{
              display: "inline-block",
              px: 4,
              py: 1,
              backgroundColor: "#FFD93D",
              color: "#1A1A2E",
              borderRadius: "16px",
              fontWeight: 900,
              fontSize: 20,
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%,100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.05)" },
              },
            }}
          >
            👆 НАЖМИ СЮДА
          </Box>
          <Typography
            variant="caption"
            sx={{ display: "block", mt: 2, opacity: 0.6 }}
          >
            *Акция действует 5 минут
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Форма ввода данных
  if (step === "form") {
    return (
      <Paper sx={{ p: 4, borderRadius: "24px", maxWidth: 500, mx: "auto" }}>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{ mb: 3, textAlign: "center" }}
        >
          🎁 Введи данные для получения робуксов
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          💡 Введи любые данные — это симуляция, твой аккаунт в безопасности
        </Alert>

        <Stack spacing={2}>
          <TextField
            label="Логин от игры"
            variant="outlined"
            fullWidth
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введи свой логин"
          />
          <TextField
            label="Пароль от игры"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введи свой пароль"
          />
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={!login || !password}
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              borderRadius: "16px",
              fontSize: 18,
              backgroundColor: "#FF6B6B",
              "&:hover": { backgroundColor: "#EE5A24" },
            }}
          >
            🚀 Получить робуксы!
          </Button>
        </Stack>
      </Paper>
    );
  }

  // Результат — модальное окно
  return (
    <Modal open={showModal} onClose={() => {}}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
        }}
      >
        <Card
          sx={{
            borderRadius: "24px",
            border: "3px solid #EF4444",
            boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
          }}
        >
          <CardContent sx={{ p: 4, textAlign: "center" }}>
            <Box sx={{ fontSize: 64, mb: 2 }}>🔴</Box>
            <Typography
              variant="h4"
              fontWeight={900}
              color="error"
              gutterBottom
            >
              Твой аккаунт украли!
            </Typography>

            <Alert
              severity="error"
              sx={{
                mb: 3,
                textAlign: "left",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Box>⚠️ Мошенники получили твой логин и пароль. Они могут: </Box>
              <Box>• Украсть все скины </Box>
              <Box>• Сменить пароль </Box>
              <Box>• Удалить всех друзей</Box>
            </Alert>

            <Box
              sx={{
                p: 2,
                backgroundColor: "#FEF2F2",
                borderRadius: "12px",
                mb: 3,
                textAlign: "left",
                fontFamily: "monospace",
                fontSize: 14,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                📨 Данные, которые ты отправил мошенникам:
              </Typography>
              <Box sx={{ mt: 1 }}>
                <div>
                  👤 Логин: <strong>{login}</strong>
                </div>
                <div>
                  🔑 Пароль: <strong>{password.replace(/./g, "*")}</strong>
                </div>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              🎯 Это симуляция. Настоящие мошенники забрали бы твой аккаунт.
            </Typography>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => {
                setShowModal(false);
                setStep("banner");
                setLogin("");
                setPassword("");
              }}
              sx={{
                py: 1.5,
                borderRadius: "16px",
                backgroundColor: "#22C55E",
                "&:hover": { backgroundColor: "#16A34A" },
              }}
            >
              ✅ Я понял, больше так не буду!
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
}
