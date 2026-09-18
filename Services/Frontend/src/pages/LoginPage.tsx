import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Security from '@mui/icons-material/Security'
import LockOpen from '@mui/icons-material/LockOpen'
import ShieldOutlined from '@mui/icons-material/ShieldOutlined'
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined'
import PrivacyTipOutlined from '@mui/icons-material/PrivacyTipOutlined'
import { useAuth } from '../context/AuthContext'

const floatingIcons = [
  { Icon: ShieldOutlined, top: '18%', left: '12%', size: 54, color: '#FFCA28', delay: 0 },
  { Icon: VpnKeyOutlined, top: '64%', left: '16%', size: 46, color: '#66BB6A', delay: 0.8 },
  { Icon: PrivacyTipOutlined, top: '30%', left: '82%', size: 48, color: '#80DEEA', delay: 0.4 },
  { Icon: ShieldOutlined, top: '85%', left: '70%', size: 42, color: '#F48FB1', delay: 1.2 },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(username, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #7C4DFF 0%, #9C27B0 55%, #EC407A 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {floatingIcons.map(({ Icon, top, left, size, color, delay }, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top,
            left,
            opacity: 0.9,
            animation: `float ${6 + delay}s ease-in-out ${delay}s infinite`,
            '@keyframes float': {
              '0%,100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-16px)' },
            },
          }}
        >
          <Icon sx={{ fontSize: size, color }} />
        </Box>
      ))}

      <Card sx={{ width: '100%', maxWidth: 900, p: { xs: 1, md: 2 }, borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' } }}>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              p: 4,
              background: 'linear-gradient(150deg, #7C4DFF, #EC407A)',
              color: '#fff',
              borderRadius: 3,
            }}
          >
            <Security sx={{ fontSize: 88 }} />
            <Typography variant="h3" fontWeight={900} sx={{ mt: 2 }}>
              CyberKids
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, mt: 1 }}>
              Безопасный интернет — это весело!
            </Typography>
            <Typography sx={{ mt: 2, opacity: 0.85 }}>
              Играй, решай задания и учись защищать себя и свои данные в сети.
            </Typography>
            <Typography sx={{ opacity: 0.4, fontSize: '12px', display: 'flex', justifyContent: 'right', mt: 4 }}>
              Персонально для KiberOne г.Ишимбай
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 1 }}>
              <Security sx={{ fontSize: 64, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={900} gutterBottom textAlign="center" sx={{ color: 'primary.main' }}>
              Вход
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
              Войди, чтобы продолжить приключение
            </Typography>

            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  required
                  autoFocus
                />
                <TextField
                  label="Пароль"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={busy}
                  startIcon={<LockOpen />}
                  sx={{ py: 1.6, fontSize: 18, background: 'linear-gradient(90deg, #7C4DFF, #EC407A)' }}
                >
                  {busy ? 'Входим…' : 'Войти'}
                </Button>
              </Stack>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
              Аккаунты создаёт только ваш учитель или родитель
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  )
}