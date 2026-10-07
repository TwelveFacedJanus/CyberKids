// components/tasks/HackedFriendTask.tsx
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
import Send from "@mui/icons-material/Send";
import CheckCircle from "@mui/icons-material/CheckCircle";
import WarningAmber from "@mui/icons-material/WarningAmber";
import type { TaskComponentProps } from "./taskUtils";

// ─── Типы сообщений в чате ───
type ChatMessage =
  | { id: string; kind: "them-text"; text: string }
  | { id: string; kind: "them-audio"; src: string; text: string }
  | { id: string; kind: "me-text"; text: string }
  | { id: string; kind: "system"; text: string }
  | { id: string; kind: "system-result"; text: string };

interface Tool {
  id: string;
  icon: string;
  label: string;
  userMessage?: string;
  systemMessage?: string;
  systemResult?: string;
  reply?: { type: string; text: string; isReveal?: boolean };
  opensOldVoice?: boolean;
  opensQuestions?: boolean;
  noReply?: boolean;
}

interface ControlQuestion {
  id: string;
  text: string;
  correct: string;
  reply: string;
}

interface RedFlag {
  id: string;
  label: string;
  hint?: string;
}

export default function HackedFriendTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const storyTitle = (content as any).storyTitle || "Взломанный друг";
  const intro = (content as any).intro || "";
  const friend = (content as any).friend;
  const initialMessages = (content as any).initialMessages || [];
  const tools: Tool[] = (content as any).tools || [];
  const controlQuestions: ControlQuestion[] =
    (content as any).controlQuestions || [];
  const oldVoice = (content as any).oldVoice;
  const redFlags: RedFlag[] = (content as any).redFlags || [];
  const reveal = (content as any).reveal;
  const explainer = (content as any).explainer;
  const finalQuestion = (content as any).finalQuestion || "Кто тебе писал?";
  const finalOptions = (content as any).finalOptions || [];

  const [phase, setPhase] = useState<"chat" | "final" | "reveal">("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [usedTools, setUsedTools] = useState<string[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [foundFlags, setFoundFlags] = useState<string[]>([]);
  const [finalChoice, setFinalChoice] = useState<string | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [showOldVoice, setShowOldVoice] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [typing, setTyping] = useState(false);
  const [revealSeen, setRevealSeen] = useState(false);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ─── Автопрокрутка чата ───
  useEffect(() => {
    const s = scrollerRef.current;
    if (s) s.scrollTop = s.scrollHeight;
  }, [messages, typing]);

  // ─── Первые сообщения ───
  useEffect(() => {
    if (phase !== "chat") return;
    let cancelled = false;

    const run = async () => {
      for (const m of initialMessages) {
        await new Promise((r) => setTimeout(r, m.delay ?? 1500));
        if (cancelled) return;
        setMessages((prev) => [
          ...prev,
          m.type === "audio"
            ? { id: m.id, kind: "them-audio", src: m.src, text: m.text }
            : { id: m.id, kind: "them-text", text: m.text },
        ]);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ─── Авто-флаги f1, f2, f3 ───
  useEffect(() => {
    if (messages.length === 0) return;
    setFoundFlags((prev) => {
      const next = new Set(prev);
      next.add("f1"); // деньги
      if (
        messages.some((m) => m.kind === "them-text" && m.text.includes("+7"))
      ) {
        next.add("f2"); // потерял телефон
      }
      if (
        messages.some(
          (m) =>
            m.kind === "them-text" && m.text.toLowerCase().includes("срочно"),
        )
      ) {
        next.add("f3"); // торопит
      }
      return [...next];
    });
  }, [messages]);

  // ─── Помощник: добавить сообщение + ответ с «печатает» ───
  const pushMessage = (m: ChatMessage) => {
    setMessages((prev) => [...prev, m]);
  };

  const pushReplyWithTyping = async (text: string, isReveal = false) => {
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));
    setTyping(false);
    setMessages((prev) => [
      ...prev,
      { id: `r_${Date.now()}`, kind: "them-text", text },
    ]);
    if (isReveal && !revealSeen) {
      setRevealSeen(true);
      setFoundFlags((prev) => [...new Set([...prev, "f6"])]);
    }
  };

  // ─── Использование инструмента ───
  const useTool = async (tool: Tool) => {
    if (usedTools.includes(tool.id)) return;
    setUsedTools((prev) => [...prev, tool.id]);

    // Если открывает старое голосовое — не пишем в чат
    if (tool.opensOldVoice) {
      setShowOldVoice(true);
      return;
    }
    // Если открывает вопросы — открываем модалку
    if (tool.opensQuestions) {
      setShowQuestionModal(true);
      return;
    }

    // Пишем сообщение в чат
    if (tool.userMessage) {
      pushMessage({
        id: `u_${Date.now()}`,
        kind: "me-text",
        text: tool.userMessage,
      });
    }
    if (tool.systemMessage) {
      pushMessage({
        id: `s_${Date.now()}`,
        kind: "system",
        text: tool.systemMessage,
      });
    }

    // Показать результат инструмента
    if (tool.systemResult) {
      await new Promise((r) => setTimeout(r, 600));
      pushMessage({
        id: `sr_${Date.now()}`,
        kind: "system-result",
        text: tool.systemResult,
      });
      // Флаг f4 — голос гладкий
      if (tool.id === "play_slow") {
        setFoundFlags((prev) => [...new Set([...prev, "f4"])]);
      }
    }

    // Ответ мошенника
    if (tool.reply && !tool.noReply) {
      await new Promise((r) => setTimeout(r, 400));
      await pushReplyWithTyping(tool.reply.text, tool.reply.isReveal);
    }
  };

  // ─── Отправка контрольного вопроса ───
  const sendControlQuestion = async (q: ControlQuestion) => {
    setShowQuestionModal(false);
    setAskedQuestions((prev) => [...prev, q.id]);
    pushMessage({ id: `q_${Date.now()}`, kind: "me-text", text: q.text });
    await pushReplyWithTyping(q.reply);
    // Флаг f5 — не знает деталей
    setFoundFlags((prev) => [...new Set([...prev, "f5"])]);
  };

  // ─── Проигрывание аудио ───
  const playAudio = (src: string, id: string) => {
    if (playing === id) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const a = new Audio(src);
    audioRef.current = a;
    a.play().catch(() => {});
    setPlaying(id);
    a.onended = () => setPlaying(null);
  };

  // ─── Финал ───
  const finish = async () => {
    if (!finalChoice) return;
    setPhase("reveal");
    onChange([
      ...answers.filter((a) => a.key !== "hacked_friend_result"),
      {
        key: "hacked_friend_result",
        value: {
          foundFlags,
          usedTools,
          askedQuestions,
          finalChoice,
        },
      },
    ]);
  };

  const handleReset = () => {
    setPhase("chat");
    setMessages([]);
    setUsedTools([]);
    setAskedQuestions([]);
    setFoundFlags([]);
    setFinalChoice(null);
    setRevealSeen(false);
    onChange(answers.filter((a) => a.key !== "hacked_friend_result"));
  };

  const isSuccess = finalChoice === "final_good";

  // Считаем ходы (сколько раз ребёнок что-то сделал)
  const turns = usedTools.length + askedQuestions.length;

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
          <Chip
            label={`Ходов: ${turns}`}
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.12)",
              color: "#fff",
              fontWeight: 700,
            }}
          />
        </Stack>
      </Paper>

      {/* ══════════ ЧАТ ══════════ */}
      {phase === "chat" && (
        <Box
          sx={{
            display: "grid",
             gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) clamp(240px, 24vw, 320px)" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Stack spacing={2}>
            {/* Чат */}
            <Paper
              data-tutorial="hacked-friend-chat"
              sx={{
                p: 2,
                borderRadius: "16px",
                backgroundColor: "#F3F4F6",
                 height: "clamp(360px, 58vh, 440px)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Box
                ref={scrollerRef}
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  pr: 0.5,
                }}
              >
                {messages.map((m) =>
                  renderMessage(m, friend, playing, playAudio),
                )}
                {typing && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ pl: 1 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#7C4DFF",
                        width: 32,
                        height: 32,
                        fontSize: 16,
                      }}
                    >
                      {friend?.avatar || "🐺"}
                    </Avatar>
                    <Box sx={{ display: "flex", gap: 0.4 }}>
                      {[0, 1, 2].map((i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: "#9CA3AF",
                            animation: `typing 1s ease-in-out ${i * 0.15}s infinite`,
                            "@keyframes typing": {
                              "0%, 60%, 100%": {
                                opacity: 0.3,
                                transform: "translateY(0)",
                              },
                              "30%": {
                                opacity: 1,
                                transform: "translateY(-3px)",
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Stack>
                )}
              </Box>
            </Paper>

            {/* Панель инструментов */}
            <Paper
              sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#F8F9FA" }}
            >
              <Typography
                fontSize={11}
                fontWeight={700}
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Инструменты проверки
              </Typography>
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
                      disabled={isUsed}
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

            {/* Кнопка «Принять решение» */}
            {turns >= 4 && (
              <Button
                variant="contained"
                size="large"
                onClick={() => setPhase("final")}
                sx={{
                  py: 1.6,
                  fontWeight: 800,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
                }}
              >
                Пора принять решение →
              </Button>
            )}
          </Stack>

          {/* Панель флагов */}
          <Box sx={{ position: { md: "sticky" }, top: { md: 16 } }}>
            <FlagsPanel allFlags={redFlags} foundFlags={foundFlags} />
          </Box>
        </Box>
      )}

      {/* ══════════ ФИНАЛ ══════════ */}
      {phase === "final" && (
        <Paper
          sx={{
            p: 4,
            borderRadius: "20px",
            background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)",
            border: "2px solid #F59E0B",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
            🎯 {finalQuestion}
          </Typography>
          <Stack spacing={2} sx={{ maxWidth: 500, mx: "auto", mt: 3 }}>
            {finalOptions.map((opt: any) => (
              <Button
                key={opt.id}
                variant={finalChoice === opt.id ? "contained" : "outlined"}
                onClick={() => setFinalChoice(opt.id)}
                sx={{
                  py: 2,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: 15,
                  justifyContent: "flex-start",
                  borderColor: opt.style === "good" ? "#22C55E" : "#EF4444",
                  background:
                    finalChoice === opt.id
                      ? opt.style === "good"
                        ? "#22C55E"
                        : "#EF4444"
                      : undefined,
                  color: finalChoice === opt.id ? "#fff" : undefined,
                }}
              >
                {opt.text}
              </Button>
            ))}
          </Stack>
          <Button
            variant="contained"
            size="large"
            disabled={!finalChoice}
            onClick={finish}
            sx={{
              mt: 3,
              py: 1.5,
              px: 6,
              borderRadius: "14px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #7C4DFF, #EC407A)",
            }}
          >
            Подтвердить
          </Button>
        </Paper>
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
              : "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
            border: `2px solid ${isSuccess ? "#22C55E" : "#EF4444"}`,
          }}
        >
          <Box sx={{ fontSize: 64, mb: 1 }}>{isSuccess ? "🏆" : "🚨"}</Box>
          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ mb: 2, color: isSuccess ? "#166534" : "#991B1B" }}
          >
            {isSuccess ? "Ты разоблачил мошенника!" : "Ты попался"}
          </Typography>

          {isSuccess ? (
            <Stack spacing={2} sx={{ maxWidth: 620, mx: "auto", mb: 3 }}>
              <Typography
                fontSize={14.5}
                sx={{ lineHeight: 1.65, color: "text.secondary" }}
              >
                {reveal?.success}
              </Typography>

              {reveal?.successAudio && (
                <Paper
                  onClick={() => playAudio(reveal.successAudio, "reveal-audio")}
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: "#FFFFFF",
                    border: "2px solid #22C55E",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(34,197,94,0.25)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: "#22C55E",
                      color: "#fff",
                      "&:hover": { bgcolor: "#16A34A" },
                    }}
                  >
                    {playing === "reveal-audio" ? (
                      <Pause sx={{ fontSize: 20 }} />
                    ) : (
                      <PlayArrow sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                  <Box sx={{ flexGrow: 1, textAlign: "left" }}>
                    <Typography fontSize={13} fontWeight={700} color="#166534">
                      🎤 Андрей ответил
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      Нажми, чтобы прослушать
                    </Typography>
                  </Box>
                </Paper>
              )}

              {reveal?.successAfter && (
                <Typography
                  fontSize={14.5}
                  sx={{ lineHeight: 1.65, color: "text.secondary" }}
                >
                  {reveal.successAfter}
                </Typography>
              )}
            </Stack>
          ) : (
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
              {reveal?.failure}
            </Typography>
          )}

          {/* Что заметил / что пропустил */}
          <Box sx={{ maxWidth: 620, mx: "auto", textAlign: "left", mb: 3 }}>
            <Typography fontWeight={800} fontSize={14} sx={{ mb: 1 }}>
              🚩 Что ты заметил:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              {foundFlags.map((fid) => {
                const f = redFlags.find((x) => x.id === fid);
                if (!f) return null;
                return (
                  <Chip
                    key={fid}
                    label={f.label}
                    size="small"
                    sx={{
                      bgcolor: "#DCFCE7",
                      color: "#166534",
                      fontWeight: 700,
                    }}
                  />
                );
              })}
              {foundFlags.length === 0 && (
                <Typography fontSize={12.5} color="text.secondary">
                  Ничего не отмечено.
                </Typography>
              )}
            </Stack>

            {foundFlags.length < redFlags.length && (
              <>
                <Typography fontWeight={800} fontSize={14} sx={{ mb: 1 }}>
                  ⚠️ Что ты пропустил:
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mb: 2 }}
                >
                  {redFlags
                    .filter((f) => !foundFlags.includes(f.id))
                    .map((f) => (
                      <Chip
                        key={f.id}
                        label={f.label}
                        size="small"
                        sx={{
                          bgcolor: "#FEF3C7",
                          color: "#92400E",
                          fontWeight: 700,
                        }}
                      />
                    ))}
                </Stack>
              </>
            )}

            {revealSeen && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor: "rgba(239,68,68,0.1)",
                  border: "1px solid #FCA5A5",
                }}
              >
                <Typography fontSize={13} fontWeight={700} color="#991B1B">
                  🎯 Ключевая фраза:
                </Typography>
                <Typography
                  fontSize={13.5}
                  color="#7F1D1D"
                  sx={{ mt: 0.5, fontStyle: "italic" }}
                >
                  «Да ладно, я пошутил. Не рассказывай никому.»
                </Typography>
                <Typography
                  fontSize={12}
                  color="#B91C1C"
                  sx={{ mt: 1, lineHeight: 1.5 }}
                >
                  Настоящий друг никогда не скажет «не рассказывай родителям».
                  Именно эта фраза выдала мошенника.
                </Typography>
              </Box>
            )}
          </Box>

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

      {/* ─── Модалка контрольного вопроса ─── */}
      <Dialog
        open={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          🧠 Контрольный вопрос
        </DialogTitle>
        <DialogContent>
          <Typography fontSize={13} color="text.secondary" sx={{ mb: 2 }}>
            Задай вопрос, который точно знает настоящий Андрей.
          </Typography>
          <Stack spacing={1}>
            {controlQuestions.map((q) => (
              <Button
                key={q.id}
                variant="outlined"
                onClick={() => sendControlQuestion(q)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: 13,
                  py: 1.25,
                }}
              >
                {q.text}
              </Button>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ─── Модалка старого голосового ─── */}
      <Dialog
        open={showOldVoice}
        onClose={() => setShowOldVoice(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          📼 Старое голосовое Андрея
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Button
              variant="contained"
              startIcon={playing === "old" ? <Pause /> : <PlayArrow />}
              onClick={() => playAudio(oldVoice.src, "old")}
              sx={{
                borderRadius: "10px",
                fontWeight: 700,
                background: "#22C55E",
                "&:hover": { background: "#16A34A" },
              }}
            >
              {playing === "old" ? "Пауза" : "Прослушать"}
            </Button>
            <Typography
              fontSize={12.5}
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              «{oldVoice.text}»
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// RENDERERS
// ═══════════════════════════════════════════════════════════

function renderMessage(
  m: ChatMessage,
  friend: any,
  playing: string | null,
  playAudio: (src: string, id: string) => void,
) {
  if (m.kind === "system" || m.kind === "system-result") {
    return (
      <Box key={m.id} sx={{ alignSelf: "center", maxWidth: "90%" }}>
        <Paper
          sx={{
            px: 2,
            py: 1,
            borderRadius: "20px",
            backgroundColor: m.kind === "system-result" ? "#FEF3C7" : "#E5E7EB",
            border: `1px solid ${m.kind === "system-result" ? "#FCD34D" : "#D1D5DB"}`,
          }}
        >
          <Typography
            fontSize={12.5}
            sx={{
              fontWeight: 600,
              color: m.kind === "system-result" ? "#92400E" : "#6B7280",
              textAlign: "center",
            }}
          >
            {m.text}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (m.kind === "me-text") {
    return (
      <Box
        key={m.id}
        sx={{
          alignSelf: "flex-end",
          maxWidth: "80%",
          animation: "msgIn 0.3s ease both",
          "@keyframes msgIn": {
            "0%": { opacity: 0, transform: "translateX(10px)" },
            "100%": { opacity: 1, transform: "translateX(0)" },
          },
        }}
      >
        <Paper
          sx={{
            px: 2,
            py: 1.25,
            borderRadius: "16px 16px 4px 16px",
            backgroundColor: "#DCF8C6",
            border: "1px solid #A5D6A7",
          }}
        >
          <Typography fontSize={14.5} sx={{ lineHeight: 1.4 }}>
            {m.text}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (m.kind === "them-audio") {
    return (
      <Stack
        key={m.id}
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
        sx={{
          animation: "msgIn 0.3s ease both",
          "@keyframes msgIn": {
            "0%": { opacity: 0, transform: "translateX(-10px)" },
            "100%": { opacity: 1, transform: "translateX(0)" },
          },
        }}
      >
        <Avatar
          sx={{ bgcolor: "#7C4DFF", width: 40, height: 40, fontSize: 20 }}
        >
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
               minWidth: "min(260px, 100%)",
              backgroundColor: "#fff",
              "&:hover": { backgroundColor: "#FAFAFA" },
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
                🎤 Голосовое
              </Typography>
              <Typography
                fontSize={11}
                color="text.secondary"
                sx={{ lineHeight: 1.4 }}
              >
                {m.text}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Stack>
    );
  }

  // them-text
  return (
    <Stack
      key={m.id}
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        animation: "msgIn 0.3s ease both",
        "@keyframes msgIn": {
          "0%": { opacity: 0, transform: "translateX(-10px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      }}
    >
      <Avatar sx={{ bgcolor: "#7C4DFF", width: 40, height: 40, fontSize: 20 }}>
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
            backgroundColor: "#fff",
          }}
        >
          <Typography fontSize={14.5} sx={{ lineHeight: 1.4 }}>
            {m.text}
          </Typography>
        </Paper>
      </Box>
    </Stack>
  );
}

// ═══════════════════════════════════════════════════════════
// FLAGS PANEL
// ═══════════════════════════════════════════════════════════

function FlagsPanel({
  allFlags,
  foundFlags,
}: {
  allFlags: RedFlag[];
  foundFlags: string[];
}) {
  return (
    <Paper
      sx={{
        borderRadius: "16px",
        border: "2px solid #F59E0B",
        backgroundColor: "#FFFBEB",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          background: "linear-gradient(135deg, #F59E0B, #EF4444)",
          color: "#fff",
        }}
      >
        <Typography
          fontSize={11}
          sx={{
            opacity: 0.85,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Подозрения
        </Typography>
        <Typography fontWeight={800} fontSize={16}>
          🚩 Красные флаги
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Stack spacing={1}>
          {allFlags.map((f) => {
            const found = foundFlags.includes(f.id);
            return (
              <Box
                key={f.id}
                sx={{
                  p: 1.25,
                  borderRadius: "10px",
                  backgroundColor: found ? "#FFFFFF" : "#F3F4F6",
                  border: `1px solid ${found ? "#FCD34D" : "#E5E7EB"}`,
                  transition: "all 0.4s ease",
                  animation: found ? "flagIn 0.5s ease both" : undefined,
                  "@keyframes flagIn": {
                    "0%": { opacity: 0, transform: "translateX(10px)" },
                    "100%": { opacity: 1, transform: "translateX(0)" },
                  },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <WarningAmber
                    sx={{
                      fontSize: 16,
                      color: found ? "#F59E0B" : "#D1D5DB",
                      mt: 0.25,
                    }}
                  />
                  <Box>
                    <Typography
                      fontSize={12.5}
                      fontWeight={found ? 700 : 500}
                      color={found ? "#92400E" : "#9CA3AF"}
                    >
                      {found ? f.label : "???"}
                    </Typography>
                    {found && f.hint && (
                      <Typography
                        fontSize={11}
                        color="text.secondary"
                        sx={{ mt: 0.25, lineHeight: 1.4 }}
                      >
                        {f.hint}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #FCD34D",
          backgroundColor: "#FEF3C7",
        }}
      >
        <Typography fontSize={12} fontWeight={700} color="#92400E">
          Найдено: {foundFlags.length} / {allFlags.length}
        </Typography>
      </Box>
    </Paper>
  );
}
