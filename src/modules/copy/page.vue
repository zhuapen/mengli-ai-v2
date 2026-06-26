<script setup lang="ts">
import { ref, computed } from 'vue'
import DsLoading from '@/design-system/components/DsLoading.vue'

// 表单数据
const copyType = ref('种草科普')
const brand = ref('')
const platform = ref('小红书')
const product = ref('')
const extra = ref('')

// 状态
const loading = ref(false)
const output = ref('')
const versions = ref<string[]>([])
const currentVersion = ref(0)

// 选项
const copyTypes = [
  { value: '种草科普', label: '种草科普 - 产品安利/选品指南' },
  { value: '误区纠正', label: '误区纠正 - 知识纠偏/专业解读' },
  { value: '场景种草', label: '场景种草 - 生活场景植入' },
  { value: '节点促销', label: '节点促销 - 618/双11/节日' },
  { value: '送礼场景', label: '送礼场景 - 送长辈/送朋友' },
  { value: '通用文案', label: '通用文案 - 自由创作' },
]

const brands = [
  { value: '', label: '通用品牌' },
  { value: '听研 BIOLAB', label: '听研 BIOLAB - 科技护肤' },
  { value: '汤臣倍健', label: '汤臣倍健 - 保健品' },
  { value: '她多维', label: '她多维 - 女性维生素' },
  { value: 'SLIM蛋', label: 'SLIM蛋 - 蛋白粉' },
  { value: '臻钻蛋白粉', label: '臻钻蛋白粉 - 高端蛋白' },
  { value: '特医', label: '特医 - 特医食品' },
]

const platforms = [
  { value: '小红书', label: '小红书 - 种草笔记' },
  { value: '朋友圈', label: '朋友圈 - 日常分享' },
  { value: '公众号', label: '公众号 - 深度长文' },
  { value: '短视频脚本', label: '短视频 - 口播脚本' },
]

// 快捷优化选项
const quickActions = [
  '更口语化',
  '更专业',
  '增加种草感',
  '增加3个标题',
  '缩短篇幅',
  '扩写内容',
  '小红书风格',
]

const followUpInput = ref('')

// 生成文案
async function handleGenerate() {
  if (!product.value.trim()) return

  loading.value = true
  output.value = ''

  // Mock 生成
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const mockOutput = `【${copyType.value}】${product.value}

亲测好用！这款${product.value}真的太绝了！✨

作为一个成分党，我必须说这个配方真的很良心。${brand.value ? brand.value + '出品，品质有保障。' : ''}

使用感受：
- 质地轻薄，吸收超快
- 用了一周效果明显
- 性价比超高

${platform.value === '小红书' ? '#好物分享 #种草 #' + product.value : ''}

${extra.value ? '备注：' + extra.value : ''}`

  output.value = mockOutput
  versions.value.push(mockOutput)
  currentVersion.value = versions.value.length - 1

  loading.value = false
}

// 快捷优化
function handleQuickRefine(action: string) {
  followUpInput.value = action
  handleRefine()
}

// 继续优化
async function handleRefine() {
  if (!followUpInput.value.trim()) return

  loading.value = true

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const refinedOutput = output.value + `\n\n【优化】${followUpInput.value}...`
  output.value = refinedOutput
  versions.value.push(refinedOutput)
  currentVersion.value = versions.value.length - 1

  followUpInput.value = ''
  loading.value = false
}

// 切换版本
function switchVersion(index: number) {
  currentVersion.value = index
  output.value = versions.value[index]
}

// 复制文案
function handleCopy() {
  navigator.clipboard.writeText(output.value)
  alert('已复制到剪贴板')
}

// 重新生成
function handleRetry() {
  handleGenerate()
}

// 是否有输出
const hasOutput = computed(() => output.value.length > 0)
</script>

