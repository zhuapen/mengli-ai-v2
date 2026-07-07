<script setup lang="ts">
import { onMounted } from 'vue'
import DsError from '@/design-system/components/DsError.vue'
import { useUserStore } from '@/core/stores/user'
import { useAdminStore } from './store'
import DashboardPanel from './components/DashboardPanel.vue'
import UserApprovalPanel from './components/UserApprovalPanel.vue'

const userStore = useUserStore()
const adminStore = useAdminStore()

onMounted(() => {
  if (userStore.role === 'admin') {
    adminStore.init()
  }
})

function handleRefresh() {
  adminStore.refresh()
}
</script>

<template>
  <div class="admin-page">
    <!-- 无权限提示 -->
    <div v-if="userStore.role !== 'admin'" class="no-permission">
      <DsError
        title="需要管理员权限"
        message="当前账号没有管理员权限，无法访问管理后台。"
        :show-retry="false"
      />
    </div>

    <!-- 管理后台主体 -->
    <template v-else>
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-header-inner">
          <div>
            <h1 class="page-title">管理后台</h1>
            <p class="page-desc">
              管理员：{{ userStore.username }}
              <span v-if="adminStore.lastUpdatedAt" class="last-updated">
                · 最后更新：{{ adminStore.lastUpdatedAt }}
              </span>
            </p>
          </div>
          <button class="refresh-btn" :disabled="adminStore.loading" @click="handleRefresh">
            {{ adminStore.loading ? '刷新中...' : '🔄 刷新' }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button
          class="admin-tab"
          :class="{ active: adminStore.activeTab === 'dashboard' }"
          @click="adminStore.setTab('dashboard')"
        >
          📊 数据看板
        </button>
        <button
          class="admin-tab"
          :class="{ active: adminStore.activeTab === 'users' }"
          @click="adminStore.setTab('users')"
        >
          👥 账号审批
          <span v-if="adminStore.pendingCount > 0" class="tab-badge">{{ adminStore.pendingCount }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="admin-content">
        <DashboardPanel v-if="adminStore.activeTab === 'dashboard'" />
        <UserApprovalPanel v-else-if="adminStore.activeTab === 'users'" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.admin-page {
  animation: pageEnter 0.2s ease;
}

.no-permission {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

/* Page Header */
.page-header {
  padding: 48px 48px 0;
  border-bottom: 1px solid var(--ds-color-gray-100);
  background: var(--ds-color-white);
}

.page-header-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 24px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--ds-color-black), var(--ds-color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  font-size: 14px;
  color: var(--ds-color-gray-400);
  margin-top: 8px;
}

.last-updated {
  font-size: 12px;
  color: var(--ds-color-gray-300);
}

.refresh-btn {
  padding: 8px 20px;
  background: var(--ds-color-white);
  border: 1.5px solid var(--ds-color-gray-200);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--ds-font-family);
}

.refresh-btn:hover {
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Tabs */
.admin-tabs {
  display: flex;
  gap: 8px;
  padding: 24px 48px;
  border-bottom: 1px solid var(--ds-color-gray-100);
  max-width: 1400px;
  margin: 0 auto;
}

.admin-tab {
  padding: 10px 24px;
  border: 1.5px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--ds-font-family);
  display: flex;
  align-items: center;
  gap: 6px;
}

.admin-tab:hover {
  border-color: var(--ds-color-black);
}

.admin-tab.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
}

.tab-badge {
  display: inline-block;
  padding: 1px 6px;
  background: var(--ds-color-error);
  color: white;
  border-radius: 10px;
  font-size: 11px;
}

/* Content */
.admin-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 48px 48px;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
