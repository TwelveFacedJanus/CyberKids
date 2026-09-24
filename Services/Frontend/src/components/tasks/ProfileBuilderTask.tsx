// components/tasks/ProfileBuilderTask.tsx
import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import WarningAmber from "@mui/icons-material/WarningAmber";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import type { TaskComponentProps } from "./taskUtils";

interface FieldOption {
  id: string;
  text: string;
  image?: string;
  caption?: string;
  safety: "good" | "warning" | "bad";
  leak: number;
}

interface ProfileField {
  id: string;
  label: string;
  displayMode?: "text" | "image";
  options: FieldOption[];
}

type Phase = "build" | "done";

const SAFETY_ICON = {
  good: <CheckCircle sx={{ fontSize: 18, color: "#22C55E" }} />,
  warning: <WarningAmber sx={{ fontSize: 18, color: "#F59E0B" }} />,
  bad: <Cancel sx={{ fontSize: 18, color: "#EF4444" }} />,
};

const SAFETY_COLOR = {
  good: "#22C55E",
  warning: "#F59E0B",
  bad: "#EF4444",
};

export default function ProfileBuilderTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const fields = (content.fields || []) as unknown as ProfileField[];
  const storyTitle = (content as any).storyTitle || "Карточка игрока";
  const intro = (content as any).intro || "";
  const explainer = (content as any).explainer as string | undefined;

  const [phase, setPhase] = useState<Phase>("build");
  // Выбранный индекс для каждого поля — стартует случайно
  const [indices, setIndices] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    fields.forEach((f) => {
      init[f.id] = Math.floor(Math.random() * f.options.length);
    });
    return init;
  });
  const [activeFieldId, setActiveFieldId] = useState<string | null>(
    fields[0]?.id ?? null,
  );

  const activeField = fields.find((f) => f.id === activeFieldId) || null;

  const shift = (dir: -1 | 1) => {
    if (phase !== "build" || !activeField) return;
    const total = activeField.options.length;
    setIndices((prev) => {
      const cur = prev[activeField.id] ?? 0;
      const next = (cur + dir + total) % total;
      return { ...prev, [activeField.id]: next };
    });
  };

  const selectField = (id: string) => {
    if (phase !== "build") return;
    setActiveFieldId(id);
  };

  // Текущие выбранные варианты
  const chosen = useMemo(() => {
    const map: Record<string, FieldOption> = {};
    for (const f of fields) {
      map[f.id] = f.options[indices[f.id] ?? 0];
    }
    return map;
  }, [fields, indices]);

  // Общая утечка → приватность
  const totalLeak = useMemo(
    () => Object.values(chosen).reduce((acc, opt) => acc + (opt?.leak ?? 0), 0),
    [chosen],
  );
  const privacy = Math.max(0, 100 - totalLeak);

  const goodCount = Object.values(chosen).filter(
    (o) => o?.safety === "good",
  ).length;
  const totalPossible = fields.length;
  const allGood = goodCount === totalPossible;

  const finish = () => {
    setPhase("done");
    setActiveFieldId(null);

    const details = fields.map((f) => {
      const opt = chosen[f.id];
      return {
        item_id: f.id,
        item_text: `${f.label}: ${opt?.text ?? ""}`,
        expected: f.options.find((o) => o.safety === "good")?.text,
        chosen: opt?.text,
        correct: opt?.safety === "good",
      };
    });

    onChange([
      ...answers.filter((a) => a.key !== "profile_builder_result"),
      {
        key: "profile_builder_result",
        value: {
          indices,
          totalLeak,
          privacy,
          goodCount,
          totalCorrect: goodCount,
          totalPossible,
          isCorrect: allGood,
          details,
        },
      },
    ]);
  };

  const handleReset = () => {
    const init: Record<string, number> = {};
    fields.forEach((f) => {
      init[f.id] = Math.floor(Math.random() * f.options.length);
    });
    setIndices(init);
    setPhase("build");
    setActiveFieldId(fields[0]?.id ?? null);
    onChange(answers.filter((a) => a.key !== "profile_builder_result"));
  };

  if (phase === "build" && !activeField) return null;

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
              background: "linear-gradient(135deg, #26C6DA, #7C4DFF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PersonOutlined sx={{ fontSize: 28, color: "#fff" }} />
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
              Профиль
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

        {phase !== "done" && (
          <Box data-tutorial="profile-privacy-bar" sx={{ mt: 2.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 0.5 }}
            >
              <Typography fontSize={12} sx={{ opacity: 0.8 }}>
                🔒 Приватность профиля
              </Typography>
              <Typography fontSize={12} fontWeight={800}>
                {privacy}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={privacy}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.15)",
                "& .MuiLinearProgress-bar": {
                  background:
                    privacy > 70
                      ? "linear-gradient(90deg, #22C55E, #26C6DA)"
                      : privacy > 40
                        ? "linear-gradient(90deg, #F59E0B, #FCD34D)"
                        : "linear-gradient(90deg, #EF4444, #EC407A)",
                  borderRadius: 4,
                  transition: "all 0.5s ease",
                },
              }}
            />
          </Box>
        )}
      </Paper>

      {/* ══════════ КАРТОЧКА ПРОФИЛЯ ══════════ */}
      <Stack
        data-tutorial="profile-builder"
        direction="row"
        spacing={1.5}
        alignItems="center"
      >
        {/* Левая стрелка */}
        <IconButton
          data-tutorial="profile-arrow-left"
          onClick={() => shift(-1)}
          disabled={phase === "done"}
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            bgcolor: phase === "done" ? "#F3F4F6" : "#26C6DA",
            color: "#fff",
            flexShrink: 0,
            boxShadow:
              phase === "done" ? "none" : "0 8px 20px rgba(38,198,218,0.4)",
            "&:hover": { bgcolor: phase === "done" ? "#F3F4F6" : "#00ACC1" },
            "&.Mui-disabled": { bgcolor: "#F3F4F6", color: "#D1D5DB" },
          }}
        >
          <ChevronLeft sx={{ fontSize: 32 }} />
        </IconButton>

        {/* Карточка */}
        <Paper
          sx={{
            flexGrow: 1,
            borderRadius: "20px",
            overflow: "hidden",
            border: "2px solid #E5E7EB",
            background: "linear-gradient(135deg, #FFFFFF, #F8F9FA)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} sx={{ p: 3, gap: 3 }}>
            {/* Аватар */}
            <Stack
              data-tutorial="profile-field-avatar"
              spacing={1}
              alignItems="center"
              sx={{ flexShrink: 0 }}
            >
              {fields.map((f) => {
                if (f.id !== "avatar") return null;
                const opt = chosen[f.id];
                const isActive = activeFieldId === "avatar";
                const isDone = phase === "done";
                const borderCol = isDone
                  ? SAFETY_COLOR[opt.safety]
                  : isActive
                    ? "#26C6DA"
                    : "#E5E7EB";

                return (
                  <Box
                    key={f.id}
                    onClick={() => selectField(f.id)}
                    sx={{
                      cursor: phase === "build" ? "pointer" : "default",
                      width: 140,
                      height: 140,
                      borderRadius: "16px",
                      border: `3px solid ${borderCol}`,
                      overflow: "hidden",
                      backgroundColor: "#F3F4F6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.25s ease",
                      position: "relative",
                    }}
                  >
                    {opt?.image ? (
                      <Box
                        component="img"
                        src={opt.image}
                        alt={opt.text}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <PersonOutlined sx={{ fontSize: 60, color: "#9CA3AF" }} />
                    )}

                    {/* Иконка безопасности в углу после проверки */}
                    {isDone && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          bgcolor: "#fff",
                          borderRadius: "50%",
                          p: 0.25,
                        }}
                      >
                        {SAFETY_ICON[opt.safety]}
                      </Box>
                    )}
                  </Box>
                );
              })}

              {/* Подпись под аватаром */}
              {fields.map((f) => {
                if (f.id !== "avatar") return null;
                const opt = chosen[f.id];
                const isActive = activeFieldId === "avatar";
                return (
                  <Box
                    key={`${f.id}-caption`}
                    sx={{ textAlign: "center", maxWidth: "140px" }}
                  >
                    <Typography
                      fontSize={12}
                      fontWeight={700}
                      sx={{
                        color:
                          isActive && phase === "build" ? "#26C6DA" : "#1F2937",
                      }}
                    >
                      {opt?.text}
                    </Typography>
                    <Typography fontSize={11} color="text.secondary">
                      {opt?.caption}
                    </Typography>

                    {/* Точки вариантов */}
                    {isActive && phase === "build" && (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                        sx={{ mt: 1 }}
                      >
                        {f.options.map((_, vi) => (
                          <Box
                            key={vi}
                            sx={{
                              width: vi === (indices[f.id] ?? 0) ? 16 : 6,
                              height: 6,
                              borderRadius: 3,
                              bgcolor:
                                vi === (indices[f.id] ?? 0)
                                  ? "#26C6DA"
                                  : "#D1D5DB",
                              transition: "all 0.25s ease",
                            }}
                          />
                        ))}
                      </Stack>
                    )}
                  </Box>
                );
              })}
            </Stack>

            {/* Поля карточки */}
            <Stack spacing={1.5} sx={{ flexGrow: 1, minWidth: 0 }}>
              {fields
                .filter((f) => f.id !== "avatar")
                .map((field) => {
                  const opt = chosen[field.id];
                  const isActive = activeFieldId === field.id;
                  const isDone = phase === "done";

                  let borderCol = "#E5E7EB";
                  let bg = "#FFFFFF";
                  if (isDone) {
                    borderCol = SAFETY_COLOR[opt.safety] + "60";
                    bg =
                      opt.safety === "good"
                        ? "#F0FDF4"
                        : opt.safety === "warning"
                          ? "#FFFBEB"
                          : "#FEF2F2";
                  } else if (isActive) {
                    borderCol = "#26C6DA";
                    bg = "#E0F7FA";
                  }

                  return (
                    <Box
                      key={field.id}
                      data-tutorial={`profile-field-${field.id}`}
                      onClick={() => selectField(field.id)}
                      sx={{
                        p: 1.75,
                        borderRadius: "12px",
                        border: `2px solid ${borderCol}`,
                        backgroundColor: bg,
                        cursor: phase === "build" ? "pointer" : "default",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor:
                            phase === "build" && !isActive ? "#F8F9FA" : bg,
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Typography
                          fontSize={11}
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "#6B7280",
                            fontWeight: 700,
                            minWidth: 92,
                            flexShrink: 0,
                          }}
                        >
                          {field.label}
                        </Typography>
                        <Typography
                          fontSize={14.5}
                          fontWeight={700}
                          sx={{
                            color: isDone
                              ? opt.safety === "good"
                                ? "#166534"
                                : opt.safety === "warning"
                                  ? "#92400E"
                                  : "#991B1B"
                              : "#1F2937",
                            flexGrow: 1,
                            wordBreak: "break-word",
                          }}
                        >
                          {opt?.text}
                        </Typography>

                        {/* Иконка после проверки */}
                        {isDone && <Box>{SAFETY_ICON[opt.safety]}</Box>}

                        {/* Точки вариантов на активном поле */}
                        {isActive && phase === "build" && (
                          <Stack direction="row" spacing={0.5}>
                            {field.options.map((_, vi) => (
                              <Box
                                key={vi}
                                sx={{
                                  width:
                                    vi === (indices[field.id] ?? 0) ? 14 : 5,
                                  height: 5,
                                  borderRadius: 3,
                                  bgcolor:
                                    vi === (indices[field.id] ?? 0)
                                      ? "#26C6DA"
                                      : "#D1D5DB",
                                  transition: "all 0.25s ease",
                                }}
                              />
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    </Box>
                  );
                })}
            </Stack>
          </Stack>
        </Paper>

        {/* Правая стрелка */}
        <IconButton
          data-tutorial="profile-arrow-right"
          onClick={() => shift(1)}
          disabled={phase === "done"}
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            bgcolor: phase === "done" ? "#F3F4F6" : "#26C6DA",
            color: "#fff",
            flexShrink: 0,
            boxShadow:
              phase === "done" ? "none" : "0 8px 20px rgba(38,198,218,0.4)",
            "&:hover": { bgcolor: phase === "done" ? "#F3F4F6" : "#00ACC1" },
            "&.Mui-disabled": { bgcolor: "#F3F4F6", color: "#D1D5DB" },
          }}
        >
          <ChevronRight sx={{ fontSize: 32 }} />
        </IconButton>
      </Stack>

      {/* Подсказка про активное поле */}
      {phase === "build" && activeField && (
        <Typography
          fontSize={12}
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Активное поле: <b>{activeField.label}</b> — вариант{" "}
          {(indices[activeField.id] ?? 0) + 1} из {activeField.options.length}
        </Typography>
      )}

      {/* ─── Кнопка проверки ─── */}
      {phase === "build" && (
        <Button
          data-tutorial="submit"
          variant="contained"
          size="large"
          fullWidth
          onClick={finish}
          sx={{
            py: 1.8,
            fontSize: 17,
            fontWeight: 800,
            borderRadius: "14px",
            background: "linear-gradient(135deg, #26C6DA, #7C4DFF)",
          }}
        >
          Проверить профиль
        </Button>
      )}

      {/* ══════════ ФИНАЛ ══════════ */}
      {phase === "done" && (
        <Stack spacing={3}>
          <Paper
            sx={{
              p: 4,
              borderRadius: "20px",
              textAlign: "center",
              background:
                privacy > 70
                  ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
                  : privacy > 40
                    ? "linear-gradient(135deg, #FFFBEB, #FEF3C7)"
                    : "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
              border: `2px solid ${
                privacy > 70 ? "#22C55E" : privacy > 40 ? "#F59E0B" : "#EF4444"
              }`,
            }}
          >
            <Box sx={{ fontSize: 64, mb: 1 }}>
              {privacy > 70 ? "🛡️" : privacy > 40 ? "⚠️" : "🚨"}
            </Box>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                mb: 1,
                color:
                  privacy > 70
                    ? "#166534"
                    : privacy > 40
                      ? "#92400E"
                      : "#991B1B",
              }}
            >
              {privacy > 70
                ? "Профиль безопасен!"
                : privacy > 40
                  ? "Есть утечки"
                  : "Опасно! Ты выдал почти всё"}
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mt: 2, mb: 3 }}
            >
              <Chip
                label={`Приватность: ${privacy}%`}
                sx={{
                  bgcolor:
                    privacy > 70
                      ? "#DCFCE7"
                      : privacy > 40
                        ? "#FEF3C7"
                        : "#FEE2E2",
                  color:
                    privacy > 70
                      ? "#166534"
                      : privacy > 40
                        ? "#92400E"
                        : "#991B1B",
                  fontWeight: 700,
                }}
              />
              <Chip
                label={`Безопасных полей: ${goodCount}/${totalPossible}`}
                sx={{ bgcolor: "#DCFCE7", color: "#166534", fontWeight: 700 }}
              />
            </Stack>

            {explainer && (
              <Typography
                fontSize={14}
                sx={{
                  mb: 3,
                  maxWidth: 560,
                  mx: "auto",
                  lineHeight: 1.6,
                  color: "text.secondary",
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
                background: "linear-gradient(135deg, #26C6DA, #7C4DFF)",
              }}
            >
              Пройти заново
            </Button>
          </Paper>
        </Stack>
      )}
    </Stack>
  );
}
