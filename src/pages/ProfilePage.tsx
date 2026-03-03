import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import DescriptionIcon from '@mui/icons-material/Description'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PaymentsIcon from '@mui/icons-material/Payments'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { useAuth } from '../context/AuthContext'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      sx={{ pt: 3 }}
    >
      {value === index && children}
    </Box>
  )
}

const SAMPLE_PRESCRIPTIONS = [
  { id: 'RX-001', patient: 'Alice Johnson', medicine: 'Amoxicillin 500mg', qty: 20, date: '2026-02-28', status: 'Filled' },
  { id: 'RX-002', patient: 'Bob Smith', medicine: 'Lisinopril 10mg', qty: 30, date: '2026-03-01', status: 'Pending' },
  { id: 'RX-003', patient: 'Carol White', medicine: 'Metformin 850mg', qty: 60, date: '2026-03-02', status: 'Filled' },
  { id: 'RX-004', patient: 'David Brown', medicine: 'Atorvastatin 20mg', qty: 30, date: '2026-03-03', status: 'Processing' },
]

const SAMPLE_ORDERS = [
  { id: 'ORD-101', patient: 'Alice Johnson', amount: 1500, status: 'Delivered', date: '2026-02-28' },
  { id: 'ORD-102', patient: 'Bob Smith', amount: 850, status: 'Processing', date: '2026-03-01' },
  { id: 'ORD-103', patient: 'Carol White', amount: 2200, status: 'Pending', date: '2026-03-02' },
  { id: 'ORD-104', patient: 'David Brown', amount: 950, status: 'Delivered', date: '2026-03-03' },
]

const MONTHLY_EARNINGS = [
  { month: 'October 2025', orders: 48, revenue: '₦72,400' },
  { month: 'November 2025', orders: 55, revenue: '₦83,150' },
  { month: 'December 2025', orders: 70, revenue: '₦105,000' },
  { month: 'January 2026', orders: 62, revenue: '₦93,600' },
  { month: 'February 2026', orders: 58, revenue: '₦87,200' },
  { month: 'March 2026', orders: 21, revenue: '₦31,500' },
]

function statusChip(status: string) {
  const map: Record<string, 'success' | 'warning' | 'info' | 'error'> = {
    Filled: 'success',
    Delivered: 'success',
    Pending: 'warning',
    Processing: 'info',
    Cancelled: 'error',
  }
  return <Chip label={status} color={map[status] ?? 'default'} size="small" />
}

function orderStatusIcon(status: string) {
  if (status === 'Delivered') return <CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />
  if (status === 'Processing') return <LocalShippingIcon fontSize="small" sx={{ color: 'info.main' }} />
  return <HourglassEmptyIcon fontSize="small" sx={{ color: 'warning.main' }} />
}

export default function ProfilePage() {
  const [tab, setTab] = useState(0)
  const { user, profile } = useAuth()

  const displayName = profile?.name || user?.name || user?.phone || 'Pharmacist'
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('')

  const totalRevenue = SAMPLE_ORDERS.filter((o) => o.status === 'Delivered').reduce((sum, o) => sum + o.amount, 0)
  const pendingOrders = SAMPLE_ORDERS.filter((o) => o.status !== 'Delivered').length
  const filledRx = SAMPLE_PRESCRIPTIONS.filter((r) => r.status === 'Filled').length

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Profile header card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f0e8ff 0%, #dde9ff 100%)',
          border: '1px solid rgba(197,139,229,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Avatar
          src={profile?.photo || undefined}
          sx={{
            width: 80,
            height: 80,
            fontSize: 28,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #C58BE5, #A8C0EE)',
            border: '3px solid #fff',
            boxShadow: '0 4px 14px rgba(197,139,229,0.4)',
          }}
        >
          {initials}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            {displayName}
          </Typography>
          {profile?.shopAddress && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              📍 {profile.shopAddress}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" mt={0.25}>
            📞 {user?.phone ?? '—'}
          </Typography>
        </Box>
      </Paper>

      {/* Summary stat cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Filled Prescriptions', value: filledRx, color: '#C58BE5' },
          { label: 'Active Orders', value: SAMPLE_ORDERS.length, color: '#A8C0EE' },
          { label: 'Pending', value: pendingOrders, color: '#FFB347' },
          { label: "This Month's Revenue", value: `₦${totalRevenue.toLocaleString()}`, color: '#7ECA9C' },
        ].map((card) => (
          <Grid item xs={6} sm={3} key={card.label}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid rgba(0,0,0,0.07)',
                textAlign: 'center',
              }}
            >
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: card.color }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid rgba(197,139,229,0.2)',
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            background: 'linear-gradient(90deg, rgba(197,139,229,0.08), rgba(168,192,238,0.08))',
            borderBottom: '1px solid rgba(197,139,229,0.2)',
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minHeight: 52 },
            '& .Mui-selected': { color: '#C58BE5' },
            '& .MuiTabs-indicator': { backgroundColor: '#C58BE5' },
          }}
        >
          <Tab
            icon={<DescriptionIcon fontSize="small" />}
            iconPosition="start"
            label="Prescriptions"
            id="profile-tab-0"
            aria-controls="profile-tabpanel-0"
          />
          <Tab
            icon={<AssignmentIcon fontSize="small" />}
            iconPosition="start"
            label="Order Status"
            id="profile-tab-1"
            aria-controls="profile-tabpanel-1"
          />
          <Tab
            icon={<PaymentsIcon fontSize="small" />}
            iconPosition="start"
            label="Earnings"
            id="profile-tab-2"
            aria-controls="profile-tabpanel-2"
          />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {/* Prescriptions tab */}
          <TabPanel value={tab} index={0}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Rx ID', 'Patient', 'Medicine', 'Qty', 'Date', 'Status'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SAMPLE_PRESCRIPTIONS.map((rx) => (
                    <TableRow key={rx.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{rx.id}</TableCell>
                      <TableCell>{rx.patient}</TableCell>
                      <TableCell>{rx.medicine}</TableCell>
                      <TableCell>{rx.qty}</TableCell>
                      <TableCell>{rx.date}</TableCell>
                      <TableCell>{statusChip(rx.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Order Status tab */}
          <TabPanel value={tab} index={1}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Order ID', 'Patient', 'Amount (₦)', 'Date', 'Status'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SAMPLE_ORDERS.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{order.id}</TableCell>
                      <TableCell>{order.patient}</TableCell>
                      <TableCell>₦{order.amount.toLocaleString()}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {orderStatusIcon(order.status)}
                          {statusChip(order.status)}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* Earnings tab */}
          <TabPanel value={tab} index={2}>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {[
                { label: 'Total Revenue (All Time)', value: '₦473,950', highlight: true },
                { label: 'This Month', value: '₦31,500', highlight: false },
                { label: 'Avg. Order Value', value: '₦1,375', highlight: false },
              ].map((stat) => (
                <Grid item xs={12} sm={4} key={stat.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      textAlign: 'center',
                      background: stat.highlight
                        ? 'linear-gradient(135deg, rgba(197,139,229,0.15), rgba(168,192,238,0.15))'
                        : undefined,
                      border: '1px solid rgba(0,0,0,0.07)',
                    }}
                  >
                    <Typography variant="h6" fontWeight={800} color={stat.highlight ? 'primary.dark' : 'text.primary'}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ mb: 2 }} />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Month', 'Orders Filled', 'Revenue'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: 12 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MONTHLY_EARNINGS.map((row) => (
                    <TableRow key={row.month} hover>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.orders}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'success.dark' }}>{row.revenue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      </Paper>
    </Box>
  )
}
