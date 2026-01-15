// API 配置
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  apiV1: process.env.NEXT_PUBLIC_API_V1_STR || '/api/v1',
  timeout: 30000,
}

// API 路径
export const API_PATHS = {
  // 认证
  register: `${API_CONFIG.apiV1}/auth/register`,
  login: `${API_CONFIG.apiV1}/auth/login`,
  
  // 用户
  currentUser: `${API_CONFIG.apiV1}/users/me`,
  updateUser: `${API_CONFIG.apiV1}/users/me`,
  getUser: (userId: number) => `${API_CONFIG.apiV1}/users/${userId}`,
  
  // 任务
  tasks: `${API_CONFIG.apiV1}/tasks`,
  
  // 健康检查
  health: `${API_CONFIG.apiV1}/health`,
  ready: `${API_CONFIG.apiV1}/ready`,
}
