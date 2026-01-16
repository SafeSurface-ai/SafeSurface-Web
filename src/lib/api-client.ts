import { API_CONFIG, STORAGE_KEYS } from '@/constants'

export interface ApiResponse<T = any> {
    data?: T
    error?: string
    message?: string
}

export interface ApiError {
    message: string
    statusCode: number
    detail?: any
}

class ApiClient {
    private baseURL: string
    private token: string | null = null

    constructor(baseURL: string) {
        this.baseURL = baseURL
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        }
    }

    setToken(token: string | null) {
        this.token = token
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token)
            } else {
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
            }
        }
    }

    getToken(): string | null {
        return this.token
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const headers = new Headers(options.headers)
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json')
        }

        if (this.token) {
            headers.set('Authorization', `Bearer ${this.token}`)
        }

        const url = `${this.baseURL}${endpoint}`

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            })

            if (!response.ok) {
                const error: ApiError = {
                    message: response.statusText,
                    statusCode: response.status,
                }

                try {
                    const errorData = await response.json()
                    error.detail = errorData
                    error.message = errorData.detail || errorData.message || error.message
                } catch {
                    // Response is not JSON
                }

                throw error
            }

            const data = await response.json()
            return data
        } catch (error) {
            if (error instanceof Error && 'statusCode' in error) {
                throw error
            }
            throw {
                message: error instanceof Error ? error.message : 'Network error',
                statusCode: 0,
            } as ApiError
        }
    }

    async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' })
    }

    async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }

    async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' })
    }
}

export const apiClient = new ApiClient(API_CONFIG.BASE_URL)
