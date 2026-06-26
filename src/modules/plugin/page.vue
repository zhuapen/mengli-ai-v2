<script setup lang="ts">
import { ref } from 'vue'
import DsEmpty from '@/design-system/components/DsEmpty.vue'

// Mock 插件数据
const plugins = ref([
  {
    id: '1',
    name: '小红书数据采集',
    description: '一键采集小红书笔记数据，包括点赞、评论、收藏等',
    icon: '📊',
    version: '1.2.0',
    downloads: 1250,
    category: '数据采集',
  },
  {
    id: '2',
    name: '抖音达人分析',
    description: '分析抖音达人的粉丝画像、互动数据、商业价值',
    icon: '📱',
    version: '2.0.1',
    downloads: 890,
    category: '数据分析',
  },
  {
    id: '3',
    name: '文案批量生成',
    description: '基于模板批量生成多平台文案，支持小红书、朋友圈等',
    icon: '✍️',
    version: '1.5.0',
    downloads: 2100,
    category: 'AI工具',
  },
  {
    id: '4',
    name: '图片批量处理',
    description: '批量压缩、裁剪、添加水印，支持多种尺寸',
    icon: '🖼️',
    version: '1.0.3',
    downloads: 560,
    category: '图片处理',
  },
])

// 当前选中的插件
const selectedPlugin = ref<string | null>(null)

function selectPlugin(id: string) {
  selectedPlugin.value = id
}

function goBack() {
  selectedPlugin.value = null
}
</script>

<template>
  <div class="plugin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">数据中心</h1>
          <p class="page-desc">提供运营工具、浏览器插件、自动化工具下载</p>
        </div>
      </div>
    </div>

    <!-- 插件列表 -->
    <div class="plugin-content">
      <div class="plugin-grid">
        <div
          v-for="plugin in plugins"
          :key="plugin.id"
          class="plugin-card"
          @click="selectPlugin(plugin.id)"
        >
          <div class="plugin-icon">{{ plugin.icon }}</div>
          <div class="plugin-info">
            <div class="plugin-name">{{ plugin.name }}</div>
            <div class="plugin-desc">{{ plugin.description }}</div>
            <div class="plugin-meta">
              <span class="plugin-version">v{{ plugin.version }}</span>
              <span class="plugin-downloads">{{ plugin.downloads }} 次下载</span>
              <span class="plugin-category">{{ plugin.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 插件详情 -->
      <div v-if="selectedPlugin" class="plugin-detail">
        <div class="detail-header">
          <button class="back-btn" @click="goBack">← 返回列表</button>
        </div>
        <div class="detail-content">
          <DsEmpty icon="🔌" title="插件详情" description="功能开发中..." />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plugin-page {
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

/* Content */
.plugin-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.plugin-card {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: var(--ds-color-white);
  border: 1px solid var(--ds-color-gray-100);
  cursor: pointer;
  transition: all 0.3s;
}

.plugin-card:hover {
  border-color: var(--ds-color-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.plugin-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ds-color-gray-50);
  border-radius: 12px;
  flex-shrink: 0;
}

.plugin-info {
  flex: 1;
  min-width: 0;
}

.plugin-name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

.plugin-desc {
  font-size: 13px;
  color: var(--ds-color-gray-500);
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.plugin-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--ds-color-gray-400);
}

.plugin-version {
  padding: 2px 8px;
  background: var(--ds-color-gray-100);
  border-radius: 4px;
  font-weight: 600;
}

.plugin-category {
  padding: 2px 8px;
  background: var(--ds-color-primary);
  color: var(--ds-color-white);
  border-radius: 4px;
  font-weight: 600;
}

/* Detail */
.plugin-detail {
  margin-top: 48px;
  padding-top: 48px;
  border-top: 1px solid var(--ds-color-gray-100);
}

.detail-header {
  margin-bottom: 24px;
}

.back-btn {
  padding: 8px 16px;
  background: var(--ds-color-gray-100);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  font-family: var(--ds-font-family);
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--ds-color-gray-200);
}

.detail-content {
  min-height: 300px;
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
