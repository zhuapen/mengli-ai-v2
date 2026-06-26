<script setup lang="ts">
import DsEmpty from '@/design-system/components/DsEmpty.vue'
</script>

<template>
  <div class="plugin-page">
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">插件中心</h1>
          <p class="page-desc">扩展平台功能</p>
        </div>
      </div>
    </div>

    <div class="page-content">
      <DsEmpty icon="🔌" title="插件中心" description="功能开发中..." />
    </div>
  </div>
</template>

<style scoped>
.plugin-page {
  animation: pageEnter 0.6s ease;
}

.page-header {
  padding: 48px 48px 0;
  border-bottom: 1px solid var(--ds-color-gray-100);
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

.page-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px;
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
