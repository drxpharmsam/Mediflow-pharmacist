import { createTheme } from '@mui/material/styles'

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
      default: '#f8f6fc',
      paper: '#ffffff',
    },
  },
})
