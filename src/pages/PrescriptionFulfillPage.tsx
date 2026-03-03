/**
 * PrescriptionFulfillPage
 *
 * Workflow:
 *  1. Pharmacist opens this page from a prescription order.
 *  2. For each medicine listed in the prescription the pharmacist searches the
 *     inventory by salt name / salt strength / brand name.
 *  3. They select MULTIPLE matching brands to build an "options pool" per medicine.
 *  4. Clicking "Push Options to Customer" sends that pool to the customer panel.
 *  5. The CUSTOMER then picks their preferred brand from the offered options.
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'
import SendIcon from '@mui/icons-material/Send'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { getOrderById, pushAlternatives } from '../api/orders'
import { getMedicines } from '../api/medicines'
import type { Order, Medicine } from '../types'

// ─── Constants ────────────────────────────────────────────────────────────────

/** How many trailing characters of the order ID to display in the header */
const ORDER_ID_DISPLAY_LENGTH = 8

/** ms to wait after a successful push before navigating back (matches Snackbar autoHideDuration) */
const PUSH_SUCCESS_REDIRECT_MS = 3000

// ─── Local types ──────────────────────────────────────────────────────────────

/** One row = one medicine from the prescription + the brand options the pharmacist curates */
interface FulfillRow {
  /** Medicine name / salt as written in the prescription */
  prescribedName: string
  /** Quantity from the prescription */
  prescribedQty: number
  /** Pool of brand alternatives the pharmacist is offering to the customer */
  options: Medicine[]
  /** Controlled search input value for this row's autocomplete */
  searchInput: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PrescriptionFulfillPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  const [order, setOrder] = useState<Order | null>(null)
  const [inventory, setInventory] = useState<Medicine[]>([])
  const [loadingOrder, setLoadingOrder] = useState(true)
  const [loadingMeds, setLoadingMeds] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [rows, setRows] = useState<FulfillRow[]>([])

  const [pushing, setPushing] = useState(false)
  const [pushSuccess, setPushSuccess] = useState(false)
  const [pushError, setPushError] = useState('')

