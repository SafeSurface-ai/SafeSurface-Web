import { apiClient } from './api-client'
import { API_PATHS } from './config'
import type { User, UserCreate, UserUpdate, LoginResponse, Task } from './types'

// 认证相关
export const authApi = {
  // 注册
  register: async (userData: UserCreate): Promise<User> => {
    return apiClient.post<User>(API_PATHS.register, userData)
  },

  // 登录
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.postWithBasicAuth<LoginResponse>(
      API_PATHS.login,
      username,
      password
    )
    // 保存 token
    apiClient.setToken(response.access_token)
    return response
  },

  // 登出
  logout: () => {
    apiClient.setToken(null)
  },
}

// 用户相关
export const userApi = {
  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>(API_PATHS.currentUser)
  },

  // 更新当前用户信息
  updateCurrentUser: async (userData: UserUpdate): Promise<User> => {
    return apiClient.put<User>(API_PATHS.updateUser, userData)
  },

  // 获取指定用户信息（管理员）
  getUser: async (userId: number): Promise<User> => {
    return apiClient.get<User>(API_PATHS.getUser(userId))
  },
}

// 任务相关
export const taskApi = {
  // 获取任务列表
  getTasks: async (): Promise<{ tasks: Task[]; message?: string }> => {
    return apiClient.get(API_PATHS.tasks)
  },

  // 创建任务
  createTask: async (): Promise<{ message: string }> => {
    return apiClient.post(API_PATHS.tasks)
  },
}

// 健康检查
export const healthApi = {
  health: async (): Promise<{ status: string }> => {
    return apiClient.get(API_PATHS.health)
  },

  ready: async (): Promise<{ status: string }> => {
    return apiClient.get(API_PATHS.ready)
  },
}
