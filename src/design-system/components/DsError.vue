<script setup lang="ts">
interface Props {
  error?: Error | null
  title?: string
}

withDefaults(defineProps<Props>(), {
  error: null,
  title: '加载失败',
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="ds-error">
    <div class="ds-error__icon">⚠️</div>
    <h3 class="ds-error__title">{{ title }}</h3>
    <p v-if="error?.message" class="ds-error__message">{{ error.message }}</p>
    <button class="ds-error__retry" @click="emit('retry')">重试</button>
  </div>
</template>

<style scoped>
.ds-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 48px;
  text-align: center;
}

.ds-error__icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.ds-error__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--ds-color-error);
  margin-bottom: 8px;
}

.ds-error__message {
  font-size: 14px;
  color: var(--ds-color-gray-400);
  margin-bottom: 24px;
  max-width: 400px;
}

.ds-error__retry {
  padding: 10px 24px;
  background: var(--ds-color-primary);
  color: var(--ds-color-white);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.ds-error__retry:hover {
  background: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
