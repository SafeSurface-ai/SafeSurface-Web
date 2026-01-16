// 用户角色枚举
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    VIEWER = 'viewer',
    OPERATOR = 'operator'
}

// 权限常量定义
export const PERMISSIONS = {
    // 仪表盘权限
    DASHBOARD: {
        VIEW: 'dashboard:view',
        MANAGE: 'dashboard:manage',
    },
    
    // 扫描任务权限
    SCAN: {
        VIEW: 'scan:view',
        CREATE: 'scan:create',
        UPDATE: 'scan:update',
        DELETE: 'scan:delete',
        EXECUTE: 'scan:execute',
    },
    
    // 报告权限
    REPORT: {
        VIEW: 'report:view',
        EXPORT: 'report:export',
        SHARE: 'report:share',
    },
    
    // 用户管理权限
    USER: {
        VIEW: 'user:view',
        CREATE: 'user:create',
        UPDATE: 'user:update',
        DELETE: 'user:delete',
    },
    
    // 系统设置权限
    SYSTEM: {
        VIEW: 'system:view',
        MANAGE: 'system:manage',
    },
} as const

// 角色权限映射
export const ROLE_PERMISSIONS = {
    [UserRole.ADMIN]: [
        // 管理员拥有所有权限
        ...Object.values(PERMISSIONS.DASHBOARD),
        ...Object.values(PERMISSIONS.SCAN),
        ...Object.values(PERMISSIONS.REPORT),
        ...Object.values(PERMISSIONS.USER),
        ...Object.values(PERMISSIONS.SYSTEM),
    ],
    
    [UserRole.OPERATOR]: [
        // 操作员可以查看仪表盘和管理扫描任务
        PERMISSIONS.DASHBOARD.VIEW,
        PERMISSIONS.DASHBOARD.MANAGE,
        ...Object.values(PERMISSIONS.SCAN),
        ...Object.values(PERMISSIONS.REPORT),
    ],
    
    [UserRole.USER]: [
        // 普通用户可以查看和创建扫描任务
        PERMISSIONS.DASHBOARD.VIEW,
        PERMISSIONS.SCAN.VIEW,
        PERMISSIONS.SCAN.CREATE,
        PERMISSIONS.SCAN.EXECUTE,
        PERMISSIONS.REPORT.VIEW,
        PERMISSIONS.REPORT.EXPORT,
    ],
    
    [UserRole.VIEWER]: [
        // 查看者只有查看权限
        PERMISSIONS.DASHBOARD.VIEW,
        PERMISSIONS.SCAN.VIEW,
        PERMISSIONS.REPORT.VIEW,
    ],
}

// 获取用户权限
export const getUserPermissions = (roles: UserRole[]): string[] => {
    const permissions = new Set<string>()
    
    roles.forEach(role => {
        const rolePermissions = ROLE_PERMISSIONS[role] || []
        rolePermissions.forEach(permission => permissions.add(permission))
    })
    
    return Array.from(permissions)
}

// 检查用户是否有特定权限
export const hasPermission = (userRoles: UserRole[], permission: string): boolean => {
    const userPermissions = getUserPermissions(userRoles)
    return userPermissions.includes(permission)
}

// 检查用户是否有任一权限
export const hasAnyPermission = (userRoles: UserRole[], permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(userRoles, permission))
}

// 检查用户是否有所有权限
export const hasAllPermissions = (userRoles: UserRole[], permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(userRoles, permission))
}