// components/tasks/QuizTask.tsx
import { useState } from 'react'
import { Box, Button, Chip, Paper, Stack, Typography, LinearProgress } from '@mui/material'
import ArrowBack from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import CheckCircle from '@mui/icons-material/CheckCircle'
import HelpOutline from '@mui/icons-material/HelpOutline'
import type { Question } from '../../types'
import { getAnswer, setAnswer, type TaskComponentProps } from './taskUtils'

const OPTION_COLORS = ['#7C4DFF', '#EC407A', '#FF7043', '#42A5F5', '#66BB6A']

export default function QuizTask({ content, answers, onChange }: TaskComponentProps) {
  const questions = content.questions ?? []
  const [index, setIndex] = useState(0)

  if (questions.length === 0) return null

  const q: Question = questions[index]
  const chosen = getAnswer(answers, q.id)
  const answeredCount = questions.filter((x) => getAnswer(answers, x.id) !== undefined).length
  const progress = (answeredCount / questions.length) * 100

  return (
    <Stack spacing={3}>
      {/* Прогресс-бар */}
      <Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            Вопрос {index + 1} из {questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {answeredCount} из {questions.length} отвечено
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 6, borderRadius: 3, backgroundColor: '#F1EBFF' }}
        />
      </Box>

      {/* Вопрос */}
      <Paper
        key={q.id}
        sx={{
          p: 4,
          borderRadius: '16px',
          border: '1px solid #F1F1F1',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: '#F1EBFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <HelpOutline sx={{ color: '#7C4DFF' }} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#1A1A2E' }}>
            {q.question}
          </Typography>
        </Stack>

        <Stack spacing={1.5} sx={{ mt: 3 }}>
          {q.options.map((opt, i) => {
            const selected = chosen === i
            const color = OPTION_COLORS[i % OPTION_COLORS.length]
            return (
              <Button
                key={i}
                fullWidth
                variant={selected ? 'contained' : 'outlined'}
                onClick={() => onChange(setAnswer(answers, q.id, i))}
                sx={{
                  py: 1.8,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: '12px',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  textTransform: 'none',
                  borderColor: selected ? color : '#E5E7EB',
                  backgroundColor: selected ? color : '#FFFFFF',
                  color: selected ? '#FFFFFF' : '#1A1A2E',
                  '&:hover': {
                    backgroundColor: selected ? color : '#F8F9FA',
                    borderColor: selected ? color : '#D1D5DB',
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: selected ? 'rgba(255,255,255,0.2)' : '#F1EBFF',
                    mr: 2,
                    flexShrink: 0,
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </Box>
                {opt}
              </Button>
            )
          })}
        </Stack>
      </Paper>

      {/* Навигация */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button
          startIcon={<ArrowBack />}
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          sx={{ color: 'text.secondary' }}
        >
          Назад
        </Button>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {questions.map((x, i) => (
            <Box
              key={x.id}
              onClick={() => setIndex(i)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundColor: getAnswer(answers, x.id) !== undefined ? '#7C4DFF' : '#D1D5DB',
                transition: 'all 0.2s ease',
                transform: i === index ? 'scale(1.4)' : 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              }}
            />
          ))}
        </Box>
        <Button
          endIcon={<ArrowForward />}
          disabled={index === questions.length - 1}
          onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          sx={{ color: 'text.secondary' }}
        >
          Далее
        </Button>
      </Stack>
    </Stack>
  )
}