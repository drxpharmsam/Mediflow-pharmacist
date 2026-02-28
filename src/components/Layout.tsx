import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import AssignmentIcon from '@mui/icons-material/Assignment'
import DescriptionIcon from '@mui/icons-material/Description'
import MedicationIcon from '@mui/icons-material/Medication'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../context/AuthContext'

const DRAWER_WIDTH = 220

const navItems = [
  { label: 'Orders', path: '/orders', icon: <AssignmentIcon /> },
  { label: 'Prescriptions', path: '/prescriptions', icon: <DescriptionIcon /> },
  { label: 'Inventory', path: '/inventory', icon: <MedicationIcon /> },
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const currentNavIndex = navItems.findIndex((item) => location.pathname === item.path)

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pb: 7 }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'linear-gradient(90deg, #C58BE5, #A8C0EE)',
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              💊 MediFlow
            </Typography>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
          <Outlet />
        </Box>

        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }}
          elevation={3}
        >
          <BottomNavigation
            value={currentNavIndex === -1 ? false : currentNavIndex}
            onChange={(_, idx) => navigate(navItems[idx].path)}
            sx={{ background: 'linear-gradient(90deg, #f0e8ff, #dde9ff)' }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={item.icon}
                sx={{ '&.Mui-selected': { color: '#C58BE5' } }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #C58BE5, #A8C0EE)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            💊 MediFlow Pharmacist
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(197,139,229,0.18)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  '&.Mui-selected': {
                    background: 'linear-gradient(90deg, rgba(197,139,229,0.18), rgba(168,192,238,0.18))',
                    color: 'primary.dark',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider />
          <List>
            <ListItemButton
              onClick={handleLogout}
              sx={{ borderRadius: 2, mx: 1, my: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}
