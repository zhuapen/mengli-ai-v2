/**
 * 系统配置
 */
export const systemConfig = {
  /** 应用名称 */
  appName: '萌力互动',
  appFullName: '萌力互动 · AI创作平台',

  /** API 配置 */
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000,
  },

  /** 分页默认值 */
  pagination: {
    defaultPage: 1,
    defaultPageSize: 20,
    pageSizes: [10, 20, 50, 100],
  },

  /** 上传限制 */
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt', '.md'],
  },

  /** AI 配置 */
  ai: {
    maxConcurrent: 3,
    retryCount: 2,
    retryDelay: 1000,
  },

  /** 缓存过期时间（毫秒） */
  cache: {
    short: 5 * 60 * 1000,      // 5 分钟
    medium: 30 * 60 * 1000,    // 30 分钟
    long: 24 * 60 * 60 * 1000, // 24 小时
  },
}

export default systemConfig
