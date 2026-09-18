// pages/TestSafetyPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import Layout from "../components/Layout";
import AnswerDialog from "../components/AnswerDialog";

const QUESTIONS = [
  {
    id: "q1",
    question: "Какое начало адреса сайта безопаснее?",
    options: ["http://", "https://", "https://", "Разницы нет"],
    correct: 1,
    explanation: "HTTPS — защищённое соединение, буква S означает Secure.",
  },
  {
    id: "q2",
    question:
      "Ты хочешь купить что-то на Avito или другом сайте с частными объявлениями. Как поступишь?",
    options: [
      "Договорюсь с продавцом, переведу ему деньги на карту, буду ждать посылку",
      "Договорюсь с продавцом о встрече, отдам деньги наличными в обмен на товар",
      "Договорюсь с продавцом и попрошу встретиться с ним знакомого",
      "Перешлю ссылку на товар кому-нибудь из родителей и попрошу их купить мне эту вещь",
    ],
    correct: 3,
    explanation:
      "Лучше покупать через родителей — они знают, как безопасно совершать покупки.",
  },
  {
    id: "q3",
    question:
      "Какой из этих паролей наиболее надёжен для регистрации почтового ящика?",
    options: ["9162651798", "L652og169_?!", "916265oleg", "SuperOleg"],
    correct: 1,
    explanation: "Хороший пароль содержит буквы, цифры и специальные символы.",
  },
  {
    id: "q4",
    question: "Где общаться под настоящим именем и фамилией точно безопасно?",
    options: [
      "Да везде, это ведь всего лишь имя и фамилия",
      "В чате со своими одноклассниками",
      "Вконтакте в группах по интересам",
      "Нигде",
    ],
    correct: 3,
    explanation:
      "Никогда не публикуй настоящее имя и фамилию в открытом доступе.",
  },
  {
    id: "q5",
    question: "Чего не стоит делать в онлайн-играх?",
    options: [
      "Вступать в гильдии",
      "Ходить в рейды",
      "Покупать игровые предметы за настоящие деньги у других игроков",
      "В них вообще играть не стоит",
    ],
    correct: 2,
    explanation: "Покупка у других игроков — риск нарваться на мошенников.",
  },
  {
    id: "q6",
    question: "Кому разрешишь отмечать тебя на фотографиях в соцсетях?",
    options: [
      "Всем",
      "Только друзьям",
      "Только друзьям с твоего согласия",
      "Никому",
    ],
    correct: 2,
    explanation: "Лучше контролировать, кто и где тебя отмечает.",
  },
  {
    id: "q7",
    question: "А о чем напишешь пост без всяких опасений?",
    options: [
      "«Вчера смотрели интересный фильм...»",
      "«Завтра в пять иду на каток „Наш каток“...»",
      "«Отцу подняли зарплату, надеюсь, теперь куда-нибудь съездим...»",
      "«Как же бесит Петя Иванов...»",
    ],
    correct: 0,
    explanation:
      "О фильмах писать безопасно. Остальное — личная информация или конфликты.",
  },
  {
    id: "q8",
    question:
      "Тебе пришло сообщение от одноклассника — он попал в неприятности и просит срочно перевести ему денег. Как поступишь?",
    options: [
      "Переведу, конечно, я же нормальный друг",
      "Проигнорирую",
      "Сначала спрошу ответным сообщением, что случилось, а потом уже переведу",
      "Позвоню и спрошу, что случилось",
    ],
    correct: 3,
    explanation: "Лучше позвонить — аккаунт друга могли взломать!",
  },
  {
    id: "q9",
    question: "Кстати, а что будешь делать, если взломают твою страницу?",
    options: [
      "Ничего",
      "Заведу новую",
      "Напишу в техподдержку, чтобы они помогли восстановить доступ",
      "У меня такой пароль, что не взломают",
    ],
    correct: 2,
    explanation: "Техподдержка может помочь восстановить доступ.",
  },
  {
    id: "q10",
    question:
      "Рассказ о какой из этих ситуаций в интернете родителям — дело вкуса, а не необходимость?",
    options: [
      "Твою страницу взломали",
      "Тебе пишут гадости в комментариях",
      "У твоего блога стало больше тысячи подписчиков",
      "Тебе предлагает встретиться френд, с которым вы раньше не виделись",
    ],
    correct: 2,
    explanation:
      "Рост подписчиков — не повод для беспокойства. Остальное — серьёзные ситуации.",
  },
];

