/**
 * 应用配置
 * 从环境变量和构建时注入的全局变量读取
 */

/** 应用名称 */
export const appName = import.meta.env.VITE_APP_NAME || 'Mengli AI Platform'

/** 运行环境 */
export const appEnv = import.meta.env.VITE_APP_ENV || 'development'

/** API 基础 URL */
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

/** 是否启用 Mock */
export const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true'

/** 应用版本（构建时注入） */
export const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0'

/** 构建时间（构建时注入） */
export const buildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : ''

/** 是否生产环境 */
export const isProduction = appEnv === 'production'

/** 是否开发环境 */
export const isDevelopment = appEnv === 'development'
