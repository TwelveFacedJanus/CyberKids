// components/tasks/ScenarioTask.tsx
import { Avatar, Box, Chip, Paper, Stack, Typography, LinearProgress } from '@mui/material'
import CheckCircle from '@mui/icons-material/CheckCircle'
import AutoAwesome from '@mui/icons-material/AutoAwesome'
import MenuBook from '@mui/icons-material/MenuBook'
import type { Scenario } from '../../types'
import { getAnswer, setAnswer, type TaskComponentProps } from './taskUtils'

const OPTION_COLORS = ['#7C4DFF', '#EC407A', '#FF7043', '#42A5F5']

export default function ScenarioTask({ content, answers, onChange }: TaskComponentProps) {
  const scenarios = content.scenarios ?? []
  const answeredCount = scenarios.filter((s) => getAnswer(answers, s.id) !== undefined).length
  const progress = (answeredCount / scenarios.length) * 100

  return (
    <Stack spacing={3}>
      {/* Прогресс */}
      <Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 6, borderRadius: 3, backgroundColor: '#F1EBFF' }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {answeredCount} из {scenarios.length} ситуаций решено
        </Typography>
      </Box>

      {scenarios.map((s: Scenario, si) => {
        const chosen = getAnswer(answers, s.id)
        const color = OPTION_COLORS[si % OPTION_COLORS.length]

        return (
          <Paper
            key={s.id}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid #F1F1F1',
              borderTop: `4px solid ${color}`,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: color, width: 36, height: 36 }}>
                <AutoAwesome sx={{ fontSize: 20 }} />
              </Avatar>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#1A1A2E' }}>
                Ситуация {si + 1}: {s.title}
              </Typography>
            </Stack>

            <Box
              sx={{
                p: 2.5,
                borderRadius: '12px',
                backgroundColor: '#F8F9FA',
                border: '1px solid #F1F1F1',
                mb: 2.5,
                display: 'flex',
                gap: 1.5,
              }}
            >
              <MenuBook sx={{ color: '#7C4DFF', fontSize: 20, mt: 0.2 }} />
              <Typography variant="body2" color="text.secondary">
                {s.description}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {s.options.map((opt, i) => {
                const selected = chosen === i
                return (
                  <Box
                    key={i}
                    onClick={() => onChange(setAnswer(answers, s.id, i))}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 15,
                      border: selected ? `2px solid ${color}` : '2px solid #F1F1F1',
                      backgroundColor: selected ? `${color}15` : '#FFFFFF',
                      color: selected ? color : '#1A1A2E',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: color,
                        backgroundColor: selected ? `${color}15` : '#F8F9FA',
                      },
                    }}
                  >
                    <Box component="span" sx={{ mr: 1.5 }}>
                      {selected ? '●' : '○'}
                    </Box>
                    {opt}
                  </Box>
                )
              })}
            </Stack>
          </Paper>
        )
      })}
    </Stack>
  )
}