// src/pages/BlockPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { api } from "../api/client";
import Layout from "../components/Layout";
import { topicColors, topicLabels } from "../theme";
import type { Result, Task } from "../types";

const SPECIAL_CARDS: Record<
  string,
  Array<{
    title: string;
    description: string;
    emoji: string;
    path: string;
    badge?: string;
  }>
> = {
  gaming_scams: [
    {
      title: "Roblox — симуляция",
      description:
        "Попробуй войти на поддельный сайт Roblox и узнай, как крадут аккаунты",
      emoji: "⚠️",
      path: "/roblox/com/auth",
      badge: "Симуляция",
    },
  ],
  fake_friends: [
    {
      title: "Тест-игра: Кибергерой",
      description:
        "10 ситуаций из жизни — как бы поступил настоящий кибергерой?",
      emoji: "🦸",
      path: "/test/cyber-hero",
    },
  ],
  ai_traps: [
    {
      title: "ALEX — Квест",
      description:
        "Пройди историю в мессенджере и разоблачи мошенников, использующих ИИ",
      emoji: "💬",
      path: "/alex",
    },
  ],
};

const TASK_TYPE_LABELS: Record<string, string> = {
  quiz: "Викторина",
  true_false: "Верно или нет",
  scenario: "Ситуация",
  dragdrop: "Распредели",
  sort: "Сортировка",
  drag3d: "3D-задание",
  theory_cards: "Карточки знаний",
  scam_banner: "Найди подвох",
  scam_chat: "Разбор переписки",
  scam_chain: "Цепочка решений",
  scam_phishing: "Фишинг",
  scam_defender: "Защитник",
  quick_test: "Быстрый тест",
  profile_builder: "Собери профиль",
  photo_detective: "Фото-детектив",
  fake_friend_chat: "Чат с другом",
  hacked_friend: "Взломанный аккаунт",
  safe_job_sort: "Проверка вакансий",
  dropper_chat: "Чат-расследование",
  prize_trap: "Конкурс-ловушка",
  fake_diary: "Цифровой дневник",
};

