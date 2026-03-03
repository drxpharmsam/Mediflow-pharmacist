import client from './client'
import type { Medicine } from '../types'
import { isTestMode, MOCK_MEDICINES } from './mockData'

// In-memory store for mock medicines (supports CRUD during the session)
let mockMedicinesStore: Medicine[] = JSON.parse(JSON.stringify(MOCK_MEDICINES))
let mockIdCounter = 100

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MedicinePayload {
  name: string
  category?: string
  type?: string
  price?: number
  stock?: number
  description?: string
  imageUrl?: string
}

// ─── API functions ─────────────────────────────────────────────────────────────
// All functions call the real backend. To point at a different endpoint, change
// the path strings below (e.g. '/api/v2/medicines') or the baseURL in client.ts.

/** Fetch all medicines in the inventory */
export async function getMedicines(): Promise<Medicine[]> {
  if (isTestMode()) return Promise.resolve([...mockMedicinesStore])
  const res = await client.get<{ success: boolean; data: Medicine[] }>('/api/medicines')
  return res.data.data
}

/** Add a new medicine to the inventory (sends multipart/form-data when an image file is provided) */
export async function addMedicine(payload: MedicinePayload, imageFile?: File): Promise<Medicine> {
  if (isTestMode()) {
    const newMed: Medicine = {
      _id: `med_mock_${++mockIdCounter}`,
      name: payload.name,
      category: payload.category,
      type: payload.type,
      price: payload.price,
      stock: payload.stock,
      description: payload.description,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : payload.imageUrl,
    }
    mockMedicinesStore = [newMed, ...mockMedicinesStore]
    return Promise.resolve({ ...newMed })
  }
  if (imageFile) {
    const form = new FormData()
    Object.entries(payload).forEach(([k, v]) => {
      if (v != null) form.append(k, String(v))
    })
    form.append('image', imageFile)
    const res = await client.post<{ success: boolean; data: Medicine }>('/api/medicines', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  }
  const res = await client.post<{ success: boolean; data: Medicine }>('/api/medicines', payload)
  return res.data.data
}

/** Update an existing medicine by id */
export async function updateMedicine(
  id: string,
  payload: Partial<MedicinePayload>,
  imageFile?: File,
): Promise<Medicine> {
  if (isTestMode()) {
    const idx = mockMedicinesStore.findIndex((m) => m._id === id)
    if (idx === -1) throw new Error('Medicine not found')
    const updated: Medicine = {
      ...mockMedicinesStore[idx],
      ...payload,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : (payload.imageUrl ?? mockMedicinesStore[idx].imageUrl),
    }
    mockMedicinesStore[idx] = updated
    return Promise.resolve({ ...updated })
  }
  if (imageFile) {
    const form = new FormData()
    Object.entries(payload).forEach(([k, v]) => {
      if (v != null) form.append(k, String(v))
    })
    form.append('image', imageFile)
    const res = await client.put<{ success: boolean; data: Medicine }>(`/api/medicines/${id}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  }
  const res = await client.put<{ success: boolean; data: Medicine }>(`/api/medicines/${id}`, payload)
  return res.data.data
}

/** Delete a medicine by id */
export async function deleteMedicine(id: string): Promise<void> {
  if (isTestMode()) {
    mockMedicinesStore = mockMedicinesStore.filter((m) => m._id !== id)
    return Promise.resolve()
  }
  await client.delete(`/api/medicines/${id}`)
}
