import client from './client'
import type { User } from '../types'

export async function sendOtp(phone: string): Promise<void> {
  await client.post('/api/auth/send-otp', { phone })
}

export async function verifyOtp(
  phone: string,
  otp: string,
): Promise<{ success: boolean; isNewUser: boolean; user: User }> {
  const res = await client.post<{ success: boolean; isNewUser: boolean; user: User }>(
    '/api/auth/verify',
    { phone, otp },
  )
  return res.data
}
