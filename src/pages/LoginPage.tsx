import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import { sendOtp, verifyOtp } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = async () => {
    setError('')
    setLoading(true)
    try {
      await sendOtp(phone)
      setOtpSent(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await verifyOtp(phone, otp)
      if (result.success) {
        login(result.user)
        navigate('/orders', { replace: true })
      } else {
        setError('Verification failed. Please try again.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Verification failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="grey.100"
    >
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          MediFlow Pharmacist
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Phone Number"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={otpSent || loading}
          sx={{ mb: 2 }}
        />

        {!otpSent ? (
          <Button
            variant="contained"
            fullWidth
            onClick={handleSendOtp}
            disabled={!phone || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
          </Button>
        ) : (
          <>
            <TextField
              label="OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleVerify}
              disabled={!otp || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </>
        )}
      </Paper>
    </Box>
  )
}
