# API 客户端使用指南

## 环境配置

在 `.env.local` 中配置 API 地址：

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_V1_STR=/api/v1
```

## 使用方式

### 1. 认证相关

```typescript
import { authApi } from '@/lib/api'

// 注册
const user = await authApi.register({
  email: 'user@example.com',
  username: 'username',
  password: 'password123',
})

// 登录
const { access_token } = await authApi.login('username', 'password')

// 登出
authApi.logout()
```

### 2. 用户相关

```typescript
import { userApi } from '@/lib/api'

// 获取当前用户信息
const user = await userApi.getCurrentUser()

// 更新当前用户信息
const updatedUser = await userApi.updateCurrentUser({
  email: 'newemail@example.com',
})
```

### 3. 任务相关

```typescript
import { taskApi } from '@/lib/api'

// 获取任务列表
const { tasks } = await taskApi.getTasks()

// 创建任务
await taskApi.createTask()
```

### 4. 使用 Auth Context

```typescript
'use client'

import { useAuth } from '@/lib/auth-context'

export default function MyComponent() {
  const { user, loading, login, logout } = useAuth()

  if (loading) return <div>Loading...</div>
  
  if (!user) {
    return <button onClick={() => login('username', 'password')}>Login</button>
  }

  return (
    <div>
      <p>Welcome, {user.username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### 5. 在根布局中使用 AuthProvider

```typescript
// app/layout.tsx
import { AuthProvider } from '@/lib/auth-context'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
```

## 错误处理

所有 API 调用都会抛出 `ApiError`：

```typescript
try {
  await authApi.login(username, password)
} catch (error: any) {
  console.error(error.message) // 用户友好的错误消息
  console.error(error.statusCode) // HTTP 状态码
  console.error(error.detail) // 详细错误信息
}
```

## 文件结构

```
lib/
├── config.ts          # API 配置和路径
├── api-client.ts      # 底层 API 客户端
├── api.ts             # API 方法封装
├── types.ts           # TypeScript 类型定义
└── auth-context.tsx   # 认证上下文
```
