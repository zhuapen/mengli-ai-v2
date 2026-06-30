/**
 * 管理员后台模块类型定义
 */

// ===== 用户管理 =====

/** 用户状态 */
export type AdminUserStatus = 'pending' | 'approved' | 'rejected'

/** 用户角色 */
export type AdminUserRole = 'user' | 'admin'

/** 管理员看到的用户 */
export interface AdminUser {
  id: string
  email: string
  display_name: string
  role: AdminUserRole
  position?: string
  status: AdminUserStatus
  is_active: boolean
  created_at: string
  updated_at?: string
  approved_at?: string
  approved_by?: string
  rejected_at?: string
}

/** 用户列表查询参数 */
export interface AdminUserListParams {
  status?: AdminUserStatus | 'all'
  keyword?: string
}

/** 用户列表结果 */
export interface AdminUserListResult {
  users: AdminUser[]
}

/** 审批操作结果 */
export interface AdminApprovalResult {
  message: string
}

// ===== 数据看板（mock） =====

/** 看板统计 */
export interface AdminDashboardStats {
  totalUsers: number
  pendingUsers: number
  activeUsers: number
  todayLogins: number
  imageGenerationsToday: number
  copyGenerationsToday: number
  articleGenerationsToday: number
  creditsUsedToday: number
  tokensUsedToday: number
  estimatedCostToday: number
  failedRequestsToday: number
  successRate: number
}

/** 使用趋势 */
export interface AdminUsageTrendItem {
  date: string
  value: number
  label?: string
}

/** 功能使用 */
export interface AdminFeatureUsageItem {
  feature: string
  count: number
  percentage: number
}

/** 高消耗用户 */
export interface AdminTopUser {
  id: string
  email: string
  display_name: string
  usage: number
  cost: number
}

/** 最近任务 */
export interface AdminRecentTask {
  id: string
  user: string
  type: string
  status: string
  createdAt: string
}

/** 看板完整数据 */
export interface AdminDashboardData {
  stats: AdminDashboardStats
  trends: AdminUsageTrendItem[]
  featureUsage: AdminFeatureUsageItem[]
  topUsers: AdminTopUser[]
  recentTasks: AdminRecentTask[]
}
