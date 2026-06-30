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
        email: 'admin@mengli.ai',
        password: '123456',
      })
      expect(result.user).toBeDefined()
      expect(result.user.username).toBe('管理员')
      expect(result.tokens.accessToken).toBeDefined()
      // 验证 token 已保存到本地
      expect(getAccessToken()).toBe(result.tokens.accessToken)
    })

    it('普通用户登录成功', async () => {
      const result = await authService.login({
        email: 'user@mengli.ai',
        password: 'pass',
      })
      expect(result.user).toBeDefined()
      expect(result.tokens.accessToken).toBeDefined()
    })

    it('空邮箱密码抛出错误', async () => {
      await expect(
        authService.login({ email: '', password: '' }),
      ).rejects.toThrow()
    })
  })

  describe('register', () => {
    it('注册成功后不写入 token', async () => {
      clearTokens()
      const result = await authService.register({
        email: 'new@mengli.ai',
        password: '123456',
      })
      expect(result.user).toBeDefined()
      expect(result.message).toBeDefined()
      // 注册不应写入 token
      expect(getAccessToken()).toBeNull()
    })
  })

  describe('logout', () => {
    it('登出后清理 token', async () => {
      await authService.login({ email: 'admin@mengli.ai', password: '123456' })
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
      expect(user.email).toBeDefined()
    })
  })

  describe('hasToken', () => {
    it('无 token 时返回 false', () => {
      clearTokens()
      expect(authService.hasToken()).toBe(false)
    })

    it('有 token 时返回 true', async () => {
      await authService.login({ email: 'admin@mengli.ai', password: '123456' })
      expect(authService.hasToken()).toBe(true)
    })
  })
})
