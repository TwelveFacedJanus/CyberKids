// pages/DashboardPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import LockIcon from "@mui/icons-material/Lock";
import { api } from "../api/client";
import Layout from "../components/Layout";
import AnimatedBackground from "../components/AnimatedBackground";
import { useAuth } from "../context/AuthContext";
import { ageGroupLabels, topicColors, topicLabels } from "../theme";
import { topicIcons, taskTypeIcons, ageGroupIcons } from "../icons";
import type { Result, Task } from "../types";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<Task[]>("/api/tasks"),
      api.get<Result[]>("/api/results/me"),
    ])
      .then(([t, r]) => {
        setTasks(t);
        setResults(r);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Не удалось загрузить"),
      )
      .finally(() => setLoading(false));
  }, []);

  const bestByTask = useMemo(() => {
    const map = new Map<string, Result>();
    for (const r of results) {
      const prev = map.get(r.task_id);
      if (!prev || r.score > prev.score) map.set(r.task_id, r);
    }
    return map;
  }, [results]);
  
  const greeting = useMemo(() => {
    const name = user?.full_name?.split(" ")[0] || user?.username || "друг";

    const phrases = [
    `Вау, у тебя отлично получается, ${name}! 🌟`,
    `Привет, ${name}! Готов покорять новые вершины? 🚀`,
    `С возвращением, ${name}! Продолжаем учиться? 📚`,
    `Класс, ${name}, ты сегодня на высоте! 🔥`,
    `Привет, ${name}! Сегодня отличный день для новых знаний ✨`,
    `О, снова ты, ${name}! Покажи, на что способен 💪`,
    `Здорово, что ты вернулся, ${name}! 🎉`,
    `Ты становишься настоящим кибергероем, ${name}! 🛡️`,
    ];

    return phrases[Math.floor(Math.random() * phrases.length)];
  }, [user]);

  const earnedStars = useMemo(() => {
    let stars = 0;
    for (const r of bestByTask.values()) {
      stars += Math.round((r.score / r.max_score) * 3);
    }
    return stars;
  }, [bestByTask]);

  const completedCount = bestByTask.size;

  const byTopic = useMemo(() => {
    const groups = new Map<string, Task[]>();
    for (const t of tasks) {
      const arr = groups.get(t.topic) ?? [];
      arr.push(t);
      groups.set(t.topic, arr);
    }
    return [...groups.entries()];
  }, [tasks]);

  // 🆕 Функция проверки доступности задания для пользователя
  const isTaskAvailable = (task: Task): boolean => {
    // Если у задания нет ограничений по группам — доступно всем
    if (!task.forbidden_groups || task.forbidden_groups.length === 0) {
      return true;
    }
    // Если у пользователя нет групп — задание недоступно
    if (!user?.groups || user.groups.length === 0) {
      return false;
    }
    // Проверяем пересечение групп
    return task.forbidden_groups.some((groupId) =>
      user.groups.includes(groupId),
    );
  };

  // 🆕 Получаем названия групп для отображения
  const getForbiddenGroupsLabel = (task: Task): string => {
    if (!task.forbidden_groups || task.forbidden_groups.length === 0) return "";
    return task.forbidden_groups.map((g) => `«${g.toUpperCase()}»`).join(", ");
  };

  if (loading) {
    return (
      <Layout>
        <AnimatedBackground />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            py: 10,
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const AgeIcon = user
    ? (ageGroupIcons[user.age_group] ?? ageGroupIcons.junior)
    : ageGroupIcons.junior;
  


  return (
    <Layout>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Приветственная секция */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#1A1A2E" }}>
            {greeting}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Продолжай учиться и зарабатывать звёзды!
          </Typography>
        </Box>

        {/* Статистика */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 🐻 Медведь на фоне */}
              <Box
                component="img"
                src="/BearSmile.svg"
                alt=""
                aria-hidden
                sx={{
                  position: "absolute",
                  right: 140,
                  bottom: -30,
                  width: 140,
                  height: "auto",
                  opacity: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                  transform: "rotate(-8deg)",
                  filter: "drop-shadow(0 8px 16px rgba(124, 77, 255, 0.15))",
                }}
              />

              <Typography
                variant="h3"
                fontWeight={800}
                color="primary"
                sx={{ position: "relative", zIndex: 1 }}
              >
                {earnedStars}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ position: "relative", zIndex: 1 }}
              >
                ⭐ Звёзд
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 📚 Книга в правом верхнем углу */}
              <Box
                component="img"
                src="/Books3D.png"
                alt=""
                aria-hidden
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 200,
                  width: 100,
                  height: "auto",
                  opacity: 0.9,
                  pointerEvents: "none",
                  userSelect: "none",
                  transform: "rotate(8deg)",
                  filter: "drop-shadow(0 6px 14px rgba(124, 77, 255, 0.2))",
                }}
              />

              <Typography
                variant="h3"
                fontWeight={800}
                color="secondary"
                sx={{ position: "relative", zIndex: 1 }}
              >
                {completedCount}/{tasks.length}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ position: "relative", zIndex: 1 }}
              >
                📚 Заданий
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 🤖 Claude в левом верхнем углу */}
              <Box
                component="img"
                src="/ClaudeIcon.svg"
                alt=""
                aria-hidden
                sx={{
                  position: "absolute",
                  top: 0,
                  left: -5,
                  width: 150,
                  height: "auto",
                  opacity: 0.85,
                  pointerEvents: "none",
                  userSelect: "none",
                  transform: "rotate(-8deg)",
                  filter: "drop-shadow(0 6px 14px rgba(124, 77, 255, 0.2))",
                }}
              />

              <Typography
                variant="h3"
                fontWeight={800}
                color="success.main"
                sx={{ position: "relative", zIndex: 1 }}
              >
                {Math.round((completedCount / tasks.length) * 100) || 0}%
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ position: "relative", zIndex: 1 }}
              >
                📈 Прогресс
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Box
                component="img"
                src="/FireGif.gif"
                alt="Серия"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                  display: "block",
                  mx: "auto",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Серия: {Math.floor(Math.random() * 10)} дней
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Задания по темам */}
        {byTopic.map(([topic, list]) => {
          const TopicIcon = topicIcons[topic] ?? topicIcons.privacy;
          const color = topicColors[topic];
          const completedInTopic = list.filter((t) =>
            bestByTask.has(t.id),
          ).length;

          return (
            <Box key={topic} sx={{ mb: 5 }}>
              {/* Заголовок темы с прогрессом */}
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <TopicIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {topicLabels[topic]}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(completedInTopic / list.length) * 100}
                      sx={{ width: 120, height: 4, borderRadius: 2 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {completedInTopic}/{list.length}
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {/* Карточки заданий */}
              <Grid container spacing={2}>
                {list.map((task) => {
                  const best = bestByTask.get(task.id);
                  const done = best !== undefined;
                  const stars = done
                    ? Math.round((best!.score / best!.max_score) * 3)
                    : 0;
                  const TypeIcon =
                    taskTypeIcons[task.task_type] ?? taskTypeIcons.quiz;
                  const available = isTaskAvailable(task);
                  const forbiddenGroupsLabel = getForbiddenGroupsLabel(task);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                      <Tooltip
                        title={
                          !available
                            ? `⛔ Задание доступно только для групп: ${forbiddenGroupsLabel}`
                            : done
                              ? `⭐ ${stars}/3 звёзд`
                              : "Нажми, чтобы начать"
                        }
                        placement="top"
                        arrow
                      >
                        <Paper
                          onClick={() => {
                            if (available) {
                              navigate(`/task/${task.id}`);
                            }
                          }}
                          sx={{
                            p: 2.5,
                            cursor: available ? "pointer" : "not-allowed",
                            height: "100%",
                            borderTop: `6px solid ${task.color || color}`,
                            opacity: available ? 1 : 0.5,
                            filter: available ? "none" : "grayscale(0.6)",
                            transition: "all 0.3s ease",
                            position: "relative",
                            "&:hover": available
                              ? {
                                  transform: "translateY(-5px)",
                                  boxShadow:
                                    "0 16px 40px rgba(124,77,255,0.22)",
                                }
                              : {},
                            pointerEvents: available ? "auto" : "none",
                            backgroundColor: available ? "#FFFFFF" : "#F3F4F6",
                          }}
                        >
                          {/* 🆕 Бейдж "Заблокировано" */}
                          {!available && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                backgroundColor: "#EF4444",
                                color: "#fff",
                                borderRadius: "8px",
                                px: 1.5,
                                py: 0.5,
                                fontSize: 11,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                zIndex: 1,
                              }}
                            >
                              <LockIcon sx={{ fontSize: 14 }} />
                              Заблокировано
                            </Box>
                          )}

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: "12px",
                                background: `linear-gradient(135deg, ${task.color || color}, ${task.color ? "#9C27B0" : "#EC407A"})`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                opacity: available ? 1 : 0.4,
                              }}
                            >
                              <TypeIcon sx={{ fontSize: 24 }} />
                            </Box>
                            {/* 🆕 Показываем звёзды только если задание доступно */}
                            {available && (
                              <Stack direction="row" spacing={0.5}>
                                {[0, 1, 2].map((i) =>
                                  i < stars ? (
                                    <Star
                                      key={i}
                                      sx={{ fontSize: 18, color: "#FFCA28" }}
                                    />
                                  ) : (
                                    <StarBorder
                                      key={i}
                                      sx={{ fontSize: 18, color: "#D1D5DB" }}
                                    />
                                  ),
                                )}
                              </Stack>
                            )}
                          </Stack>

                          <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{
                              mt: 2,
                              mb: 0.5,
                              color: available ? "#1A1A2E" : "#9CA3AF",
                            }}
                          >
                            {task.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color={available ? "text.secondary" : "#9CA3AF"}
                            sx={{ mb: 2 }}
                          >
                            {task.description}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            sx={{ gap: 1 }}
                          >
                            <Chip
                              label={`+${task.points} очков`}
                              size="small"
                              sx={{
                                bgcolor: available ? "#FFF3E0" : "#F3F4F6",
                                fontWeight: 600,
                                color: available ? "inherit" : "#9CA3AF",
                              }}
                            />
                            <Chip
                              label={task.task_type}
                              size="small"
                              sx={{
                                bgcolor: available ? "#F1EBFF" : "#F3F4F6",
                                fontWeight: 600,
                                color: available ? "inherit" : "#9CA3AF",
                              }}
                            />
                            {/* 🆕 Индикатор групп доступа */}
                            {task.forbidden_groups &&
                              task.forbidden_groups.length > 0 && (
                                <Chip
                                  label={`👥 ${task.forbidden_groups.map((g) => g.toUpperCase()).join(", ")}`}
                                  size="small"
                                  sx={{
                                    bgcolor: available ? "#E0F2FE" : "#F3F4F6",
                                    fontWeight: 600,
                                    color: available ? "inherit" : "#9CA3AF",
                                    fontSize: 10,
                                  }}
                                />
                              )}
                          </Stack>

                          {/* 🆕 Подсказка о группах для заблокированного задания */}
                          {!available && (
                            <Typography
                              variant="caption"
                              sx={{
                                mt: 1.5,
                                display: "block",
                                color: "#EF4444",
                                fontWeight: 600,
                              }}
                            >
                              ⛔ Доступно для групп: {forbiddenGroupsLabel}
                            </Typography>
                          )}
                        </Paper>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })}

        {tasks.length === 0 && (
          <Alert severity="info" icon={<AutoAwesome />}>
            Пока нет заданий для твоей возрастной группы. Загляни позже!
          </Alert>
        )}
      </Box>
    </Layout>
  );
}