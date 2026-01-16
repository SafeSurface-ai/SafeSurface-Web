# Router和Permission系统使用说明

## 概述

该项目实现了完整的路由管理和权限控制系统，支持基于角色的访问控制(RBAC)。

## 主要组件

### 1. 权限系统 (`src/constants/permissions.ts`)

#### 用户角色
- `ADMIN`: 管理员，拥有所有权限
- `OPERATOR`: 操作员，可以管理扫描任务和报告
- `USER`: 普通用户，可以创建和查看扫描任务
- `VIEWER`: 访客，只有查看权限

#### 权限定义
```typescript
PERMISSIONS = {
  DASHBOARD: { VIEW, MANAGE },
  SCAN: { VIEW, CREATE, UPDATE, DELETE, EXECUTE },
  REPORT: { VIEW, EXPORT, SHARE },
  USER: { VIEW, CREATE, UPDATE, DELETE },
  SYSTEM: { VIEW, MANAGE }
}
```

### 2. 路由配置 (`src/router/routeMeta.ts`)

定义了完整的路由结构，包括：
- 路由元信息（标题、图标、权限要求等）
- 嵌套路由支持
- 菜单生成功能
- 面包屑导航支持

### 3. 路由守卫 (`src/router/index.tsx`)

- `RouteGuard`: 自动检查用户权限和角色
- `PermissionComponent`: 基于权限控制组件显示
- `usePermission`: 权限检查Hook

## 页面结构

### 主要页面
1. **Welcome页面** (`/`) - 首页，无需认证
2. **Login页面** (`/login`) - 登录页面
3. **Dashboard页面** (`/dashboard`) - 仪表盘，需要认证

### 功能模块
1. **扫描管理** (`/scan`)
   - 扫描任务列表 (`/scan/list`)
   - 创建扫描任务 (`/scan/create`)

2. **报告管理** (`/report`)
   - 报告列表 (`/report/list`)

3. **系统管理** (`/system`) - 仅管理员
   - 用户管理 (`/system/users`)
   - 系统设置 (`/system/settings`)

4. **错误页面**
   - 403无权限 (`/403`)
   - 404页面未找到 (`/404`)
   - 500服务器错误 (`/500`)

## 使用方法

### 1. 在布局中使用路由守卫

```tsx
import { AuthProvider } from '@/lib/auth-context'
import { RouteGuard } from '@/router'

function App({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RouteGuard>
        {children}
      </RouteGuard>
    </AuthProvider>
  )
}
```

### 2. 使用权限组件

```tsx
import { PermissionComponent, usePermission } from '@/router'
import { PERMISSIONS, UserRole } from '@/constants/permissions'

function MyComponent() {
  const { checkPermission, checkRole } = usePermission()

  return (
    <div>
      {/* 基于权限显示按钮 */}
      <PermissionComponent permission={PERMISSIONS.SCAN.CREATE}>
        <Button>创建扫描</Button>
      </PermissionComponent>

      {/* 基于角色显示内容 */}
      <PermissionComponent role={UserRole.ADMIN}>
        <AdminPanel />
      </PermissionComponent>

      {/* 使用Hook检查权限 */}
      {checkPermission(PERMISSIONS.REPORT.EXPORT) && (
        <ExportButton />
      )}
    </div>
  )
}
```

### 3. 生成菜单

```tsx
import { getMenuRoutes } from '@/router'

function Sidebar() {
  const menuRoutes = getMenuRoutes()
  
  return (
    <Menu>
      {menuRoutes.map(route => (
        <Menu.Item key={route.path} icon={route.meta?.icon}>
          {route.meta?.title}
        </Menu.Item>
      ))}
    </Menu>
  )
}
```

### 4. 面包屑导航

```tsx
import { getBreadcrumbPath } from '@/router'
import { usePathname } from 'next/navigation'

function Breadcrumb() {
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumbPath(pathname)
  
  return (
    <Breadcrumb>
      {breadcrumbs.map(item => (
        <Breadcrumb.Item key={item.path}>
          {item.meta?.title}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}
```

## 权限检查流程

1. 用户访问路由时，`RouteGuard`自动检查：
   - 是否需要认证 (`requiresAuth`)
   - 用户是否已登录
   - 用户角色是否满足要求 (`roles`)
   - 用户是否有所需权限 (`permissions`)

2. 如果权限不足：
   - 未登录用户重定向到登录页 (`/login`)
   - 已登录但无权限用户重定向到403页面 (`/403`)

3. 权限检查通过后渲染页面内容

## 扩展指南

### 添加新权限

1. 在`PERMISSIONS`中添加新权限常量
2. 在`ROLE_PERMISSIONS`中为角色分配新权限
3. 在路由配置中添加权限要求

### 添加新角色

1. 在`UserRole`枚举中添加新角色
2. 在`ROLE_PERMISSIONS`中定义角色权限
3. 更新用户管理界面的角色选项

### 添加新路由

1. 在`RouteMetaConfig`中添加路由配置
2. 创建对应的页面组件
3. 在组件导出文件中添加导出

这套系统提供了灵活的权限控制和路由管理功能，可以根据实际需求进行扩展和定制。