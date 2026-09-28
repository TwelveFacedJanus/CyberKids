// components/tasks/FakeFriendChatTask.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PersonOutline from "@mui/icons-material/PersonOutline";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";
import ArrowForward from "@mui/icons-material/ArrowForward";
import type { TaskComponentProps } from "./taskUtils";
import ChatBubble from "./fake_friend_chat/ChatBubble";
import SuspicionPanel from "./fake_friend_chat/SuspicionPanel";
import FriendProfileModal from "./fake_friend_chat/FriendProfileModal";
import RealFriendModal from "./fake_friend_chat/RealFriendModal";
import ChoiceBar from "./fake_friend_chat/ChoiceBar";
import HackedAccountScenario from "./fake_friend_chat/HackedAccountScenario";

interface Message {
  id: string;
  text: string;
  delay?: number;
}

interface Day {
  id: string;
  label: string;
  messages: Message[];
}

interface ChoiceOption {
  id: string;
  style: "good" | "neutral" | "bad";
  text: string;
  consequence: string;
}

interface ChoiceDef {
  id: string;
  title: string;
  afterDay: string;
  options: ChoiceOption[];
}

interface RedFlag {
  id: string;
  label: string;
  hint?: string;
}

type Phase = "chat" | "reveal";

export default function FakeFriendChatTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const storyTitle = (content as any).storyTitle || "Разоблачи мошенника";
  const intro = (content as any).intro || "";
  const friend = (content as any).friend;
  const days: Day[] = (content as any).days || [];
  const choices: ChoiceDef[] = (content as any).choices || [];
  const redFlags: RedFlag[] = (content as any).redFlags || [];
  const realFriendChat = (content as any).realFriendChat || [];
  const reveal = (content as any).reveal;
  const explainer = (content as any).explainer;

  const [phase, setPhase] = useState<Phase>("chat");
  const [dayIdx, setDayIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [currentChoice, setCurrentChoice] = useState<ChoiceDef | null>(null);
  const [choiceResult, setChoiceResult] = useState<ChoiceOption | null>(null);
  const [foundFlags, setFoundFlags] = useState<string[]>([]);
  const [choicesMade, setChoicesMade] = useState<Record<string, string>>({});
  const [showProfile, setShowProfile] = useState(false);
  const [showRealChat, setShowRealChat] = useState(false);
  const [finalChoice, setFinalChoice] = useState<
    "good" | "neutral" | "bad" | null
  >(null);
  const scenario = (content as any).scenario || "fake_friend";

  const timerRef = useRef<number | null>(null);

  const currentDay = days[dayIdx];

  if (scenario === "hacked_account") {
    return (
      <HackedAccountScenario
        content={content}
        answers={answers}
        onChange={onChange}
      />
    );
  }

  // Показ сообщений по одному
  useEffect(() => {
    if (phase !== "chat" || !currentDay) return;
    setVisibleCount(0);

    let idx = 0;
    const tick = () => {
      idx += 1;
      setVisibleCount(idx);
      if (idx < currentDay.messages.length) {
        const delay = currentDay.messages[idx]?.delay ?? 1500;
        timerRef.current = window.setTimeout(tick, delay);
      } else {
        // После последнего сообщения — развилка
        const c = choices.find((x) => x.afterDay === currentDay.id);
        if (c) {
          timerRef.current = window.setTimeout(() => {
            setCurrentChoice(c);
          }, 1000);
        }
      }
    };

    timerRef.current = window.setTimeout(tick, 800);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayIdx, phase]);

  // Отмечаем красные флаги в зависимости от дня
  useEffect(() => {
    if (phase !== "chat") return;
    const dayId = currentDay?.id;

    if (dayId === "day1" && !foundFlags.includes("f1")) {
      setFoundFlags((prev) => [...prev, "f1"]);
    }
    if (dayId === "day2") {
      setFoundFlags((prev) => {
        const next = new Set(prev);
        next.add("f2");
        next.add("f3");
        return [...next];
      });
    }
    if (dayId === "day3" && !foundFlags.includes("f4")) {
      setFoundFlags((prev) => [...prev, "f4"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayIdx, phase]);

  const handleChoice = (
    style: "good" | "neutral" | "bad",
    optionId: string,
  ) => {
    if (!currentChoice) return;
    const opt = currentChoice.options.find((o) => o.id === optionId);
    if (!opt) return;

    setChoiceResult(opt);
    setChoicesMade((prev) => ({ ...prev, [currentChoice.id]: style }));

    if (currentChoice.id === "c3") {
      setFinalChoice(style);
    }
  };

  const goNext = () => {
    setChoiceResult(null);
    setCurrentChoice(null);

    if (dayIdx < days.length - 1) {
      setDayIdx(dayIdx + 1);
    } else {
      // Конец — разоблачение
      setPhase("reveal");
      const finalAnswers = [
        ...answers.filter((a) => a.key !== "fake_friend_chat_result"),
        {
          key: "fake_friend_chat_result",
          value: {
            foundFlags,
            choices: choicesMade,
            finalChoice,
          },
        },
      ];
      onChange(finalAnswers);
    }
  };

  const handleReset = () => {
    setPhase("chat");
    setDayIdx(0);
    setVisibleCount(0);
    setCurrentChoice(null);
    setChoiceResult(null);
    setFoundFlags([]);
    setChoicesMade({});
    setFinalChoice(null);
    onChange(answers.filter((a) => a.key !== "fake_friend_chat_result"));
  };

  const isSuccess = finalChoice === "good";
  const isPartial = finalChoice === "neutral";

  // Прогресс
  const progress = useMemo(() => {
    return ((dayIdx + 1) / days.length) * 100;
  }, [dayIdx, days.length]);

  return (
    <Stack spacing={3}>
      {/* ─── Шапка ─── */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "16px",
          background: "linear-gradient(135deg, #1E1E2E, #2A2A3E)",
          color: "#fff",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #EC407A, #7C4DFF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            👥
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              fontSize={11}
              sx={{
                opacity: 0.6,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Разоблачение
            </Typography>
            <Typography fontWeight={800} fontSize={16}>
              {storyTitle}
            </Typography>
            {intro && (
              <Typography fontSize={12.5} sx={{ opacity: 0.75, mt: 0.5 }}>
                {intro}
              </Typography>
            )}
          </Box>
          <Chip
            label={`День ${dayIdx + 1} / ${days.length}`}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.15)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7C4DFF, #EC407A)",
                transition: "width 0.5s ease",
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* ══════════ ЧАТ ══════════ */}
      {phase === "chat" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 320px" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Stack spacing={2}>
            {/* Заголовок дня */}
            <Paper
              sx={{
                p: 2,
                borderRadius: "12px",
                backgroundColor: "#F8F9FA",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography fontWeight={800} fontSize={14}>
                📅 {currentDay?.label}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<PersonOutline />}
                  onClick={() => setShowProfile(true)}
                  sx={{
                    borderRadius: "8px",
                    fontSize: 11,
                    textTransform: "none",
                  }}
                >
                  Профиль
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<ChatBubbleOutline />}
                  onClick={() => setShowRealChat(true)}
                  sx={{
                    borderRadius: "8px",
                    fontSize: 11,
                    textTransform: "none",
                  }}
                >
                  Настоящий Андрей
                </Button>
              </Stack>
            </Paper>

            {/* Сообщения */}
            <Paper
              data-tutorial="fake-friend-chat"
              sx={{
                p: 2.5,
                borderRadius: "16px",
                backgroundColor: "#F3F4F6",
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, rgba(124,77,255,0.05), transparent 40%)",
                minHeight: 320,
              }}
            >
              <Stack spacing={2}>
                {currentDay?.messages.map((m, i) => (
                  <ChatBubble
                    key={m.id}
                    text={m.text}
                    avatar={friend?.fakeAvatar ?? "🐱"}
                    name={friend?.name ?? "Андрей"}
                    visible={i < visibleCount}
                  />
                ))}
              </Stack>
            </Paper>

            {/* Развилка */}
            {currentChoice && !choiceResult && (
              <ChoiceBar
                title={currentChoice.title}
                options={currentChoice.options}
                onSelect={handleChoice}
              />
            )}

            {/* Последствие выбора */}
            {choiceResult && (
              <Alert
                severity={
                  choiceResult.style === "good"
                    ? "success"
                    : choiceResult.style === "bad"
                      ? "error"
                      : "warning"
                }
                sx={{ borderRadius: "12px" }}
              >
                {choiceResult.consequence}
              </Alert>
            )}

            {/* Кнопка дальше */}
            {choiceResult && (
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={goNext}
                sx={{
                  py: 1.6,
                  fontWeight: 800,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
                }}
              >
                {dayIdx < days.length - 1 ? "Следующий день →" : "Завершить"}
              </Button>
            )}
          </Stack>

          {/* Правая панель с флагами */}
          <Box sx={{ position: { md: "sticky" }, top: { md: 16 } }}>
            <SuspicionPanel allFlags={redFlags} foundFlags={foundFlags} />
          </Box>
        </Box>
      )}

      {/* ══════════ РАЗОБЛАЧЕНИЕ ══════════ */}
      {phase === "reveal" && (
        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            textAlign: "center",
            background: isSuccess
              ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
              : isPartial
                ? "linear-gradient(135deg, #FFFBEB, #FEF3C7)"
                : "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
            border: `2px solid ${
              isSuccess ? "#22C55E" : isPartial ? "#F59E0B" : "#EF4444"
            }`,
          }}
        >
          <Box sx={{ fontSize: 64, mb: 1 }}>
            {isSuccess ? "🏆" : isPartial ? "⚠️" : "🚨"}
          </Box>
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              mb: 2,
              color: isSuccess ? "#166534" : isPartial ? "#92400E" : "#991B1B",
            }}
          >
            {isSuccess
              ? "Ты разоблачил мошенника!"
              : isPartial
                ? "Ты почти справился"
                : "Ты попался"}
          </Typography>

          <Typography
            fontSize={14.5}
            sx={{
              mb: 3,
              maxWidth: 620,
              mx: "auto",
              lineHeight: 1.65,
              color: "text.secondary",
            }}
          >
            {isSuccess ? reveal?.success : reveal?.failure}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{ mb: 3 }}
          >
            <Chip
              label={`🚩 Найдено флагов: ${foundFlags.length}/${redFlags.length}`}
              sx={{ bgcolor: "#FFFFFF", fontWeight: 700 }}
            />
            <Chip
              label={`✅ Правильных решений: ${
                Object.values(choicesMade).filter((s) => s === "good").length
              }/${choices.length}`}
              sx={{ bgcolor: "#FFFFFF", fontWeight: 700 }}
            />
          </Stack>

          {explainer && (
            <Typography
              fontSize={13.5}
              sx={{
                mb: 3,
                maxWidth: 620,
                mx: "auto",
                lineHeight: 1.65,
                color: "text.secondary",
                textAlign: "left",
                p: 2,
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              💡 {explainer}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleReset}
            sx={{
              borderRadius: "12px",
              fontWeight: 700,
              py: 1.4,
              px: 4,
              background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
            }}
          >
            Пройти заново
          </Button>
        </Paper>
      )}

      {/* Модалки */}
      <FriendProfileModal
        open={showProfile}
        onClose={() => setShowProfile(false)}
        nickname={friend?.nickname ?? "Andrey_2011"}
        fakeAvatar={friend?.fakeAvatar ?? "🐱"}
        realAvatar={friend?.realAvatar ?? "🐺"}
      />

      <RealFriendModal
        open={showRealChat}
        onClose={() => setShowRealChat(false)}
        messages={realFriendChat}
      />
    </Stack>
  );
}
