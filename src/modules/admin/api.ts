/**
 * 管理员后台真实 API
 * 只负责 HTTP 请求，不写业务逻辑
 */
import api from '@/core/api'
import type { AdminUserListResult, AdminApprovalResult } from './types'

export const adminApi = {
  /** 获取用户列表 */
  getUsers(params?: { status?: string; keyword?: string }): Promise<AdminUserListResult> {
    return api.get<AdminUserListResult>('/admin/users', { params })
  },

  /** 创建用户 */
  createUser(data: { email: string; password: string; display_name?: string; role?: string }): Promise<{ message: string; user_id: string }> {
    return api.post('/admin/users', data)
  },

  /** 审批通过 */
  approveUser(userId: string): Promise<AdminApprovalResult> {
    return api.put<AdminApprovalResult>(`/admin/users/${userId}/approve`)
  },

  /** 拒绝审批 */
  rejectUser(userId: string): Promise<AdminApprovalResult> {
    return api.put<AdminApprovalResult>(`/admin/users/${userId}/reject`)
  },

  /** 切换启用/禁用 */
  toggleUser(userId: string): Promise<AdminApprovalResult> {
    return api.put<AdminApprovalResult>(`/admin/users/${userId}/toggle`)
  },

  /** 删除用户 */
  deleteUser(userId: string): Promise<AdminApprovalResult> {
    return api.delete<AdminApprovalResult>(`/admin/users/${userId}`)
  },
}
