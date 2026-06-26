<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    class="ds-button"
    :class="[
      `ds-button--${variant}`,
      `ds-button--${size}`,
      { 'is-disabled': disabled, 'is-loading': loading },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="ds-button__spinner" />
    <slot />
  </button>
</template>

<style scoped>
.ds-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--ds-font-family);
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

/* Sizes */
.ds-button--sm {
  padding: 8px 16px;
  font-size: 12px;
}

.ds-button--md {
  padding: 12px 24px;
  font-size: 14px;
}

.ds-button--lg {
  padding: 16px 32px;
  font-size: 15px;
}

/* Variants */
.ds-button--primary {
  background: var(--ds-color-primary);
  color: var(--ds-color-white);
}

.ds-button--primary:hover {
  background: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.ds-button--secondary {
  background: var(--ds-color-white);
  color: var(--ds-color-black);
  border: 2px solid var(--ds-color-black);
}

.ds-button--secondary:hover {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.ds-button--ghost {
  background: transparent;
  color: var(--ds-color-gray-500);
}

.ds-button--ghost:hover {
  color: var(--ds-color-black);
  background: var(--ds-color-gray-50);
}

/* States */
.ds-button.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.ds-button.is-loading {
  cursor: wait;
}

.ds-button__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
