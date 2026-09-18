// pages/admin/AdminQuestsPage.tsx
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { api } from "../../api/client";

interface QuestStat {
  quest_id: string;
  total_completed: number;
  avg_score: number;
}

export default function AdminQuestsPage() {
  const [stats, setStats] = useState<QuestStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Можно расширить на бэке — пока просто заглушка
    api
      .get<QuestStat[]>("/api/admin/quests/stats")
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight={700}>
        💬 ALEX Quest
      </Typography>
      {stats.length === 0 && (
        <Alert severity="info">Пока нет данных о прохождении</Alert>
      )}
      {stats.map((s) => (
        <Card key={s.quest_id}>
          <CardContent>
            <Typography variant="h6">{s.quest_id}</Typography>
            <Chip label={`Пройдено: ${s.total_completed}`} />
            <Chip label={`Средний балл: ${s.avg_score}`} />
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
