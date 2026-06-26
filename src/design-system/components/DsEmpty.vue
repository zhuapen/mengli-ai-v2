<script setup lang="ts">
interface Props {
  icon?: string
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  icon: '📭',
  title: '暂无数据',
  description: '',
})
</script>

<template>
  <div class="ds-empty">
    <div class="ds-empty__icon">{{ icon }}</div>
    <h3 class="ds-empty__title">{{ title }}</h3>
    <p v-if="description" class="ds-empty__desc">{{ description }}</p>
    <slot />
  </div>
</template>

<style scoped>
.ds-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 48px;
  text-align: center;
}

.ds-empty__icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: float 3s ease-in-out infinite;
}

.ds-empty__title {
  font-size: 16px;
  font-weight: 400;
  color: var(--ds-color-gray-300);
  margin-bottom: 8px;
}

.ds-empty__desc {
  font-size: 14px;
  color: var(--ds-color-gray-400);
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
</style>
