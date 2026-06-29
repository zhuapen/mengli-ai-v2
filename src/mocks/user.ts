/**
 * 用户 Mock API（兼容旧接口）
 * Auth 模块已迁移到 modules/auth/mock.ts
 * 此文件保留用于其他模块需要获取用户信息的场景
 */
import type { ApiResponse } from '@/core/api/types'

export interface MockUser {
  id: string
  username: string
  email: string
  avatar: string
  role: 'user' | 'vip' | 'admin'
  credits: number
  createdAt: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockUserData: MockUser = {
  id: '1',
  username: '萌力用户',
  email: 'user@mengli.ai',
  avatar: '👤',
  role: 'user',
  credits: 100,
  createdAt: '2024-01-15',
}

export const userMockApi = {
  async getUserInfo(): Promise<ApiResponse<MockUser>> {
    await delay(500)
    return { code: 0, message: 'success', success: true, data: mockUserData }
  },
}
