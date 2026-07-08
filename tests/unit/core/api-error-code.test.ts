import { describe, it, expect } from 'vitest'
import { ApiErrorCode, API_ERROR_MESSAGES, getErrorMessage } from '@/core/api/error-code'

describe('ApiErrorCode', () => {
  it('包含所有必要错误码', () => {
    expect(ApiErrorCode.Success).toBe(0)
    expect(ApiErrorCode.Unauthorized).toBe(401)
    expect(ApiErrorCode.Forbidden).toBe(403)
    expect(ApiErrorCode.NotFound).toBe(404)
    expect(ApiErrorCode.ValidationError).toBe(422)
    expect(ApiErrorCode.ServerError).toBe(500)
    expect(ApiErrorCode.GatewayTimeout).toBe(504)
    expect(ApiErrorCode.NetworkError).toBe(10000)
    expect(ApiErrorCode.UnknownError).toBe(10001)
    expect(ApiErrorCode.RequestTimeout).toBe(10002)
  })
})

describe('API_ERROR_MESSAGES', () => {
  it('每个错误码都有对应文案', () => {
    for (const code of Object.values(ApiErrorCode)) {
      if (typeof code === 'number') {
        expect(API_ERROR_MESSAGES[code as ApiErrorCode]).toBeDefined()
        expect(API_ERROR_MESSAGES[code as ApiErrorCode].length).toBeGreaterThan(0)
      }
    }
  })
})

describe('getErrorMessage', () => {
  it('已知错误码返回正确文案', () => {
    expect(getErrorMessage(0)).toBe('请求成功')
    expect(getErrorMessage(401)).toBe('登录已过期，请重新登录')
    expect(getErrorMessage(403)).toBe('暂无权限访问')
    expect(getErrorMessage(404)).toBe('请求资源不存在')
    expect(getErrorMessage(422)).toBe('请求参数错误')
    expect(getErrorMessage(500)).toBe('服务器错误，请稍后重试')
    expect(getErrorMessage(504)).toBe('请求超时，请稍后重试')
    expect(getErrorMessage(10000)).toBe('网络异常，请检查网络连接')
    expect(getErrorMessage(10001)).toBe('未知错误，请稍后重试')
    expect(getErrorMessage(10002)).toBe('请求超时，请稍后重试')
  })

  it('未知错误码返回默认文案', () => {
    expect(getErrorMessage(999)).toBe('未知错误，请稍后重试')
    expect(getErrorMessage(-1)).toBe('未知错误，请稍后重试')
  })
})
