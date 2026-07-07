<script setup lang="ts">
import { ref, computed } from 'vue'
import DsLoading from '@/design-system/components/DsLoading.vue'
import DsError from '@/design-system/components/DsError.vue'
import { useArticleStore } from './store'

const store = useArticleStore()

const title = ref('')
const brief = ref('')
const extra = ref('')
const mode = ref<'outline' | 'draft'>('outline')

const modeHint = computed(() => {
  return mode.value === 'outline'
    ? '输出结构化大纲（800-1200字），包含标题、论点框架和要点展开'
    : '输出完整初稿（2000-3000字），包含标题、开头、正文和结尾'
})

async function handleGenerate() {
  if (!title.value.trim()) {
    alert('请输入文章标题')
    return
  }
  if (!brief.value.trim()) {
    alert('请输入客户 Brief / 需求说明')
    return
  }

  const requirements = [
    '写作平台：微信公众号。',
    '请生成适合公众号发布的长文稿件，结构清晰，语气自然，避免硬广。',
    '',
    '客户 Brief：',
    brief.value.trim(),
    extra.value.trim() ? `\n补充说明：\n${extra.value.trim()}` : '',
  ].join('\n')

  await store.generate({
    title: title.value.trim(),
    mode: mode.value,
    requirements,
  })
}

function handleCopy() {
  navigator.clipboard.writeText(store.output)
  alert('已复制到剪贴板')
}
</script>

<template>
  <div class="article-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">公众号写稿</h1>
          <p class="page-desc">粘贴客户 Brief 和写作要求，一键生成适合公众号发布的文章</p>
        </div>
      </div>
    </div>

    <div class="article-layout">
      <!-- 左侧：输入区 -->
      <div class="article-left">
        <div class="gen-label">文章标题 *</div>
        <input
          v-model="title"
          class="gen-input"
          placeholder="请输入公众号文章标题，例如：如何提升小红书内容转化率"
        />

        <div class="gen-label" style="margin-top: 24px">客户 Brief / 需求说明 *</div>
        <textarea
          v-model="brief"
          class="gen-textarea"
          placeholder="请粘贴客户需求、产品信息、目标人群、核心卖点、文章方向等内容"
          style="min-height: 160px"
        />

        <div class="gen-label" style="margin-top: 24px">生成模式</div>
        <div class="article-mode-tabs">
          <button
            class="article-mode-tab"
            :class="{ active: mode === 'outline' }"
            @click="mode = 'outline'"
          >
            📋 大纲
          </button>
          <button
            class="article-mode-tab"
            :class="{ active: mode === 'draft' }"
            @click="mode = 'draft'"
          >
            📝 初稿
          </button>
        </div>
        <div class="article-mode-hint">{{ modeHint }}</div>

        <div class="gen-label" style="margin-top: 24px">补充说明（选填）</div>
        <textarea
          v-model="extra"
          class="gen-textarea"
          placeholder="例如：语气亲切，结构清晰，适合品牌方阅读，字数 1500 字左右"
          style="min-height: 100px"
        />

        <button
          class="gen-btn"
          :disabled="store.loading"
          @click="handleGenerate"
        >
          {{ store.loading ? '生成中...' : '生成公众号文章' }}
        </button>
      </div>

      <!-- 右侧：输出区 -->
      <div class="article-right">
        <div class="gen-label">生成结果</div>

        <DsLoading v-if="store.loading" text="正在生成文章..." />

        <DsError
          v-else-if="store.error && !store.output"
          :message="store.error"
          @retry="handleGenerate"
        />

        <div v-else-if="store.output" class="article-output">
          <pre>{{ store.output }}</pre>
        </div>

        <div v-else class="article-output empty">
          点击「生成公众号文章」开始创作
        </div>

        <!-- 操作按钮 -->
        <div v-if="store.output" class="article-actions">
          <button class="gen-btn" @click="handleGenerate">重新生成</button>
          <button class="gen-btn secondary" @click="handleCopy">复制内容</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-page {
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
.article-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
}

.article-left {
  padding: 48px;
  border-right: 1px solid var(--ds-color-gray-100);
}

.article-right {
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

/* Input */
.gen-input {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--ds-color-gray-200);
  font-size: 15px;
  font-family: var(--ds-font-family);
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.gen-input:focus {
  border-color: var(--ds-color-primary);
  box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.2);
}

.gen-input::placeholder {
  color: var(--ds-color-gray-300);
}

/* Mode Tabs */
.article-mode-tabs {
  display: flex;
  gap: 8px;
}

.article-mode-tab {
  flex: 1;
  padding: 12px;
  border: 2px solid var(--ds-color-gray-200);
  background: var(--ds-color-white);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--ds-font-family);
  border-radius: 8px;
  text-align: center;
}

.article-mode-tab:hover {
  border-color: var(--ds-color-black);
}

.article-mode-tab.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
}

.article-mode-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--ds-color-gray-400);
  padding: 8px 12px;
  background: var(--ds-color-gray-50);
  border-radius: 6px;
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

/* Output */
.article-output {
  flex: 1;
  white-space: pre-wrap;
  line-height: 2;
  font-size: 15px;
  padding: 32px;
  background: var(--ds-color-gray-50);
  min-height: 400px;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.article-output:not(.empty):hover {
  background: var(--ds-color-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.article-output.empty {
  color: var(--ds-color-gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-output pre {
  margin: 0;
  font-family: var(--ds-font-family);
  white-space: pre-wrap;
  word-break: break-all;
}

/* Actions */
.article-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.article-actions .gen-btn {
  flex: 1;
  margin-top: 0;
}

.article-actions .secondary {
  background: var(--ds-color-white);
  color: var(--ds-color-black);
  border: 2px solid var(--ds-color-black);
}

.article-actions .secondary:hover {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
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
