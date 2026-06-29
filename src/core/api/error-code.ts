/**
 * API 错误码规范
 * 统一前后端错误码约定
 */

/** 错误码枚举 */
export enum ApiErrorCode {
  /** 业务成功 */
  Success = 0,
  /** 未授权 / token 过期 */
  Unauthorized = 401,
  /** 无权限 */
  Forbidden = 403,
  /** 资源不存在 */
  NotFound = 404,
  /** 请求参数错误 */
  ValidationError = 422,
  /** 服务器内部错误 */
  ServerError = 500,
  /** 网络异常 */
  NetworkError = 10000,
  /** 未知错误 */
  UnknownError = 10001,
}

/** 错误码文案映射 */
export const API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  [ApiErrorCode.Success]: '请求成功',
  [ApiErrorCode.Unauthorized]: '登录已过期，请重新登录',
  [ApiErrorCode.Forbidden]: '暂无权限访问',
  [ApiErrorCode.NotFound]: '请求资源不存在',
  [ApiErrorCode.ValidationError]: '请求参数错误',
  [ApiErrorCode.ServerError]: '服务器错误，请稍后重试',
  [ApiErrorCode.NetworkError]: '网络异常，请检查网络连接',
  [ApiErrorCode.UnknownError]: '未知错误，请稍后重试',
}

/** 根据 HTTP 状态码获取错误文案 */
export function getErrorMessage(statusCode: number): string {
  const code = statusCode as ApiErrorCode
  return API_ERROR_MESSAGES[code] ?? API_ERROR_MESSAGES[ApiErrorCode.UnknownError]
}
