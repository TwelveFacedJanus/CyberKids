import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
} from '@mui/material'
import { api } from '../../api/client'
import { topicLabels } from '../../theme'
import type { ResultDetailed } from '../../types'

export default function AdminResultsPage() {
  const [results, setResults] = useState<ResultDetailed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<ResultDetailed[]>('/api/admin/results')
      .then(setResults)
      .catch((e) => setError(e instanceof Error ? e.message : 'Ошибка'))
      .finally(() => setLoading(false))
  }, [])

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" fontWeight={700}>
            📊 Результаты
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Всего: {results.length}
          </Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {results.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: '12px' }}>
          Пока нет результатов
        </Alert>
      )}

      <Paper sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
                <TableCell sx={{ fontWeight: 700 }}>Пользователь</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Задание</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Тема</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Результат</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Верных</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Дата</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((r) => {
                const pct = Math.round((r.score / r.max_score) * 100)
                const isSuccess = pct >= 70
                return (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: '#7C4DFF',
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {r.full_name?.[0] || r.username?.[0] || '?'}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600}>{r.full_name || r.username || r.user_id}</Typography>
                          {r.username && (
                            <Typography variant="caption" color="text.secondary">
                              @{r.username}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {r.task_title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={topicLabels[r.topic] ?? r.topic}
                        size="small"
                        sx={{ backgroundColor: '#F1EBFF', fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${r.score}/${r.max_score} (${pct}%)`}
                        size="small"
                        sx={{
                          backgroundColor: isSuccess ? '#E0F2E9' : pct >= 40 ? '#FFF9C4' : '#FFCDD2',
                          fontWeight: 700,
                          color: isSuccess ? '#166534' : pct >= 40 ? '#92400E' : '#991B1B',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {r.correct_count}/{r.total_count}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(r.completed_at).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  )
}