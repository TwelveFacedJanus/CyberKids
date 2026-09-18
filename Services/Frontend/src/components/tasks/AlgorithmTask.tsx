// components/tasks/AlgorithmTask.tsx
import { useMemo, useState, useEffect } from "react";
import { Box, Paper, Stack, Typography, Chip, IconButton } from "@mui/material";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { getAnswer, setAnswer, type TaskComponentProps } from "./taskUtils";

interface AlgorithmItem {
  id: string;
  text: string;
}

export default function AlgorithmTask({
  content,
  answers,
  onChange,
}: TaskComponentProps) {
  const items = (content.items as AlgorithmItem[]) || [];

  // 🆕 Перемешиваем элементы при первом рендере
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Текущий порядок элементов (индексы)
  const [order, setOrder] = useState<number[]>(() => {
    // Если уже есть ответы — используем их (не перемешиваем)
    const savedOrder: number[] = [];
    for (let i = 0; i < items.length; i++) {
      const val = getAnswer(answers, items[i].id);
      if (val !== undefined && typeof val === "number") {
        savedOrder.push(val);
      }
    }
    if (savedOrder.length === items.length) {
      return savedOrder;
    }

    // Иначе — перемешиваем
    const indices = items.map((_, i) => i);
    return shuffleArray(indices);
  });

  // 🆕 Сохраняем перемешанный порядок при первом рендере
  useEffect(() => {
    // Если нет сохранённых ответов — сохраняем перемешанный порядок
    const hasAnswers = items.some(
      (item) => getAnswer(answers, item.id) !== undefined,
    );
    if (!hasAnswers && items.length > 0) {
      const initialOrder = order.map((originalIndex, position) => position);
      const newAnswers = items.map((item, index) => {
        const position = order.indexOf(index);
        return { key: item.id, value: position };
      });
      onChange(newAnswers);
    }
  }, []);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...order];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setOrder(newOrder);

    const newAnswers = items.map((item, index) => {
      const itemIndex = newOrder.indexOf(index);
      return { key: item.id, value: itemIndex };
    });
    onChange(newAnswers);
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      moveItem(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < order.length - 1) {
      moveItem(index, index + 1);
    }
  };

  if (items.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
        Нет элементов для сортировки
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        🔄 Перетащи элементы или используй кнопки ↑↓, чтобы расставить в
        правильном порядке
      </Typography>

      <Paper sx={{ p: 2, borderRadius: "16px", backgroundColor: "#F8F9FA" }}>
        <Stack spacing={1}>
          {order.map((originalIndex, displayIndex) => {
            const item = items[originalIndex];
            const isFirst = displayIndex === 0;
            const isLast = displayIndex === order.length - 1;

            return (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: "12px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#7C4DFF",
                    boxShadow: "0 2px 8px rgba(124,77,255,0.12)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#7C4DFF",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {displayIndex + 1}
                </Box>

                <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>
                  {item.text}
                </Typography>

                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={() => moveUp(displayIndex)}
                    disabled={isFirst}
                    sx={{
                      color: isFirst ? "#D1D5DB" : "#6B7280",
                      "&:hover": {
                        backgroundColor: "#F1EBFF",
                        color: "#7C4DFF",
                      },
                    }}
                  >
                    <ArrowUpward fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => moveDown(displayIndex)}
                    disabled={isLast}
                    sx={{
                      color: isLast ? "#D1D5DB" : "#6B7280",
                      "&:hover": {
                        backgroundColor: "#F1EBFF",
                        color: "#7C4DFF",
                      },
                    }}
                  >
                    <ArrowDownward fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Paper>

      <Chip
        label={`${order.length} шагов в алгоритме`}
        size="small"
        sx={{
          backgroundColor: "#F1EBFF",
          fontWeight: 600,
          alignSelf: "flex-start",
        }}
      />
    </Stack>
  );
}
