import type { User, LoginResponse, Task } from '@/types'

// Mock 用户数据
export const mockUsers: User[] = [
    {
        id: 1,
        email: 'admin@safesurface.ai',
        username: 'admin',
        is_active: true,
        is_superuser: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
    {
        id: 2,
        email: 'user@safesurface.ai',
        username: 'testuser',
        is_active: true,
        is_superuser: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
    },
]

// Mock 任务数据
export const mockTasks: Task[] = [
    {
        id: 1,
        name: '主站安全扫描',
        status: 'running',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T14:30:00Z',
    },
    {
        id: 2,
        name: 'API 接口测试',
        status: 'completed',
        created_at: '2024-01-15T08:00:00Z',
        updated_at: '2024-01-15T12:00:00Z',
    },
    {
        id: 3,
        name: '漏洞验证',
        status: 'pending',
        created_at: '2024-01-15T16:00:00Z',
        updated_at: '2024-01-15T16:00:00Z',
    },
]

// Mock 登录凭证（用户名/密码）
export const mockCredentials = {
    'admin@safesurface.ai': 'admin123',
    'admin': 'admin123',
    'user@safesurface.ai': 'user123',
    'testuser': 'user123',
}

// 生成 Mock Token
export function generateMockToken(username: string): string {
    return `mock_token_${username}_${Date.now()}`
}

// 从 Token 中获取用户
export function getUserFromToken(token: string): User | null {
    if (!token || !token.startsWith('mock_token_')) {
        return null
    }

    const parts = token.split('_')
    const username = parts[2]
    
    return mockUsers.find(u => u.username === username || u.email === username) || null
}

// 延迟函数（模拟网络延迟）
export function mockDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}
