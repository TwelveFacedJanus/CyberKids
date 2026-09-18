// pages/TaskPage.tsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";
import Replay from "@mui/icons-material/Replay";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import ArrowBack from "@mui/icons-material/ArrowBack";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import LockIcon from "@mui/icons-material/LockRounded";
import LocalFlorist from "@mui/icons-material/LocalFlorist";
import { api } from "../api/client";
import Layout from "../components/Layout";
import Confetti from "../components/Confetti";
import PlacementTask from "../components/tasks/PlacementTask";
import PhysicsDrag3D from "../components/tasks/PhysicsDrag3D";
import QuizTask from "../components/tasks/QuizTask";
import TrueFalseTask from "../components/tasks/TrueFalseTask";
import ScenarioTask from "../components/tasks/ScenarioTask";
import CodeTask from "../components/tasks/CodeTask";
import AIPromptTask from "../components/tasks/AIPromptTask";
import AlgorithmTask from "../components/tasks/AlgorithmTask";
import { topicColors, topicLabels } from "../theme";
import { taskTypeIcons, topicIcons, darkenHex } from "../icons";
import { useAuth } from "../context/AuthContext";
import type { Answer, Result, TaskFull, User, Task } from "../types";
import TheoryCardsTask from "../components/tasks/TheoryCardsTask";
import ScamBannerTask from "../components/tasks/ScamBannerTask";
import ScamChatTask from "../components/tasks/ScamChatTask";
import ScamChainTask from "../components/tasks/ScamChainTask";
import ScamPhishingTask from "../components/tasks/ScamPhishingTask";
import ScamDefenderTask from "../components/tasks/ScamDefenderTask";
import QuickTestTask from "../components/tasks/QuickTestTask";
import AnimatedBackground from "../components/AnimatedBackground";

