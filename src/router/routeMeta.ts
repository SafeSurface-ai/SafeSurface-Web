import { UserRole, PERMISSIONS } from '@/constants/permissions'

// 定义路由元信息接口
export interface RouteMeta {
    title: string // 路由标题
    requiresAuth?: boolean // 是否需要认证
    icon?: string // 路由图标
    hidden?: boolean // 是否在菜单中隐藏
    roles?: UserRole[] // 允许访问的用户角色
    permissions?: string[] // 需要的权限
    layout?: 'main' | 'auth' | 'blank' // 布局类型
    keepAlive?: boolean // 是否缓存页面
    order?: number // 菜单排序
    [key: string]: any // 其他自定义元数据
}

// 定义路由类型
export interface Route {
    name: string
    path?: string
    component?: string
    meta?: RouteMeta
    children?: Route[]
    redirect?: string
}

// 路由配置
export const RouteMetaConfig: Route[] = [
    {
        name: 'Welcome',
        path: '/',
        component: 'index',
        meta: {
            title: '首页',
            icon: 'home',
            requiresAuth: false,
            layout: 'blank',
            order: 1
        }
    },
    {
        name: 'Login',
        path: '/login',
        component: 'login',
        meta: {
            title: '登录',
            hidden: true,
            layout: 'auth'
        }
    },
    {
        name: 'Dashboard',
        path: '/dashboard',
        component: 'dashboard',
        meta: {
            title: '仪表盘',
            icon: 'dashboard',
            requiresAuth: true,
            layout: 'main',
            permissions: [PERMISSIONS.DASHBOARD.VIEW],
            roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER, UserRole.VIEWER],
            keepAlive: true,
            order: 2
        }
    },
    {
        name: 'Scan',
        path: '/scan',
        meta: {
            title: '扫描管理',
            icon: 'scan',
            requiresAuth: true,
            layout: 'main',
            order: 3
        },
        children: [
            {
                name: 'ScanList',
                path: '/scan/list',
                component: 'scan/list',
                meta: {
                    title: '扫描任务',
                    requiresAuth: true,
                    permissions: [PERMISSIONS.SCAN.VIEW],
                    roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER, UserRole.VIEWER]
                }
            },
            {
                name: 'ScanCreate',
                path: '/scan/create',
                component: 'scan/create',
                meta: {
                    title: '创建扫描',
                    requiresAuth: true,
                    permissions: [PERMISSIONS.SCAN.CREATE],
                    roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER]
                }
            }
        ]
    },
    {
        name: 'Report',
        path: '/report',
        meta: {
            title: '报告管理',
            icon: 'file-text',
            requiresAuth: true,
            layout: 'main',
            order: 4
        },
        children: [
            {
                name: 'ReportList',
                path: '/report/list',
                component: 'report/list',
                meta: {
                    title: '报告列表',
                    requiresAuth: true,
                    permissions: [PERMISSIONS.REPORT.VIEW],
                    roles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.USER, UserRole.VIEWER]
                }
            }
        ]
    },
    {
        name: 'System',
        path: '/system',
        meta: {
            title: '系统管理',
            icon: 'setting',
            requiresAuth: true,
            layout: 'main',
            roles: [UserRole.ADMIN],
            order: 5
        },
        children: [
            {
                name: 'UserManagement',
                path: '/system/users',
                component: 'system/users',
                meta: {
                    title: '用户管理',
                    requiresAuth: true,
                    permissions: [PERMISSIONS.USER.VIEW],
                    roles: [UserRole.ADMIN]
                }
            },
            {
                name: 'SystemSettings',
                path: '/system/settings',
                component: 'system/settings',
                meta: {
                    title: '系统设置',
                    requiresAuth: true,
                    permissions: [PERMISSIONS.SYSTEM.MANAGE],
                    roles: [UserRole.ADMIN]
                }
            }
        ]
    },
    {
        name: 'Errors',
        meta: {
            title: '错误页面',
            hidden: true
        },
        children: [
            {
                name: '403',
                path: '/403',
                component: '403',
                meta: {
                    title: '无权限访问',
                    hidden: true,
                    layout: 'blank'
                }
            },
            {
                name: '404',
                path: '/404',
                component: '404',
                meta: {
                    title: '未找到页面',
                    hidden: true,
                    layout: 'blank'
                }
            },
            {
                name: '500',
                path: '/500',
                component: '500',
                meta: {
                    title: '服务器错误',
                    hidden: true,
                    layout: 'blank'
                }
            }
        ]
    }
]

// 获取菜单路由（过滤隐藏项并排序）
export const getMenuRoutes = (): Route[] => {
    const filterAndSort = (routes: Route[]): Route[] => {
        return routes
            .filter(route => !route.meta?.hidden)
            .map(route => ({
                ...route,
                children: route.children ? filterAndSort(route.children) : undefined
            }))
            .sort((a, b) => (a.meta?.order || 999) - (b.meta?.order || 999))
    }
    
    return filterAndSort(RouteMetaConfig)
}

// 根据路径查找路由
export const findRouteByPath = (path: string): Route | undefined => {
    const findInRoutes = (routes: Route[]): Route | undefined => {
        for (const route of routes) {
            if (route.path === path) {
                return route
            }
            if (route.children) {
                const found = findInRoutes(route.children)
                if (found) return found
            }
        }
        return undefined
    }
    
    return findInRoutes(RouteMetaConfig)
}

// 获取面包屑路径
export const getBreadcrumbPath = (path: string): Route[] => {
    const breadcrumbs: Route[] = []
    
    const findPath = (routes: Route[], targetPath: string, currentPath: Route[] = []): boolean => {
        for (const route of routes) {
            const newPath = [...currentPath, route]
            
            if (route.path === targetPath) {
                breadcrumbs.push(...newPath)
                return true
            }
            
            if (route.children && findPath(route.children, targetPath, newPath)) {
                return true
            }
        }
        return false
    }
    
    findPath(RouteMetaConfig, path)
    return breadcrumbs
}

export default RouteMetaConfig