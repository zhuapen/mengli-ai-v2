<script setup lang="ts">
import { useRouter } from 'vue-router'
import DsButton from '@/design-system/components/DsButton.vue'

const router = useRouter()

function goHome() {
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-desc">您访问的页面不存在或已被移除</p>
      <DsButton size="lg" @click="goHome">返回首页</DsButton>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--ds-color-gray-50) 0%, var(--ds-color-white) 100%);
}

.error-content {
  text-align: center;
  padding: 48px;
}

.error-code {
  font-size: 120px;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(135deg, var(--ds-color-black) 0%, var(--ds-color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
}

.error-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
}

.error-desc {
  font-size: 16px;
  color: var(--ds-color-gray-400);
  margin-bottom: 40px;
}
</style>