export default function TaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<TaskFull | null>(null);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [startTime] = useState(Date.now());
  const [isBlocked, setIsBlocked] = useState(false);

  const isTaskAvailable = (task: TaskFull, user: User | null): boolean => {
    if (!task.forbidden_groups || task.forbidden_groups.length === 0)
      return true;
    if (!user?.groups || user.groups.length === 0) return false;
    return task.forbidden_groups.some((groupId) =>
      user.groups.includes(groupId),
    );
  };

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.get<TaskFull>(`/api/tasks/${id}`),
      api.get<Task[]>("/api/tasks"),
    ])
      .then(([fetchedTask, tasksList]) => {
        setTask(fetchedTask);
        setAllTasks(tasksList);

        const available = isTaskAvailable(fetchedTask, user);
        if (!available) {
          setIsBlocked(true);
          setError("⛔ Это задание недоступно для вашей группы");
        }
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Ошибка загрузки"),
      )
      .finally(() => setLoading(false));
  }, [id, user]);

  const submit = useCallback(async () => {
    if (!task) return;
    setSubmitting(true);
    try {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const res = await api.post<Result>("/api/results", {
        task_id: task.id,
        answers: answers.map((a) => ({ payload: a })),
        time_spent_sec: timeSpent,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось отправить ответы");
    } finally {
      setSubmitting(false);
    }
  }, [answers, task, startTime]);

  const restart = () => {
    setAnswers([]);
    setResult(null);
    setError("");
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (isBlocked) {
    return (
      <Layout>
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: "20px",
            border: "2px solid #FCA5A5",
            backgroundColor: "#FEF2F2",
          }}
        >
          <LockIcon sx={{ fontSize: 64, color: "#EF4444", mb: 2 }} />
          <Typography variant="h4" fontWeight={800} color="error" gutterBottom>
            Доступ запрещён
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Это задание доступно только для определённых групп.
          </Typography>
          {task?.forbidden_groups && task.forbidden_groups.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              Доступно для групп:{" "}
              <strong>
                {task.forbidden_groups
                  .map((g) => `«${g.toUpperCase()}»`)
                  .join(", ")}
              </strong>
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ mt: 3, borderRadius: "12px" }}
          >
            Вернуться к заданиям
          </Button>
        </Paper>
      </Layout>
    );
  }

  if (error && !task) {
    return (
      <Layout>
        <Alert severity="error">{error}</Alert>
      </Layout>
    );
  }

  if (!task) return null;

  const stars = result ? Math.round((result.score / result.max_score) * 3) : 0;
  const color = task.color || topicColors[task.topic];
  const TopicIcon = topicIcons[task.topic] ?? topicIcons.privacy;
  const TypeIcon = taskTypeIcons[task.task_type] ?? taskTypeIcons.quiz;

  return (
    <Layout>
      <AnimatedBackground/>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {result && stars >= 2 && <Confetti pieces={50} />}

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/")}
            sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
          >
            Все задания
          </Button>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            /
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {task.title}
          </Typography>
        </Stack>

        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderLeft: `6px solid ${color}`,
            borderRadius: "20px",
            background: "linear-gradient(135deg, #FFFFFF, #FAFAFF)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            alignItems={{ sm: "center" }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "16px",
                background: `linear-gradient(135deg, ${color}, ${darkenHex(color)})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              <TopicIcon sx={{ fontSize: 36 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Chip
                  label={topicLabels[task.topic] || task.topic}
                  size="small"
                  sx={{ bgcolor: `${color}20`, color, fontWeight: 600 }}
                />
                <Chip
                  icon={<TypeIcon sx={{ fontSize: 16 }} />}
                  label="Интерактив"
                  size="small"
                  sx={{ bgcolor: "#F1EBFF", fontWeight: 600 }}
                />
                <Chip
                  label={`+${task.points} очков`}
                  size="small"
                  sx={{ bgcolor: "#FFF3E0", fontWeight: 600 }}
                />
              </Stack>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ mt: 1, color: "#1A1A2E" }}
              >
                {task.title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {task.description}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: "12px",
              backgroundColor: "#F8F9FA",
              border: "1px solid #F1F1F1",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <InfoOutlined sx={{ color: "#7C4DFF", fontSize: 20, mt: 0.2 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Инструкция:</strong> {task.instructions}
            </Typography>
          </Box>
        </Paper>

        {result ? (
          <ResultCard
            result={result}
            stars={stars}
            task={task}
            onRestart={restart}
          />
        ) : (
          // ✅ Передаём allTasks в TaskContent
          <TaskContent
            task={task}
            allTasks={allTasks}
            answers={answers}
            setAnswers={setAnswers}
            submitting={submitting}
            onSubmit={submit}
            error={error}
          />
        )}
      </Box>
    </Layout>
  );
}

// ================= Компонент результата =================
function ResultCard({
  result,
  stars,
  task,
  onRestart,
}: {
  result: Result;
  stars: number;
  task: TaskFull;
  onRestart: () => void;
}) {
  const navigate = useNavigate();
  const pct = Math.round((result.score / result.max_score) * 100);
  const isSuccess = pct >= 70;

  return (
    <Paper
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: "20px",
        background: isSuccess
          ? "linear-gradient(135deg, #F0FDF4, #ECFDF5)"
          : "linear-gradient(135deg, #FFF7ED, #FFFBEB)",
        border: `2px solid ${isSuccess ? "#86EFAC" : "#FDBA74"}`,
      }}
    >
      <Box sx={{ fontSize: 72, mb: 1 }}>
        {isSuccess ? (
          <EmojiEvents sx={{ fontSize: 72, color: "#FFCA28" }} />
        ) : (
          <LocalFlorist sx={{ fontSize: 72, color: "#86EFAC" }} />
        )}
      </Box>

      <Typography
        variant="h4"
        fontWeight={800}
        sx={{ color: isSuccess ? "#166534" : "#9A3412" }}
      >
        {isSuccess
          ? "Отлично! Ты молодец! 🎉"
          : "Хорошая попытка! Попробуй ещё раз 💪"}
      </Typography>

      {/* Звёзды */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ my: 2 }}>
        {[0, 1, 2].map((i) =>
          i < stars ? (
            <Star key={i} sx={{ fontSize: 48, color: "#FFCA28" }} />
          ) : (
            <StarBorder key={i} sx={{ fontSize: 48, color: "#D1D5DB" }} />
          ),
        )}
      </Stack>

      {/* Результат */}
      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 3 }}>
        <Box>
          <Typography
            variant="h5"
            fontWeight={800}
            color={isSuccess ? "success.main" : "warning.main"}
          >
            {result.score} из {result.max_score}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            очков
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            {result.correct_count} из {result.total_count}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            правильных
          </Typography>
        </Box>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            {pct}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            точность
          </Typography>
        </Box>
      </Stack>

      {/* 🆕 УВЕДОМЛЕНИЕ О ДОБАВЛЕННЫХ ОЧКАХ — ВСТАВЛЯЕМ СЮДА */}
      {result.score_added !== undefined && result.score_added > 0 && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: "12px" }}>
          ⭐ +{result.score_added} очков! (всего: {result.score})
        </Alert>
      )}
      {result.score_added !== undefined &&
        result.score_added === 0 &&
        result.score > 0 && (
          <Alert severity="info" sx={{ mb: 2, borderRadius: "12px" }}>
            💡 Ты уже проходил это задание. Новых очков не добавлено.
          </Alert>
        )}

      {/* Прогресс-бар */}
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 8,
          borderRadius: 4,
          mb: 3,
          backgroundColor: "#E5E7EB",
          "& .MuiLinearProgress-bar": {
            backgroundColor: isSuccess ? "#22C55E" : "#F59E0B",
            borderRadius: 4,
          },
        }}
      />

      {/* Кнопки */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<Replay />}
          onClick={onRestart}
        >
          Пройти ещё раз
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<EmojiEvents />}
          onClick={() => navigate("/")}
        >
          К заданиям
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 3, textAlign: "left" }}
      >
        📝 Разбор ответов
      </Typography>
      <Feedback task={task} result={result} />
    </Paper>
  );
}

// ================= Компонент задания =================
// ✅ Добавили allTasks в пропсы
function TaskContent({
  task,
  allTasks,
  answers,
  setAnswers,
  submitting,
  onSubmit,
  error,
}: {
  task: TaskFull;
  allTasks: Task[];
  answers: Answer[];
  setAnswers: (a: Answer[]) => void;
  submitting: boolean;
  onSubmit: () => void;
  error: string;
}) {
  const answeredCount = answers.length;

  const renderTask = () => {
    switch (task.task_type) {
      case "dragdrop":
        return (
          <PlacementTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
            mode="zones"
          />
        );
      case "sort":
        return (
          <PlacementTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
            mode="columns"
          />
        );
      case "drag3d":
        return (
          <PhysicsDrag3D
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "quiz":
        return (
          <QuizTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "true_false":
        return (
          <TrueFalseTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "scenario":
        return (
          <ScenarioTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "code":
        return (
          <CodeTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "ai_prompt":
        return (
          <AIPromptTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "algorithm":
        return (
          <AlgorithmTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "scam_banner":
        return (
          <ScamBannerTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "scam_chat":
        return (
          <ScamChatTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "scam_chain":
        return (
          <ScamChainTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "scam_phishing":
        return (
          <ScamPhishingTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "scam_defender":
        return (
          <ScamDefenderTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "quick_test":
        return (
          <QuickTestTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
          />
        );
      case "theory_cards": {
        const nextTask = allTasks.find(
          (t) =>
            t.topic === task.topic &&
            t.task_type !== "theory_cards" &&
            t.order > (task.order || 0),
        );
        return (
          <TheoryCardsTask
            content={task.content}
            answers={answers}
            onChange={setAnswers}
            nextTaskId={nextTask?.id}
          />
        );
      }
      default:
        return (
          <Alert severity="warning">
            Тип задания «{task.task_type}» пока не поддерживается
          </Alert>
        );
    }
  };

  return (
    <Box>
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          borderRadius: "12px",
          backgroundColor: "#F8F9FA",
          border: "1px solid #F1F1F1",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" fontWeight={600}>
            Прогресс:
          </Typography>
          <LinearProgress
            variant="determinate"
            value={
              (answeredCount /
                (task.content.questions?.length ||
                  task.content.items?.length ||
                  1)) *
              100
            }
            sx={{ width: 120, height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption" color="text.secondary">
            {answeredCount} из{" "}
            {task.content.questions?.length || task.content.items?.length || 0}
          </Typography>
        </Stack>
        <Chip
          label={answeredCount === 0 ? "Начни отвечать!" : "Можно проверять"}
          color={answeredCount === 0 ? "default" : "primary"}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Paper>

      <Box sx={{ mb: 3 }}>{renderTask()}</Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={answers.length === 0 || submitting}
        onClick={onSubmit}
        sx={{
          py: 1.8,
          fontSize: 18,
          fontWeight: 700,
          borderRadius: "12px",
          background:
            answers.length === 0
              ? undefined
              : "linear-gradient(135deg, #7C4DFF, #9C27B0)",
        }}
      >
        {submitting ? (
          <CircularProgress size={24} sx={{ color: "#fff" }} />
        ) : answers.length === 0 ? (
          "Сначала ответь на все вопросы"
        ) : (
          "✅ Проверить ответы"
        )}
      </Button>
    </Box>
  );
}

// ================= Компонент разбора ответов =================
function Feedback({ task, result }: { task: TaskFull; result: Result }) {
  const content = task.content;
  const sections = content.sections ?? [];
  const details: Array<{
    correct: boolean;
    expected: unknown;
    chosen: unknown;
    item_id?: string;
    question_id?: string;
    statement_id?: string;
    scenario_id?: string;
  }> = (result as Result & { answers?: unknown[] }).answers ?? [];

  const labelOf = (key: string, value: unknown): string => {
    if (value === undefined || value === null) return "—";
    if (task.task_type === "true_false") {
      return value === true ? "Правда" : "Ложь";
    }
    if (task.task_type === "quiz") {
      const q = content.questions?.find((x) => x.id === key);
      return q ? q.options[Number(value)] : String(value);
    }
    if (task.task_type === "scenario") {
      const s = content.scenarios?.find((x) => x.id === key);
      return s ? s.options[Number(value)] : String(value);
    }
    const sec = sections.find((x) => x.id === String(value));
    return sec ? sec.label : String(value);
  };

  const textOf = (key: string): string => {
    const item = content.items?.find((x) => x.id === key);
    if (item) return item.text;
    const q = content.questions?.find((x) => x.id === key);
    if (q) return q.question;
    const s = content.statements?.find((x) => x.id === key);
    if (s) return s.statement;
    const sc = content.scenarios?.find((x) => x.id === key);
    if (sc) return `${sc.title}: ${sc.description}`;
    return key;
  };

  const explainOf = (key: string): string => {
    const q = content.questions?.find((x) => x.id === key);
    if (q?.explanation) return q.explanation;
    const s = content.statements?.find((x) => x.id === key);
    if (s?.explanation) return s.explanation;
    const sc = content.scenarios?.find((x) => x.id === key);
    if (sc?.explanation) return sc.explanation;
    return "";
  };

  const keyOf = (d: (typeof details)[0]): string => {
    return String(
      d.item_id ?? d.question_id ?? d.statement_id ?? d.scenario_id ?? "",
    );
  };

  return (
    <Stack spacing={2} sx={{ textAlign: "left" }}>
      {details.map((d, i) => {
        const key = keyOf(d);
        const isCorrect = d.correct;
        return (
          <Paper
            key={i}
            sx={{
              p: 3,
              borderRadius: "12px",
              borderLeft: `4px solid ${isCorrect ? "#22C55E" : "#EF4444"}`,
              backgroundColor: isCorrect ? "#F0FDF4" : "#FEF2F2",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              {isCorrect ? (
                <CheckCircle sx={{ color: "#22C55E", mt: 0.3 }} />
              ) : (
                <Cancel sx={{ color: "#EF4444", mt: 0.3 }} />
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={700} sx={{ color: "#1A1A2E" }}>
                  {textOf(key)}
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 1 }}
                >
                  <Typography variant="body2">
                    Твой ответ: <strong>{labelOf(key, d.chosen)}</strong>
                  </Typography>
                  {!isCorrect && (
                    <Typography variant="body2">
                      Правильный ответ:{" "}
                      <strong>{labelOf(key, d.expected)}</strong>
                    </Typography>
                  )}
                </Stack>
                {explainOf(key) && (
                  <Box
                    sx={{
                      mt: 1.5,
                      p: 1.5,
                      borderRadius: "8px",
                      backgroundColor: isCorrect ? "#E5F4E5" : "#FDE8E8",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      💡 <strong>Почему:</strong> {explainOf(key)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
