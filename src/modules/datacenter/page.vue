<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsError from '@/design-system/components/DsError.vue'
import DsEmpty from '@/design-system/components/DsEmpty.vue'
import { useDatacenterStore } from './store'

const router = useRouter()
const store = useDatacenterStore()

onMounted(() => {
  store.init()
})

function navigateTo(route: string | null) {
  if (route) router.push(route)
}
</script>

<template>
  <div class="datacenter-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">数据中心</h1>
          <p class="page-desc">插件工具 · 数据分析 · 智能媒体库</p>
        </div>
      </div>
    </div>

    <!-- 功能卡片 -->
    <div class="dc-content">
      <DsLoading v-if="store.loading && store.features.length === 0" text="正在加载数据中心..." />

      <DsError
        v-else-if="store.error && store.features.length === 0"
        :message="store.error"
        @retry="store.init()"
      />

      <DsEmpty
        v-else-if="store.features.length === 0 && !store.loading"
        icon="📊"
        title="暂无功能"
        description="数据中心功能正在建设中"
      />

      <div v-else class="dc-grid">
        <div
          v-for="feature in store.features"
          :key="feature.id"
          class="dc-card"
          :class="{ clickable: feature.route }"
          @click="navigateTo(feature.route)"
        >
          <div class="dc-card-icon">{{ feature.icon }}</div>
          <div class="dc-card-title">{{ feature.title }}</div>
          <div class="dc-card-desc">{{ feature.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.datacenter-page {
  animation: pageEnter 0.2s ease;
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
.dc-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px;
}

.dc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.dc-card {
  padding: 40px;
  background: var(--ds-color-white);
  border: 2px solid var(--ds-color-gray-100);
  text-align: center;
  transition: all 0.3s;
}

.dc-card.clickable {
  cursor: pointer;
}

.dc-card.clickable:hover {
  border-color: var(--ds-color-primary);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dc-card-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.dc-card-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

.dc-card-desc {
  font-size: 14px;
  color: var(--ds-color-gray-400);
  line-height: 1.8;
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
