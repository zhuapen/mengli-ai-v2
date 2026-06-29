<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/design-system/components/AppNavbar.vue'
</script>

<template>
  <div class="main-layout">
    <AppNavbar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.main-content {
  padding-top: 72px; /* Navbar height */
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 60px; /* 移动端 Navbar 高度 */
  }
}
</style>
