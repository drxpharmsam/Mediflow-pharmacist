import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Avatar from '@mui/material/Avatar'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import { useAuth } from '../context/AuthContext'
import { gradientBg, glassCard } from '../theme'

const MIN_PHARMACIST_AGE = 18
const MAX_PHARMACIST_AGE = 100
const GEOLOCATION_TIMEOUT_MS = 12000
import type { UserProfile } from '../types'

const steps = ['Personal Info', 'Location']

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { saveProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeStep, setActiveStep] = useState(0)

  // Step 1 fields
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [photo, setPhoto] = useState('')
  const [shopAddress, setShopAddress] = useState('')
  const [step1Error, setStep1Error] = useState('')

  // Step 2 fields
  const [locLoading, setLocLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null)
  const [locError, setLocError] = useState('')

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleStep1Next = () => {
    setStep1Error('')
    if (!name.trim() || !age || !gender || !shopAddress.trim()) {
      setStep1Error('Please fill in all required fields.')
      return
    }
    setActiveStep(1)
  }

  const handleGetLocation = () => {
    setLocError('')
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.')
      return
    }
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        })
        setLocLoading(false)
      },
      (err) => {
        setLocError(`Could not get location: ${err.message}`)
        setLocLoading(false)
      },
      { timeout: GEOLOCATION_TIMEOUT_MS },
    )
  }

  const handleFinish = () => {
    const profile: UserProfile = {
      name: name.trim(),
      age,
      gender,
      photo,
      shopAddress: shopAddress.trim(),
      location: location ?? undefined,
    }
    saveProfile(profile)
    navigate('/orders', { replace: true })
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ background: gradientBg, p: 2 }}
    >
      <Box sx={{ ...glassCard, p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 480 }}>
        <Typography variant="h5" textAlign="center" mb={0.5} color="primary.dark">
          💊 MediFlow
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary" mb={3}>
          Let's set up your pharmacist profile
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <>
            {/* Photo upload */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                src={photo || undefined}
                sx={{ width: 84, height: 84, mb: 1, bgcolor: 'primary.light', cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraAltIcon />
              </Avatar>
              <Button
                size="small"
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<CameraAltIcon />}
              >
                Upload Photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
            </Box>

            <TextField
              label="Full Name *"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Age *"
              type="number"
              fullWidth
              value={age}
              onChange={(e) => setAge(e.target.value)}
              inputProps={{ min: MIN_PHARMACIST_AGE, max: MAX_PHARMACIST_AGE }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Gender *</InputLabel>
              <Select value={gender} label="Gender *" onChange={(e) => setGender(e.target.value)}>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Shop / Pharmacy Address *"
              fullWidth
              multiline
              rows={2}
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              sx={{ mb: 2.5 }}
            />

            {step1Error && <Alert severity="error" sx={{ mb: 2 }}>{step1Error}</Alert>}

            <Button variant="contained" fullWidth onClick={handleStep1Next} sx={{ py: 1.2 }}>
              Next →
            </Button>
          </>
        )}

        {activeStep === 1 && (
          <>
            <Typography variant="body1" mb={2} textAlign="center" color="text.secondary">
              We need your shop location to help customers find you.
            </Typography>

            {locError && <Alert severity="error" sx={{ mb: 2 }}>{locError}</Alert>}

            {location ? (
              <Box
                sx={{
                  ...glassCard,
                  p: 2,
                  mb: 3,
                  background: 'rgba(168,192,238,0.25)',
                  textAlign: 'center',
                }}
              >
                <LocationOnIcon color="primary" sx={{ fontSize: 36, mb: 0.5 }} />
                <Typography variant="body2">
                  <strong>Lat:</strong> {location.lat.toFixed(6)}, <strong>Lng:</strong> {location.lng.toFixed(6)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Accuracy: ±{location.accuracy} m
                </Typography>
                <br />
                <Button
                  size="small"
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 0.5 }}
                >
                  View on Google Maps ↗
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGetLocation}
                disabled={locLoading}
                startIcon={locLoading ? <CircularProgress size={18} /> : <LocationOnIcon />}
                sx={{ mb: 3, py: 1.2 }}
              >
                {locLoading ? 'Getting location…' : 'Request Location Permission'}
              </Button>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleFinish}
              sx={{ py: 1.2, mb: 1 }}
            >
              Finish Setup →
            </Button>
            <Button fullWidth onClick={() => setActiveStep(0)} size="small">
              ← Back
            </Button>
          </>
        )}
      </Box>
    </Box>
  )
}
