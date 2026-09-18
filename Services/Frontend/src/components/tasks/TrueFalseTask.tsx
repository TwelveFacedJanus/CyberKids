// components/tasks/TrueFalseTask.tsx
import { Box, Button, Paper, Stack, Typography, LinearProgress } from '@mui/material'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Cancel from '@mui/icons-material/Cancel'
import HelpOutline from '@mui/icons-material/HelpOutline'
import { getAnswer, setAnswer, type TaskComponentProps } from './taskUtils'

export default function TrueFalseTask({ content, answers, onChange }: TaskComponentProps) {
  const statements = content.statements ?? []
  const answeredCount = statements.filter((s) => getAnswer(answers, s.id) !== undefined).length
  const progress = (answeredCount / statements.length) * 100

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
          {answeredCount} из {statements.length} отвечено
        </Typography>
      </Box>

      {statements.map((s, i) => {
        const chosen = getAnswer(answers, s.id)
        const isAnswered = chosen !== undefined

        return (
          <Paper
            key={s.id}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: isAnswered ? `2px solid ${chosen === true ? '#22C55E' : '#EF4444'}` : '1px solid #F1F1F1',
              backgroundColor: isAnswered ? (chosen === true ? '#F0FDF4' : '#FEF2F2') : '#FFFFFF',
              transition: 'all 0.2s ease',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: '#F1EBFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <HelpOutline sx={{ color: '#7C4DFF', fontSize: 20 }} />
              </Box>
              <Typography variant="body1" fontWeight={600} sx={{ flexGrow: 1, color: '#1A1A2E' }}>
                {s.statement}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant={chosen === true ? 'contained' : 'outlined'}
                // startIcon={<CheckCircle />}
                onClick={() => onChange(setAnswer(answers, s.id, true))}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  borderColor: '#22C55E',
                  color: chosen === true ? '#FFFFFF' : '#22C55E',
                  backgroundColor: chosen === true ? '#22C55E' : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: chosen === true ? '#16A34A' : '#F0FDF4',
                    borderColor: '#22C55E',
                  },
                }}
              >
                ✅ Правда
              </Button>
              <Button
                fullWidth
                variant={chosen === false ? 'contained' : 'outlined'}
                // startIcon={<Cancel />}
                onClick={() => onChange(setAnswer(answers, s.id, false))}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 600,
                  borderColor: '#EF4444',
                  color: chosen === false ? '#FFFFFF' : '#EF4444',
                  backgroundColor: chosen === false ? '#EF4444' : '#FFFFFF',
                  '&:hover': {
                    backgroundColor: chosen === false ? '#DC2626' : '#FEF2F2',
                    borderColor: '#EF4444',
                  },
                }}
              >
                ❌ Ложь
              </Button>
            </Stack>
          </Paper>
        )
      })}
    </Stack>
  )
}