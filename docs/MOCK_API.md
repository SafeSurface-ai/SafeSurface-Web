# Mock API 使用说明

## 🎭 Mock 功能已启用

当前项目已配置 Mock API，无需后端服务器即可测试前端功能。

## 📝 测试账号

### 管理员账号
- **用户名**: `admin` 或 `admin@safesurface.com`
- **密码**: `admin123`

### 普通用户账号
- **用户名**: `testuser` 或 `user@safesurface.com`
- **密码**: `user123`

## 🔧 配置说明

Mock 模式在 `src/lib/api.ts` 中配置：

```typescript
const USE_MOCK = true  // 设置为 false 使用真实 API
```

## 📦 Mock 数据

Mock 数据定义在 `src/lib/mock-data.ts` 中，包括：

- **用户数据** (`mockUsers`)
- **任务数据** (`mockTasks`)
- **登录凭证** (`mockCredentials`)

## ✨ 功能特性

### 已实现的 Mock API

1. **认证相关**
   - ✅ 用户登录 (`authApi.login`)
   - ✅ 用户登出 (`authApi.logout`)

2. **用户管理**
   - ✅ 获取当前用户 (`userApi.getCurrentUser`)
   - ✅ 创建用户 (`userApi.createUser`)
   - ✅ 更新用户 (`userApi.updateUser`)
   - ✅ 删除用户 (`userApi.deleteUser`)

3. **任务管理**
   - ✅ 获取任务列表 (`taskApi.getTasks`)
   - ✅ 获取单个任务 (`taskApi.getTask`)
   - ✅ 创建任务 (`taskApi.createTask`)
   - ✅ 删除任务 (`taskApi.deleteTask`)

### Mock 特性

- 🕐 模拟网络延迟（300-800ms）
- 🔐 基于 Token 的认证
- 💾 内存中的数据存储
- ✅ 完整的错误处理

## 🚀 快速测试

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```

2. 访问登录页面：
   ```
   http://localhost:3000/login
   ```

3. 使用测试账号登录

4. 登录成功后会自动跳转到仪表盘

## 🔄 切换到真实 API

编辑 `src/lib/api.ts`：

```typescript
const USE_MOCK = false  // 关闭 Mock 模式
```

然后配置后端 API 地址在 `src/constants/index.ts`：

```typescript
export const API_CONFIG = {
    BASE_URL: 'http://your-backend-api.com',
    // ...
}
```

## 📊 数据示例

### 用户对象
```typescript
{
    id: 1,
    email: 'admin@safesurface.com',
    username: 'admin',
    is_active: true,
    is_superuser: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
}
```

### 任务对象
```typescript
{
    id: 1,
    name: '主站安全扫描',
    status: 'running',  // 'pending' | 'running' | 'completed' | 'failed'
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
}
```

## 💡 提示

- Mock 数据存储在内存中，刷新页面会重置
- Token 存储在 localStorage 中，保持登录状态
- 可以在 `mock-data.ts` 中添加更多测试数据
