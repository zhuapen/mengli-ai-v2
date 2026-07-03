<script setup lang="ts">
import { onMounted } from 'vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsError from '@/design-system/components/DsError.vue'
import DsEmpty from '@/design-system/components/DsEmpty.vue'
import { useAdminStore } from '../store'
import type { AdminUserStatus } from '../types'

const store = useAdminStore()

onMounted(() => {
  if (store.users.length === 0) {
    store.loadUsers()
  }
})

function getStatusLabel(status: string, isActive: boolean): string {
  if (!isActive) return '已禁用'
  switch (status) {
    case 'pending': return '待审批'
    case 'approved': return '已通过'
    case 'rejected': return '已拒绝'
    default: return status
  }
}

function getStatusClass(status: string, isActive: boolean): string {
  if (!isActive) return 'status-disabled'
  switch (status) {
    case 'pending': return 'status-pending'
    case 'approved': return 'status-approved'
    case 'rejected': return 'status-rejected'
    default: return ''
  }
}

function handleApprove(userId: string) {
  store.approveUser(userId)
}

function handleReject(userId: string) {
  store.rejectUser(userId)
}

function handleToggle(userId: string) {
  store.toggleUser(userId)
}

function handleDelete(userId: string, email: string) {
  if (confirm(`确认删除用户 ${email}？此操作不可恢复。`)) {
    store.deleteUser(userId)
  }
}

function handleFilter(status: AdminUserStatus | 'all') {
  store.setFilter(status)
}

function handleSearch(e: Event) {
  store.setKeyword((e.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="approval-panel">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="filter-tabs">
        <button
          v-for="tab in (['all', 'pending', 'approved', 'rejected'] as const)"
          :key="tab"
          class="filter-tab"
          :class="{ active: store.userStatusFilter === tab }"
          @click="handleFilter(tab)"
        >
          {{ tab === 'all' ? '全部' : tab === 'pending' ? '待审批' : tab === 'approved' ? '已通过' : '已拒绝' }}
          <span v-if="tab === 'pending' && store.pendingCount > 0" class="badge">{{ store.pendingCount }}</span>
        </button>
      </div>
      <input
        type="text"
        class="search-input"
        placeholder="搜索邮箱或昵称..."
        :value="store.keyword"
        @input="handleSearch"
      />
    </div>

    <!-- Loading -->
    <DsLoading v-if="store.loading && store.users.length === 0" text="正在加载用户列表..." />

    <!-- Error -->
    <DsError
      v-else-if="store.error && store.users.length === 0"
      :message="store.error"
      @retry="store.loadUsers()"
    />

    <!-- Empty -->
    <DsEmpty
      v-else-if="store.filteredUsers.length === 0 && !store.loading"
      icon="👥"
      title="暂无用户"
      description="没有符合条件的用户"
    />

    <!-- 用户列表 -->
    <div v-else class="user-table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th>邮箱</th>
            <th>昵称</th>
            <th>角色</th>
            <th>状态</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in store.filteredUsers" :key="user.id">
            <td class="cell-email">{{ user.email }}</td>
            <td>{{ user.display_name }}</td>
            <td>
              <span class="role-badge" :class="'role-' + user.role">{{ user.role === 'admin' ? '管理员' : '用户' }}</span>
            </td>
            <td>
              <span class="status-badge" :class="getStatusClass(user.status, user.is_active)">
                {{ getStatusLabel(user.status, user.is_active) }}
              </span>
            </td>
            <td class="cell-date">{{ user.created_at }}</td>
            <td class="cell-actions">
              <button
                v-if="user.status === 'pending'"
                class="action-btn approve"
                :disabled="store.actionLoading"
                @click="handleApprove(user.id)"
              >
                通过
              </button>
              <button
                v-if="user.status === 'pending'"
                class="action-btn reject"
                :disabled="store.actionLoading"
                @click="handleReject(user.id)"
              >
                拒绝
              </button>
              <button
                v-if="user.status === 'approved'"
                class="action-btn toggle"
                :disabled="store.actionLoading"
                @click="handleToggle(user.id)"
              >
                {{ user.is_active ? '禁用' : '启用' }}
              </button>
              <button
                class="action-btn delete"
                :disabled="store.actionLoading"
                @click="handleDelete(user.id, user.email)"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.approval-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  border: 1.5px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--ds-font-family);
}

.filter-tab:hover {
  border-color: var(--ds-color-black);
}

.filter-tab.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
}

.badge {
  display: inline-block;
  padding: 1px 6px;
  margin-left: 4px;
  background: var(--ds-color-error);
  color: white;
  border-radius: 10px;
  font-size: 11px;
}

.search-input {
  padding: 8px 16px;
  border: 1.5px solid var(--ds-color-gray-200);
  font-size: 13px;
  font-family: var(--ds-font-family);
  outline: none;
  width: 240px;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--ds-color-primary);
}

.user-table-wrapper {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 700px;
}

.user-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: var(--ds-color-gray-400);
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid var(--ds-color-black);
}

.user-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--ds-color-gray-100);
  vertical-align: middle;
}

.cell-email {
  font-weight: 600;
}

.cell-date {
  font-size: 13px;
  color: var(--ds-color-gray-400);
}

.cell-actions {
  display: flex;
  gap: 6px;
}

.role-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.role-admin {
  background: var(--ds-color-primary);
  color: white;
}

.role-user {
  background: var(--ds-color-gray-100);
  color: var(--ds-color-gray-600);
}

.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background: #FEF3C7;
  color: #92400E;
}

.status-approved {
  background: #D1FAE5;
  color: #065F46;
}

.status-rejected {
  background: #FEE2E2;
  color: #991B1B;
}

.status-disabled {
  background: var(--ds-color-gray-100);
  color: var(--ds-color-gray-400);
}

.action-btn {
  padding: 4px 10px;
  border: 1px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--ds-font-family);
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.action-btn.approve {
  border-color: #10B981;
  color: #10B981;
}

.action-btn.approve:hover {
  background: #10B981;
  color: white;
}

.action-btn.reject {
  border-color: #EF4444;
  color: #EF4444;
}

.action-btn.reject:hover {
  background: #EF4444;
  color: white;
}

.action-btn.toggle {
  border-color: var(--ds-color-gray-400);
  color: var(--ds-color-gray-600);
}

.action-btn.toggle:hover {
  background: var(--ds-color-gray-600);
  color: white;
}

.action-btn.delete {
  border-color: #EF4444;
  color: #EF4444;
}

.action-btn.delete:hover {
  background: #EF4444;
  color: white;
}
</style>
