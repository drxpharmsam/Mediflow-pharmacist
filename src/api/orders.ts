import client from './client'
import type { Order, PrescriptionAlternative } from '../types'

export async function getOrders(): Promise<Order[]> {
  const res = await client.get<{ success: boolean; data: Order[] }>('/api/admin/orders')
  return res.data.data
}

export async function getOrderById(orderId: string): Promise<Order> {
  try {
    const res = await client.get<{ success: boolean; data: Order }>(`/api/orders/${orderId}`)
    return res.data.data
  } catch (primaryErr) {
    // Single-order endpoint may not exist; fall back to fetching all orders
    try {
      const all = await getOrders()
      const found = all.find((o) => o._id === orderId)
      if (!found) throw new Error('Order not found')
      return found
    } catch {
      // Re-throw the original error for better diagnostics
      throw primaryErr
    }
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  const res = await client.put<Order>(`/api/orders/${orderId}/status`, { status })
  return res.data
}

/**
 * Push a list of same-salt/strength brand options per prescribed medicine to the
 * customer panel so the customer can choose their preferred brand.
 */
export async function pushAlternatives(
  orderId: string,
  alternatives: PrescriptionAlternative[],
): Promise<void> {
  await client.put(`/api/orders/${orderId}/alternatives`, { alternatives })
}
