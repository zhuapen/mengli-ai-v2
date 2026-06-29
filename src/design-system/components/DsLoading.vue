<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  overlay?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  text: '加载中...',
  overlay: false,
})
</script>

<template>
  <div class="ds-loading" :class="[`ds-loading--${size}`, { 'ds-loading--overlay': overlay }]">
    <div class="ds-loading__spinner" />
    <p v-if="text" class="ds-loading__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.ds-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.ds-loading--overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  z-index: 10;
  padding: 0;
}

.ds-loading__spinner {
  border-radius: 50%;
  border: 3px solid var(--ds-color-gray-200);
  border-top-color: var(--ds-color-primary);
  animation: spin 0.8s linear infinite;
}

.ds-loading--sm .ds-loading__spinner {
  width: 24px;
  height: 24px;
}

.ds-loading--md .ds-loading__spinner {
  width: 40px;
  height: 40px;
}

.ds-loading--lg .ds-loading__spinner {
  width: 56px;
  height: 56px;
}

.ds-loading__text {
  margin-top: 16px;
  font-size: 14px;
  color: var(--ds-color-gray-400);
  animation: pulse 1.5s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
