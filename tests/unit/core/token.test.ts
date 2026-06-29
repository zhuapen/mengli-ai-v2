import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  removeRefreshToken,
  clearTokens,
  setTokens,
} from '@/core/auth/token'

describe('Token 管理', () => {
  beforeEach(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  })

  describe('AccessToken', () => {
    it('初始状态返回 null', () => {
      expect(getAccessToken()).toBeNull()
    })

    it('setAccessToken 写入后可读取', () => {
      setAccessToken('test-token')
      expect(getAccessToken()).toBe('test-token')
    })

    it('removeAccessToken 清除后返回 null', () => {
      setAccessToken('test-token')
      removeAccessToken()
      expect(getAccessToken()).toBeNull()
    })
  })

  describe('RefreshToken', () => {
    it('初始状态返回 null', () => {
      expect(getRefreshToken()).toBeNull()
    })

    it('setRefreshToken 写入后可读取', () => {
      setRefreshToken('refresh-token')
      expect(getRefreshToken()).toBe('refresh-token')
    })

    it('removeRefreshToken 清除后返回 null', () => {
      setRefreshToken('refresh-token')
      removeRefreshToken()
      expect(getRefreshToken()).toBeNull()
    })
  })

  describe('setTokens', () => {
    it('同时设置两个 token', () => {
      setTokens('access', 'refresh')
      expect(getAccessToken()).toBe('access')
      expect(getRefreshToken()).toBe('refresh')
    })

    it('只设置 accessToken 时 refreshToken 不变', () => {
      setRefreshToken('old-refresh')
      setTokens('new-access')
      expect(getAccessToken()).toBe('new-access')
      expect(getRefreshToken()).toBe('old-refresh')
    })
  })

  describe('clearTokens', () => {
    it('清除所有 token', () => {
      setTokens('access', 'refresh')
      clearTokens()
      expect(getAccessToken()).toBeNull()
      expect(getRefreshToken()).toBeNull()
    })
  })
})
