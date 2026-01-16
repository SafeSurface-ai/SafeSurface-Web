// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    TIMEOUT: 30000,
    RETRY_COUNT: 3,
} as const

// Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'safesurface_access_token',
    USER_INFO: 'safesurface_user_info',
    THEME: 'safesurface_theme',
} as const

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    WELCOME: '/welcome',
    PROFILE: '/profile',
    SETTINGS: '/settings',
} as const

// Task Status
export const TASK_STATUS = {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
} as const
