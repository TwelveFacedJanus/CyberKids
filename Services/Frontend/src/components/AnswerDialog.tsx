// components/AnswerDialog.tsx
import { Box, Dialog, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface AnswerDialogProps {
  open: boolean;
  isCorrect: boolean;
  explanation: string;
  onNext: () => void;
  theme: "kaspersky" | "mailru";
  isLastQuestion: boolean;
}

export default function AnswerDialog({
  open,
  isCorrect,
  explanation,
  onNext,
  theme,
  isLastQuestion,
}: AnswerDialogProps) {
  // 🟢 KASPERSKY — точная копия
  if (theme === "kaspersky") {
    return (
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "8px",
            overflow: "hidden",
            p: 0,
            background: "#FFFFFF",
            maxWidth: 780,
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          },
        }}
      >
        <Box sx={{ display: "flex", minHeight: 400 }}>
          {/* 🟩 Левая зелёная часть с иконкой */}
          <Box
            sx={{
              width: "40%",
              minWidth: 240,
              background: "linear-gradient(135deg, #00B34A 0%, #76FF03 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Декоративная белая фигура */}
            <Box
              sx={{
                position: "absolute",
                top: "10%",
                left: "-20%",
                width: "140%",
                height: "120%",
                background: "#FFFFFF",
                clipPath:
                  "polygon(30% 0%, 100% 15%, 95% 70%, 60% 100%, 10% 85%, 0% 40%)",
                opacity: 0.95,
              }}
            />
            {/* Иконка */}
            <Box
              component="img"
              src={
                isCorrect
                  ? "/test-images/right-icon.svg"
                  : "/test-images/wrong-icon.svg"
              }
              alt=""
              sx={{
                position: "relative",
                zIndex: 1,
                width: 140,
                height: 140,
              }}
            />
          </Box>

          {/* 📝 Правая белая часть с текстом */}
          <Box
            sx={{
              flex: 1,
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Заголовок */}
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                color: "#1A1A2E",
                mb: 2,
              }}
            >
              {isCorrect ? "Верно!" : "Не совсем так!"}
            </Typography>

            {/* Текст */}
            <Typography
              variant="body1"
              sx={{
                color: "#1A1A2E",
                lineHeight: 1.7,
                mb: 3,
                fontSize: 14,
              }}
            >
              {explanation}
            </Typography>

            {/* Кнопка */}
            <Button
              onClick={onNext}
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: "4px",
                fontSize: 15,
                fontWeight: 700,
                backgroundColor: "#00A651",
                color: "#fff",
                alignSelf: "flex-start",
                "&:hover": { backgroundColor: "#008C44" },
              }}
            >
              {isLastQuestion ? "Завершить" : "Следующий вопрос"}
            </Button>
          </Box>
        </Box>
      </Dialog>
    );
  }

  // 🔵 MAIL.RU — точная копия
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          background: "#FFFFFF",
          p: 0,
          maxWidth: 500,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        },
      }}
    >
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Заголовок "Интернет-броня" если неправильно */}
        {!isCorrect && (
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                color: "#9CA3AF",
                fontSize: 14,
                fontWeight: 500,
                mb: 0.5,
              }}
            >
              Интернет-броня:
            </Typography>
          </Box>
        )}

        {/* Иконка */}
        <Box
          component="img"
          src={
            isCorrect
              ? "/test-images/answer-success.svg"
              : "/test-images/answer-fail.svg"
          }
          alt=""
          sx={{ width: 180, height: 180, mb: 3 }}
        />

        {/* Текст */}
        <Typography
          variant="body1"
          sx={{
            color: "#1A1A2E",
            lineHeight: 1.7,
            mb: 4,
            textAlign: "center",
            fontSize: 14,
          }}
        >
          {explanation}
        </Typography>

        {/* Кнопка */}
        <Button
          onClick={onNext}
          sx={{
            py: 1.8,
            px: 6,
            borderRadius: "8px",
            fontSize: 15,
            fontWeight: 700,
            backgroundColor: "#000",
            color: "#fff",
            "&:hover": { backgroundColor: "#1A1A2E" },
          }}
        >
          {isLastQuestion ? "Завершить" : "Дальше"}
        </Button>
      </Box>
    </Dialog>
  );
}
