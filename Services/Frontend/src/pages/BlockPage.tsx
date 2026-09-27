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
  const color = topicColors[topic || ""] || "#7C4DFF";
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
          sx={{ mb: 3, color: "text.secondary" }}
        >
          Все блоки
        </Button>

        {/* Hero блока */}
        <Box
          sx={{
            p: 4,
            mb: 4,
            borderRadius: "24px",
            background: `linear-gradient(135deg, ${color}22, ${color}08)`,
            border: `2px solid ${color}40`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: "22px",
                background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 46,
                boxShadow: `0 12px 32px ${color}55`,
                flexShrink: 0,
              }}
            >
              📚
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h3"
                fontWeight={900}
                sx={{ color: "#1A1A2E", mb: 0.5 }}
              >
                {label}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    width: 200,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#FFFFFF",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: color,
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="body2" fontWeight={700}>
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
                    borderRadius: "20px",
                    borderTop: `6px solid ${task.color || color}`,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    animation: `cardIn 0.5s ease ${i * 0.08}s both`,
                    "@keyframes cardIn": {
                      "0%": { opacity: 0, transform: "translateY(20px)" },
                      "100%": { opacity: 1, transform: "translateY(0)" },
                    },
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: `0 20px 40px ${task.color || color}55`,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/task/${task.id}`)}
                    sx={{ p: 3, height: "100%" }}
                  >
                    <Stack spacing={2}>
                      {/* Звёзды */}
                      <Stack direction="row" spacing={0.5}>
                        {[0, 1, 2].map((j) =>
                          j < stars ? (
                            <StarIcon
                              key={j}
                              sx={{ fontSize: 22, color: "#FFCA28" }}
                            />
                          ) : (
                            <StarBorderIcon
                              key={j}
                              sx={{ fontSize: 22, color: "#D1D5DB" }}
                            />
                          ),
                        )}
                      </Stack>

                      <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{ color: "#1A1A2E", lineHeight: 1.3 }}
                      >
                        {task.emoji} {task.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.55,
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
                          size="small"
                          sx={{
                            bgcolor: "#FFF3E0",
                            fontWeight: 700,
                            color: "#7C4DFF",
                          }}
                        />
                        <Chip
                          label={task.task_type}
                          size="small"
                          sx={{ bgcolor: "#F1EBFF", fontWeight: 600 }}
                        />
                      </Stack>
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
        borderRadius: "20px",
        borderTop: "6px solid #7C4DFF", // ← акцентная полоса сверху
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        height: "100%",
        background: "#FFFFFF",
        // Лёгкий фиолетовый оттенок по углам — «спец», но не кричит
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 100% 0%, rgba(124,77,255,0.06), transparent 50%)",
          pointerEvents: "none",
        },
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 20px 40px rgba(124,77,255,0.25)",
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(path)}
        sx={{
          p: 3,
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
                  bgcolor: "#F1EBFF",
                  color: "#7C4DFF",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              />
            ) : (
              <Chip
                label="Интерактив"
                size="small"
                sx={{
                  bgcolor: "#F1EBFF",
                  color: "#7C4DFF",
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              />
            )}

            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7C4DFF22, #7C4DFF08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              {emoji}
            </Box>
          </Stack>

          {/* Заголовок */}
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ color: "#1A1A2E", lineHeight: 1.3 }}
          >
            {title}
          </Typography>

          {/* Описание */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.55,
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
                bgcolor: "#FFF3E0",
                fontWeight: 700,
                color: "#7C4DFF",
              }}
            />
            <Chip
              label="спец"
              size="small"
              sx={{ bgcolor: "#F1EBFF", fontWeight: 600, color: "#7C4DFF" }}
            />
          </Stack>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
