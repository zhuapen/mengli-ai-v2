<script setup lang="ts">
import { ref } from 'vue'
import DsButton from '@/design-system/components/DsButton.vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsEmpty from '@/design-system/components/DsEmpty.vue'

const prompt = ref('')
const output = ref('')
const loading = ref(false)

async function handleGenerate() {
  if (!prompt.value.trim()) return

  loading.value = true
  // TODO: 调用 copyService.generate
  setTimeout(() => {
    output.value = `生成的文案内容...\n\n提示词：${prompt.value}`
    loading.value = false
  }, 1000)
}
</script>

<template>
  <div class="copy-page">
    <div class="copy-layout">
      <!-- 左侧：输入区 -->
      <div class="copy-left">
        <h2 class="copy-title">AI 文案撰写</h2>
        <p class="copy-desc">输入您的需求，AI 为您生成专业文案</p>

        <div class="form-group">
          <label class="form-label">提示词</label>
          <textarea
            v-model="prompt"
            class="form-textarea"
            placeholder="请描述您想要的文案内容..."
            rows="6"
          />
        </div>

        <DsButton
          :loading="loading"
          :disabled="!prompt.trim()"
          size="lg"
          style="width: 100%"
          @click="handleGenerate"
        >
          生成文案
        </DsButton>
      </div>

      <!-- 右侧：输出区 -->
      <div class="copy-right">
        <div class="output-header">
          <h3 class="output-title">生成结果</h3>
        </div>

        <DsLoading v-if="loading" text="正在生成文案..." />

        <div v-else-if="output" class="output-content">
          <pre>{{ output }}</pre>
        </div>

        <DsEmpty v-else icon="✍️" title="等待生成" description="输入提示词后点击生成按钮" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.copy-page {
  animation: pageEnter 0.6s ease;
}

.copy-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 72px);
}

.copy-left {
  padding: 48px;
  border-right: 1px solid var(--ds-color-gray-100);
}

.copy-right {
  padding: 48px;
  display: flex;
  flex-direction: column;
}

.copy-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
}

.copy-desc {
  font-size: 14px;
  color: var(--ds-color-gray-400);
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: var(--ds-color-gray-400);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
}

.form-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--ds-color-gray-200);
  font-size: 15px;
  font-family: var(--ds-font-family);
  outline: none;
  min-height: 160px;
  resize: vertical;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  border-color: var(--ds-color-primary);
  box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.2);
}

.form-textarea::placeholder {
  color: var(--ds-color-gray-300);
}

.output-header {
  margin-bottom: 24px;
}

.output-title {
  font-size: 18px;
  font-weight: 700;
}

.output-content {
  flex: 1;
  padding: 24px;
  background: var(--ds-color-gray-50);
  border-radius: 8px;
}

.output-content pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 15px;
  line-height: 1.8;
  color: var(--ds-color-gray-700);
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
