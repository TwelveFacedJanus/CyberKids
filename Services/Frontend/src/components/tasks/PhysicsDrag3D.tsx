import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Box, Chip, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import TouchApp from '@mui/icons-material/TouchApp'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { zoneIconFor } from '../../icons'
import { cubeColor, getAnswer, setAnswer, type TaskComponentProps } from './taskUtils'
import type { Item, Section } from '../../types'

// Уменьшаем размер куба в 2 раза
const CUBE_SIZE = 72  // Было 112
const HALF = CUBE_SIZE / 2  // Теперь 28
const DROP_ANIM_MS = 420

// Физические параметры как в исходном примере
const FRICTION = 0.95
const BOUNCE = -0.6
const SPRING = 0.15
const DAMPING = 0.85

// Цвета для граней как в исходном примере
const FACE_COLORS = [
  'rgba(239, 71, 111, 0.4)',   // front
  'rgba(6, 214, 160, 0.4)',    // back
  'rgba(17, 138, 178, 0.4)',   // right
  'rgba(255, 209, 102, 0.4)',  // left
  'rgba(114, 9, 183, 0.4)',    // top
  'rgba(76, 201, 240, 0.4)',   // bottom
]

interface CubePos {
  x: number
  y: number
  vx: number
  vy: number
  tiltX: number
  tiltY: number
  tiltVelX: number
  tiltVelY: number
  grabbed: boolean
  animating: boolean
}

