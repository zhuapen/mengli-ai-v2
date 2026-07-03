/**
 * 管理员后台 Mock API
 * 数据看板：全部 mock（后端无 dashboard/stats 接口）
 * 用户管理：模拟真实后端结构
 */
import type {
  AdminUser,
  AdminUserListResult,
  AdminApprovalResult,
  AdminDashboardData,
} from './types'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const mockUsers: AdminUser[] = [
  { id: '1', email: 'admin@mengliai.cn', display_name: '管理员', role: 'admin', status: 'approved', is_active: true, created_at: '2026-01-01', position: '管理员' },
  { id: '2', email: '3121950980@qq.com', display_name: '管理员', role: 'admin', status: 'approved', is_active: true, created_at: '2026-06-22', position: '管理员' },
  { id: '3', email: 'test@test.com', display_name: '测试用户', role: 'user', status: 'pending', is_active: true, created_at: '2026-06-25' },
  { id: '4', email: 'test2@test.com', display_name: '测试', role: 'user', status: 'pending', is_active: true, created_at: '2026-06-26' },
  { id: '5', email: 'test3@test.com', display_name: '测试', role: 'user', status: 'pending', is_active: true, created_at: '2026-06-27' },
  { id: '6', email: 'user@example.com', display_name: '普通用户', role: 'user', status: 'approved', is_active: true, created_at: '2026-06-20' },
]

export const adminMockApi = {
  async getUsers(params?: { status?: string; keyword?: string }): Promise<AdminUserListResult> {
    await delay(500)
    let users = [...mockUsers]
    if (params?.status && params.status !== 'all') {
      users = users.filter((u) => u.status === params.status)
    }
    if (params?.keyword) {
      const kw = params.keyword.toLowerCase()
      users = users.filter((u) =>
        u.email.toLowerCase().includes(kw) || u.display_name.toLowerCase().includes(kw)
      )
    }
    return { users }
  },

  async approveUser(userId: string): Promise<AdminApprovalResult> {
    await delay(300)
    const user = mockUsers.find((u) => u.id === userId)
    if (user) {
      user.status = 'approved'
      user.approved_at = new Date().toISOString()
    }
    return { message: '已审批通过' }
  },

  async rejectUser(userId: string): Promise<AdminApprovalResult> {
    await delay(300)
    const user = mockUsers.find((u) => u.id === userId)
    if (user) {
      user.status = 'rejected'
      user.rejected_at = new Date().toISOString()
    }
    return { message: '已拒绝' }
  },

  async toggleUser(userId: string): Promise<AdminApprovalResult> {
    await delay(300)
    const user = mockUsers.find((u) => u.id === userId)
    if (user) {
      user.is_active = !user.is_active
    }
    return { message: '已切换状态' }
  },

  async deleteUser(userId: string): Promise<AdminApprovalResult> {
    await delay(300)
    const idx = mockUsers.findIndex((u) => u.id === userId)
    if (idx >= 0) mockUsers.splice(idx, 1)
    return { message: '已删除' }
  },

  async getDashboard(): Promise<AdminDashboardData> {
    await delay(800)
    return {
      stats: {
        totalUsers: 6,
        pendingUsers: 3,
        activeUsers: 5,
        todayLogins: 2,
        imageGenerationsToday: 15,
        copyGenerationsToday: 28,
        articleGenerationsToday: 5,
        creditsUsedToday: 120,
        tokensUsedToday: 45000,
        estimatedCostToday: 12.5,
        failedRequestsToday: 3,
        successRate: 94.2,
      },
      trends: [
        { date: '06-24', value: 12 },
        { date: '06-25', value: 18 },
        { date: '06-26', value: 25 },
        { date: '06-27', value: 22 },
        { date: '06-28', value: 30 },
        { date: '06-29', value: 28 },
        { date: '06-30', value: 35 },
      ],
      featureUsage: [
        { feature: '文案生成', count: 128, percentage: 35 },
        { feature: '图片生成', count: 85, percentage: 23 },
        { feature: '公众号写稿', count: 45, percentage: 12 },
        { feature: '媒体库', count: 62, percentage: 17 },
        { feature: '素材库', count: 48, percentage: 13 },
      ],
      topUsers: [
        { id: '1', email: 'admin@mengliai.cn', display_name: '管理员', usage: 156, cost: 45.2 },
        { id: '6', email: 'user@example.com', display_name: '普通用户', usage: 89, cost: 22.1 },
      ],
      recentTasks: [
        { id: 't1', user: 'admin@mengliai.cn', type: '文案生成', status: '成功', createdAt: '2026-06-30 10:30:00' },
        { id: 't2', user: 'user@example.com', type: '图片生成', status: '成功', createdAt: '2026-06-30 10:15:00' },
        { id: 't3', user: 'admin@mengliai.cn', type: '公众号写稿', status: '失败', createdAt: '2026-06-30 09:50:00' },
      ],
    }
  },
}
