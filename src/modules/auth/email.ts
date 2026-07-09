/**
 * 企业邮箱校验工具
 * 仅允许 @menglihudong.com 域名
 */

const ALLOWED_DOMAIN = 'menglihudong.com'

export interface EmailValidationResult {
  valid: boolean
  error?: string
}

/**
 * 校验注册邮箱是否为合法的企业邮箱
 * @param raw 用户输入的原始邮箱字符串
 * @returns 校验结果
 */
export function validateCompanyEmail(raw: string): EmailValidationResult {
  const trimmed = raw.trim()

  if (!trimmed) {
    return { valid: false, error: '请输入企业微信邮箱' }
  }

  // 基本邮箱格式：至少包含一个 @，@ 前后各有非空字符，域名含 .
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: '请输入有效的企业微信邮箱' }
  }

  // 提取最后一个 @ 后的域名
  const atIndex = trimmed.lastIndexOf('@')
  const domain = trimmed.slice(atIndex + 1).toLowerCase()

  // 严格匹配公司域名，不允许子域名或相似域名
  if (domain !== ALLOWED_DOMAIN) {
    return { valid: false, error: '仅支持使用 @menglihudong.com 企业微信邮箱注册' }
  }

  return { valid: true }
}
