import { useNavigate } from 'react-router-dom'
import OrdersTable from '../components/OrdersTable'
import type { Order } from '../types'

const filter = (order: Order) => order.hasPrescription === true || !!order.rxImageUrl

export default function PrescriptionsPage() {
  const navigate = useNavigate()
  return (
    <OrdersTable
      title="Prescriptions"
      filterFn={filter}
      onFulfillRx={(orderId) => navigate(`/prescriptions/${orderId}/fulfill`)}
    />
  )
}
