// src/components/messenger/messages/QuizCard.tsx
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import type { QuizMessage } from "../../types/messenger";

interface Props {
  msg: QuizMessage;
}

export default function QuizCard({ msg }: Props) {
  const [feedback, setFeedback] = useState("");
  const [feedbackColor, setFeedbackColor] = useState("");
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [wrongIndexes, setWrongIndexes] = useState<number[]>([]);

  const handleAnswer = (i: number, correct: boolean) => {
    if (answeredCorrectly) return;
    if (correct) {
      setAnsweredCorrectly(true);
      setFeedback("🏆 Квест пройден! Ты умеешь замечать опасные ситуации.");
      setFeedbackColor("#175c36");
    } else {
      setWrongIndexes((prev) => [...prev, i]);
      setFeedback("Не совсем так. Подумай ещё раз и выбери другой вариант 🤔");
      setFeedbackColor("#7a201a");
    }
  };

  return (
    <Box
      sx={{
        alignSelf: "center",
        width: 460,
        maxWidth: "92%",
        bgcolor: "#e8f1ff",
        border: "1px solid #2f7bf6",
        color: "#12377c",
        borderRadius: "14px",
        p: 1.75,
        fontSize: 14,
        my: 0.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.875, mb: 0.5 }}>
        <Typography sx={{ fontSize: 16 }}>❓</Typography>
        <Typography sx={{ fontWeight: 800, fontSize: 14.5 }}>
          {msg.question}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
        {msg.options.map((opt, i) => (
          <Button
            key={i}
            disabled={wrongIndexes.includes(i) || answeredCorrectly}
            onClick={() => handleAnswer(i, opt.correct)}
            sx={{
              textAlign: "left",
              justifyContent: "flex-start",
              bgcolor: "#fff",
              color: opt.correct ? "#1a7a45" : "#c53c30",
              borderRadius: "22px",
              px: 2,
              py: 1.25,
              fontSize: 13.5,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 2px 6px rgba(20,30,50,.12)",
              "&:hover": { bgcolor: "#fff", transform: "translateY(-1px)" },
              "&.Mui-disabled": { color: "inherit", opacity: 0.45 },
            }}
          >
            {opt.label}
          </Button>
        ))}
      </Box>

      {feedback && (
        <Typography
          sx={{ mt: 1, fontSize: 13, color: feedbackColor, fontWeight: 600 }}
        >
          {feedback}
        </Typography>
      )}
    </Box>
  );
}
