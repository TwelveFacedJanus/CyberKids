// theme.ts
import { createTheme } from '@mui/material/styles'

// Яркая детская палитра БЕЗ фиолетового/синего
const palette = {
  primary: '#FF6B35', // Яркий оранжевый
  secondary: '#FFD23F', // Солнечный жёлтый
  accent: '#00D9A3', // Мятный зелёный
  success: '#6BCF7F', // Салатовый
  warning: '#FF8C42', // Тёплый оранжевый
  error: '#FF5252', // Яркий красный
  pink: '#FF6B9D', // Розовый
  coral: '#FF7F66', // Коралловый
  lime: '#CDDC39', // Лаймовый
  cyan: '#00E5FF', // Яркий голубой (не синий!)
  orange: '#FF9800', // Апельсиновый
  yellow: '#FFEB3B', // Лимонный
  green: '#4CAF50', // Зелёный
  red: '#F44336', // Красный
  dark: '#2C3E50', // Тёмный для текста
  grey: '#7F8C8D', // Серый
  lightGrey: '#ECF0F1', // Светло-серый
  white: '#FFFFFF',
}

export const topicColors: Record<string, string> = {
  phishing: '#FF8C42',
  cyberbullying: '#00E5FF',
  passwords: '#FFD93F',
  viruses: '#6BCF7F',
  privacy: '#FF6B35',
  safe: '#FF6B9D',
  gaming_scams: '#FF6B35', // Оранжевый
  safety_test: '#4CAF50',
  cyber_hero_test: '#00E5FF',
  digital_footprint: '#00D9A3', // Мятный
  fake_friends: '#FF6B9D', // Розовый
  ai_traps: '#FF9800', // Апельсиновый
  easy_money: '#FFD23F', // Жёлтый
  school_trap: '#00E5FF', // Голубой
  cybersecurity: '#CDDC39', // Лаймовый
}

export const topicLabels: Record<string, string> = {
  phishing: 'Фишинг',
  cyberbullying: 'Кибербуллинг',
  passwords: 'Пароли',
  viruses: 'Вирусы',
  privacy: 'Личные данные',
  safe: 'Безопасные действия',
  gaming_scams: 'Игровые мошенничества',  
  safety_test: 'Это нормально или опасно?',
  cyber_hero_test: 'Тест-игра: кибергерой',
  digital_footprint: 'Цифровой след',
  //
  fake_friends: 'Фальшивые друзья',
  ai_traps: 'Ловушки с ИИ и дипфейками',
  easy_money: 'Лёгкие деньги',
  school_trap: 'Школьная ловушка',
  cybersecurity: 'Кибербезопасность',
}

export const ageGroupLabels: Record<string, string> = {
  junior: '6–8 лет',
  middle: '9–11 лет',
  senior: '12–14 лет',
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.primary },
    secondary: { main: palette.secondary },
    success: { main: palette.success },
    warning: { main: palette.warning },
    error: { main: palette.error },
    info: { main: palette.cyan },
    background: {
      default: '#FFF9F0', // Тёплый кремовый фон
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Trebuchet MS", "Segoe UI", sans-serif',
    // Крупные шрифты для детей
    h1: { fontWeight: 900, letterSpacing: '-0.02em', fontSize: 'clamp(3rem, 5vw, 5rem)' },
    h2: { fontWeight: 900, letterSpacing: '-0.02em', fontSize: 'clamp(2.5rem, 4vw, 4rem)' },
    h3: { fontWeight: 800, letterSpacing: '-0.01em', fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' },
    h4: { fontWeight: 800, letterSpacing: '-0.01em', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' },
    h5: { fontWeight: 700, fontSize: 'clamp(1.5rem, 2.5vw, 2rem)' },
    h6: { fontWeight: 700, fontSize: 'clamp(1.25rem, 2vw, 1.75rem)' },
    body1: { fontWeight: 500, lineHeight: 1.7, fontSize: 'clamp(1.1rem, 1.35vw, 1.35rem)' },
    body2: { fontWeight: 500, lineHeight: 1.6, fontSize: 'clamp(1rem, 1.15vw, 1.18rem)' },
    button: { fontWeight: 800, textTransform: 'none', letterSpacing: '0.03em', fontSize: 'clamp(1.125rem, 1.5vw, 1.5rem)' },
  },
  shape: { borderRadius: 16 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 4px 12px rgba(0,0,0,0.05)',
    '0 8px 24px rgba(0,0,0,0.08)',
    '0 12px 36px rgba(0,0,0,0.10)',
    '0 20px 48px rgba(0,0,0,0.12)',
    '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    '0 24px 48px rgba(0,0,0,0.30), 0 20px 14px rgba(0,0,0,0.22)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
    '0 10px 20px rgba(0,0,0,0.10)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          backgroundColor: '#FFF9F0',
          color: '#2C3E50',
        },
        'button, input, textarea, select': {
          font: 'inherit',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 6px 20px rgba(255,107,53,0.25)',
          padding: '13px 30px',
          fontSize: 'clamp(1.05rem, 1.2vw, 1.25rem)',
          fontWeight: 800,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(255,107,53,0.35)',
            transform: 'translateY(-3px) scale(1.02)',
          },
          '&:active': {
            transform: 'translateY(-2px) scale(0.98)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
          fontWeight: 900,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          border: '3px solid transparent',
          '&:hover': {
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            transform: 'translateY(-12px) scale(1.03) rotate(1deg)',
            border: '3px solid #FFD23F',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 700,
          fontSize: '1rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
            fontSize: 'clamp(1.125rem, 1.25vw, 1.375rem)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(255,107,53,0.15)',
            },
            '&.Mui-focused': {
              boxShadow: '0 6px 24px rgba(255,107,53,0.25)',
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '3px solid #FFFFFF',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFE5D9',
          height: 14,
        },
        bar: {
          borderRadius: 12,
          background: 'linear-gradient(90deg, #FF6B35, #FFD23F)',
        },
      },
    },
  },
})

export default theme
