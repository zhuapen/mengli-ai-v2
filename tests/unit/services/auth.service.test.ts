import { describe, it, expect, beforeEach } from 'vitest'
import { authService } from '@/modules/auth/service'
import { getAccessToken, clearTokens } from '@/core/auth/token'

describe('authService', () => {
  beforeEach(() => {
    clearTokens()
  })

  describe('login', () => {
    it('登录成功后写入 token', async () => {
      const result = await authService.login({
        account: 'admin',
        password: '123456',
      })
      expect(result.user).toBeDefined()
      expect(result.user.username).toBe('管理员')
      expect(result.tokens.accessToken).toBeDefined()
      expect(getAccessToken()).toBeDefined()
    })

    it('普通用户登录成功', async () => {
      const result = await authService.login({
        account: 'user',
        password: 'pass',
      })
      expect(result.user).toBeDefined()
      expect(result.tokens.accessToken).toBeDefined()
    })

    it('空账号密码抛出错误', async () => {
      await expect(
        authService.login({ account: '', password: '' }),
      ).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('登出后清理 token', async () => {
      await authService.login({ account: 'admin', password: '123456' })
      expect(getAccessToken()).toBeDefined()

      await authService.logout()
      expect(getAccessToken()).toBeNull()
    })
  })

  describe('getCurrentUser', () => {
    it('返回用户信息', async () => {
      const user = await authService.getCurrentUser()
      expect(user).toBeDefined()
      expect(user.id).toBeDefined()
      expect(user.username).toBeDefined()
    })
  })

  describe('hasToken', () => {
    it('无 token 时返回 false', () => {
      clearTokens()
      expect(authService.hasToken()).toBe(false)
    })

    it('有 token 时返回 true', async () => {
      await authService.login({ account: 'admin', password: '123456' })
      expect(authService.hasToken()).toBe(true)
    })
  })
})
