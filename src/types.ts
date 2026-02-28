export interface User {
  _id: string
  name?: string
  email?: string
  phone: string
  role?: string
  token?: string
}

export interface UserProfile {
  name: string
  age: string
  gender: string
  photo: string
  shopAddress: string
  location?: { lat: number; lng: number; accuracy: number }
}

export interface Order {
  _id: string
  patientName?: string
  patientPhone?: string
  status: string
  hasPrescription?: boolean
  rxImageUrl?: string
  medicines?: { name: string; quantity: number; price?: number }[]
  totalAmount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Medicine {
  _id: string
  name: string
  category?: string
  type?: string
  price?: number
  stock?: number
  description?: string
  imageUrl?: string
}
