/**
 * 管理员后台 Service
 * 用户管理：优先真实 API
 * 数据看板：mock（后端 dashboard/stats 接口未就绪）
 */
import { isFeatureEnabled } from '@/core/config/feature'
import { logger } from '@/core/logger'
import { adminApi } from './api'
import { adminMockApi } from './mock'
import type {
  AdminUser,
  AdminUserListParams,
  AdminUserListResult,
  AdminApprovalResult,
  AdminDashboardData,
} from './types'

function useMock(): boolean {
  return isFeatureEnabled('enableMock')
}

export const adminService = {
  /** 获取用户列表 */
  async getUsers(params?: AdminUserListParams): Promise<AdminUserListResult> {
    logger.info('[AdminService] getUsers', params)
    try {
      if (useMock()) {
        return await adminMockApi.getUsers(params)
      }
      return await adminApi.getUsers(params)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '获取用户列表失败'
      logger.error('[AdminService] getUsers failed', msg)
      throw new Error(msg)
    }
  },

  /** 审批通过 */
  async approveUser(userId: string): Promise<AdminApprovalResult> {
    logger.info('[AdminService] approveUser', { userId })
    try {
      if (useMock()) {
        return await adminMockApi.approveUser(userId)
      }
      return await adminApi.approveUser(userId)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '审批失败'
      logger.error('[AdminService] approveUser failed', msg)
      throw new Error(msg)
    }
  },

  /** 拒绝审批 */
  async rejectUser(userId: string): Promise<AdminApprovalResult> {
    logger.info('[AdminService] rejectUser', { userId })
    try {
      if (useMock()) {
        return await adminMockApi.rejectUser(userId)
      }
      return await adminApi.rejectUser(userId)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '拒绝失败'
      logger.error('[AdminService] rejectUser failed', msg)
      throw new Error(msg)
    }
  },

  /** 切换启用/禁用 */
  async toggleUser(userId: string): Promise<AdminApprovalResult> {
    logger.info('[AdminService] toggleUser', { userId })
    try {
      if (useMock()) {
        return await adminMockApi.toggleUser(userId)
      }
      return await adminApi.toggleUser(userId)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '操作失败'
      logger.error('[AdminService] toggleUser failed', msg)
      throw new Error(msg)
    }
  },

  /** 删除用户 */
  async deleteUser(userId: string): Promise<AdminApprovalResult> {
    logger.info('[AdminService] deleteUser', { userId })
    try {
      if (useMock()) {
        return await adminMockApi.deleteUser(userId)
      }
      return await adminApi.deleteUser(userId)
    } catch (e) {
      const msg = e instanceof Error ? e.message : '删除失败'
      logger.error('[AdminService] deleteUser failed', msg)
      throw new Error(msg)
    }
  },

  /**
   * 获取数据看板
   * ⚠️ 后端 dashboard/stats 接口未就绪，当前强制 mock
   * 待后端实现后移除 FALLBACK_TO_MOCK
   */
  async getDashboard(): Promise<AdminDashboardData> {
    logger.info('[AdminService] getDashboard')
    // 后端无此接口，强制 mock
    return await adminMockApi.getDashboard()
  },
}
