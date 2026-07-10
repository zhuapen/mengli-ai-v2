import { describe, it, expect } from 'vitest'
import { validateCompanyEmail } from '@/modules/auth/email'

describe('企业邮箱校验', () => {
  describe('允许的邮箱', () => {
    it('标准企业邮箱', () => {
      const r = validateCompanyEmail('user@menglihudong.com')
      expect(r.valid).toBe(true)
    })

    it('大写企业邮箱', () => {
      const r = validateCompanyEmail('USER@MENGLIHUDONG.COM')
      expect(r.valid).toBe(true)
    })

    it('前后有空格的企业邮箱', () => {
      const r = validateCompanyEmail('  user@menglihudong.com  ')
      expect(r.valid).toBe(true)
    })
  })

  describe('拒绝的邮箱', () => {
    it('user@qq.com', () => {
      const r = validateCompanyEmail('user@qq.com')
      expect(r.valid).toBe(false)
      expect(r.error).toContain('menglihudong.com')
    })

    it('user@gmail.com', () => {
      const r = validateCompanyEmail('user@gmail.com')
      expect(r.valid).toBe(false)
    })

    it('user@sub.menglihudong.com', () => {
      const r = validateCompanyEmail('user@sub.menglihudong.com')
      expect(r.valid).toBe(false)
    })

    it('user@evil-menglihudong.com', () => {
      const r = validateCompanyEmail('user@evil-menglihudong.com')
      expect(r.valid).toBe(false)
    })

    it('user@menglihudong.com.evil.com', () => {
      const r = validateCompanyEmail('user@menglihudong.com.evil.com')
      expect(r.valid).toBe(false)
    })

    it('menglihudong.com@gmail.com', () => {
      const r = validateCompanyEmail('menglihudong.com@gmail.com')
      expect(r.valid).toBe(false)
    })

    it('user@@menglihudong.com', () => {
      const r = validateCompanyEmail('user@@menglihudong.com')
      expect(r.valid).toBe(false)
    })

    it('非法邮箱格式', () => {
      const r = validateCompanyEmail('not-an-email')
      expect(r.valid).toBe(false)
    })

    it('空邮箱', () => {
      const r = validateCompanyEmail('')
      expect(r.valid).toBe(false)
      expect(r.error).toBe('请输入企业微信邮箱')
    })

    it('纯空格', () => {
      const r = validateCompanyEmail('   ')
      expect(r.valid).toBe(false)
      expect(r.error).toBe('请输入企业微信邮箱')
    })
  })
})