export default function TestSafetyPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const current = QUESTIONS[currentIndex];
  const selected = selectedAnswers[currentIndex];

  const handleAnswer = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = index;
    setSelectedAnswers(newAnswers);
    setShowDialog(true);
  };

  const handleDialogNext = () => {
    setShowDialog(false);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setShowDialog(false);
  };

  // 📊 Экран результатов
  if (showResult) {
    const correctCount = selectedAnswers.filter(
      (ans, idx) => ans === QUESTIONS[idx].correct,
    ).length;
    const percent = Math.round((correctCount / QUESTIONS.length) * 100);

    let resultTitle, resultText, resultEmoji;
    if (percent >= 80) {
      resultTitle = "Все под контролем";
      resultText =
        "Мы совершенно спокойны — ты знаешь о кибербезопасности всё или почти всё. Так держать!";
      resultEmoji = "🐻";
    } else if (percent >= 50) {
      resultTitle = "Хорошо, но можно лучше";
      resultText = "Ты знаешь basics, но есть что подтянуть. Попробуй ещё раз!";
      resultEmoji = "🤔";
    } else {
      resultTitle = "Стоит повторить";
      resultText =
        "Есть над чем поработать. Пройди наши уроки и попробуй снова!";
      resultEmoji = "📚";
    }

    return (
      <Layout theme="kaspersky">
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <Box sx={{ width: "100%", maxWidth: 700 }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={800}
                  sx={{ color: "#fff", letterSpacing: 1 }}
                >
                  ТЕСТ: «ЭТО НОРМАЛЬНО ИЛИ ОПАСНО?»
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={800}
                  sx={{ color: "#fff", letterSpacing: 1 }}
                >
                  РЕЗУЛЬТАТЫ
                </Typography>
              </Box>

              <Paper
                sx={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg, #00B34A 0%, #76FF03 100%)",
                  p: 5,
                  color: "#fff",
                  position: "relative",
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}
                >
                  Правильных ответов
                </Typography>
                <Typography variant="h2" fontWeight={900} sx={{ mb: 2 }}>
                  {correctCount} из {QUESTIONS.length}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={900}
                  sx={{ mb: 1, maxWidth: "60%", lineHeight: 1.2 }}
                >
                  {resultTitle}
                </Typography>
                <Box
                  sx={{
                    position: "absolute",
                    right: 40,
                    bottom: 0,
                    fontSize: 160,
                    lineHeight: 1,
                    opacity: 0.95,
                  }}
                >
                  {resultEmoji}
                </Box>
              </Paper>

              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#fff" }}
              >
                {resultText}
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleRestart}
                  sx={{
                    py: 1.8,
                    px: 4,
                    borderRadius: "4px",
                    fontSize: 15,
                    fontWeight: 700,
                    backgroundColor: "#FF4757",
                    "&:hover": { backgroundColor: "#FF3344" },
                  }}
                >
                  Пройти еще раз
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/")}
                  sx={{
                    py: 1.8,
                    px: 4,
                    borderRadius: "4px",
                    fontSize: 15,
                    fontWeight: 700,
                    backgroundColor: "#00A651",
                    "&:hover": { backgroundColor: "#008C44" },
                  }}
                >
                  Вернуться на главную
                </Button>
              </Stack>

              <Typography
                variant="caption"
                sx={{ textAlign: "center", color: "rgba(255,255,255,0.7)" }}
              >
                Источник: Kaspersky Kids — kids.kaspersky.ru
              </Typography>

              {/* Разбор ответов */}
              <Stack spacing={2}>
                {QUESTIONS.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correct;
                  return (
                    <Box
                      key={q.id}
                      sx={{
                        p: 2,
                        borderRadius: "8px",
                        backgroundColor: isCorrect
                          ? "rgba(240, 253, 244, 0.95)"
                          : "rgba(254, 242, 242, 0.95)",
                        borderLeft: `4px solid ${isCorrect ? "#22C55E" : "#EF4444"}`,
                      }}
                    >
                      <Typography
                        fontWeight={600}
                        sx={{ mb: 1, color: "#1A1A2E" }}
                      >
                        {idx + 1}. {q.question}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        Твой ответ:{" "}
                        <strong style={{ color: "#1A1A2E" }}>
                          {q.options[userAns]}
                        </strong>
                      </Typography>
                      {!isCorrect && (
                        <Typography variant="body2" sx={{ color: "#22C55E" }}>
                          Правильный ответ:{" "}
                          <strong>{q.options[q.correct]}</strong>
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 1,
                          color: "#6B7280",
                        }}
                      >
                        💡 {q.explanation}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Layout>
    );
  }

  // 📝 Экран вопроса
  return (
    <Layout theme="kaspersky">
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <Box sx={{ width: "100%", maxWidth: 700 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={800}
                sx={{ color: "#000", letterSpacing: 1 }}
              >
                ТЕСТ: «ЭТО НОРМАЛЬНО ИЛИ ОПАСНО?»
              </Typography>
              <Typography
                variant="body2"
                fontWeight={800}
                sx={{ color: "#000", letterSpacing: 1 }}
              >
                {currentIndex + 1} из {QUESTIONS.length}
              </Typography>
            </Box>

            <Paper
              sx={{
                borderRadius: "4px",
                overflow: "hidden",
                // background: "linear-gradient(135deg, #00B34A 0%, #76FF03 100%)",
                background: "linear-gradient(105deg,#2aca93,#6ff748 100.24%)",
                p: 4,
                minHeight: 140,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ color: "#fff", lineHeight: 1.4 }}
              >
                {current.question}
              </Typography>
            </Paper>

            <Stack spacing={1.5}>
              {current.options.map((option, index) => (
                <Paper
                  key={index}
                  onClick={() => handleAnswer(index)}
                  sx={{
                    p: 2,
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "#F5F5F5",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#E8F5E9",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "linear-gradient(135deg, #00A651, #00C853)",
                      //   background:
                      //     "linear-gradient(105deg,#2aca93,#6ff748 100.24%)",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 16,
                      clipPath:
                        "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      flexShrink: 0,
                    }}
                  >
                    {String.fromCharCode(65 + index)}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 500, color: "#1A1A2E" }}
                  >
                    {option}
                  </Typography>
                </Paper>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="center">
              {QUESTIONS.map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor:
                      selectedAnswers[idx] === undefined
                        ? "rgba(0,0,0,0.3)"
                        : selectedAnswers[idx] === QUESTIONS[idx].correct
                          ? "#22C55E" // ✅ зелёный
                          : "#EF4444", // ❌ красный
                    transition: "all 0.2s ease",
                    transform: idx === currentIndex ? "scale(1.4)" : "scale(1)",
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>

      <AnswerDialog
        open={showDialog}
        isCorrect={selected === current.correct}
        explanation={current.explanation}
        onNext={handleDialogNext}
        theme="kaspersky"
        isLastQuestion={currentIndex === QUESTIONS.length - 1}
      />
    </Layout>
  );
}
