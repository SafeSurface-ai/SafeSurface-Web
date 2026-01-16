import { apiClient } from './api-client'
import type { User, UserCreate, UserUpdate, LoginResponse, Task } from '@/types'
import { 
    mockUsers, 
    mockTasks, 
    mockCredentials, 
    generateMockToken, 
    getUserFromToken,
    mockDelay 
} from './mock-data'

// 启用 Mock 模式
const USE_MOCK = true

// ========== Auth API ==========
export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        if (USE_MOCK) {
            // Mock 登录
            await mockDelay(800)
            
            const credentials = mockCredentials as Record<string, string>
            if (credentials[email] === password) {
                const user = mockUsers.find(u => u.email === email || u.username === email)
                const token = generateMockToken(user?.username || email)
                apiClient.setToken(token)
                
                return {
                    access_token: token,
                    token_type: 'Bearer',
                }
            } else {
                throw new Error('用户名或密码错误')
            }
        }

        // 真实 API 调用
        const formData = new URLSearchParams()
        formData.append('username', email)
        formData.append('password', password)

        const response = await fetch(`${apiClient['baseURL']}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        })

        if (!response.ok) {
            throw new Error('登录失败')
        }

        const data = await response.json()
        apiClient.setToken(data.access_token)
        return data
    },

    logout: () => {
        apiClient.setToken(null)
    },
}

// ========== User API ==========
export const userApi = {
    getCurrentUser: async (): Promise<User> => {
        if (USE_MOCK) {
            // Mock 获取当前用户
            await mockDelay(300)
            
            const token = apiClient.getToken()
            if (!token) {
                throw new Error('未登录')
            }
            
            const user = getUserFromToken(token)
            if (!user) {
                throw new Error('无效的令牌')
            }
            
            return user
        }

        return apiClient.get<User>('/api/users/me')
    },

    createUser: async (userData: UserCreate): Promise<User> => {
        if (USE_MOCK) {
            await mockDelay(500)
            const newUser: User = {
                id: mockUsers.length + 1,
                email: userData.email,
                username: userData.username,
                is_active: true,
                is_superuser: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            mockUsers.push(newUser)
            return newUser
        }

        return apiClient.post<User>('/api/users', userData)
    },

    updateUser: async (id: number, userData: UserUpdate): Promise<User> => {
        if (USE_MOCK) {
            await mockDelay(500)
            const user = mockUsers.find(u => u.id === id)
            if (!user) {
                throw new Error('用户不存在')
            }
            Object.assign(user, userData, { updated_at: new Date().toISOString() })
            return user
        }

        return apiClient.put<User>(`/api/users/${id}`, userData)
    },

    deleteUser: async (id: number): Promise<void> => {
        if (USE_MOCK) {
            await mockDelay(500)
            const index = mockUsers.findIndex(u => u.id === id)
            if (index > -1) {
                mockUsers.splice(index, 1)
            }
            return
        }

        return apiClient.delete<void>(`/api/users/${id}`)
    },
}

// ========== Task API ==========
export const taskApi = {
    getTasks: async (): Promise<Task[]> => {
        if (USE_MOCK) {
            await mockDelay(400)
            return [...mockTasks]
        }

        return apiClient.get<Task[]>('/api/tasks')
    },

    getTask: async (id: number): Promise<Task> => {
        if (USE_MOCK) {
            await mockDelay(300)
            const task = mockTasks.find(t => t.id === id)
            if (!task) {
                throw new Error('任务不存在')
            }
            return task
        }

        return apiClient.get<Task>(`/api/tasks/${id}`)
    },

    createTask: async (name: string): Promise<Task> => {
        if (USE_MOCK) {
            await mockDelay(500)
            const newTask: Task = {
                id: mockTasks.length + 1,
                name,
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            mockTasks.push(newTask)
            return newTask
        }

        return apiClient.post<Task>('/api/tasks', { name })
    },

    deleteTask: async (id: number): Promise<void> => {
        if (USE_MOCK) {
            await mockDelay(400)
            const index = mockTasks.findIndex(t => t.id === id)
            if (index > -1) {
                mockTasks.splice(index, 1)
            }
            return
        }

        return apiClient.delete<void>(`/api/tasks/${id}`)
    },
}
