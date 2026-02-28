import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from './context/AuthContext'
import { theme } from './theme'
import DesktopGuard from './components/DesktopGuard'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import PrescriptionsPage from './pages/PrescriptionsPage'
import InventoryPage from './pages/InventoryPage'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <DesktopGuard>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/orders" replace />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="prescriptions" element={<PrescriptionsPage />} />
                <Route path="inventory" element={<InventoryPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/orders" replace />} />
            </Routes>
          </DesktopGuard>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
