/**
 * 测试用 Mock API 工具
 * 提供统一的 mock 数据和辅助函数
 */

/** 创建成功的 ApiResponse */
export function createSuccessResponse<T>(data: T) {
  return {
    code: 0,
    message: 'success',
    success: true,
    data,
  }
}

/** 创建失败的 ApiResponse */
export function createErrorResponse(message: string, code = 500) {
  return {
    code,
    message,
    success: false,
    data: null,
  }
}

/** 模拟延迟 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
