import client from './client'
import type { Order, PrescriptionAlternative } from '../types'
import { isTestMode, MOCK_ORDERS } from './mockData'

// In-memory store for mock orders (supports status updates during the session)
let mockOrdersStore: Order[] = JSON.parse(JSON.stringify(MOCK_ORDERS))

export async function getOrders(): Promise<Order[]> {
  if (isTestMode()) return Promise.resolve([...mockOrdersStore])
  const res = await client.get<{ success: boolean; data: Order[] }>('/api/admin/orders')
  return res.data.data
}

export async function getOrderById(orderId: string): Promise<Order> {
  if (isTestMode()) {
    const found = mockOrdersStore.find((o) => o._id === orderId)
    if (!found) throw new Error('Order not found')
    return Promise.resolve({ ...found })
  }
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
  if (isTestMode()) {
    const idx = mockOrdersStore.findIndex((o) => o._id === orderId)
    if (idx === -1) throw new Error('Order not found')
    mockOrdersStore[idx] = { ...mockOrdersStore[idx], status, updatedAt: new Date().toISOString() }
    return Promise.resolve({ ...mockOrdersStore[idx] })
  }
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
  if (isTestMode()) {
    // Simulate a successful push in test mode
    return Promise.resolve()
  }
  await client.put(`/api/orders/${orderId}/alternatives`, { alternatives })
}
