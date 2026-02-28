import { useState, useEffect, useRef, ChangeEvent } from 'react'
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
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import Autocomplete from '@mui/material/Autocomplete'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ImageIcon from '@mui/icons-material/Image'
import LockIcon from '@mui/icons-material/Lock'
import { useAuth } from '../context/AuthContext'
import { getMedicines, addMedicine, updateMedicine, deleteMedicine } from '../api/medicines'
import type { Medicine } from '../types'
import type { MedicinePayload } from '../api/medicines'

// ─── Preset options ────────────────────────────────────────────────────────────
const CATEGORY_PRESETS = [
  'Cough', 'Allergy', 'Headache', 'Fever', 'Infection',
  'Diabetes', 'Pain', 'Hypertension', 'Asthma',
]

const TYPE_PRESETS = ['Tablet', 'Syrup', 'Capsule', 'Ointment', 'Injection', 'Other']

// ─── Empty form state ──────────────────────────────────────────────────────────
const EMPTY_FORM: MedicinePayload = {
  name: '',
  category: '',
  type: '',
  price: undefined,
  stock: undefined,
  description: '',
  imageUrl: '',
}

// ─── Roles allowed to access this page ────────────────────────────────────────
const ALLOWED_ROLES = ['pharmacist', 'admin']

export default function InventoryPage() {
  const { user } = useAuth()

  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  // Add / Edit form state
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Medicine | null>(null)
  const [form, setForm] = useState<MedicinePayload>(EMPTY_FORM)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null)
  const [deleting, setDeleting] = useState(false)

  // ── Role guard ─────────────────────────────────────────────────────────────
  const isAllowed = ALLOWED_ROLES.includes((user?.role ?? '').toLowerCase())

  // ── Revoke object URL when imagePreview changes or component unmounts ──────
  useEffect(() => {
    const url = imagePreview
    // Only revoke blob URLs (not remote URLs from existing medicine records)
    return () => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url)
    }
  }, [imagePreview])

  // ── Load medicines ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAllowed) return
    getMedicines()
      .then((data) => { setMedicines(data); setError('') })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load medicines')
      })
      .finally(() => setLoading(false))
  }, [isAllowed])

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = medicines.filter((m) => {
    const q = search.toLowerCase()
    return (
      m.name.toLowerCase().includes(q) ||
      (m.category ?? '').toLowerCase().includes(q) ||
      (m.type ?? '').toLowerCase().includes(q)
    )
  })

  // ── Form helpers ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview('')
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (med: Medicine) => {
    setEditTarget(med)
    setForm({
      name: med.name,
      category: med.category ?? '',
      type: med.type ?? '',
      price: med.price,
      stock: med.stock,
      description: med.description ?? '',
      imageUrl: med.imageUrl ?? '',
    })
    setImageFile(null)
    setImagePreview(med.imageUrl ?? '')
    setFormError('')
    setFormOpen(true)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Validate: image only, max 5 MB
    if (!file.type.startsWith('image/')) {
      setFormError('Only image files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be smaller than 5 MB.')
      return
    }
    setFormError('')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview('')
    setForm((f) => ({ ...f, imageUrl: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const validateForm = (): boolean => {
    if (!form.name.trim()) { setFormError('Name is required.'); return false }
    if (form.price == null || isNaN(Number(form.price)) || Number(form.price) < 0) {
      setFormError('Price must be a valid non-negative number.'); return false
    }
    if (form.stock == null || isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      setFormError('Quantity must be a valid non-negative number.'); return false
    }
    return true
  }

  const handleSave = async () => {
    setFormError('')
    if (!validateForm()) return
    setSaving(true)
    try {
      const payload: MedicinePayload = {
        ...form,
        price: form.price != null ? Number(form.price) : undefined,
        stock: form.stock != null ? Number(form.stock) : undefined,
      }
      if (editTarget) {
        const updated = await updateMedicine(editTarget._id, payload, imageFile ?? undefined)
        setMedicines((prev) => prev.map((m) => (m._id === updated._id ? updated : m)))
      } else {
        const created = await addMedicine(payload, imageFile ?? undefined)
        setMedicines((prev) => [created, ...prev])
      }
      setFormOpen(false)
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save medicine.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete helpers ─────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMedicine(deleteTarget._id)
      setMedicines((prev) => prev.filter((m) => m._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete medicine.')
    } finally {
      setDeleting(false)
    }
  }

  // ── Render: access denied ──────────────────────────────────────────────────
  if (!isAllowed) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
        gap={2}
      >
        <LockIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
        <Typography variant="h6" color="text.secondary">
          Access Restricted
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Only pharmacists and admins can manage the inventory.
        </Typography>
      </Box>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box>
      {/* Header row */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
        <Typography variant="h5" fontWeight={700}>
          💊 Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{ borderRadius: 2 }}
        >
          Add Medicine
        </Button>
      </Box>

      {/* Search */}
      <TextField
        label="Search by name, category, or type"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: { xs: '100%', sm: 360 } }}
      />

      {/* Status */}
      {loading && <CircularProgress />}
      {!loading && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Table */}
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(197,139,229,0.12)' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg,rgba(197,139,229,0.12),rgba(168,192,238,0.12))' }}>
                <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((med) => (
                <TableRow key={med._id} hover>
                  <TableCell>
                    {med.imageUrl ? (
                      <Avatar
                        src={med.imageUrl}
                        variant="rounded"
                        sx={{ width: 48, height: 48 }}
                        alt={med.name}
                      />
                    ) : (
                      <Avatar variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'grey.100' }}>
                        <ImageIcon sx={{ color: 'text.disabled' }} />
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{med.name}</TableCell>
                  <TableCell>
                    {med.category ? <Chip label={med.category} size="small" color="secondary" variant="outlined" /> : '—'}
                  </TableCell>
                  <TableCell>
                    {med.type ? <Chip label={med.type} size="small" variant="outlined" /> : '—'}
                  </TableCell>
                  <TableCell>{med.price != null ? `₹${med.price}` : '—'}</TableCell>
                  <TableCell>{med.stock ?? '—'}</TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {med.description ?? '—'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(med)} color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setDeleteTarget(med)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No medicines found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ── Add / Edit Dialog ─────────────────────────────────────────────── */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editTarget ? 'Edit Medicine' : 'Add Medicine'}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <TextField
            label="Name"
            required
            fullWidth
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            sx={{ mb: 2 }}
          />

          {/* Category autocomplete with presets + free entry */}
          <Autocomplete
            freeSolo
            options={CATEGORY_PRESETS}
            value={form.category ?? ''}
            onInputChange={(_, val) => setForm((f) => ({ ...f, category: val }))}
            renderInput={(params) => (
              <TextField {...params} label="Medical Condition / Category" fullWidth sx={{ mb: 2 }} />
            )}
          />

          {/* Type autocomplete with presets + free entry */}
          <Autocomplete
            freeSolo
            options={TYPE_PRESETS}
            value={form.type ?? ''}
            onInputChange={(_, val) => setForm((f) => ({ ...f, type: val }))}
            renderInput={(params) => (
              <TextField {...params} label="Type" fullWidth sx={{ mb: 2 }} />
            )}
          />

          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Price"
              required
              type="number"
              value={form.price ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value === '' ? undefined : Number(e.target.value) }))}
              inputProps={{ min: 0, step: 0.01 }}
              InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Quantity (Stock)"
              required
              type="number"
              value={form.stock ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value === '' ? undefined : Number(e.target.value) }))}
              inputProps={{ min: 0 }}
              sx={{ flex: 1 }}
            />
          </Box>

          <TextField
            label="Description (optional)"
            fullWidth
            multiline
            rows={2}
            value={form.description ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            sx={{ mb: 2 }}
          />

          {/* Image upload */}
          <Box mb={1}>
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Image (optional, max 5 MB, image files only)
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                size="small"
                component="label"
                startIcon={<ImageIcon />}
              >
                {imagePreview ? 'Change Image' : 'Upload Image'}
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                />
              </Button>
              {imagePreview && (
                <Button size="small" color="error" onClick={clearImage}>
                  Remove
                </Button>
              )}
            </Box>
            {imagePreview && (
              <Box mt={1.5}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8, border: '1px solid #e0e0e0' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setFormOpen(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Medicine'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────────────────── */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs">
        <DialogTitle>Delete Medicine?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
