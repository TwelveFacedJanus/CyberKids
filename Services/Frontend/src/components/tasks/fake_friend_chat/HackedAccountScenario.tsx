// components/tasks/fake_friend_chat/HackedAccountScenario.tsx
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import PhoneIcon from "@mui/icons-material/Phone";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ArrowForward from "@mui/icons-material/ArrowForward";
import type { Answer } from "../../../types";
import SuspicionPanel from "./SuspicionPanel";
import ChoiceBar from "./ChoiceBar";
import RealFriendModal from "./RealFriendModal";

interface AudioMessage {
  id: string;
  src: string;
  text: string;
  delay?: number;
}

interface TextMessage {
  id: string;
  text: string;
  delay?: number;
}

interface Tool {
  id: string;
  icon: string;
  label: string;
  questions?: Array<{ id: string; text: string; correct: string }>;
  result: {
    type?: string;
    src?: string;
    text: string;
    revealFlag?: string;
  };
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
  options: ChoiceOption[];
}

interface RedFlag {
  id: string;
  label: string;
  hint?: string;
}

interface Props {
  content: any;
  answers: Answer[];
  onChange: (answers: Answer[]) => void;
}

export default function HackedAccountScenario({
  content,
  answers,
  onChange,
}: Props) {
  const storyTitle = content.storyTitle || "Взломанный друг";
  const intro = content.intro || "";
  const friend = content.friend;
  const audioMessages: AudioMessage[] = content.audioMessages || [];
  const textMessages: TextMessage[] = content.textMessages || [];
  const tools: Tool[] = content.tools || [];
  const choices: ChoiceDef[] = content.choices || [];
  const redFlags: RedFlag[] = content.redFlags || [];
  const realFriendChat = content.realFriendChat || [];
  const reveal = content.reveal;
  const explainer = content.explainer;

  const [phase, setPhase] = useState<"chat" | "reveal">("chat");
  const [visibleAudio, setVisibleAudio] = useState(0);
  const [visibleText, setVisibleText] = useState(0);
  const [usedTools, setUsedTools] = useState<string[]>([]);
  const [toolResult, setToolResult] = useState<{
    id: string;
    result: any;
  } | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showRealChat, setShowRealChat] = useState(false);
  const [currentChoice, setCurrentChoice] = useState<ChoiceDef | null>(null);
  const [choiceResult, setChoiceResult] = useState<ChoiceOption | null>(null);
  const [choicesMade, setChoicesMade] = useState<Record<string, string>>({});
  const [foundFlags, setFoundFlags] = useState<string[]>([]);
  const [finalChoice, setFinalChoice] = useState<
    "good" | "neutral" | "bad" | null
  >(null);
  const [playing, setPlaying] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Показ аудио → текстов → развилка 1
  useEffect(() => {
    if (phase !== "chat") return;
    let cancelled = false;

    const run = async () => {
      // Аудио по одному
      for (let i = 0; i < audioMessages.length; i++) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, audioMessages[i].delay ?? 2000));
        if (cancelled) return;
        setVisibleAudio(i + 1);
      }
      // Текстовые
      for (let i = 0; i < textMessages.length; i++) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, textMessages[i].delay ?? 2000));
        if (cancelled) return;
        setVisibleText(i + 1);
      }
      // Развилка 1
      await new Promise((r) => setTimeout(r, 1000));
      if (cancelled) return;
      setCurrentChoice(choices[0]);
    };

    run();
    return () => {
      cancelled = true;
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Автофлаг f1 — «просит денег» после аудио
  useEffect(() => {
    if (visibleAudio > 0 && !foundFlags.includes("f1")) {
      setFoundFlags((prev) => [...prev, "f1"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleAudio]);

  // Флаг f2 — «давит» после текстов
  useEffect(() => {
    if (visibleText > 0 && !foundFlags.includes("f2")) {
      setFoundFlags((prev) => [...prev, "f2"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleText]);

  const playAudio = (src: string, id: string) => {
    if (playing === id) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play().catch(() => {});
    setPlaying(id);
    audio.onended = () => setPlaying(null);
  };

  const useTool = (tool: Tool) => {
    if (usedTools.includes(tool.id)) {
      setToolResult({ id: tool.id, result: tool.result });
      return;
    }

    if (tool.id === "question") {
      setShowQuestionModal(true);
      return;
    }

    setUsedTools((prev) => [...prev, tool.id]);
    setToolResult({ id: tool.id, result: tool.result });

    // Флаг за использование инструмента
    if (
      tool.result.revealFlag &&
      !foundFlags.includes(tool.result.revealFlag)
    ) {
      setFoundFlags((prev) => [...prev, tool.result.revealFlag]);
    }

    // Первое использование инструмента → развилка 2
    if (!choicesMade["c2"] && choices[1]) {
      setCurrentChoice(choices[1]);
    }
  };

  const handleQuestionAnswered = (q: any) => {
    setShowQuestionModal(false);
    setUsedTools((prev) => [...prev, "question"]);
    setToolResult({
      id: "question",
      result: tools.find((t) => t.id === "question")?.result,
    });
    if (!foundFlags.includes("f3")) {
      setFoundFlags((prev) => [...prev, "f3"]);
    }
    if (!choicesMade["c2"] && choices[1]) {
      setCurrentChoice(choices[1]);
    }
  };

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
    const current = currentChoice;
    setChoiceResult(null);
    setCurrentChoice(null);

    // Если закончилась c1 → ждём действий с инструментами, потом c2
    if (current?.id === "c1") {
      // Ничего, ждём выбора инструмента
      return;
    }
    // Если c2 → переход к c3
    if (current?.id === "c2") {
      if (choices[2]) setCurrentChoice(choices[2]);
      return;
    }
    // c3 → разоблачение
    if (current?.id === "c3") {
      setPhase("reveal");
      const finalAnswers = [
        ...answers.filter((a) => a.key !== "fake_friend_chat_result"),
        {
          key: "fake_friend_chat_result",
          value: {
            foundFlags,
            choices: choicesMade,
            finalChoice,
            usedTools,
          },
        },
      ];
      onChange(finalAnswers);
    }
  };

  const handleReset = () => {
    setPhase("chat");
    setVisibleAudio(0);
    setVisibleText(0);
    setUsedTools([]);
    setToolResult(null);
    setCurrentChoice(null);
    setChoiceResult(null);
    setChoicesMade({});
    setFoundFlags([]);
    setFinalChoice(null);
    onChange(answers.filter((a) => a.key !== "fake_friend_chat_result"));
  };

  const isSuccess = finalChoice === "good";
  const isPartial = finalChoice === "neutral";

  return (
    <Stack spacing={3}>
      {/* Шапка */}
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
            }}
          >
            🔓
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
              Взломанный аккаунт
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
        </Stack>
      </Paper>

      {/* ЧАТ */}
      {phase === "chat" && (
        <Box
          sx={{
            display: "grid",
             gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Stack spacing={2}>
            {/* Кнопки инструментов */}
            <Paper
              sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#F8F9FA" }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {tools.map((t) => {
                  const isUsed = usedTools.includes(t.id);
                  return (
                    <Button
                      key={t.id}
                      onClick={() => useTool(t)}
                      size="small"
                      variant={isUsed ? "outlined" : "contained"}
                      startIcon={
                        <Box component="span" sx={{ fontSize: 16 }}>
                          {t.icon}
                        </Box>
                      }
                      endIcon={
                        isUsed ? (
                          <CheckCircle sx={{ fontSize: 14 }} />
                        ) : undefined
                      }
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: 12,
                        background: isUsed ? undefined : "#7C4DFF",
                      }}
                    >
                      {t.label}
                    </Button>
                  );
                })}
              </Stack>
            </Paper>

            {/* Сообщения */}
            <Paper
              sx={{
                p: 2.5,
                borderRadius: "16px",
                backgroundColor: "#F3F4F6",
                minHeight: 320,
              }}
            >
              <Stack spacing={2}>
                {/* Аудио */}
                {audioMessages.slice(0, visibleAudio).map((m) => (
                  <Stack
                    key={m.id}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                  >
                    <Avatar sx={{ bgcolor: "#7C4DFF", width: 40, height: 40 }}>
                      {friend?.avatar || "🐺"}
                    </Avatar>
                    <Box sx={{ maxWidth: "80%" }}>
                      <Typography
                        fontSize={11}
                        fontWeight={700}
                        sx={{ color: "#6B7280", mb: 0.25, ml: 0.5 }}
                      >
                        {friend?.name || "Андрей"}
                      </Typography>
                      <Paper
                        onClick={() => playAudio(m.src, m.id)}
                        sx={{
                          p: 1.5,
                          borderRadius: "4px 16px 16px 16px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          minWidth: 220,
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: "#7C4DFF",
                            color: "#fff",
                            "&:hover": { bgcolor: "#6A3EE0" },
                          }}
                        >
                          {playing === m.id ? (
                            <Pause sx={{ fontSize: 18 }} />
                          ) : (
                            <PlayArrow sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography fontSize={12} fontWeight={600}>
                            🎤 Голосовое сообщение
                          </Typography>
                          <Typography fontSize={11} color="text.secondary">
                            {m.text}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Stack>
                ))}

                {/* Текст */}
                {textMessages.slice(0, visibleText).map((m) => (
                  <Stack
                    key={m.id}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                  >
                    <Avatar sx={{ bgcolor: "#7C4DFF", width: 40, height: 40 }}>
                      {friend?.avatar || "🐺"}
                    </Avatar>
                    <Box sx={{ maxWidth: "80%" }}>
                      <Typography
                        fontSize={11}
                        fontWeight={700}
                        sx={{ color: "#6B7280", mb: 0.25, ml: 0.5 }}
                      >
                        {friend?.name || "Андрей"}
                      </Typography>
                      <Paper
                        sx={{
                          px: 2,
                          py: 1.25,
                          borderRadius: "4px 16px 16px 16px",
                        }}
                      >
                        <Typography fontSize={14.5}>{m.text}</Typography>
                      </Paper>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            {/* Результат инструмента */}
            {toolResult && (
              <Alert
                severity="info"
                sx={{ borderRadius: "12px" }}
                onClose={() => setToolResult(null)}
              >
                <Typography fontWeight={700} fontSize={13} sx={{ mb: 0.5 }}>
                  Результат: {tools.find((t) => t.id === toolResult.id)?.label}
                </Typography>
                <Typography fontSize={12.5}>
                  {toolResult.result.text}
                </Typography>
                {toolResult.result.src && (
                  <Button
                    size="small"
                    startIcon={<PlayArrow />}
                    onClick={() => playAudio(toolResult.result.src, "result")}
                    sx={{ mt: 1, textTransform: "none" }}
                  >
                    Прослушать
                  </Button>
                )}
              </Alert>
            )}

            {/* Развилка */}
            {currentChoice && !choiceResult && (
              <ChoiceBar
                title={currentChoice.title}
                options={currentChoice.options}
                onSelect={handleChoice}
              />
            )}

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
                Дальше
              </Button>
            )}
          </Stack>

          <Box sx={{ position: { md: "sticky" }, top: { md: 16 } }}>
            <SuspicionPanel allFlags={redFlags} foundFlags={foundFlags} />
          </Box>
        </Box>
      )}

      {/* РАЗОБЛАЧЕНИЕ */}
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
              label={`🚩 Флагов: ${foundFlags.length}/${redFlags.length}`}
              sx={{ bgcolor: "#FFFFFF", fontWeight: 700 }}
            />
            <Chip
              label={`🔧 Инструментов: ${usedTools.length}/${tools.length}`}
              sx={{ bgcolor: "#FFFFFF", fontWeight: 700 }}
            />
            <Chip
              label={`✅ Решений: ${
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

      {/* Модалка контрольного вопроса */}
      <Dialog
        open={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Контрольный вопрос</DialogTitle>
        <DialogContent>
          <Typography fontSize={13} color="text.secondary" sx={{ mb: 2 }}>
            Задай один из вопросов, который знает только настоящий Андрей.
          </Typography>
          <Stack spacing={1}>
            {tools
              .find((t) => t.id === "question")
              ?.questions?.map((q) => (
                <Button
                  key={q.id}
                  variant="outlined"
                  onClick={() => handleQuestionAnswered(q)}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {q.text}
                </Button>
              ))}
          </Stack>
        </DialogContent>
      </Dialog>

      <RealFriendModal
        open={showRealChat}
        onClose={() => setShowRealChat(false)}
        messages={realFriendChat}
      />
    </Stack>
  );
}
