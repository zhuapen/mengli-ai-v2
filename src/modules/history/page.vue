<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsError from '@/design-system/components/DsError.vue'
import DsEmpty from '@/design-system/components/DsEmpty.vue'
import { useHistoryStore } from './store'
import type { HistoryTabType } from './types'

const store = useHistoryStore()

onMounted(() => {
  store.init()
})

function getTypeIcon(type: string): string {
  switch (type) {
    case 'copy': return '✍️'
    case 'image': return '🎨'
    case 'article': return '📝'
    default: return '📄'
  }
}

function getTypeName(type: string): string {
  switch (type) {
    case 'copy': return '文案'
    case 'image': return '图片'
    case 'article': return '写稿'
    default: return '未知'
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return '今天 ' + dateStr.split(' ')[1]
  if (days === 1) return '昨天 ' + dateStr.split(' ')[1]
  if (days < 7) return `${days}天前`
  return dateStr
}

const expandedId = ref<string | null>(null)
function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function handleTabChange(tab: HistoryTabType) {
  store.setTab(tab)
}
</script>

<template>
  <div class="history-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">生成历史</h1>
          <p class="page-desc">查看所有图片、文案、写稿的生成记录</p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="history-tabs">
      <button
        class="history-tab"
        :class="{ active: store.activeTab === 'all' }"
        @click="handleTabChange('all')"
      >
        全部
      </button>
      <button
        class="history-tab"
        :class="{ active: store.activeTab === 'image' }"
        @click="handleTabChange('image')"
      >
        图片
      </button>
      <button
        class="history-tab"
        :class="{ active: store.activeTab === 'copy' }"
        @click="handleTabChange('copy')"
      >
        文案
      </button>
      <button
        class="history-tab"
        :class="{ active: store.activeTab === 'article' }"
        @click="handleTabChange('article')"
      >
        写稿
      </button>
    </div>

    <!-- History List -->
    <div class="history-list">
      <DsLoading v-if="store.loading && store.items.length === 0" text="正在加载历史记录..." />

      <DsError
        v-else-if="store.error && store.items.length === 0"
        :message="store.error"
        @retry="store.init()"
      />

      <template v-else>
      <div
        v-for="item in store.filteredItems"
        :key="item.id"
        class="history-item"
        @click="toggleExpand(item.id)"
      >
        <div class="history-item-header">
          <div class="history-item-left">
            <span class="history-icon">{{ getTypeIcon(item.type) }}</span>
            <div class="history-info">
              <div class="history-title">{{ item.title }}</div>
              <div class="history-meta">
                <span class="history-type">{{ getTypeName(item.type) }}</span>
                <span class="history-date">{{ formatDate(item.createdAt) }}</span>
              </div>
            </div>
          </div>
          <div class="history-item-right">
            <span class="history-arrow" :class="{ expanded: expandedId === item.id }">
              ›
            </span>
          </div>
        </div>

        <div v-if="expandedId === item.id" class="history-detail">
          <div class="history-detail-content">
            {{ item.content }}
          </div>
          <div class="history-detail-actions">
            <button class="detail-btn">复制</button>
            <button class="detail-btn">重新生成</button>
          </div>
        </div>
      </div>

      <DsEmpty
        v-if="store.filteredItems.length === 0 && !store.loading"
        icon="📋"
        title="暂无历史记录"
        description="开始创作后，记录会显示在这里"
      />
      </template>
    </div>
  </div>
</template>

<style scoped>
.history-page {
  animation: pageEnter 0.6s ease;
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

/* Tabs */
.history-tabs {
  display: flex;
  gap: 8px;
  padding: 24px 48px;
  border-bottom: 1px solid var(--ds-color-gray-100);
  max-width: 1400px;
  margin: 0 auto;
}

.history-tab {
  padding: 10px 24px;
  border: 1.5px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--ds-font-family);
}

.history-tab:hover {
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.history-tab.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* History List */
.history-list {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 48px;
}

.history-item {
  background: var(--ds-color-white);
  border: 1px solid var(--ds-color-gray-100);
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  border-color: var(--ds-color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
}

.history-item-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.history-icon {
  font-size: 24px;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-title {
  font-size: 15px;
  font-weight: 600;
}

.history-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--ds-color-gray-400);
}

.history-type {
  padding: 2px 8px;
  background: var(--ds-color-gray-100);
  border-radius: 4px;
  font-weight: 600;
}

.history-arrow {
  font-size: 24px;
  color: var(--ds-color-gray-400);
  transition: transform 0.3s;
}

.history-arrow.expanded {
  transform: rotate(90deg);
}

/* Detail */
.history-detail {
  padding: 0 24px 20px;
  border-top: 1px solid var(--ds-color-gray-100);
  animation: slideDown 0.3s ease;
}

.history-detail-content {
  padding: 20px 0;
  font-size: 14px;
  line-height: 1.8;
  color: var(--ds-color-gray-600);
  white-space: pre-wrap;
}

.history-detail-actions {
  display: flex;
  gap: 12px;
}

.detail-btn {
  padding: 8px 16px;
  border: 1px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--ds-font-family);
}

.detail-btn:hover {
  border-color: var(--ds-color-primary);
  color: var(--ds-color-primary);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px;
  color: var(--ds-color-gray-300);
}

.empty-state .icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

.empty-state h3 {
  font-size: 16px;
  font-weight: 400;
}

.empty-state p {
  font-size: 14px;
  margin-top: 8px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
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
