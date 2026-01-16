/**
 * 邮箱验证
 */
export function isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * 密码强度验证（至少8位，包含字母和数字）
 */
export function isStrongPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
    return passwordRegex.test(password)
}

/**
 * 用户名验证（4-20位字母、数字、下划线）
 */
export function isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/
    return usernameRegex.test(username)
}

/**
 * URL验证
 */
export function isURL(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}
