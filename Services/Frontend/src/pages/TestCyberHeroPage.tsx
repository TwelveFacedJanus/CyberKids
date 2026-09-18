// pages/TestCyberHeroPage.tsx
import { useState } from "react";
import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import Layout from "../components/Layout";
import AnswerDialog from "../components/AnswerDialog";

const QUESTIONS = [
  {
    id: "q1",
    question:
      "Утром вы проснулись, потянулись выключить будильник на телефоне и заметили сообщение от друга:",
    image: "/test-images/mail-q1.svg",
    options: [
      "У него наверняка проблемы — надо срочно помочь!",
      "У меня столько нет. Попробую одолжить, сколько смогу",
      "Что-то не похоже на моего друга. Надо бы лично спросить, что случилось",
    ],
    correct: 2,
    explanation:
      "Верное решение! Вы позвонили другу и узнали, что никакие деньги ему не нужны. Аккаунт друга взломали. Ещё можно было спросить в чате что-то личное, чтобы проверить собеседника. Но лучше позвонить. Главное — не переводите деньги, пока всё не выясните.",
  },
  {
    id: "q2",
    question:
      "Что ж, теперь можно и соцсети полистать. О, кто-то откомментил ваше селфи! Только не очень лестно...",
    image: "/test-images/mail-q2.svg",
    options: [
      "Не буду отвечать: мало ли, кто что думает",
      "Оскорблю в ответ — надо поставить на место негодяя",
      "Попробую нейтрализовать хама вежливым ответом",
    ],
    correct: 0,
    explanation:
      "Мнение троллей необъективно, переубеждать их бесполезно. Лучше игнорировать обидчика — так он скорее отстанет. Ещё можно заблокировать или пожаловаться администратору сообщества.",
  },
  {
    id: "q3",
    question:
      "А что там по новостям? Ого, неудивительно, что такая спорная история оказалась в топе...",
    image: "/test-images/mail-q3.svg",
    options: [
      "Фу, бред! Кошки совсем не дружелюбные.",
      "Уи-и-и, это правда! Котики — милашки, а собаки туповаты",
      "Не буду ввязываться в бессмысленный холивар",
    ],
    correct: 2,
    explanation:
      "Комментарий на эмоциях может обидеть кого-то или спровоцировать жестокость. Стоит проверять: вас бы самих задело такое высказывание? Не забывайте, что любой комментарий остаётся в интернете навсегда.",
  },
  {
    id: "q4",
    question: "На сайте, где вы читали новости, вдруг всплыл баннер:",
    image: "/test-images/mail-q4.svg",
    options: [
      "Не сейчас — антивирусы вечно всё преувеличивают",
      "Хорошо, что предупредили! Надо срочно вылечить вирус",
      "А какая программа прислала это оповещение? Надо разобраться",
    ],
    correct: 2,
    explanation:
      "Вы правильно делаете, что критически относитесь к большим ярким кнопкам и кричащим баннерам. В заголовке баннера было название TrojaFreeAntivirus — проверили в поиске и узнали, что это вирус. Обшлось без сомнительного лечения.",
  },
  {
    id: "q5",
    question:
      "После такого нужна терапия видоскиками! Среди милых зверушек вы заметили интересное видео о похудении от диетолога:",
    image: "/test-images/mail-q5.png",
    options: [
      "Почему нет? Это же врач, а не бьюти-блогер",
      "У этого специалиста много подписчиков. А что о нём говорят другие врачи?",
      "А диплом у этого врача есть? А, есть. Ну, тогда всё нормально",
    ],
    correct: 1,
    explanation:
      "Дети намного доверчивее нас, а советы «экспертов» бывают ещё опаснее. Тренируйте критическое мышление смолоду, проверьте научные работы и проконсультируйтесь с врачом в поликлинике.",
  },
  {
    id: "q6",
    question:
      "Дзинь! Ни минуты покоя, но таков уж этот интернет. Ловите важное письмо:",
    image: "/test-images/mail-q6.svg",
    options: [
      "А то! Еще и в календаре этот день помету",
      "Помню что-то про налоговый вычет — наверное, это он",
      "Ничего не понятно. Пойду сам зайду в личный кабинет и проверю",
    ],
    correct: 2,
    explanation:
      "В личном кабинете никаких компенсаций не оказалось. Вы вернулись перечитать письмо и заметили: оно отправлено с адреса gos1234@gov.ru вместо no-reply@gosuslugi.ru. Чтобы не попасться, сравнивайте адрес отправителя, проверяйте на официальном сайте, не переходите по ссылкам.",
  },
  {
    id: "q7",
    question:
      "Вы оторвались от телефона и увидели, какая красота за окном вашего дома:",
    image: "/test-images/mail-q7.png",
    options: [
      "Да, конечно, только выкину из кадра всё лишнее",
      "Само собой! И надо ещё не забыть хэштеги и геометку",
      "Выложу целиком, но геометку ставить не буду",
    ],
    correct: 0,
    explanation:
      "Может, вы просто хотели, чтобы фото было красивее, но ещё неосознанно защитили себя. Тайный недоброжелатель так и не смог вычислить, где вы живёте. Сообщите детям, что нельзя выкладывать паспорт, авиабилеты, точную геометку дома.",
  },
  {
    id: "q8",
    question:
      "Кстати, о фото. Похоже, у какого-то незнакомца есть на вас компромат:",
    image: "/test-images/mail-q8.svg",
    options: [
      "Вот это палево! Похоже, ничего больше не остаётся, как перевести деньги",
      "Меня бы это здорово напрягло, посещай я эротические сайты",
      "Ой, боюсь-боюсь! Мне такие письма каждый день приходят",
    ],
    correct: 2,
    explanation:
      "Такие письма — массовая рассылка мошенников. Они приходят каждый день тысячам людей. Ничего не переводите, не отвечайте, удалите письмо.",
  },
  {
    id: "q9",
    question:
      "Ну, уж любимая онлайн-игра-то не подведёт! К тому же какие-то умельцы нашли хитрое дополнение:",
    image: "/test-images/mail-q9.png",
    options: [
      "Игра и так постоянно вытягивает деньги. Схитрю в этот раз",
      "Чего это он делится таким богатством со всеми? Подозрительно",
      "О, кайф, скину друзьям — пусть тоже прокачаются бесплатно!",
    ],
    correct: 1,
    explanation:
      "Вы не стали скачивать обновление, а через 10 минут кто-то написал в чате, что по ссылке был вирус, который ворует аккаунт. Лучше уж потихоньку прокачивать персонажа, чем потерять его.",
  },
  {
    id: "q10",
    question: "Сложный день позади. Вы уютно устроились в кроватке:",
    image: "/test-images/mail-q10.jpg",
    options: [
      "Почитаю ленту за весь день",
      "Включу сериальчик или кино онлайн",
      "Почитаю книгу или послушаю спокойные шумы, музыку, медитации",
    ],
    correct: 2,
    explanation:
      "Вы прочитали главу любимой книги, и глаза стали закрываться. Выключили свет и тут же уснули. На утро вы хоть и не помнили сны, но чувствовали себя радостным и отдохнувшим. Придумывайте здоровые офлайн-ритуалы и интересный досуг.",
  },
];

