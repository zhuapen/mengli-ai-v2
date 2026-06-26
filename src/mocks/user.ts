/**
 * 用户 Mock 数据
 */

export interface MockUser {
  id: string
  username: string
  email: string
  avatar: string
  role: 'user' | 'vip' | 'admin'
  credits: number
  createdAt: string
}

export const mockUser: MockUser = {
  id: '1',
  username: '萌力用户',
  email: 'user@mengli.ai',
  avatar: '👤',
  role: 'user',
  credits: 100,
  createdAt: '2024-01-15',
}

export const mockAdminUser: MockUser = {
  id: '2',
  username: '管理员',
  email: 'admin@mengli.ai',
  avatar: '👑',
  role: 'admin',
  credits: 9999,
  createdAt: '2023-06-01',
}