<template>
  <div class="copy-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">文案撰写</h1>
          <p class="page-desc">萌力互动专属文案工作室 · KOC/UGC 社交文案</p>
        </div>
      </div>
    </div>

    <div class="copy-layout">
      <!-- 左侧：输入区 -->
      <div class="copy-left">
        <div class="gen-label">文案类型</div>
        <select v-model="copyType" class="gen-select">
          <option v-for="item in copyTypes" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>

        <div class="gen-label" style="margin-top: 24px">品牌</div>
        <select v-model="brand" class="gen-select">
          <option v-for="item in brands" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>

        <div class="gen-label" style="margin-top: 24px">发布平台</div>
        <select v-model="platform" class="gen-select">
          <option v-for="item in platforms" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>

        <div class="gen-label" style="margin-top: 24px">产品/主题</div>
        <input
          v-model="product"
          type="text"
          class="gen-input"
          placeholder="如：超上扬精华、钙片、蛋白粉..."
        />

        <div class="gen-label" style="margin-top: 24px">补充要求</div>
        <textarea
          v-model="extra"
          class="gen-textarea"
          placeholder="如：突出性价比、强调温和不刺激、200字左右..."
        />

        <button
          class="gen-btn"
          :disabled="loading || !product.trim()"
          @click="handleGenerate"
        >
          {{ loading ? '生成中...' : '生成文案' }}
        </button>
      </div>

      <!-- 右侧：输出区 -->
      <div class="copy-right">
        <div class="gen-label">
          生成结果
        </div>

        <DsLoading v-if="loading && !output" text="正在生成文案..." />

        <div
          v-else-if="hasOutput"
          class="copy-output"
        >
          <pre>{{ output }}</pre>
        </div>

        <div v-else class="copy-output empty">
          点击「生成文案」开始创作
        </div>

        <!-- 版本条 -->
        <div v-if="versions.length > 1" class="version-bar">
          <span
            v-for="(v, index) in versions"
            :key="index"
            class="version-item"
            :class="{ active: index === currentVersion }"
            @click="switchVersion(index)"
          >
            V{{ index + 1 }}
          </span>
        </div>

        <!-- 继续优化 -->
        <div v-if="hasOutput" class="follow-up-bar">
          <div class="follow-up-actions">
            <button
              v-for="action in quickActions"
              :key="action"
              class="quick-action-btn"
              @click="handleQuickRefine(action)"
            >
              {{ action }}
            </button>
          </div>
          <div class="follow-up-input-row">
            <input
              v-model="followUpInput"
              placeholder="输入修改要求，如：保留前半部分，把结尾改得更有种草感"
              @keyup.enter="handleRefine"
            />
            <button
              class="gen-btn refine-btn"
              :disabled="loading || !followUpInput.trim()"
              @click="handleRefine"
            >
              继续优化
            </button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="copy-actions">
          <button
            v-if="hasOutput"
            class="gen-btn retry-btn"
            @click="handleRetry"
          >
            重新生成
          </button>
          <button
            v-if="hasOutput"
            class="gen-btn secondary"
            @click="handleCopy"
          >
            复制文案
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.copy-page {
  animation: pageEnter 0.6s ease;
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
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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
.copy-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
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

/* Form Elements */
.gen-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--ds-color-gray-400);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
}

.gen-select {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--ds-color-gray-200);
  font-size: 15px;
  font-family: var(--ds-font-family);
  outline: none;
  cursor: pointer;
  background: var(--ds-color-white);
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23808080'%3E%3Cpath d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.gen-select:focus {
  border-color: var(--ds-color-primary);
  box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.2);
}

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

.gen-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid var(--ds-color-gray-200);
  font-size: 15px;
  font-family: var(--ds-font-family);
  outline: none;
  min-height: 120px;
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
.copy-output {
  flex: 1;
  white-space: pre-wrap;
  line-height: 2;
  font-size: 15px;
  padding: 24px;
  background: var(--ds-color-gray-50);
  min-height: 300px;
  transition: all 0.3s ease;
}

.copy-output:not(.empty):hover {
  background: var(--ds-color-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.copy-output.empty {
  color: var(--ds-color-gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-output pre {
  margin: 0;
  font-family: var(--ds-font-family);
  white-space: pre-wrap;
  word-break: break-all;
}

/* Version Bar */
.version-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  padding: 8px 0;
  margin-top: 8px;
  font-size: 13px;
}

.version-item {
  padding: 3px 10px;
  border-radius: 12px;
  cursor: pointer;
  background: var(--ds-color-gray-100);
  color: var(--ds-color-gray-500);
  border: 1px solid var(--ds-color-gray-200);
  transition: all 0.15s;
}

.version-item:hover {
  background: var(--ds-color-gray-200);
}

.version-item.active {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
  border-color: var(--ds-color-black);
}

/* Follow Up Bar */
.follow-up-bar {
  margin-top: 16px;
}

.follow-up-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.quick-action-btn {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  background: var(--ds-color-gray-50);
  border: 1px solid var(--ds-color-gray-200);
  cursor: pointer;
  color: var(--ds-color-gray-600);
  transition: all 0.15s;
  white-space: nowrap;
  font-family: var(--ds-font-family);
}

.quick-action-btn:hover {
  background: var(--ds-color-gray-100);
  border-color: var(--ds-color-gray-300);
  color: var(--ds-color-black);
}

.follow-up-input-row {
  display: flex;
  gap: 8px;
}

.follow-up-input-row input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid var(--ds-color-gray-200);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: var(--ds-font-family);
}

.follow-up-input-row input:focus {
  border-color: var(--ds-color-black);
}

.follow-up-input-row input::placeholder {
  color: var(--ds-color-gray-300);
}

.refine-btn {
  flex-shrink: 0;
  padding: 10px 20px;
  font-size: 14px;
  margin-top: 0;
  width: auto;
}

/* Actions */
.copy-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.copy-actions .gen-btn {
  flex: 1;
  margin-top: 0;
}

.copy-actions .secondary {
  background: var(--ds-color-white);
  color: var(--ds-color-black);
  border: 2px solid var(--ds-color-black);
}

.copy-actions .secondary:hover {
  background: var(--ds-color-black);
  color: var(--ds-color-white);
}

.retry-btn {
  background: var(--ds-color-gray-100);
  color: var(--ds-color-black);
}

.retry-btn:hover {
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
