'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { userApi, authApi } from '@/lib/api'
import type { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const userData = await userApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (username: string, password: string) => {
    await authApi.login(username, password)
    await fetchUser()
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
