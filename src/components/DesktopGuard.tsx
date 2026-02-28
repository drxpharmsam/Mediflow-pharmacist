import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const MIN_WIDTH = 1100

export default function DesktopGuard({ children }: { children: React.ReactNode }) {
  const [width, setWidth] = useState(window.innerWidth)
  const [override, setOverride] = useState(false)

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  if (width < MIN_WIDTH && !override) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        p={3}
        textAlign="center"
        gap={2}
      >
        <Typography variant="h6">
          This app is designed for desktop use. Please use a screen width of at least 1100px.
        </Typography>
        <Button variant="outlined" onClick={() => setOverride(true)}>
          Continue anyway
        </Button>
      </Box>
    )
  }

  return <>{children}</>
}
