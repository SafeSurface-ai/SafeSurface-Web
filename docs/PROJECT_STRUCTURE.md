# SafeSurface Web 项目结构文档

## 📁 目录结构

```
src/
├── components/          # 通用可复用组件
│   ├── layout/         # 布局组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── common/         # 通用组件
│   │   ├── Loading.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   └── index.ts        # 组件统一导出
│
├── dashboard/          # Dashboard 模块
│   ├── page.tsx            # 路由页面（逻辑）
│   └── DashboardView.tsx   # UI 组件（界面）
│
├── login/              # 登录模块
│   ├── page.tsx            # 路由页面（逻辑）
│   └── LoginForm.tsx       # UI 组件（界面）
│
├── welcome/            # 欢迎页模块
│   ├── page.tsx            # 路由页面（逻辑）
│   └── WelcomeView.tsx     # UI 组件（界面）
│
├── hooks/              # 自定义 React Hooks
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   ├── useWindowSize.ts
│   ├── useClickOutside.ts
│   └── index.ts
│
├── types/              # TypeScript 类型定义
│   ├── index.ts        # 统一导出所有类型
│   └── api.ts          # API 相关类型
│
├── constants/          # 常量定义
│   ├── index.ts        # 应用常量
│   └── theme.ts        # 主题配置
│
├── utils/              # 工具函数
│   ├── date.ts         # 日期处理
│   ├── format.ts       # 格式化工具
│   ├── validation.ts   # 验证工具
│   ├── helpers.ts      # 辅助函数
│   └── index.ts
│
├── lib/                # 核心库
│   ├── api-client.ts   # API 客户端
│   ├── api.ts          # API 接口定义
│   ├── auth-context.tsx # 认证上下文
│   └── index.ts
│
├── assets/             # 静态资源
├── globals.css         # 全局样式
├── layout.tsx          # 根布局
├── page.tsx            # 首页
└── providers.tsx       # 全局 Providers
```

## 📦 模块说明

### 功能模块（按页面组织）

每个功能模块包含：
- `page.tsx`: 路由页面 - 负责数据获取、状态管理、事件处理
- `XxxView.tsx` 或 `XxxForm.tsx`: UI 组件 - 负责界面展示

**Dashboard 模块** - `src/dashboard/`
- `page.tsx`: 仪表盘路由页面
- `DashboardView.tsx`: 仪表盘 UI 组件

**Login 模块** - `src/login/`
- `page.tsx`: 登录路由页面
- `LoginForm.tsx`: 登录表单 UI 组件

**Welcome 模块** - `src/welcome/`
- `page.tsx`: 欢迎页路由页面
- `WelcomeView.tsx`: 欢迎页 UI 组件

### Components 通用组件

**Layout 布局组件**
- `Header.tsx`: 顶部导航栏
- `Sidebar.tsx`: 侧边栏菜单
- `Footer.tsx`: 页脚

**Common 通用组件**
- `Loading.tsx`: 加载状态组件
- `ErrorBoundary.tsx`: 错误边界组件

> **架构说明**: UI 组件和路由页面放在同一个文件夹中，按功能模块组织，便于维护和查找。

### Hooks 自定义钩子

- `useLocalStorage`: 本地存储管理
- `useDebounce`: 防抖处理
- `useWindowSize`: 窗口尺寸监听
- `useClickOutside`: 点击外部区域检测

### Types 类型定义

- 用户类型 (User, UserCreate, UserUpdate)
- 认证类型 (LoginResponse, AuthContextType)
- 任务类型 (Task, TaskStatus)
- API 类型 (ApiResponse, PaginatedResponse)

### Constants 常量

- API 配置
- 存储键名
- 路由常量
- 任务状态
- HTTP 状态码
- 主题配置

### Utils 工具函数

**date.ts - 日期工具**
- `formatDateTime`: 格式化日期时间
- `getRelativeTime`: 计算相对时间

**format.ts - 格式化工具**
- `formatFileSize`: 格式化文件大小
- `formatNumber`: 数字千分位格式化
- `formatPercent`: 百分比格式化

**validation.ts - 验证工具**
- `isEmail`: 邮箱验证
- `isStrongPassword`: 密码强度验证
- `isValidUsername`: 用户名验证
- `isURL`: URL 验证

**helpers.ts - 辅助函数**
- `generateId`: 生成唯一 ID
- `deepClone`: 深拷贝
- `debounce`: 防抖函数
- `throttle`: 节流函数
- `sleep`: 异步睡眠

