import OrdersTable from '../components/OrdersTable'
import type { Order } from '../types'

const filter = (order: Order) => order.hasPrescription === true || !!order.rxImageUrl

export default function PrescriptionsPage() {
  return <OrdersTable title="Prescriptions" filterFn={filter} />
}
