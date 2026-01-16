import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useAuth } from '@/lib/auth-context'
import { findRouteByPath } from '@/router/routeMeta'
import { hasAnyPermission, UserRole } from '@/constants/permissions'

interface AuthGuardProps {
  children: ReactNode
}

/**
 * 认证守卫组件 - 适配 SafeSurface 项目
 * 负责检查用户登录状态和路由权限
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const routeMeta = findRouteByPath(router.pathname)

  useEffect(() => {
    // 等待认证状态加载完成
    if (isLoading) return

    // 公共路由直接放行
    if (routeMeta?.meta?.requiresAuth === false) {
      return
    }

    // 需要认证但用户未登录，重定向到登录页
    if (!user && routeMeta?.meta?.requiresAuth !== true) {
      const redirectUrl = router.pathname !== '/login' 
        ? `?redirect=${encodeURIComponent(router.asPath)}`
        : ''
      router.replace(`/login${redirectUrl}`)
      return
    }

    // 已登录，检查权限
    if (user && routeMeta?.meta) {
      const { roles, permissions } = routeMeta.meta
      
      // 检查角色权限
      if (roles && roles.length > 0) {
        const userRoles = getUserRoles(user)
        const hasRoleAccess = roles.some(role => userRoles.includes(role))
        
        if (!hasRoleAccess) {
          router.replace('/403')
          return
        }
      }

      // 检查具体权限
      if (permissions && permissions.length > 0) {
        const userRoles = getUserRoles(user)
        const hasPermissionAccess = hasAnyPermission(userRoles, permissions)
        
        if (!hasPermissionAccess) {
          router.replace('/403')
          return
        }
      }
    }
  }, [user, isLoading, router.pathname, routeMeta])

  // 加载中显示 loading 状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin 
          size="large"
          indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          tip="加载中..."
        />
      </div>
    )
  }

  // 公共路由或已通过权限检查
  return <>{children}</>
}

/**
 * 获取用户角色
 */
function getUserRoles(user: any): UserRole[] {
  if (user.is_superuser) {
    return [UserRole.ADMIN]
  }
  
  return user.roles || [UserRole.USER]
}