import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Star from "@mui/icons-material/Star";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import { api } from "../api/client";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { ageGroupLabels, topicColors, topicLabels } from "../theme";
import { ageGroupIcons } from "../icons";
import type { Result, Task } from "../types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get<Result[]>("/api/results/me"),
      api.get<Task[]>("/api/tasks"),
    ])
      .then(([r, t]) => {
        setResults(r);
        setTasks(t);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  const totalPossible = tasks.reduce((s, t) => s + t.points, 0);
  const earned = results.reduce((s, r) => s + r.score, 0);
  const completedTasks = new Set(results.map((r) => r.task_id)).size;
  const AgeIcon = user
    ? (ageGroupIcons[user.age_group] ?? ageGroupIcons.junior)
    : ageGroupIcons.junior;

  return (
    <Layout>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        Мой профиль
      </Typography>

      <Grid container spacing={4}>
        {/* Левая колонка - карточка пользователя */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                bgcolor: "#7C4DFF",
                fontSize: 40,
                fontWeight: 700,
                mb: 2,
              }}
            >
              {user?.full_name?.[0] || "?"}
            </Avatar>
            <Typography variant="h5" fontWeight={700}>
              {user?.full_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              @{user?.username}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              <Chip
                label={ageGroupLabels[user?.age_group || "junior"]}
                size="small"
                sx={{ bgcolor: "#F1EBFF", fontWeight: 600 }}
              />
              {user?.roles?.includes("admin") && (
                <Chip
                  label="Админ"
                  size="small"
                  sx={{ bgcolor: "#FFE0B2", fontWeight: 600 }}
                />
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={3} justifyContent="center">
              <Box>
                <Typography variant="h4" fontWeight={800} color="primary">
                  {completedTasks}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  заданий
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800} color="secondary">
                  {earned}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  очков
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ color: "#FFCA28" }}
                >
                  {Math.round((earned / totalPossible) * 100) || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  прогресс
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Правая колонка - результаты */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              📊 Мои результаты
            </Typography>

            {results.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                Ты пока не прошёл ни одного задания. Вперёд! 🚀
              </Typography>
            ) : (
              <Stack spacing={2}>
                {results.map((r) => {
                  const pct = Math.round((r.score / r.max_score) * 100);
                  return (
                    <Box key={r.id}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography fontWeight={600}>
                            {topicLabels[r.topic] || r.topic}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {r.task_title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700}>
                          {r.score}/{r.max_score} ({pct}%)
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          mt: 0.5,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#F1EBFF",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: topicColors[r.topic] || "#7C4DFF",
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