### Lib 核心库

- `api-client.ts`: HTTP 请求封装
- `api.ts`: API 接口集合
- `auth-context.tsx`: 认证状态管理

## 🚀 使用示例

### 功能模块结构

每个功能模块在同一个文件夹下，方便管理：

```
src/login/
├── page.tsx         # 路由页面（逻辑）
└── LoginForm.tsx    # UI 组件（界面）
```

**路由页面**（page.tsx - 负责逻辑）
```tsx
// src/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from './LoginForm'  // 从同目录导入
import { authApi } from '@/lib/api'

export default function LoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (values) => {
        setLoading(true)
        await authApi.login(values)
        router.push('/dashboard')
    }

    return <LoginForm onSubmit={handleSubmit} loading={loading} />
}
```

**UI 组件**（LoginForm.tsx - 负责展示）
```tsx
// src/login/LoginForm.tsx
export default function LoginForm({ onSubmit, loading }) {
    return (
        <Form onFinish={onSubmit}>
            <Input placeholder="用户名" />
            <Button loading={loading}>登录</Button>
        </Form>
    )
}
```

### 使用通用组件

```tsx
import { Header, Footer, Loading } from '@/components'

export default function MyPage() {
    return (
        <div>
            <Header />
            <Loading />
            <Footer />
        </div>
    )
}
```

### 使用 Hooks

```tsx
import { useLocalStorage, useDebounce } from '@/hooks'

export default function MyComponent() {
    const [value, setValue] = useLocalStorage('key', 'default')
    const debouncedValue = useDebounce(value, 500)
    
    return <div>{debouncedValue}</div>
}
```

### 使用工具函数

```tsx
import { formatDateTime, isEmail, generateId } from '@/utils'

const formattedDate = formatDateTime(new Date())
const valid = isEmail('user@example.com')
const id = generateId()
```

### 使用 API

```tsx
import { userApi, taskApi } from '@/lib'

async function loadData() {
    const user = await userApi.getCurrentUser()
    const tasks = await taskApi.getTasks()
}
```

### 使用认证

```tsx
'use client'

import { useAuth } from '@/lib/auth-context'

export default function MyComponent() {
    const { user, login, logout } = useAuth()
    
    return (
        <div>
            {user ? (
                <button onClick={logout}>退出</button>
            ) : (
                <button onClick={() => login('email', 'password')}>登录</button>
            )}
        </div>
    )
}
```

## 📝 开发规范

### 页面与组件职责划分

**路由页面** (`src/*/page.tsx`)
- ✅ 数据获取和状态管理
- ✅ 事件处理函数
- ✅ 路由导航逻辑
- ✅ API 调用
- ❌ 不包含复杂的 UI 代码

**UI 组件** (`src/components/features/`)
- ✅ 纯 UI 展示
- ✅ 接收 props 渲染
- ✅ 触发回调函数
- ❌ 不直接调用 API
- ❌ 不进行路由跳转

### 导入顺序

```tsx
// 1. React/Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. 第三方库
import { Button } from 'antd'

// 3. 组件
import { Header, Footer } from '@/components'

// 4. Hooks
import { useLocalStorage } from '@/hooks'

// 5. 工具函数
import { formatDateTime } from '@/utils'

// 6. 类型
import type { User } from '@/types'

// 7. 常量
import { ROUTES } from '@/constants'

// 8. 样式
import './styles.css'
```

### 命名规范

- **组件**: PascalCase (e.g., `UserProfile.tsx`)
- **工具函数**: camelCase (e.g., `formatDateTime`)
- **常量**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **类型/接口**: PascalCase (e.g., `User`, `ApiResponse`)
- **文件夹**: kebab-case (e.g., `user-profile/`)

## 🔧 配置

### tsconfig.json 路径别名

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

这样可以使用 `@/` 作为 `src/` 的别名进行导入。

## 📚 最佳实践

1. **组件职责单一**: 每个组件只负责一个功能
2. **复用 Hooks**: 将可复用逻辑提取为自定义 Hooks
3. **类型安全**: 所有 API 接口和组件 Props 都应有类型定义
4. **错误处理**: 使用 ErrorBoundary 包裹可能出错的组件
5. **懒加载**: 大型组件使用 `dynamic` 进行懒加载
6. **常量集中**: 将硬编码的值提取到 constants 目录
7. **工具函数纯净**: utils 中的函数应该是纯函数，无副作用