export default function TestCyberHeroPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(
    null,
  );

  const current = QUESTIONS[currentIndex];
  const selected = selectedAnswers[currentIndex];

  const totalScore = selectedAnswers.reduce((acc, ans, idx) => {
    if (ans === QUESTIONS[idx].correct) return acc + 5;
    return acc;
  }, 0);
  const maxScore = QUESTIONS.length * 5;

  const handleAnswer = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = index;
    setSelectedAnswers(newAnswers);
    setLastAnswerCorrect(index === current.correct);
    setShowDialog(true);
  };

  const handleDialogNext = () => {
    setShowDialog(false);
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLastAnswerCorrect(null);
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

  const glowColorFirst =
    lastAnswerCorrect === false
      ? "rgba(255,158,0,.26)" // оранжевый
      : "rgba(33,68,254,.216993)"; // синий

  const glowColorSecond =
    lastAnswerCorrect === false
      ? "rgba(255,158,0,.26)" // оранжевый
      : "rgba(33,68,254,.313504)"; // синий

  const glowColorThird =
    lastAnswerCorrect === false
      ? "rgba(255,158,0,.26)" // оранжевый
      : "rgba(33,68,254,.386444)"; // синий

  const glowColorFourth =
    lastAnswerCorrect === false
      ? "rgba(255,158,0,.29)" // оранжевый
      : "rgba(33,68,254,.453556)"; // синий

  const glowColorFiveth =
    lastAnswerCorrect === false
      ? "rgba(255,158,0,.45)" // оранжевый
      : "rgba(33,68,254,.526496)"; // синий

  const glowColorSixth =
    lastAnswerCorrect === false
      ? "rgba(255,158,0,.55)" // оранжевый
      : "rgba(33,68,254,.623007)"; // синий

  const glowColorSeventh =
    lastAnswerCorrect === false
      ? "rgba(255,158,0,.8)" // оранжевый
      : "rgba(33,68,254,.84)"; // синий

  // 📊 Экран результатов
  if (showResult) {
    const percent = Math.round((totalScore / maxScore) * 100);
    let title, description, emoji;
    if (percent >= 90) {
      title = "Вы — кибергерой!";
      description = "Отлично! Вы отлично разбираетесь в безопасности.";
      emoji = "🦸";
    } else if (percent >= 70) {
      title = "Вы — крепкий орешек!";
      description = "Хороший результат! Но ещё есть над чем поработать.";
      emoji = "🛡️";
    } else if (percent >= 50) {
      title = "Вы — рыбка в сетях интернета";
      description = "Иногда по доброте душевной вы попадаетесь в ловушки.";
      emoji = "🐟";
    } else {
      title = "Вы — лёгкая добыча";
      description = "Мошенники легко могут вас обмануть.";
      emoji = "🎣";
    }

    return (
      <Layout theme="mailru">
        <Box sx={{ position: "relative", minHeight: "100%" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              //   background: `radial-gradient(ellipse at 50% 100%, ${glowColor} 0%, transparent 60%)`,
              pointerEvents: "none",
              zIndex: 0,
              transition: "background 0.5s ease",
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 4,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 700 }}>
              <Stack spacing={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}
                  >
                    Ваш результат
                  </Typography>
                  <Typography
                    sx={{ color: "#fff", fontWeight: 900, fontSize: 36 }}
                  >
                    {totalScore} из {maxScore}
                  </Typography>
                </Box>

                <Paper
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: "#1A1A2E",
                    p: 5,
                    color: "#fff",
                    position: "relative",
                    minHeight: 240,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    boxShadow: "0 0 60px rgba(0, 95, 249, 0.5)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      right: 40,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 140,
                      opacity: 0.95,
                    }}
                  >
                    {emoji}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 900,
                      mb: 2,
                      maxWidth: "65%",
                      lineHeight: 1.2,
                      fontSize: 32,
                    }}
                  >
                    {title}
                  </Typography>
                </Paper>

                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 16,
                    lineHeight: 1.8,
                  }}
                >
                  {description}
                </Typography>

                <Button
                  onClick={handleRestart}
                  sx={{
                    py: 2,
                    px: 4,
                    borderRadius: "8px",
                    fontSize: 15,
                    fontWeight: 700,
                    backgroundColor: "#005FF9",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#0043B8" },
                    alignSelf: "flex-start",
                  }}
                >
                  Прокачать киберброню
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Layout>
    );
  }

  // 📝 Экран вопроса
  return (
    <Layout theme="mailru">
      <Box sx={{ position: "relative", minHeight: "100%", my: 4 }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            // background: `radial-gradient(ellipse at 50% 100%, ${glowColor} 0%, transparent 60%)`,
            pointerEvents: "none",
            zIndex: 0,
            transition: "background 0.5s ease",
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 4,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 700 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 8 }}>
              <Box
                component="img"
                src="/test-images/mail-logo.svg"
                alt="Mail.ru"
                sx={{ height: 36 }}
              />
            </Box>

            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,1)",
                borderRadius: "25px",
                p: "24px 40px 50px",
                mb: 3,
                // boxShadow: `0px 160px 1600px 32px ${glowColor}`,
                boxShadow: `0 316.8px 316.8px ${glowColorFirst},
                  0 146.466px 146.466px ${glowColorSecond},
                  0 83.8047px 83.8047px ${glowColorThird},
                  0 50.8688px 50.8688px ${glowColorFourth},
                  0 30.6507px 30.6507px ${glowColorFiveth},
                  0 17.0683px 17.0683px ${glowColorSixth},
                  0 7.34095px 7.34095px ${glowColorSeventh}`,
              }}
            >
              <Stack spacing={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    sx={{
                      color: "rgba(100, 100, 100, 0.9)",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    {currentIndex + 1}/{QUESTIONS.length}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(100, 100, 100, 0.9)",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    ИНТЕРНЕТ-БРОНЯ:{" "}
                    <span style={{ color: "#22C55E" }}>{totalScore}</span>{" "}
                    <span
                      style={{
                        color: "rgba(0, 0, 0, 0.9)",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      ИЗ {maxScore}
                    </span>
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: "rgba(0, 0, 0, 0.9)",
                    fontWeight: 700,
                    textAlign: "center",
                    fontSize: 18,
                    lineHeight: 1.5,
                  }}
                >
                  {current.question}
                </Typography>

                {current.image && (
                  <Box
                    component="img"
                    src={current.image}
                    alt=""
                    sx={{
                      width: "100%",
                      maxHeight: 700,
                      objectFit: "contain",
                      borderRadius: "12px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                  />
                )}

                <Typography
                  sx={{
                    color: "rgba(0, 0, 0, 0.9)",
                    fontWeight: 700,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  Что будете делать?
                </Typography>

                <Stack spacing={1.5}>
                  {current.options.map((option, index) => (
                    <Paper
                      key={index}
                      onClick={() => handleAnswer(index)}
                      sx={{
                        p: 2,
                        borderRadius: "8px",
                        cursor: "pointer",
                        border: "1px solid rgba(0, 0, 0, 0.15)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "#005FF9",
                          backgroundColor: "rgba(0, 95, 249, 0.1)",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color: "rgba(0, 0, 0, 0.6)",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {option}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Box>

        <AnswerDialog
          open={showDialog}
          isCorrect={selected === current.correct}
          explanation={current.explanation}
          onNext={handleDialogNext}
          theme="mailru"
          isLastQuestion={currentIndex === QUESTIONS.length - 1}
        />
      </Box>
    </Layout>
  );
}
