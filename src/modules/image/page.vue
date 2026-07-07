<script setup lang="ts">
import { ref, computed } from 'vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsError from '@/design-system/components/DsError.vue'
import { useImageStore } from './store'

const store = useImageStore()

const mode = ref<'text2img' | 'img2img'>('text2img')
const prompt = ref('')
const img2imgPrompt = ref('')
const size = ref('1024x1024')

const sizeOptions = [
  { value: '1024x1024', label: '1:1 方图' },
  { value: '768x1024', label: '3:4 竖图' },
  { value: '1024x768', label: '4:3 横图' },
  { value: '576x1024', label: '9:16 竖版海报' },
  { value: '1024x576', label: '16:9 横版封面' },
]

const currentPrompt = computed(() =>
  mode.value === 'text2img' ? prompt.value : img2imgPrompt.value,
)

async function handleGenerate() {
  if (!currentPrompt.value.trim()) return
  await store.generate({
    prompt: currentPrompt.value,
    size: size.value,
    style: 'realistic',
  })
}

function handleDownload() {
  if (!store.outputUrl) return
  const link = document.createElement('a')
  link.href = store.outputUrl
  link.download = `mengli-ai-${Date.now()}.png`
  link.click()
}

function handleRetry() {
  handleGenerate()
}
</script>

<template>
  <div class="image-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">图片生成</h1>
          <p class="page-desc">AI 创意生图，一键生成营销素材</p>
        </div>
      </div>
    </div>

    <div class="gen-layout">
      <!-- 左侧：输入区 -->
      <div class="gen-left">
        <div class="gen-label">生成模式</div>
        <div class="gen-mode-tabs">
          <button
            class="gen-mode-tab"
            :class="{ active: mode === 'text2img' }"
            @click="mode = 'text2img'"
          >
            文生图
          </button>
          <button
            class="gen-mode-tab"
            :class="{ active: mode === 'img2img' }"
            @click="mode = 'img2img'"
          >
            图生图
          </button>
        </div>

        <!-- 文生图 -->
        <div v-if="mode === 'text2img'">
          <div class="gen-label" style="margin-top: 24px">图片描述</div>
          <textarea
            v-model="prompt"
            class="gen-textarea"
            placeholder="描述你想要的图片，如：可爱的卡通小象，橙色主题，简约风格..."
          />
        </div>

        <!-- 图生图 -->
        <div v-else>
          <div class="gen-label" style="margin-top: 24px">
            参考图片
            <span style="font-size: 11px; color: var(--ds-color-gray-400); font-weight: 400">
              最多3张
            </span>
          </div>
          <div class="gen-upload">
            <div class="gen-upload-icon">📷</div>
            <div class="gen-upload-text">点击上传参考图片</div>
            <div class="gen-upload-hint">支持 JPG、PNG，可多选</div>
          </div>

          <div class="gen-label" style="margin-top: 24px">修改要求</div>
          <textarea
            v-model="img2imgPrompt"
            class="gen-textarea"
            placeholder="描述你想要的修改，如：把背景改成蓝色、添加一个帽子、改成卡通风格..."
          />
        </div>

        <div class="gen-label" style="margin-top: 24px">图片尺寸</div>
        <div class="gen-sizes">
          <button
            v-for="s in sizeOptions"
            :key="s.value"
            class="gen-size-btn"
            :class="{ active: size === s.value }"
            @click="size = s.value"
          >
            {{ s.label }}
          </button>
        </div>

        <button
          class="gen-btn"
          data-testid="image-generate"
          :disabled="store.loading || !currentPrompt.trim()"
          @click="handleGenerate"
        >
          {{ store.loading ? '生成中...' : '生成图片' }}
        </button>
      </div>

      <!-- 右侧：预览区 -->
      <div class="gen-right">
        <div class="gen-preview">
          <div class="gen-preview-title">预览</div>

          <DsLoading v-if="store.loading" text="正在生成图片..." />

          <DsError
            v-else-if="store.error && !store.outputUrl"
            :message="store.error"
            @retry="handleRetry"
          />

          <div v-else-if="store.outputUrl" class="gen-result-container">
            <img :src="store.outputUrl" alt="生成的图片" class="gen-result" />
            <div class="gen-toolbar">
              <button class="gen-toolbar-btn" @click="handleDownload">
                📥 下载
              </button>
              <button class="gen-toolbar-btn" @click="handleRetry">
                🔄 重新生成
              </button>
            </div>
          </div>

          <div v-else class="gen-placeholder">
            <div class="icon">🎨</div>
            <p>输入描述后点击生成按钮</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-page {
  animation: pageEnter 0.2s ease;
}

/* Page Header */
.page-header {
  padding: 48px 48px 0;
  border-bottom: 1px solid var(--ds-color-gray-100);
  background: var(--ds-color-white);
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

/* Layout */
.gen-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
}

.gen-left {
  padding: 48px;
  border-right: 1px solid var(--ds-color-gray-100);
}

.gen-right {
  padding: 48px;
  display: flex;
  flex-direction: column;
}

/* Form Elements */
.gen-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--ds-color-gray-400);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
}

/* Mode Tabs */
.gen-mode-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.gen-mode-tab {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--ds-font-family);
  text-align: center;
}

.gen-mode-tab:hover {
  border-color: var(--ds-color-black);
}

.gen-mode-tab.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
}

/* Textarea */
.gen-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--ds-color-gray-200);
  font-size: 15px;
  font-family: var(--ds-font-family);
  outline: none;
  min-height: 160px;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.gen-textarea:focus {
  border-color: var(--ds-color-primary);
  box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.2);
}

.gen-textarea::placeholder {
  color: var(--ds-color-gray-300);
}

/* Upload */
.gen-upload {
  padding: 40px;
  border: 2px dashed var(--ds-color-gray-200);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.gen-upload:hover {
  border-color: var(--ds-color-primary);
  background: var(--ds-color-gray-50);
}

.gen-upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.gen-upload-text {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.gen-upload-hint {
  font-size: 13px;
  color: var(--ds-color-gray-400);
}

/* Size Buttons */
.gen-sizes {
  display: flex;
  gap: 8px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.gen-size-btn {
  padding: 10px 20px;
  border: 1.5px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--ds-font-family);
}

.gen-size-btn:hover {
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gen-size-btn.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Generate Button */
.gen-btn {
  width: 100%;
  padding: 16px;
  background: var(--ds-color-primary);
  color: var(--ds-color-white);
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--ds-font-family);
  transition: all 0.3s ease;
  margin-top: 24px;
}

.gen-btn:hover {
  background: var(--ds-color-black);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.gen-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Preview */
.gen-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--ds-color-gray-50);
  position: relative;
  transition: all 0.3s ease;
  min-height: 400px;
}

.gen-preview:hover {
  background: var(--ds-color-gray-100);
}

.gen-preview-title {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--ds-color-gray-400);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.gen-placeholder {
  text-align: center;
  color: var(--ds-color-gray-300);
}

.gen-placeholder .icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.gen-placeholder p {
  font-size: 14px;
}

/* Result */
.gen-result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.gen-result {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.gen-result:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Toolbar */
.gen-toolbar {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.gen-toolbar-btn {
  padding: 8px 16px;
  border: 1px solid var(--ds-color-gray-200);
  border-radius: 8px;
  background: var(--ds-color-white);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--ds-font-family);
}

.gen-toolbar-btn:hover {
  background: var(--ds-color-gray-50);
  border-color: var(--ds-color-primary);
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
