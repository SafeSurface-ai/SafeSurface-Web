import { API_CONFIG } from './config'

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
      this.token = localStorage.getItem('access_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token)
      } else {
        localStorage.removeItem('access_token')
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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const error: ApiError = {
          message: errorData.detail || errorData.message || 'Request failed',
          statusCode: response.status,
          detail: errorData,
        }
        throw error
      }

      return await response.json()
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error
      }
      throw {
        message: 'Network error',
        statusCode: 0,
        detail: error,
      } as ApiError
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Basic Auth (用于登录)
  async postWithBasicAuth<T>(
    endpoint: string,
    username: string,
    password: string
  ): Promise<T> {
    const credentials = btoa(`${username}:${password}`)
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    })
  }
}

export const apiClient = new ApiClient(API_CONFIG.baseURL)
