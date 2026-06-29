<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-brand">
        <img src="/logo.jpg" alt="萌力互动" class="auth-logo" />
        <h1 class="auth-title">萌力互动</h1>
        <p class="auth-subtitle">AI创作平台</p>
      </div>
      <div class="auth-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--ds-color-gray-50) 0%, var(--ds-color-white) 100%);
  padding: 48px;
}

.auth-container {
  display: flex;
  gap: 80px;
  align-items: center;
  max-width: 1000px;
  width: 100%;
}

.auth-brand {
  text-align: center;
  flex-shrink: 0;
}

.auth-logo {
  width: 120px;
  height: 120px;
  border-radius: 24px;
  margin-bottom: 24px;
}

.auth-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 18px;
  color: var(--ds-color-gray-400);
}

.auth-content {
  flex: 1;
  max-width: 400px;
  min-width: 0;
}

/* 移动端：隐藏品牌区域，只显示表单 */
@media (max-width: 768px) {
  .auth-layout {
    padding: 24px;
  }

  .auth-container {
    gap: 0;
    justify-content: center;
  }

  .auth-brand {
    display: none;
  }

  .auth-content {
    max-width: 100%;
  }
}
</style>
