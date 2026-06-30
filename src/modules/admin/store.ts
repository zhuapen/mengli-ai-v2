/**
 * 管理员后台 Store
 * 只做状态管理，只调用 Service
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminService } from './service'
import type { AdminUser, AdminDashboardData, AdminUserStatus } from './types'

export const useAdminStore = defineStore('admin', () => {
  // ===== State =====
  const activeTab = ref<'dashboard' | 'users'>('dashboard')
  const loading = ref(false)
  const actionLoading = ref(false)
  const error = ref<string | null>(null)
  const dashboardData = ref<AdminDashboardData | null>(null)
  const users = ref<AdminUser[]>([])
  const userStatusFilter = ref<AdminUserStatus | 'all'>('all')
  const keyword = ref('')
  const lastUpdatedAt = ref<string>('')

  // ===== Getters =====
  const filteredUsers = computed(() => {
    let result = [...users.value]
    if (userStatusFilter.value !== 'all') {
      result = result.filter((u) => u.status === userStatusFilter.value)
    }
    if (keyword.value) {
      const kw = keyword.value.toLowerCase()
      result = result.filter(
        (u) => u.email.toLowerCase().includes(kw) || u.display_name.toLowerCase().includes(kw)
      )
    }
    return result
  })

  const pendingCount = computed(() => users.value.filter((u) => u.status === 'pending').length)

  // ===== Actions =====

  /** 加载数据看板 */
  async function loadDashboard(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      dashboardData.value = await adminService.getDashboard()
      lastUpdatedAt.value = new Date().toLocaleTimeString()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取看板数据失败'
    } finally {
      loading.value = false
    }
  }

  /** 加载用户列表 */
  async function loadUsers(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const result = await adminService.getUsers({
        status: userStatusFilter.value === 'all' ? undefined : userStatusFilter.value,
      })
      users.value = result.users
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取用户列表失败'
    } finally {
      loading.value = false
    }
  }

  /** 审批通过 */
  async function approveUser(userId: string): Promise<void> {
    actionLoading.value = true
    error.value = null
    try {
      await adminService.approveUser(userId)
      const user = users.value.find((u) => u.id === userId)
      if (user) {
        user.status = 'approved'
        user.approved_at = new Date().toISOString()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '审批失败'
    } finally {
      actionLoading.value = false
    }
  }

  /** 拒绝审批 */
  async function rejectUser(userId: string): Promise<void> {
    actionLoading.value = true
    error.value = null
    try {
      await adminService.rejectUser(userId)
      const user = users.value.find((u) => u.id === userId)
      if (user) {
        user.status = 'rejected'
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '拒绝失败'
    } finally {
      actionLoading.value = false
    }
  }

  /** 切换启用/禁用 */
  async function toggleUser(userId: string): Promise<void> {
    actionLoading.value = true
    error.value = null
    try {
      await adminService.toggleUser(userId)
      const user = users.value.find((u) => u.id === userId)
      if (user) {
        user.is_active = !user.is_active
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '操作失败'
    } finally {
      actionLoading.value = false
    }
  }

  /** 删除用户 */
  async function deleteUser(userId: string): Promise<void> {
    actionLoading.value = true
    error.value = null
    try {
      await adminService.deleteUser(userId)
      users.value = users.value.filter((u) => u.id !== userId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除失败'
    } finally {
      actionLoading.value = false
    }
  }

  /** 设置筛选状态 */
  function setFilter(status: AdminUserStatus | 'all'): void {
    userStatusFilter.value = status
    loadUsers()
  }

  /** 设置搜索关键词 */
  function setKeyword(kw: string): void {
    keyword.value = kw
  }

  /** 切换 tab */
  function setTab(tab: 'dashboard' | 'users'): void {
    activeTab.value = tab
    if (tab === 'users' && users.value.length === 0) {
      loadUsers()
    }
    if (tab === 'dashboard' && !dashboardData.value) {
      loadDashboard()
    }
  }

  /** 清空错误 */
  function clearError(): void {
    error.value = null
  }

  /** 初始化 */
  async function init(): Promise<void> {
    await loadDashboard()
  }

  /** 刷新当前 tab */
  async function refresh(): Promise<void> {
    if (activeTab.value === 'dashboard') {
      await loadDashboard()
    } else {
      await loadUsers()
    }
  }

  return {
    activeTab,
    loading,
    actionLoading,
    error,
    dashboardData,
    users,
    userStatusFilter,
    keyword,
    lastUpdatedAt,
    filteredUsers,
    pendingCount,
    loadDashboard,
    loadUsers,
    approveUser,
    rejectUser,
    toggleUser,
    deleteUser,
    setFilter,
    setKeyword,
    setTab,
    clearError,
    init,
    refresh,
  }
})
