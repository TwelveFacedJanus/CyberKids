import { Box } from '@mui/material'
import { keyframes } from '@emotion/react'
import { useMemo } from 'react'

const fall = keyframes`
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0.6; }
`

const COLORS = ['#7C4DFF', '#EC407A', '#FF7043', '#FFCA28', '#66BB6A', '#42A5F5', '#26C6DA']

export default function Confetti({ pieces = 40 }: { pieces?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        size: 8 + ((i * 13) % 12),
        color: COLORS[i % COLORS.length],
        delay: `${(i % 10) * 0.18}s`,
        duration: `${2.2 + (i % 5) * 0.4}s`,
        shape: i % 3 === 0 ? '50%' : i % 3 === 1 ? '4px' : '3px 6px',
      })),
    [pieces],
  )

  return (
    <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {items.map((p, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: 0,
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape,
            animation: `${fall} ${p.duration} linear ${p.delay} infinite`,
          }}
        />
      ))}
    </Box>
  )
}