  // ── Load order ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!orderId) return
    setLoadingOrder(true)
    getOrderById(orderId)
      .then((o) => {
        setOrder(o)
        // Bootstrap one row per prescribed medicine
        const initial: FulfillRow[] = (o.medicines ?? []).map((m) => ({
          prescribedName: m.name,
          prescribedQty: m.quantity,
          options: [],
          searchInput: '',
        }))
        setRows(initial)
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : 'Failed to load order')
      })
      .finally(() => setLoadingOrder(false))
  }, [orderId])

  // ── Load inventory ──────────────────────────────────────────────────────────
  useEffect(() => {
    setLoadingMeds(true)
    getMedicines()
      .then(setInventory)
      .catch(() => {})
      .finally(() => setLoadingMeds(false))
  }, [])

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /** Filter inventory by query (name, salt, category, description) */
  const filterInventory = (query: string): Medicine[] => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return inventory.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.salt ?? '').toLowerCase().includes(q) ||
        (m.saltStrength ?? '').toLowerCase().includes(q) ||
        (m.category ?? '').toLowerCase().includes(q) ||
        (m.type ?? '').toLowerCase().includes(q) ||
        (m.description ?? '').toLowerCase().includes(q),
    )
  }

  const handleSelectOption = (rowIdx: number, med: Medicine) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== rowIdx) return row
        // Avoid duplicates
        if (row.options.some((o) => o._id === med._id)) return { ...row, searchInput: '' }
        return { ...row, options: [...row.options, med], searchInput: '' }
      }),
    )
  }

  const handleRemoveOption = (rowIdx: number, medId: string) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i !== rowIdx ? row : { ...row, options: row.options.filter((o) => o._id !== medId) },
      ),
    )
  }

  const handleSearchInput = (rowIdx: number, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => (i !== rowIdx ? row : { ...row, searchInput: value })),
    )
  }

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { prescribedName: '', prescribedQty: 1, options: [], searchInput: '' },
    ])
  }

  const handleRemoveRow = (rowIdx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== rowIdx))
  }

  const handlePrescribedNameChange = (rowIdx: number, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => (i !== rowIdx ? row : { ...row, prescribedName: value })),
    )
  }

  // ── Push ────────────────────────────────────────────────────────────────────

  const totalOptions = rows.reduce((sum, r) => sum + r.options.length, 0)

  const handlePush = async () => {
    if (!orderId) return
    setPushing(true)
    setPushError('')
    try {
      await pushAlternatives(
        orderId,
        rows
          .filter((r) => r.options.length > 0)
          .map((r) => ({
            prescribedName: r.prescribedName,
            alternatives: r.options.map((med) => ({
              medicineId: med._id,
              brandName: med.name,
              qty: r.prescribedQty,
              price: med.price,
            })),
          })),
      )
      setPushSuccess(true)
      setTimeout(() => navigate('/prescriptions'), PUSH_SUCCESS_REDIRECT_MS)
    } catch (err: unknown) {
      setPushError(err instanceof Error ? err.message : 'Failed to push options to customer')
    } finally {
      setPushing(false)
    }
  }

  // ── Render: loading / error ──────────────────────────────────────────────────

  if (loadingOrder || loadingMeds) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    )
  }

  if (loadError) {
    return (
      <Box mt={3}>
        <Alert severity="error">{loadError}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/prescriptions')} sx={{ mt: 2 }}>
          Back to Prescriptions
        </Button>
      </Box>
    )
  }

  // ── Render: main UI ──────────────────────────────────────────────────────────

  return (
    <Box sx={{ maxWidth: 860, mx: 'auto' }}>
      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <IconButton onClick={() => navigate('/prescriptions')}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Fulfill Prescription
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Order #{orderId?.slice(-ORDER_ID_DISPLAY_LENGTH).toUpperCase()} &mdash; {order?.patientName ?? 'Unknown Patient'}
          </Typography>
        </Box>
      </Box>

      {/* ── Info banner ──────────────────────────────────────────────────────── */}
      <Alert
        icon={<InfoOutlinedIcon />}
        severity="info"
        sx={{ mb: 2, borderRadius: 2 }}
      >
        Search your inventory for medicines with the <strong>same salt &amp; salt strength</strong> as each
        prescribed medicine, then add them as <strong>brand options</strong>. The customer will choose their
        preferred brand from the options you push.
      </Alert>

      {/* ── Order info strip ─────────────────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f0e8ff, #dde9ff)',
          border: '1px solid rgba(197,139,229,0.22)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { label: 'Patient', value: order?.patientName ?? '—' },
            { label: 'Phone', value: order?.patientPhone ?? '—' },
            { label: 'Status', value: order?.status ?? '—' },
            {
              label: 'Date',
              value: order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—',
            },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography fontWeight={600}>{value}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* ── Prescription image ───────────────────────────────────────────────── */}
      {order?.rxImageUrl && (
        <Paper
          elevation={0}
          sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            📋 Prescription Image
          </Typography>
          <img
            src={order.rxImageUrl}
            alt="Prescription"
            style={{ maxWidth: '100%', maxHeight: 380, borderRadius: 8 }}
          />
        </Paper>
      )}

      {/* ── Medicine rows ────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          💊 Build Options per Prescribed Medicine
        </Typography>
        <Tooltip title="Add a medicine row manually">
          <Button
            size="small"
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddRow}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Add Row
          </Button>
        </Tooltip>
      </Box>

      {rows.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          No medicines are listed in this prescription order. Use <strong>Add Row</strong> to add
          them manually, or ask the patient to re-upload the prescription with medicine details.
        </Alert>
      )}

      {rows.map((row, idx) => (
        <Card
          key={idx}
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 2,
            border: '1px solid rgba(197,139,229,0.25)',
            '&:hover': { boxShadow: '0 2px 12px rgba(197,139,229,0.15)' },
            transition: 'box-shadow 0.2s',
          }}
        >
          <CardContent sx={{ pb: '16px !important' }}>
            {/* Row header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
              <Box sx={{ flex: 1, mr: 2 }}>
                <TextField
                  label="Prescribed medicine / salt name"
                  size="small"
                  value={row.prescribedName}
                  onChange={(e) => handlePrescribedNameChange(idx, e.target.value)}
                  fullWidth
                  placeholder="e.g. Amoxicillin 500mg"
                  sx={{ mb: 0 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                <Chip
                  label={`Qty: ${row.prescribedQty}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`${row.options.length} option${row.options.length !== 1 ? 's' : ''}`}
                  size="small"
                  color={row.options.length > 0 ? 'success' : 'default'}
                />
                {rows.length > 1 && (
                  <Tooltip title="Remove this row">
                    <IconButton size="small" onClick={() => handleRemoveRow(idx)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>

            {/* Inventory search autocomplete */}
            <Autocomplete
              options={filterInventory(row.searchInput)}
              getOptionLabel={(m) =>
                `${m.name}${m.salt ? ` (${m.salt}${m.saltStrength ? ' ' + m.saltStrength : ''})` : ''}${m.category ? ' · ' + m.category : ''}`
              }
              inputValue={row.searchInput}
              onInputChange={(_, val) => handleSearchInput(idx, val)}
              onChange={(_, med) => {
                if (med) handleSelectOption(idx, med)
              }}
              value={null}
              filterOptions={(opts) => opts}
              noOptionsText={
                row.searchInput.trim()
                  ? 'No medicines found — try another salt name or brand'
                  : 'Type a salt name, brand, or category to search inventory…'
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Search inventory by salt, brand, or category"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <SearchIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, m) => (
                <li {...props} key={m._id}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {m.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {[
                        m.salt && `Salt: ${m.salt}${m.saltStrength ? ' ' + m.saltStrength : ''}`,
                        m.category,
                        m.type,
                        m.stock != null && `Stock: ${m.stock}`,
                        m.price != null && `₦${m.price}`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </Typography>
                  </Box>
                </li>
              )}
              sx={{ mb: 1.5 }}
            />

            {/* Selected brand options */}
            {row.options.length > 0 ? (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
                  Brand options for customer to choose from:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {row.options.map((med) => (
                    <Chip
                      key={med._id}
                      label={`${med.name}${med.price != null ? ` — ₦${med.price}` : ''}`}
                      onDelete={() => handleRemoveOption(idx, med._id)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography variant="caption" color="text.disabled" fontStyle="italic">
                No options added yet — search and select alternative brands above.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* ── Push section ─────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
        {pushError && (
          <Alert severity="error" sx={{ width: '100%', borderRadius: 2 }}>
            {pushError}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" textAlign="right">
          {totalOptions > 0
            ? `${totalOptions} brand option${totalOptions !== 1 ? 's' : ''} across ${rows.filter((r) => r.options.length > 0).length} medicine${rows.filter((r) => r.options.length > 0).length !== 1 ? 's' : ''} will be sent to the customer.`
            : 'Add at least one brand option to enable push.'}
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={
            pushing ? <CircularProgress size={18} color="inherit" /> : <SendIcon />
          }
          onClick={handlePush}
          disabled={pushing || totalOptions === 0}
          sx={{
            background: 'linear-gradient(90deg, #C58BE5, #A8C0EE)',
            borderRadius: 2,
            px: 4,
            fontWeight: 700,
            '&:hover': { background: 'linear-gradient(90deg, #b070d4, #90aadf)' },
            '&.Mui-disabled': { opacity: 0.5 },
          }}
        >
          Push Brand Options to Customer
        </Button>
      </Box>

      {/* ── Success toast ─────────────────────────────────────────────────────── */}
      <Snackbar
        open={pushSuccess}
        autoHideDuration={PUSH_SUCCESS_REDIRECT_MS}
        onClose={() => setPushSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setPushSuccess(false)}>
          Brand options pushed to customer! Redirecting…
        </Alert>
      </Snackbar>
    </Box>
  )
}
