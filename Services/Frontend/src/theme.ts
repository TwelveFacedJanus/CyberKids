// theme.ts
import { createTheme } from '@mui/material/styles'

const palette = {
  purple: '#7C4DFF',
  violet: '#B388FF',
  orange: '#FF7043',
  yellow: '#FFCA28',
  green: '#66BB6A',
  blue: '#42A5F5',
  pink: '#EC407A',
  // Новые цвета для строгости
  dark: '#1A1A2E',
  grey: '#6B7280',
  lightGrey: '#F3F4F6',
  white: '#FFFFFF',
}

export const topicColors: Record<string, string> = {
  phishing: palette.orange,
  cyberbullying: palette.blue,
  passwords: palette.yellow,
  viruses: palette.green,
  privacy: palette.purple,
  safe: palette.pink,
  gaming_scams: '#FF6B6B',
  safety_test: '#00A651',
  cyber_hero_test: '#005FF9',
  digital_footprint: '#26C6DA',
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
}

export const ageGroupLabels: Record<string, string> = {
  junior: '6–8 лет',
  middle: '9–11 лет',
  senior: '12–14 лет',
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.purple, light: palette.violet },
    secondary: { main: palette.pink },
    success: { main: palette.green },
    warning: { main: palette.yellow },
    error: { main: palette.orange },
    info: { main: palette.blue },
    background: {
      default: '#F8F9FA', // Светлый, чистый фон
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Nunito", "Segoe UI", sans-serif', // Inter для строгости, Nunito для детскости
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    body1: { fontWeight: 400, lineHeight: 1.6 },
    body2: { fontWeight: 400, lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.01em' },
  },
  shape: { borderRadius: 16 },
shadows: [
  'none',                                                       // 0
  '0 1px 3px rgba(0,0,0,0.06)',                                 // 1
  '0 4px 12px rgba(0,0,0,0.05)',                                // 2
  '0 8px 24px rgba(0,0,0,0.08)',                                // 3
  '0 12px 36px rgba(0,0,0,0.10)',                               // 4
  '0 20px 48px rgba(0,0,0,0.12)',                               // 5
  '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',     // 6
  '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',   // 7
  '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)', // 8
  '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)', // 9
  '0 24px 48px rgba(0,0,0,0.30), 0 20px 14px rgba(0,0,0,0.22)', // 10
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 11
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 12
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 13
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 14
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 15
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 16
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 17
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 18
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 19
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 20
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 21
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 22
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 23
  '0 10px 20px rgba(0,0,0,0.10), 0 6px 6px rgba(0,0,0,0.10)',   // 24
],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollBehavior: 'smooth',
          backgroundColor: '#F8F9FA',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Менее круглые, более строгие
          boxShadow: '0 2px 8px rgba(124,77,255,0.12)',
          padding: '10px 24px',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(124,77,255,0.20)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7C4DFF, #9C27B0)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        },
        elevation1: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        },
        elevation2: {
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(124,77,255,0.10)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 16px rgba(124,77,255,0.15)',
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#F1EBFF',
          height: 8,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
  },
})

export default theme