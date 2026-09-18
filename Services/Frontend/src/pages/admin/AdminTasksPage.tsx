// pages/admin/AdminTasksPage.tsx
import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  IconButton,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  Tooltip,
} from "@mui/material";
import { api } from "../../api/client";
import { ageGroupLabels, topicLabels } from "../../theme";
import { taskTypeIcons, topicIcons } from "../../icons";
import LockIcon from "@mui/icons-material/LockRounded";
import type { Task, TaskFull, Group } from "../../types";
import GroupSelector from "../../components/GroupSelector";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [details, setDetails] = useState<Record<string, TaskFull>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openGroupsDialog, setOpenGroupsDialog] = useState(false);
  const [forbiddenGroups, setForbiddenGroups] = useState<string[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);

  const loadTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const [list, groupsData] = await Promise.all([
        api.get<Task[]>("/api/tasks"),
        api.get<Group[]>("/api/groups"),
      ]);
      setTasks(list);
      setAllGroups(groupsData);

      const map: Record<string, TaskFull> = {};
      await Promise.all(
        list.map((t) =>
          api
            .get<TaskFull>(`/api/tasks/${t.id}`)
            .then((full) => (map[t.id] = full))
            .catch(() => {}),
        ),
      );
      setDetails(map);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // 🆕 Переключение задания
  const toggleTask = async (taskId: string) => {
    try {
      await api.patch(`/api/admin/tasks/${taskId}/toggle`, {});
      await loadTasks();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка переключения");
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );

  const countOf = (t: TaskFull) => {
    switch (t.task_type) {
      case "quiz":
      case "quick_test":
        return t.content.questions?.length ?? 0;
      case "true_false":
        return t.content.statements?.length ?? 0;
      case "scenario":
        return t.content.scenarios?.length ?? 0;
      default:
        return t.content.items?.length ?? 0;
    }
  };

  const openGroupsEditor = (task: Task) => {
    setSelectedTask(task);
    setForbiddenGroups(task.forbidden_groups || []);
    setOpenGroupsDialog(true);
  };

  const saveForbiddenGroups = async () => {
    if (!selectedTask) return;
    try {
      await api.put(`/api/admin/tasks/${selectedTask.id}/groups`, {
        forbidden_groups: forbiddenGroups,
      });
      await loadTasks();
      setOpenGroupsDialog(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка сохранения");
    }
  };

  const getGroupName = (groupId: string): string => {
    const group = allGroups.find((g) => g.id === groupId);
    return group ? group.name : groupId.toUpperCase();
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" fontWeight={700}>
            📚 Задания
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Всего: {tasks.length} · Включено:{" "}
            {tasks.filter((t) => t.is_enabled !== false).length}
          </Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {tasks.map((t) => {
          const full = details[t.id];
          const TopicIcon = topicIcons[t.topic] ?? topicIcons.privacy;
          const TypeIcon = taskTypeIcons[t.task_type] ?? taskTypeIcons.quiz;
          const itemCount = full ? countOf(full) : 0;
          const isEnabled = t.is_enabled !== false;

          return (
            <Grid item xs={12} sm={6} md={4} key={t.id}>
              <Card
                sx={{
                  borderRadius: "16px",
                  borderTop: `4px solid ${t.color}`,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                  // 🆕 Приглушаем отключённые
                  opacity: isEnabled ? 1 : 0.6,
                  backgroundColor: isEnabled ? "#FFFFFF" : "#F3F4F6",
                  "&:hover": {
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* 🆕 Верхняя строка с Switch */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: `linear-gradient(135deg, ${t.color}, #9C27B0)`,
                        }}
                      >
                        <TypeIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Chip
                        size="small"
                        icon={<TopicIcon sx={{ fontSize: 16 }} />}
                        label={topicLabels[t.topic] ?? t.topic}
                        sx={{ backgroundColor: "#F1EBFF", fontWeight: 600 }}
                      />
                    </Stack>

                    <Tooltip
                      title={
                        isEnabled
                          ? "Отключить задание (не будет показываться детям)"
                          : "Включить задание"
                      }
                    >
                      <Switch
                        checked={isEnabled}
                        onChange={() => toggleTask(t.id)}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#22C55E",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#22C55E",
                            },
                        }}
                      />
                    </Tooltip>
                  </Stack>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "#1A1A2E" }}
                  >
                    {t.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {t.description}
                  </Typography>

                  {/* 🆕 Индикатор статуса */}
                  {!isEnabled && (
                    <Chip
                      label="🚫 Отключено"
                      size="small"
                      sx={{
                        backgroundColor: "#FEE2E2",
                        color: "#991B1B",
                        fontWeight: 700,
                        mb: 1.5,
                      }}
                    />
                  )}

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    sx={{ mb: 1.5 }}
                  >
                    <Chip
                      label={t.task_type}
                      size="small"
                      sx={{ backgroundColor: "#E8E0FF", fontWeight: 600 }}
                    />
                    <Chip
                      label={`${itemCount} заданий`}
                      size="small"
                      sx={{ backgroundColor: "#FFF3E0", fontWeight: 600 }}
                    />
                    <Chip
                      label={`+${t.points} очков`}
                      size="small"
                      sx={{ backgroundColor: "#E0F2E9", fontWeight: 600 }}
                    />
                  </Stack>

                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Возрастные группы:
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      {t.age_groups.map((g) => (
                        <Chip
                          key={g}
                          label={ageGroupLabels[g] ?? g}
                          size="small"
                          sx={{ backgroundColor: "#F1EBFF", fontWeight: 600 }}
                        />
                      ))}
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      flexWrap="wrap"
                      sx={{ mt: 1 }}
                    >
                      {t.forbidden_groups && t.forbidden_groups.length > 0 ? (
                        <Chip
                          label={`🚫 Запрещено для: ${t.forbidden_groups.map((g) => getGroupName(g)).join(", ")}`}
                          size="small"
                          sx={{
                            backgroundColor: "#FEE2E2",
                            fontWeight: 600,
                            color: "#991B1B",
                          }}
                        />
                      ) : (
                        <Chip
                          label="🌐 Доступно всем"
                          size="small"
                          sx={{
                            backgroundColor: "#E0F2E9",
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={() => openGroupsEditor(t)}
                      sx={{
                        width: "96px",
                        height: "36px",
                        borderRadius: "16px",
                        "&:hover": { backgroundColor: "#F1EBFF" },
                      }}
                    >
                      <LockIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={openGroupsDialog}
        onClose={() => setOpenGroupsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Настройка доступа к заданию</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Выберите группы, для которых это задание будет{" "}
            <strong>запрещено</strong>. Остальные пользователи смогут видеть и
            проходить задание.
          </Typography>
          <GroupSelector
            selectedGroups={forbiddenGroups}
            onChange={setForbiddenGroups}
            label="Запретить для групп"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGroupsDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={saveForbiddenGroups}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
