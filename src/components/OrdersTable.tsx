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
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import { getOrders, updateOrderStatus } from '../api/orders'
import type { Order } from '../types'

type ChipColor = 'default' | 'warning' | 'info' | 'success' | 'error'

function statusChipColor(status: string): ChipColor {
  switch (status) {
    case 'pending': return 'warning'
    case 'processing': return 'info'
    case 'ready': return 'success'
    case 'delivered': return 'success'
    case 'cancelled': return 'error'
    default: return 'default'
  }
}

const ORDER_STATUSES = ['pending', 'processing', 'ready', 'delivered', 'cancelled']

interface OrdersTableProps {
  title: string
  filterFn?: (order: Order) => boolean
  onFulfillRx?: (orderId: string) => void
}

export default function OrdersTable({ title, filterFn, onFulfillRx }: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Order | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    getOrders()
      .then((data) => {
        setOrders(data)
        setError('')
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load orders')
      })
      .finally(() => setLoading(false))
  }, [])

  const displayed = filterFn ? orders.filter(filterFn) : orders

  const handleRowClick = (order: Order) => {
    setSelected(order)
    setNewStatus(order.status)
    setDrawerOpen(true)
  }

  const handleSave = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const updated = await updateOrderStatus(selected._id, newStatus)
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)))
      setSelected(updated)
      setSnackOpen(true)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Typography variant="h5" mb={2}>{title}</Typography>

      {loading && <CircularProgress />}
      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayed.map((order) => (
                <TableRow key={order._id} hover sx={{ cursor: 'pointer' }}>
                  <TableCell>{order.patientName ?? '—'}</TableCell>
                  <TableCell>{order.patientPhone ?? '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={statusChipColor(order.status)}
                      variant={order.status === 'delivered' ? 'outlined' : 'filled'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleRowClick(order)}>
                      View
                    </Button>
                    {onFulfillRx && (order.hasPrescription || order.rxImageUrl) && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ ml: 1 }}
                        onClick={() => onFulfillRx(order._id)}
                      >
                        Fulfill Rx
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {displayed.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">No orders found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 400, p: 3 }}>
          {selected && (
            <>
              <Typography variant="h6" mb={1}>Order Details</Typography>
              <Typography><strong>Patient:</strong> {selected.patientName ?? '—'}</Typography>
              <Typography><strong>Phone:</strong> {selected.patientPhone ?? '—'}</Typography>
              <Typography><strong>Total:</strong> {selected.totalAmount != null ? `₹${selected.totalAmount}` : '—'}</Typography>
              <Typography><strong>Created:</strong> {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}</Typography>

              {selected.medicines && selected.medicines.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Medicines:</Typography>
                  {selected.medicines.map((m, i) => (
                    <Typography key={i} variant="body2">
                      {m.name} × {m.quantity}{m.price != null ? ` (₹${m.price})` : ''}
                    </Typography>
                  ))}
                </Box>
              )}

              {selected.rxImageUrl && (
                <Box mt={2}>
                  <Typography variant="subtitle2" mb={1}>Prescription:</Typography>
                  <img
                    src={selected.rxImageUrl}
                    alt="Prescription"
                    style={{ maxWidth: '100%', borderRadius: 4 }}
                  />
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  label="Status"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {ORDER_STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                onClick={handleSave}
                disabled={saving || newStatus === selected.status}
              >
                {saving ? <CircularProgress size={22} /> : 'Save Status'}
              </Button>
            </>
          )}
        </Box>
      </Drawer>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackOpen(false)}>
          Status updated successfully
        </Alert>
      </Snackbar>
    </Box>
  )
}
