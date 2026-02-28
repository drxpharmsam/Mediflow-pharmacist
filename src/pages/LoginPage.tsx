import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Chip from '@mui/material/Chip'
import ScienceIcon from '@mui/icons-material/Science'
import { useAuth } from '../context/AuthContext'
import { gradientBg, glassCard } from '../theme'
import type { User } from '../types'

const TEST_OTP = '123456'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, profile } = useAuth()

  const [tab, setTab] = useState(0)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = () => {
    setError('')
    if (!email || !phone) {
      setError('Please enter both email and phone number.')
      return
    }
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Please enter a valid Gmail address (e.g. name@gmail.com).')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
    }, 800)
  }

  const handleVerify = () => {
    setError('')
    if (otp !== TEST_OTP) {
      setError('Invalid OTP. (Hint: use 123456 in TEST mode)')
      return
    }
    setLoading(true)
    setTimeout(() => {
      const user: User = {
        _id: `test_${Date.now()}`,
        email,
        phone,
        name: email.split('@')[0],
        role: 'pharmacist',
        token: `test_token_${Date.now()}`,
      }
      login(user)
      setLoading(false)
      if (!profile) {
        navigate('/onboarding', { replace: true })
      } else {
        navigate('/orders', { replace: true })
      }
    }, 800)
  }

  const handleBack = () => {
    setStep('credentials')
    setOtp('')
    setError('')
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ background: gradientBg, p: 2 }}
    >
      <Box sx={{ ...glassCard, p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 400 }}>
        {/* Logo / Title */}
        <Typography variant="h5" textAlign="center" mb={0.5} color="primary.dark">
          💊 MediFlow
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={2}>
          Pharmacist Portal
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(_, v) => { setTab(v); setStep('credentials'); setError('') }}
          variant="fullWidth"
          sx={{ mb: 2.5, '& .MuiTabs-indicator': { background: 'linear-gradient(90deg,#C58BE5,#A8C0EE)' } }}
        >
          <Tab label="Sign In" />
          <Tab label="Register" />
        </Tabs>

        {/* TEST MODE chip */}
        <Box display="flex" justifyContent="center" mb={2}>
          <Chip
            icon={<ScienceIcon fontSize="small" />}
            label="TEST MODE — OTP: 123456"
            color="warning"
            size="small"
            sx={{ fontWeight: 600, fontSize: '0.72rem' }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 'credentials' ? (
          <>
            <TextField
              label="Gmail address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone number"
              type="tel"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              sx={{ mb: 2.5 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSendOtp}
              disabled={!email || !phone || loading}
              sx={{ py: 1.2 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Send OTP'}
            </Button>
          </>
        ) : (
          <>
            <Alert severity="info" sx={{ mb: 2 }} icon={<ScienceIcon />}>
              <strong>TEST MODE:</strong> OTPs have been "sent" to <em>{email}</em> and <em>{phone}</em>.{' '}
              Use <strong>123456</strong> for both.
            </Alert>
            <TextField
              label="Enter OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              inputProps={{ maxLength: 6, style: { letterSpacing: '0.3em', fontSize: '1.2rem' } }}
              sx={{ mb: 2.5 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleVerify}
              disabled={otp.length < 6 || loading}
              sx={{ py: 1.2, mb: 1 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Verify & Continue'}
            </Button>
            <Button fullWidth onClick={handleBack} disabled={loading} size="small">
              ← Back
            </Button>
          </>
        )}

        <Typography variant="caption" display="block" textAlign="center" mt={2} color="text.secondary">
          {tab === 0 ? 'New user? Click Register above.' : 'Already have an account? Click Sign In above.'}
        </Typography>
      </Box>
    </Box>
  )
}
