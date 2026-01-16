import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/lib/auth-context'
import { findRouteByPath } from './routeMeta'
import { hasPermission, hasAnyPermission, UserRole } from '@/constants/permissions'
import { Spin, Result, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface RouteGuardProps {
    children: React.ReactNode
}

// 路由守卫组件
export function RouteGuard({ children }: RouteGuardProps) {
    const router = useRouter()
    const pathname = router.pathname
    const { user, isLoading } = useAuth()
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [hasAccess, setHasAccess] = useState(false)

    useEffect(() => {
        const checkRouteAccess = async () => {
            if (isLoading) {
                return
            }

            const currentRoute = findRouteByPath(pathname)
            
            // 如果找不到路由配置，默认允许访问
            if (!currentRoute?.meta) {
                setHasAccess(true)
                setIsCheckingAuth(false)
                return
            }

            const { requiresAuth, roles, permissions } = currentRoute.meta

            // 不需要认证的页面
            if (!requiresAuth) {
                setHasAccess(true)
                setIsCheckingAuth(false)
                return
            }

            // 需要认证但用户未登录
            if (requiresAuth && !user) {
                router.replace('/login')
                return
            }

            // 用户已登录，检查角色和权限
            if (user) {
                let hasRoleAccess = true
                let hasPermissionAccess = true

                // 检查角色权限
                if (roles && roles.length > 0) {
                    const userRoles = getUserRoles(user)
                    hasRoleAccess = roles.some(role => userRoles.includes(role))
                }

                // 检查具体权限
                if (permissions && permissions.length > 0) {
                    const userRoles = getUserRoles(user)
                    hasPermissionAccess = hasAnyPermission(userRoles, permissions)
                }

                if (hasRoleAccess && hasPermissionAccess) {
                    setHasAccess(true)
                } else {
                    // 无权限访问，跳转到403页面
                    router.replace('/403')
                    return
                }
            }

            setIsCheckingAuth(false)
        }

        checkRouteAccess()
    }, [pathname, user, isLoading, router])

    // 获取用户角色
    const getUserRoles = (user: any): UserRole[] => {
        // 根据用户信息判断角色
        if (user.is_superuser) {
            return [UserRole.ADMIN]
        }
        
        // 这里可以根据实际业务逻辑确定用户角色
        // 例如从用户对象的 roles 字段获取
        return user.roles || [UserRole.USER]
    }

    // 正在检查权限时显示加载状态
    if (isCheckingAuth) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Spin 
                    size="large"
                    indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} 
                />
                <div className="text-gray-400">检查权限中...</div>
            </div>
        )
    }

    // 有权限访问时渲染子组件
    if (hasAccess) {
        return <>{children}</>
    }

    // 无权限访问时显示403页面
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Result
                status="403"
                title="403"
                subTitle="抱歉，您没有权限访问此页面。"
                extra={
                    <Button type="primary" onClick={() => router.push('/dashboard')}>
                        返回首页
                    </Button>
                }
            />
        </div>
    )
}

// 权限检查Hook
export function usePermission() {
    const { user } = useAuth()
    
    const checkPermission = (permission: string): boolean => {
        if (!user) return false
        
        const userRoles = getUserRoles(user)
        return hasPermission(userRoles, permission)
    }
    
    const checkAnyPermission = (permissions: string[]): boolean => {
        if (!user) return false
        
        const userRoles = getUserRoles(user)
        return hasAnyPermission(userRoles, permissions)
    }
    
    const checkRole = (role: UserRole): boolean => {
        if (!user) return false
        
        const userRoles = getUserRoles(user)
        return userRoles.includes(role)
    }
    
    const getUserRoles = (user: any): UserRole[] => {
        if (user.is_superuser) {
            return [UserRole.ADMIN]
        }
        return user.roles || [UserRole.USER]
    }
    
    return {
        checkPermission,
        checkAnyPermission,
        checkRole,
        userRoles: user ? getUserRoles(user) : []
    }
}

// 权限组件 - 根据权限控制子组件显示
interface PermissionComponentProps {
    permission?: string
    permissions?: string[]
    role?: UserRole
    roles?: UserRole[]
    fallback?: React.ReactNode
    children: React.ReactNode
}

export function PermissionComponent({
    permission,
    permissions,
    role,
    roles,
    fallback,
    children
}: PermissionComponentProps) {
    const { checkPermission, checkAnyPermission, checkRole } = usePermission()
    
    let hasAccess = true
    
    // 检查单个权限
    if (permission) {
        hasAccess = hasAccess && checkPermission(permission)
    }
    
    // 检查多个权限（任一）
    if (permissions && permissions.length > 0) {
        hasAccess = hasAccess && checkAnyPermission(permissions)
    }
    
    // 检查单个角色
    if (role) {
        hasAccess = hasAccess && checkRole(role)
    }
    
    // 检查多个角色（任一）
    if (roles && roles.length > 0) {
        hasAccess = hasAccess && roles.some(r => checkRole(r))
    }
    
    return hasAccess ? <>{children}</> : <>{fallback || null}</>
}

// 导出路由相关工具
export { RouteMetaConfig, getMenuRoutes, findRouteByPath, getBreadcrumbPath } from './routeMeta'
export type { Route, RouteMeta } from './routeMeta'