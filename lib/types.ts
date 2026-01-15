export interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
}

export interface UserCreate {
  email: string
  username: string
  password: string
}

export interface UserUpdate {
  email?: string
  username?: string
  password?: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface Task {
  id: number
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}
