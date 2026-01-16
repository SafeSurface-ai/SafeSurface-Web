# SafeSurface 项目架构说明

## 🎯 核心理念

**UI 组件和路由页面放在同一个文件夹中，按功能模块组织！**

## 📐 架构设计

### 功能模块结构

每个功能模块在一个文件夹中包含：
- `page.tsx` - 路由页面（逻辑层）
- `XxxView.tsx` 或 `XxxForm.tsx` - UI 组件（视图层）

```
src/
├── login/
│   ├── page.tsx         # 路由 + 逻辑
│   └── LoginForm.tsx    # UI 组件
├── dashboard/
│   ├── page.tsx         # 路由 + 逻辑
│   └── DashboardView.tsx # UI 组件
└── welcome/
    ├── page.tsx         # 路由 + 逻辑
    └── WelcomeView.tsx  # UI 组件
```

### 示例对比

#### ❌ 旧方式（不推荐）
```tsx
// src/login/page.tsx - 包含大量 UI 代码，难以维护
export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    
    return (
        <div className="...">
            <Form onFinish={...}>
                <Input placeholder="用户名" />
                <Button>登录</Button>
            </Form>
        </div>
    )
}
```

#### ✅ 新方式（推荐）
```tsx
// src/login/page.tsx - 只负责逻辑
import LoginForm from './LoginForm'  // 同目录导入

export default function LoginPage() {
    const handleSubmit = async (values) => {
        await api.login(values)
    }
    return <LoginForm onSubmit={handleSubmit} />
}

// src/login/LoginForm.tsx - 负责 UI
export default function LoginForm({ onSubmit }) {
    return (
        <div className="...">
            <Form onFinish={onSubmit}>
                <Input placeholder="用户名" />
                <Button>登录</Button>
            </Form>
        </div>
    )
}
```

## 📂 目录结构详解

```
src/
├── components/          # 通用可复用组件
│   ├── layout/         # Header, Sidebar, Footer
│   └── common/         # Loading, ErrorBoundary
│
├── login/              # 登录功能模块
│   ├── page.tsx           # Next.js 路由页面
│   └── LoginForm.tsx      # 登录 UI 组件
│
├── dashboard/          # 仪表盘功能模块
│   ├── page.tsx           # Next.js 路由页面
│   └── DashboardView.tsx  # 仪表盘 UI 组件
│
├── welcome/            # 欢迎页功能模块
│   ├── page.tsx           # Next.js 路由页面
│   └── WelcomeView.tsx    # 欢迎页 UI 组件
│
├── hooks/              # 自定义 Hooks
├── utils/              # 工具函数
├── types/              # 类型定义
├── constants/          # 常量配置
└── lib/                # 核心库（API、Auth等）
```

**优势**：
- ✅ 相关文件在同一文件夹，便于查找和维护
- ✅ 功能模块独立，易于重构和删除
- ✅ 导入路径简洁：`import LoginForm from './LoginForm'`

## 🚀 开发流程

### 添加新功能模块的步骤

1. **创建模块文件夹** - 在 `src/` 下创建新文件夹
   ```bash
   mkdir src/profile
   ```

2. **创建 UI 组件** - 在模块文件夹中
   ```tsx
   // src/profile/ProfileView.tsx
   export default function ProfileView({ user, onUpdate }) {
       return <div>{/* UI 代码 */}</div>
   }
   ```

3. **创建路由页面** - 在同一文件夹中
   ```tsx
   // src/profile/page.tsx
   'use client'
   import ProfileView from './ProfileView'
   
   export default function ProfilePage() {
       const user = useAuth()
       const handleUpdate = async (data) => { /* 逻辑 */ }
       return <ProfileView user={user} onUpdate={handleUpdate} />
   }
   ```

完成！所有相关文件都在 `src/profile/` 文件夹中。

## ✨ 优势

✅ **关注点分离** - UI 和逻辑分离  
✅ **易于测试** - 组件可单独测试  
✅ **可复用** - UI 组件可在多处使用  
✅ **易维护** - 修改 UI 不影响逻辑  
✅ **团队协作** - UI 和逻辑开发可并行  

## 📋 快速参考

### 模块文件组织
```
功能模块/
├── page.tsx          # 路由页面（必需）
├── XxxView.tsx       # 主 UI 组件
├── components/       # 模块私有组件（可选）
└── types.ts          # 模块类型定义（可选）
```

### 导入规则
```tsx
// ✅ 从同目录导入 UI 组件
import LoginForm from './LoginForm'

// ✅ 从 components 导入通用组件
import { Header, Footer } from '@/components'

// ✅ 从 lib 导入工具
import { useAuth } from '@/lib/auth-context'
```

### 现有模块
- **登录**: `src/login/` → `page.tsx` + `LoginForm.tsx`
- **欢迎**: `src/welcome/` → `page.tsx` + `WelcomeView.tsx`
- **仪表盘**: `src/dashboard/` → `page.tsx` + `DashboardView.tsx`

## 🎨 命名规范

- **页面组件**: `XxxView.tsx` 或 `XxxForm.tsx`
- **布局组件**: `Header.tsx`, `Footer.tsx`
- **通用组件**: `Loading.tsx`, `Button.tsx`
