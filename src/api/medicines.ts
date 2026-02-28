import client from './client'
import type { Medicine } from '../types'

export async function getMedicines(): Promise<Medicine[]> {
  const res = await client.get<{ success: boolean; data: Medicine[] }>('/api/medicines')
  return res.data.data
}
