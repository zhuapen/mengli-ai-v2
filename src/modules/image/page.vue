<script setup lang="ts">
import { ref } from 'vue'
import DsButton from '@/design-system/components/DsButton.vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsEmpty from '@/design-system/components/DsEmpty.vue'

const prompt = ref('')
const size = ref('1024x1024')
const loading = ref(false)
const resultUrl = ref('')

const sizes = ['512x512', '1024x1024', '1024x1792', '1792x1024']

async function handleGenerate() {
  if (!prompt.value.trim()) return

  loading.value = true
  // TODO: 调用 imageService.generate
  setTimeout(() => {
    resultUrl.value = 'https://via.placeholder.com/1024'
    loading.value = false
  }, 2000)
}
</script>

<template>
  <div class="image-page">
    <div class="image-layout">
      <!-- 左侧：输入区 -->
      <div class="image-left">
        <h2 class="image-title">AI 图片生成</h2>
        <p class="image-desc">输入描述，AI 为您生成创意图片</p>

        <div class="form-group">
          <label class="form-label">图片描述</label>
          <textarea
            v-model="prompt"
            class="form-textarea"
            placeholder="请描述您想要的图片..."
            rows="4"
          />
        </div>

        <div class="form-group">
          <label class="form-label">图片尺寸</label>
          <div class="size-options">
            <button
              v-for="s in sizes"
              :key="s"
              class="size-btn"
              :class="{ active: size === s }"
              @click="size = s"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <DsButton
          :loading="loading"
          :disabled="!prompt.trim()"
          size="lg"
          style="width: 100%"
          @click="handleGenerate"
        >
          生成图片
        </DsButton>
      </div>

      <!-- 右侧：预览区 -->
      <div class="image-right">
        <div class="preview-header">
          <h3 class="preview-title">预览</h3>
        </div>

        <DsLoading v-if="loading" text="正在生成图片..." />

        <div v-else-if="resultUrl" class="preview-content">
          <img :src="resultUrl" alt="生成的图片" class="preview-image" />
        </div>

        <DsEmpty v-else icon="🎨" title="等待生成" description="输入描述后点击生成按钮" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-page {
  animation: pageEnter 0.6s ease;
}

.image-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 72px);
}

.image-left {
  padding: 48px;
  border-right: 1px solid var(--ds-color-gray-100);
}

.image-right {
  padding: 48px;
  display: flex;
  flex-direction: column;
}

.image-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
}

.image-desc {
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
  resize: vertical;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  border-color: var(--ds-color-primary);
  box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.2);
}

.size-options {
  display: flex;
  gap: 8px;
}

.size-btn {
  flex: 1;
  padding: 10px;
  border: 1.5px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.size-btn:hover {
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
}

.size-btn.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
}

.preview-header {
  margin-bottom: 24px;
}

.preview-title {
  font-size: 18px;
  font-weight: 700;
}

.preview-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ds-color-gray-50);
  border-radius: 8px;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
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
