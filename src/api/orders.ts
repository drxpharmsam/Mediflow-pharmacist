import client from './client'
import type { Order } from '../types'

export async function getOrders(): Promise<Order[]> {
  const res = await client.get<{ success: boolean; data: Order[] }>('/api/admin/orders')
  return res.data.data
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  const res = await client.put<Order>(`/api/orders/${orderId}/status`, { status })
  return res.data
}
