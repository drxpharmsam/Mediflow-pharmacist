import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { getMedicines } from '../api/medicines'
import type { Medicine } from '../types'

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMedicines()
      .then((data) => {
        setMedicines(data)
        setError('')
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load medicines')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = medicines.filter((m) => {
    const q = search.toLowerCase()
    return m.name.toLowerCase().includes(q) || (m.category ?? '').toLowerCase().includes(q)
  })

  return (
    <Box>
      <Typography variant="h5" mb={2}>Inventory</Typography>

      <TextField
        label="Search by name or category"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: 320 }}
      />

      {loading && <CircularProgress />}
      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((med) => (
                <TableRow key={med._id} hover>
                  <TableCell>{med.name}</TableCell>
                  <TableCell>{med.category ?? '—'}</TableCell>
                  <TableCell>{med.price != null ? `₹${med.price}` : '—'}</TableCell>
                  <TableCell>{med.stock ?? '—'}</TableCell>
                  <TableCell>{med.description ?? '—'}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No medicines found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
