import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { userApi, authApi } from './api'
import type { User, AuthContextType } from '@/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchUser = async () => {
        try {
            const userData = await userApi.getCurrentUser()
            setUser(userData)
        } catch (error) {
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const login = async (email: string, password: string) => {
        await authApi.login(email, password)
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
                login,
                logout,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
