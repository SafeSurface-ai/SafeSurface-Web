import { UserRole } from '@/constants/permissions'

// ========== User Types ==========
export interface User {
    id: number
    email: string
    username: string
    is_active: boolean
    is_superuser: boolean
    roles?: UserRole[]
    created_at: string
    updated_at: string
}

export interface UserCreate {
    email: string
    username: string
    password: string
    roles?: UserRole[]
}

export interface UserUpdate {
    email?: string
    username?: string
    password?: string
    roles?: UserRole[]
}

// ========== Auth Types ==========
export interface LoginResponse {
    access_token: string
    token_type: string
}

export interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isLoading: boolean
}

// ========== Task Types ==========
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface Task {
    id: number
    name: string
    status: TaskStatus
    created_at: string
    updated_at: string
}

// ========== API Types ==========
export interface ApiResponse<T = any> {
    code: number
    data: T
    message: string
}

export interface PaginationParams {
    page: number
    pageSize: number
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}
