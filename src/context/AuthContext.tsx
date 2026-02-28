import React, { createContext, useContext, useState, useCallback } from 'react'
import type { User, UserProfile } from '../types'

const STORAGE_KEY = 'mediflow_user'
const PROFILE_KEY = 'mediflow_profile'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  login: (user: User) => void
  logout: () => void
  saveProfile: (profile: UserProfile) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  })

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as UserProfile
    } catch {
      return null
    }
  })

  const login = useCallback((u: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const saveProfile = useCallback((p: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p))
    setProfile(p)
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, login, logout, saveProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
