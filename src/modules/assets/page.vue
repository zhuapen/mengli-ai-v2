<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsError from '@/design-system/components/DsError.vue'
import DsEmpty from '@/design-system/components/DsEmpty.vue'
import { useAssetsStore } from './store'

const store = useAssetsStore()

onMounted(() => {
  store.init()
})

const searchQuery = ref('')

function getTypeName(type: string): string {
  switch (type) {
    case 'image': return '图片'
    case 'copy': return '文案'
    case 'article': return '写稿'
    default: return '未知'
  }
}
</script>

<template>
  <div class="assets-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">素材库</h1>
          <p class="page-desc">管理你的图片和文案素材</p>
        </div>
        <button class="batch-btn">批量管理</button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="assets-tabs">
      <button
        class="assets-tab"
        :class="{ active: store.activeTab === 'all' }"
        @click="store.setTab('all')"
      >
        全部
      </button>
      <button
        class="assets-tab"
        :class="{ active: store.activeTab === 'image' }"
        @click="store.setTab('image')"
      >
        图片
      </button>
      <button
        class="assets-tab"
        :class="{ active: store.activeTab === 'copy' }"
        @click="store.setTab('copy')"
      >
        文案
      </button>
      <button
        class="assets-tab"
        :class="{ active: store.activeTab === 'article' }"
        @click="store.setTab('article')"
      >
        写稿
      </button>
      <button
        class="assets-tab"
        :class="{ active: store.activeTab === 'feedback' }"
        @click="store.setTab('feedback')"
      >
        ⭐ 反馈库
      </button>
    </div>

    <!-- 搜索栏 -->
    <div class="assets-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 搜索素材..."
      />
    </div>

    <!-- 素材列表 -->
    <div class="assets-content">
      <DsLoading v-if="store.loading && store.items.length === 0" text="正在加载素材..." />

      <DsError
        v-else-if="store.error && store.items.length === 0"
        :message="store.error"
        @retry="store.init()"
      />

      <div v-else-if="store.filteredItems.length > 0" class="assets-grid">
        <div
          v-for="asset in store.filteredItems"
          :key="asset.id"
          class="asset-card"
        >
          <div class="asset-preview">
            <img
              v-if="asset.type === 'image'"
              :src="asset.content"
              :alt="asset.title"
            />
            <div v-else class="asset-text-preview">
              {{ asset.content.substring(0, 100) }}...
            </div>
          </div>
          <div class="asset-info">
            <div class="asset-title">{{ asset.title }}</div>
            <div class="asset-meta">
              <span class="asset-type">{{ getTypeName(asset.type) }}</span>
              <span class="asset-date">{{ asset.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>

      <DsEmpty
        v-else
        icon="📁"
        title="暂无素材"
        description="开始创作后，素材会显示在这里"
      />
    </div>
  </div>
</template>

<style scoped>
.assets-page {
  animation: pageEnter 0.2s ease;
}

/* Page Header */
.page-header {
  padding: 48px 48px 0;
  background: var(--ds-color-white);
}

.page-header-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--ds-color-gray-100);
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

.batch-btn {
  padding: 8px 16px;
  background: var(--ds-color-gray-100);
  border: 1px solid var(--ds-color-gray-200);
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  font-family: var(--ds-font-family);
  transition: all 0.2s;
}

.batch-btn:hover {
  background: var(--ds-color-gray-200);
}

/* Tabs */
.assets-tabs {
  display: flex;
  gap: 8px;
  padding: 24px 48px;
  border-bottom: 1px solid var(--ds-color-gray-100);
  max-width: 1400px;
  margin: 0 auto;
}

.assets-tab {
  padding: 10px 24px;
  border: 1.5px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--ds-font-family);
}

.assets-tab:hover {
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.assets-tab.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Search */
.assets-search {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 48px;
}

.assets-search input {
  width: 100%;
  max-width: 400px;
  padding: 10px 16px;
  border: 2px solid var(--ds-color-gray-200);
  border-radius: 8px;
  font-size: 14px;
  font-family: var(--ds-font-family);
  outline: none;
  transition: border-color 0.2s;
}

.assets-search input:focus {
  border-color: var(--ds-color-primary);
}

.assets-search input::placeholder {
  color: var(--ds-color-gray-300);
}

/* Content */
.assets-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 48px 48px;
}

.assets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.asset-card {
  background: var(--ds-color-white);
  border: 1px solid var(--ds-color-gray-100);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.asset-card:hover {
  border-color: var(--ds-color-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.asset-preview {
  height: 180px;
  overflow: hidden;
  background: var(--ds-color-gray-50);
  display: flex;
  align-items: center;
  justify-content: center;
}

.asset-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.asset-text-preview {
  padding: 16px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ds-color-gray-600);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
}

.asset-info {
  padding: 16px;
}

.asset-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.asset-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--ds-color-gray-400);
}

.asset-type {
  padding: 2px 8px;
  background: var(--ds-color-gray-100);
  border-radius: 4px;
  font-weight: 600;
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
