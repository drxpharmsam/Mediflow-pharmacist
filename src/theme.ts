import { createTheme } from '@mui/material/styles'

export const gradientBg = 'linear-gradient(135deg, #FFB7FD 0%, #C58BE5 50%, #A8C0EE 100%)'

export const glassCard = {
  background: 'rgba(255, 255, 255, 0.28)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  boxShadow: '0 8px 32px rgba(197, 139, 229, 0.18)',
} as const

export const theme = createTheme({
  palette: {
    primary: {
      light: '#FFB7FD',
      main: '#C58BE5',
      dark: '#9a5cc0',
      contrastText: '#2d1a40',
    },
    secondary: {
      main: '#A8C0EE',
      contrastText: '#1a2a40',
    },
    background: {
      default: '#f3eeff',
      paper: 'rgba(255,255,255,0.85)',
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(90deg, #C58BE5, #A8C0EE)',
          color: '#fff',
          '&:hover': { background: 'linear-gradient(90deg, #b079d1, #90aee0)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})