interface DragState {
  id: string
  offsetX: number
  offsetY: number
  lastX: number
  lastY: number
  lastTime: number
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function topicColorOf(id: string): string {
  const map: Record<string, string> = {
    phishing: '#FF7043',
    cyberbullying: '#42A5F5',
    passwords: '#F9A825',
    viruses: '#66BB6A',
    privacy: '#7C4DFF',
    safe: '#EC407A',
  }
  return map[id] ?? '#7C4DFF'
}

export default function PhysicsDrag3D({ content, answers, onChange }: TaskComponentProps) {
  const sections = content.sections ?? []
  const items = content.items ?? []
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const containerRef = useRef<HTMLDivElement | null>(null)
  const trayRef = useRef<HTMLDivElement | null>(null)
  const zoneRefs = useRef(new Map<string, HTMLDivElement>())
  const dragRef = useRef<DragState | null>(null)
  const posRef = useRef<Record<string, CubePos>>({})
  const animFrameRef = useRef<number>(0)

  const [pos, setPos] = useState<Record<string, CubePos>>({})
  const [dragging, setDragging] = useState(false)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [tray, setTray] = useState({ x: 0, y: 0, w: 0, h: 0 })

  const placedOf = useCallback((itemId: string) => getAnswer(answers, itemId), [answers])
  const pending = useMemo(() => items.filter((i) => placedOf(i.id) === undefined), [items, placedOf])
  const pendingIds = pending.map((i) => i.id).join('|')

  // ---- измеряем контейнер и лоток ----
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const c = el.getBoundingClientRect()
      setBox({ w: c.width, h: c.height })
      const t = trayRef.current
      if (t) {
        const tr = t.getBoundingClientRect()
        setTray({ x: tr.left - c.left, y: tr.top - c.top, w: tr.width, h: tr.height })
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ---- распределяем кубики по лотку ----
  useEffect(() => {
    if (box.w === 0 || tray.w === 0) return
    const prev = posRef.current
    const next = { ...prev }
    const list = pending.filter((i) => !next[i.id] || (!next[i.id].grabbed && !next[i.id].animating))
    
    // Уменьшаем отступы для маленьких кубиков
    const slotW = isMobile ? CUBE_SIZE + 12 : CUBE_SIZE + 24
    const slotH = isMobile ? CUBE_SIZE + 13 : CUBE_SIZE + 22
    const maxPerRow = Math.max(1, Math.floor(tray.w / slotW))
    const rows = Math.ceil(list.length / maxPerRow)
    const firstRowCount = Math.min(list.length, maxPerRow)
    const startX = tray.x + (tray.w - firstRowCount * slotW) / 2 + slotW / 2 - HALF
    const startY = tray.y + (tray.h - rows * slotH) / 2 + slotH / 2 - HALF

    list.forEach((item, idx) => {
      const row = Math.floor(idx / maxPerRow)
      const col = idx % maxPerRow
      next[item.id] = {
        x: startX + col * slotW,
        y: startY + row * slotH,
        vx: 0,
        vy: 0,
        tiltX: 0,
        tiltY: 0,
        tiltVelX: 0,
        tiltVelY: 0,
        grabbed: false,
        animating: false,
      }
    })
    posRef.current = next
    setPos(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingIds, box, tray, isMobile])

  // ---- физический цикл ----
  useEffect(() => {
    if (!dragging) return

    const tick = () => {
      const d = dragRef.current
      if (!d) {
        cancelAnimationFrame(animFrameRef.current)
        return
      }

      const p = posRef.current[d.id]
      if (p && !p.animating) {
        // Трение о стол
        let vx = p.vx * FRICTION
        let vy = p.vy * FRICTION

        // Движение
        let nx = p.x + vx
        let ny = p.y + vy

        // Возврат покачивания (пружина)
        const targetTiltX = 0
        const targetTiltY = 0
        let tiltVelX = p.tiltVelX + (targetTiltX - p.tiltX) * SPRING
        let tiltVelY = p.tiltVelY + (targetTiltY - p.tiltY) * SPRING
        tiltVelX *= DAMPING
        tiltVelY *= DAMPING
        let tiltX = p.tiltX + tiltVelX
        let tiltY = p.tiltY + tiltVelY

        // Столкновения с границами
        const maxX = box.w - CUBE_SIZE
        const maxY = box.h - CUBE_SIZE

        if (nx < 0) { nx = 0; vx *= BOUNCE; tiltVelY += vx * 0.5 }
        else if (nx > maxX) { nx = maxX; vx *= BOUNCE; tiltVelY += vx * 0.5 }

        if (ny < 0) { ny = 0; vy *= BOUNCE; tiltVelX -= vy * 0.5 }
        else if (ny > maxY) { ny = maxY; vy *= BOUNCE; tiltVelX -= vy * 0.5 }

        // Ограничиваем наклон
        tiltX = clamp(tiltX, -25, 25)
        tiltY = clamp(tiltY, -25, 25)

        posRef.current = {
          ...posRef.current,
          [d.id]: {
            ...p,
            x: nx,
            y: ny,
            vx,
            vy,
            tiltX,
            tiltY,
            tiltVelX,
            tiltVelY,
            grabbed: true,
          },
        }
        setPos(posRef.current)
      }

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [dragging, box])

  // ---- проверка попадания в зону ----
  const zoneIdAt = useCallback((cx: number, cy: number): string | undefined => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return undefined
    for (const [zid, el] of zoneRefs.current) {
      const z = el.getBoundingClientRect()
      if (cx >= z.left - rect.left && cx <= z.right - rect.left && 
          cy >= z.top - rect.top && cy <= z.bottom - rect.top) {
        return zid
      }
    }
    return undefined
  }, [])

  // ---- отпускание: бросок в зону или возврат в лоток ----
  const release = useCallback(
    (state: CubePos, id: string) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = state.x + HALF
      const cy = state.y + HALF
      const zoneId = zoneIdAt(cx, cy)

      if (zoneId) {
        const el = zoneRefs.current.get(zoneId)!
        const z = el.getBoundingClientRect()
        const tx = z.left - rect.left + z.width / 2 - HALF
        const ty = z.top - rect.top + z.height / 2 - HALF
        posRef.current = { 
          ...posRef.current, 
          [id]: { 
            ...state, 
            x: tx, 
            y: ty, 
            vx: 0, 
            vy: 0, 
            tiltX: 0, 
            tiltY: 0,
            tiltVelX: 0,
            tiltVelY: 0,
            grabbed: false, 
            animating: true 
          } 
        }
        setPos(posRef.current)
        window.setTimeout(() => {
          onChange(setAnswer(answers, id, zoneId!))
          const n = { ...posRef.current }
          delete n[id]
          posRef.current = n
          setPos(n)
        }, DROP_ANIM_MS)
      } else {
        posRef.current = { 
          ...posRef.current, 
          [id]: { 
            ...state, 
            vx: 0, 
            vy: 0, 
            tiltX: 0, 
            tiltY: 0,
            tiltVelX: 0,
            tiltVelY: 0,
            grabbed: false, 
            animating: false 
          } 
        }
        setPos(posRef.current)
      }
    },
    [answers, onChange, zoneIdAt],
  )

  const onPointerDown = (e: React.PointerEvent, item: Item) => {
    const rect = containerRef.current?.getBoundingClientRect()
    const cur = posRef.current[item.id]
    if (!rect || !cur || cur.animating) return
    
    e.currentTarget.setPointerCapture(e.pointerId)
    
    const clientX = e.clientX
    const clientY = e.clientY
    
    dragRef.current = {
      id: item.id,
      offsetX: clientX - rect.left - cur.x,
      offsetY: clientY - rect.top - cur.y,
      lastX: clientX,
      lastY: clientY,
      lastTime: performance.now(),
    }
    
    // Поднимаем куб (увеличиваем масштаб)
    posRef.current = { 
      ...posRef.current, 
      [item.id]: { 
        ...cur, 
        grabbed: true,
        vx: 0,
        vy: 0,
        tiltVelX: 0,
        tiltVelY: 0,
      } 
    }
    setPos(posRef.current)
    setDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    const rect = containerRef.current?.getBoundingClientRect()
    if (!d || !rect) return
    
    const cur = posRef.current[d.id]
    if (!cur) return
    
    const clientX = e.clientX
    const clientY = e.clientY
    const currentTime = performance.now()
    const dt = currentTime - d.lastTime || 16
    
    const deltaX = clientX - d.lastX
    const deltaY = clientY - d.lastY
    
    const newX = clientX - rect.left - d.offsetX
    const newY = clientY - rect.top - d.offsetY
    
    // Рассчитываем скорость для инерции (как в исходном примере)
    const vx = (deltaX / dt) * 16
    const vy = (deltaY / dt) * 16
    
    // Наклон в зависимости от движения (как в исходном примере)
    let tiltY = cur.tiltY + deltaX * 0.3
    let tiltX = cur.tiltX - deltaY * 0.3
    
    // Ограничиваем наклон
    tiltX = clamp(tiltX, -25, 25)
    tiltY = clamp(tiltY, -25, 25)
    
    posRef.current = {
      ...posRef.current,
      [d.id]: {
        ...cur,
        x: clamp(newX, 0, Math.max(0, box.w - CUBE_SIZE)),
        y: clamp(newY, 0, Math.max(0, box.h - CUBE_SIZE)),
        vx: clamp(vx, -20, 20),
        vy: clamp(vy, -20, 20),
        tiltX,
        tiltY,
      },
    }
    setPos(posRef.current)
    
    // Обновляем последние координаты
    d.lastX = clientX
    d.lastY = clientY
    d.lastTime = currentTime
  }

  const onPointerUp = (e: React.PointerEvent, item: Item) => {
    const d = dragRef.current
    if (!d || d.id !== item.id) return
    
    dragRef.current = null
    setDragging(false)
    
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
    
    const cur = posRef.current[item.id]
    if (cur) {
      // Задаем начальный импульс покачиванию при броске (как в исходном примере)
      const tiltVelX = -cur.vy * 0.5
      const tiltVelY = cur.vx * 0.5
      
      posRef.current = {
        ...posRef.current,
        [item.id]: {
          ...cur,
          tiltVelX,
          tiltVelY,
          grabbed: false,
        },
      }
      setPos(posRef.current)
      
      // Проверяем попадание в зону через небольшую задержку (для инерции)
      setTimeout(() => {
        const finalCur = posRef.current[item.id]
        if (finalCur && !finalCur.grabbed && !finalCur.animating) {
          release(finalCur, item.id)
        }
      }, 100)
    }
  }

  const placed = useMemo(() => {
    const map = new Map<string, string>()
    for (const i of items) {
      const v = placedOf(i.id)
      if (v !== undefined) map.set(i.id, String(v))
    }
    return map
  }, [items, placedOf])

  const zone = (section: Section, index: number) => {
    const Icon = zoneIconFor(section.icon ?? section.id)
    const color = topicColorOf(section.id)
    const inZone = items.filter((i) => placed.get(i.id) === section.id)
    return (
      <Paper
        key={section.id}
        ref={(el) => {
          if (el) zoneRefs.current.set(section.id, el)
          else zoneRefs.current.delete(section.id)
        }}
        sx={{
          p: 1.5,
          minHeight: 118,
          border: '2px dashed',
          borderColor: '#D1D5DB',
          borderRadius: '16px',
          backgroundColor: '#FAFAFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.75,
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#7C4DFF',
            backgroundColor: '#F1EBFF',
          },
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            background: `linear-gradient(135deg, ${color}, ${topicColorOf(section.id)}80)`,
            boxShadow: 2,
          }}
        >
          <Icon sx={{ fontSize: 26 }} />
        </Box>
        <Typography sx={{ fontWeight: 900, fontSize: 13, textAlign: 'center' }}>{section.label}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', maxHeight: 42, overflow: 'hidden' }}>
          {inZone.map((i) => (
            <Chip
              key={i.id}
              label={i.text}
              size="small"
              icon={<CheckCircle sx={{ fontSize: 16 }} />}
              sx={{ bgcolor: '#E0F2E9', fontWeight: 700, fontSize: 11, maxWidth: 130, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
          ))}
        </Box>
      </Paper>
    )
  }

  const leftZones = sections.slice(0, 3)
  const rightZones = sections.slice(3, 6)

  return (
    <Box>
      <Box ref={containerRef} sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '200px 1fr 200px' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <Stack spacing={2} sx={{ order: { xs: 2, md: 1 }, display: { xs: 'grid', md: 'flex' }, gridTemplateColumns: { xs: 'repeat(2,1fr)' }, gap: { xs: 2, md: 0 } }}>
            {leftZones.map((s, i) => zone(s, i))}
          </Stack>

          <Box sx={{ order: { xs: 1, md: 2 } }}>
            <Paper
              ref={trayRef}
              sx={{
                p: 1.5,
                minHeight: { xs: 540, md: 440 },
                background: 'linear-gradient(150deg, #F1EBFF, #E8F5FF)',
                border: '2px solid #D9C9FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Chip
                icon={<TouchApp />}
                label={pending.length === 0 ? 'Все кубики разложены!' : `Возьми кубик и перетащи в зону (${pending.length} осталось)`}
                sx={{ bgcolor: '#fff', fontWeight: 800, boxShadow: 1 }}
              />
              {pending.length === 0 && (
                <Typography variant="body2" fontWeight={700} color="text.secondary">
                  Нажми «Проверить ответы» ниже
                </Typography>
              )}
            </Paper>
          </Box>

          <Stack spacing={2} sx={{ order: { xs: 3, md: 3 }, display: { xs: 'grid', md: 'flex' }, gridTemplateColumns: { xs: 'repeat(2,1fr)' }, gap: { xs: 2, md: 0 } }}>
            {rightZones.map((s, i) => zone(s, i))}
          </Stack>
        </Box>

        {/* Оверлей с кубиками */}
        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5, perspective: '1500px' }}>
          {items.map((item, idx) => {
            const c = pos[item.id]
            if (!c || placed.has(item.id)) return null
            const isDrag = dragRef.current?.id === item.id
            
            return (
              <Box
                key={item.id}
                onPointerDown={(e) => onPointerDown(e, item)}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => onPointerUp(e, item)}
                onPointerCancel={(e) => onPointerUp(e, item)}
                sx={{
                  position: 'absolute',
                  left: c.x,
                  top: c.y,
                  width: CUBE_SIZE,
                  height: CUBE_SIZE,
                  pointerEvents: 'auto',
                  cursor: isDrag ? 'grabbing' : 'grab',
                  touchAction: 'none',
                  userSelect: 'none',
                  zIndex: isDrag ? 20 : 6,
                  opacity: c.animating ? 0 : 1,
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${c.tiltX}deg) rotateY(${c.tiltY}deg) scale(${isDrag ? 1.18 : 1})`,
                  transition: isDrag ? 'none' : 'transform 0.15s ease-out, opacity 0.4s ease',
                  boxShadow: isDrag ? '0 40px 60px rgba(0,0,0,0.7)' : '0 10px 20px rgba(0,0,0,0.5)',
                }}
              >
                {cubeFaces(item.text, idx)}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}

function cubeFaces(text: string, index: number) {
  const faces = [
    { name: 'front', transform: `rotateY(0deg) translateZ(${HALF}px)`, color: FACE_COLORS[0] },
    { name: 'back', transform: `rotateY(180deg) translateZ(${HALF}px)`, color: FACE_COLORS[1] },
    { name: 'right', transform: `rotateY(90deg) translateZ(${HALF}px)`, color: FACE_COLORS[2] },
    { name: 'left', transform: `rotateY(-90deg) translateZ(${HALF}px)`, color: FACE_COLORS[3] },
    { name: 'top', transform: `rotateX(90deg) translateZ(${HALF}px)`, color: FACE_COLORS[4] },
    { name: 'bottom', transform: `rotateX(-90deg) translateZ(${HALF}px)`, color: FACE_COLORS[5] },
  ]
  
  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative', 
        transformStyle: 'preserve-3d' 
      }}
    >
      {faces.map((f) => (
        <Box
          key={f.name}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            background: f.color,
            backdropFilter: 'blur(4px)',
            userSelect: 'none',
            transform: f.transform,
            backfaceVisibility: 'visible',
          }}
        >
          <span
            style={{
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              fontFamily: 'sans-serif',
              textAlign: 'center',
              padding: '2px',
              wordBreak: 'break-word',
              lineHeight: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              transform: 'rotate(0deg)',
            }}
          >
            {text}
          </span>
        </Box>
      ))}
    </Box>
  )
}