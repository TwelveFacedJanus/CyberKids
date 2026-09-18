import { useEffect, useState } from 'react'
import { Alert, Avatar, Box, Card, CardContent, Chip, CircularProgress, Grid, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import GroupOutlined from '@mui/icons-material/GroupOutlined'
import TrackChangesOutlined from '@mui/icons-material/TrackChangesOutlined'
import ExtensionOutlined from '@mui/icons-material/ExtensionOutlined'
import TrendingUpOutlined from '@mui/icons-material/TrendingUpOutlined'
import LocalFireDepartment from '@mui/icons-material/LocalFireDepartment'
import { api } from '../../api/client'
import { ageGroupLabels, topicLabels } from '../../theme'
import type { Stats } from '../../types'

const CARD_STYLES: Record<string, string> = {
  users: 'linear-gradient(135deg, #7C4DFF, #B388FF)',
  attempts: 'linear-gradient(135deg, #EC407A, #F48FB1)',
  tasks: 'linear-gradient(135deg, #42A5F5, #80DEEA)',
  avg: 'linear-gradient(135deg, #66BB6A, #A5D6A7)',
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<Stats>('/api/admin/stats')
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : 'Ошибка'))
  }, [])

  if (error) return <Alert severity="error">{error}</Alert>
  if (!stats)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )

  const cards = [
    { key: 'users', title: 'Пользователей', value: stats.total_users, Icon: GroupOutlined },
    { key: 'attempts', title: 'Попыток', value: stats.total_attempts, Icon: TrackChangesOutlined },
    { key: 'tasks', title: 'Заданий пройдено', value: stats.total_completed_tasks, Icon: ExtensionOutlined },
    { key: 'avg', title: 'Средний балл', value: `${stats.avg_score_percent}%`, Icon: TrendingUpOutlined },
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Grid container spacing={2}>
        {cards.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.key}>
            <Card sx={{ background: CARD_STYLES[c.key], color: '#fff' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <c.Icon sx={{ fontSize: 38 }} />
                <Typography variant="h4" fontWeight={900}>{c.value}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>{c.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={800} gutterBottom>
          Пользователи по возрастным группам
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(stats.by_age_group).map(([group, count]) => (
            <Chip key={group} label={`${ageGroupLabels[group] ?? group}: ${count}`} sx={{ bgcolor: '#E8E0FF', fontWeight: 700, py: 1, fontSize: 15 }} />
          ))}
          {Object.keys(stats.by_age_group).length === 0 && <Typography color="text.secondary">Пока пусто</Typography>}
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Успеваемость по темам */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              📈 Успеваемость по темам
            </Typography>
            {stats.by_topic.map((t) => (
              <Box key={t.topic} sx={{ mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography fontWeight={600}>{topicLabels[t.topic] ?? t.topic}</Typography>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    {t.avg_score_percent}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={t.avg_score_percent}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#F1EBFF',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#7C4DFF',
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {t.attempts} попыток
                </Typography>
              </Box>
            ))}
            {stats.by_topic.length === 0 && (
              <Typography color="text.secondary">Нет данных</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: '16px', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              🔥 Самые сложные задания
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <LocalFireDepartment color="error" sx={{ fontSize: 20 }} />
              <Typography variant="caption" color="text.secondary">
                низкий средний балл = сложнее
              </Typography>
            </Stack>
            {stats.hardest_tasks.map((t, i) => (
              <Box
                key={t.task_id}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: '10px',
                  backgroundColor: i === 0 ? '#FEF2F2' : '#F8F9FA',
                  border: i === 0 ? '1px solid #FCA5A5' : '1px solid #F1F1F1',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={700} color={i === 0 ? 'error.main' : 'text.primary'}>
                      #{i + 1}
                    </Typography>
                    <Typography fontWeight={600}>{t.title}</Typography>
                  </Stack>
                  <Chip
                    label={`${t.avg_score_percent}%`}
                    size="small"
                    sx={{
                      backgroundColor: t.avg_score_percent < 40 ? '#FCA5A5' : t.avg_score_percent < 60 ? '#FCD34D' : '#A7F3D0',
                      fontWeight: 700,
                    }}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {t.attempts} попыток
                </Typography>
              </Box>
            ))}
            {stats.hardest_tasks.length === 0 && (
              <Typography color="text.secondary">Нет данных</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}