export default function BlockPage() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const special = SPECIAL_CARDS[topic || ""] || [];

  useEffect(() => {
    Promise.all([
      api.get<Task[]>("/api/tasks"),
      api.get<Result[]>("/api/results/me"),
    ])
      .then(([t, r]) => {
        setTasks(t.filter((x) => x.topic === topic));
        setResults(r);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));
  }, [topic]);

  const bestByTask = useMemo(() => {
    const map = new Map<string, Result>();
    for (const r of results) {
      const prev = map.get(r.task_id);
      if (!prev || r.score > prev.score) map.set(r.task_id, r);
    }
    return map;
  }, [results]);

  const completed = tasks.filter((t) => bestByTask.has(t.id)).length;
  const progress = tasks.length ? (completed / tasks.length) * 100 : 0;
  const color = topicColors[topic || ""] || "#FF6B35";
  const label = topicLabels[topic || ""] || topic || "";

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!topic) return null;

  return (
    <Layout>
      <Box>
        {/* Хлебные крошки */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/blocks")}
          sx={{ mb: 2, color: "#D94726", fontSize: "1.05rem", fontWeight: 800 }}
        >
          Все блоки
        </Button>

        {/* Hero блока */}
        <Box
          sx={{
            p: { xs: 2.5, md: 4 },
            mb: 4,
            borderRadius: "28px",
            background: `linear-gradient(120deg, ${color}18, #FFFFFF 72%)`,
            border: `3px solid ${color}40`,
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 14px 36px ${color}20`,
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Box
              sx={{
                 width: { xs: 76, md: 100 },
                 height: { xs: 76, md: 100 },
                 borderRadius: "28px",
                background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                 fontSize: { xs: 38, md: 52 },
                 boxShadow: `0 14px 34px ${color}55`,
                flexShrink: 0,
              }}
            >
              📚
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h3"
                fontWeight={900}
                 sx={{ color: "#263238", mb: 0.75, fontSize: { xs: "2rem", md: "2.7rem" } }}
              >
                {label}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                     width: { xs: 130, sm: 220 },
                     height: 12,
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: color,
                      borderRadius: 4,
                    },
                  }}
                />
                 <Typography variant="body2" fontWeight={800} sx={{ fontSize: { xs: ".95rem", md: "1.1rem" } }}>
                  {completed} / {tasks.length} пройдено
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Карточки заданий */}
        <Grid container spacing={3}>
          {special.map((card, i) => (
            <Grid item xs={12} sm={6} md={4} key={card.path}>
              <SpecialCard {...card} />
            </Grid>
          ))}

          {tasks.map((task, i) => {
            const best = bestByTask.get(task.id);
            const done = best !== undefined;
            const stars = done
              ? Math.round((best!.score / best!.max_score) * 3)
              : 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card
                  sx={{
                    borderRadius: "28px",
                    borderTop: `8px solid ${task.color || color}`,
                    cursor: "pointer",
                    transition: "all 0.35s cubic-bezier(.2,.8,.3,1)",
                    animation: `cardIn 0.55s cubic-bezier(.2,.8,.3,1) ${i * 0.07}s both`,
                    background: done ? "#F8FFFC" : "#FFFFFF",
                    overflow: "hidden",
                    "@keyframes cardIn": {
                      "0%": { opacity: 0, transform: "translateY(20px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 22px 48px ${task.color || color}45`,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/task/${task.id}`)}
                    sx={{ p: { xs: 2.5, md: 3 }, height: "100%" }}
                  >
                    <Stack spacing={2.25} sx={{ height: "100%" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box
                          sx={{
                            width: 58,
                            height: 58,
                            borderRadius: "18px",
                            bgcolor: `${task.color || color}18`,
                            color: task.color || color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 30,
                          }}
                        >
                          {task.emoji || "🎯"}
                        </Box>
                        {done ? (
                          <Stack direction="row" spacing={0.6} alignItems="center" sx={{ color: "#079476", fontWeight: 800, fontSize: ".95rem" }}>
                            <CheckCircleRoundedIcon sx={{ fontSize: 22 }} />
                            Пройдено
                          </Stack>
                        ) : (
                          <Typography sx={{ color: "#8A979D", fontWeight: 800, fontSize: ".95rem" }}>
                            Задание {i + 1}
                          </Typography>
                        )}
                      </Stack>

                      <Stack direction="row" spacing={0.35}>
                        {[0, 1, 2].map((j) =>
                          j < stars ? (
                            <StarIcon
                              key={j}
                              sx={{ fontSize: 25, color: "#F4B400" }}
                            />
                          ) : (
                            <StarBorderIcon
                              key={j}
                              sx={{ fontSize: 25, color: "#D9E0E0" }}
                            />
                          ),
                        )}
                      </Stack>

                      <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{ color: "#263238", lineHeight: 1.25, fontSize: { xs: "1.35rem", md: "1.55rem" } }}
                      >
                        {task.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.6,
                          fontSize: { xs: "1rem", md: "1.08rem" },
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {task.description}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                          label={`+${task.points} очков`}
                          sx={{
                            bgcolor: "#FFF1D6",
                            fontWeight: 700,
                            color: "#D94726",
                            fontSize: ".95rem",
                          }}
                        />
                        <Chip
                          label={TASK_TYPE_LABELS[task.task_type] || "Интерактивное задание"}
                          sx={{ bgcolor: "#ECF8F5", color: "#087F6D", fontWeight: 700, fontSize: ".9rem" }}
                        />
                      </Stack>
                      <Box sx={{ mt: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", color: task.color || color, fontWeight: 900, fontSize: "1rem" }}>
                        {done ? "Повторить" : "Начать задание"}
                        <ArrowForwardRoundedIcon sx={{ fontSize: 24 }} />
                      </Box>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {tasks.length === 0 && special.length === 0 && (
          <Alert severity="info" sx={{ mt: 3 }}>
            В этом блоке пока нет заданий. Загляни позже!
          </Alert>
        )}
      </Box>
    </Layout>
  );
}

function SpecialCard({
  title,
  description,
  emoji,
  path,
  badge,
}: {
  title: string;
  description: string;
  emoji: string;
  path: string;
  badge?: string;
}) {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        borderRadius: "28px",
        borderTop: "8px solid #F45B35",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(.2,.8,.3,1)",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        background: "linear-gradient(145deg, #FFF1D6, #FFFFFF)",
        boxShadow: "0 14px 34px rgba(244,91,53,.18)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 100% 0%, rgba(255,210,71,0.2), transparent 52%)",
          pointerEvents: "none",
        },
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 24px 52px rgba(244,91,53,.3)",
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(path)}
        sx={{
          p: { xs: 2.5, md: 3 },
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={2}>
          {/* Верхняя строка: бейдж слева, эмодзи-иконка справа */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ minHeight: 28 }}
          >
            {badge ? (
              <Chip
                label={badge}
                size="small"
                sx={{
                   bgcolor: "#FFE2D5",
                   color: "#D94726",
                   fontWeight: 700,
                   fontSize: ".85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              />
            ) : (
              <Chip
                label="Интерактив"
                size="small"
                sx={{
                   bgcolor: "#FFE2D5",
                   color: "#D94726",
                   fontWeight: 700,
                   fontSize: ".85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              />
            )}

            <Box
              sx={{
                 width: 58,
                 height: 58,
                 borderRadius: "18px",
                 background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                 fontSize: 32,
                 boxShadow: "0 7px 16px rgba(244,91,53,.14)",
              }}
            >
              {emoji}
            </Box>
          </Stack>

          {/* Заголовок */}
          <Typography
            variant="h6"
            fontWeight={800}
             sx={{ color: "#263238", lineHeight: 1.25, fontSize: { xs: "1.35rem", md: "1.55rem" } }}
          >
            {title}
          </Typography>

          {/* Описание */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
               lineHeight: 1.6,
               fontSize: { xs: "1rem", md: "1.08rem" },
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>

          {/* Нижняя строка с чипом, как у обычных заданий */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              label="Открыть"
              size="small"
              sx={{
                bgcolor: "#FFFFFF",
                fontWeight: 700,
                color: "#D94726",
                fontSize: ".95rem",
              }}
            />
            <Chip
              label="интерактив"
              sx={{ bgcolor: "#D8F5EE", fontWeight: 700, color: "#087F6D", fontSize: ".9rem" }}
            />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
