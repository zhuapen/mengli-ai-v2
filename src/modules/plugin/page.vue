<script setup lang="ts">
/**
 * 插件下载页 — 萌力AI插件 MVP
 * 纯静态页面，不接入后端 API
 */

const PLUGIN_VERSION = '0.3.61'
const DOWNLOAD_URL = '/downloads/mengli-ai-plugin-v0.3.61.zip'

const platforms = [
  { name: '蒲公英', icon: '🌸', desc: '小红书蒲公英平台达人数据' },
  { name: '虎选 / 腾讯互选', icon: '🐯', desc: '腾讯互选视频号达人数据' },
  { name: '巨量星图', icon: '⭐', desc: '抖音巨量星图达人数据' },
]

const capabilities = [
  '达人搜索',
  '达人详情采集',
  '粉丝画像',
  '内容 / 笔记表现',
  'CPM / CPE / 成本效率',
  'CSV / XLSX 导入导出',
]

const steps = [
  { num: 1, text: '点击下方按钮下载插件包' },
  { num: 2, text: '解压到本地任意目录' },
  { num: 3, text: '打开 Chrome 浏览器，访问 chrome://extensions' },
  { num: 4, text: '打开右上角"开发者模式"' },
  { num: 5, text: '点击"加载已解压的扩展程序"，选择解压后的插件目录' },
  { num: 6, text: '登录对应平台（蒲公英 / 虎选 / 星图）' },
  { num: 7, text: '使用插件采集数据' },
  { num: 8, text: '导出 CSV / XLSX，后续可导入 Mengli 网站' },
]

const safetyNotes = [
  '插件在用户本地浏览器中运行，数据不上传到网站',
  '网站不会接管任何平台账号',
  '网站不会读取平台 Cookie 或 Token',
  '第一版不做实时同步，用户自行决定采集和导出',
]
</script>

<template>
  <div class="plugin-page">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-icon">🔌</div>
        <h1 class="hero-title">萌力AI插件</h1>
        <p class="hero-version">v{{ PLUGIN_VERSION }}</p>
        <p class="hero-desc">
          用于在用户本地浏览器中辅助采集蒲公英、虎选/腾讯互选、巨量星图等平台的数据。
        </p>
        <a :href="DOWNLOAD_URL" download class="download-btn">
          <span class="download-icon">⬇</span>
          下载插件包
        </a>
      </div>
    </section>

    <!-- 支持平台 -->
    <section class="section">
      <h2 class="section-title">支持平台</h2>
      <div class="platform-grid">
        <div v-for="p in platforms" :key="p.name" class="platform-card">
          <span class="platform-icon">{{ p.icon }}</span>
          <div>
            <div class="platform-name">{{ p.name }}</div>
            <div class="platform-desc">{{ p.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心能力 -->
    <section class="section">
      <h2 class="section-title">核心能力</h2>
      <div class="capability-grid">
        <div v-for="cap in capabilities" :key="cap" class="capability-tag">
          {{ cap }}
        </div>
      </div>
    </section>

    <!-- 使用流程 -->
    <section class="section">
      <h2 class="section-title">使用流程</h2>
      <ol class="steps-list">
        <li v-for="step in steps" :key="step.num" class="step-item">
          <span class="step-num">{{ step.num }}</span>
          <span class="step-text">{{ step.text }}</span>
        </li>
      </ol>
    </section>

    <!-- 安全说明 -->
    <section class="section">
      <h2 class="section-title">安全说明</h2>
      <div class="safety-card">
        <ul class="safety-list">
          <li v-for="(note, i) in safetyNotes" :key="i">{{ note }}</li>
        </ul>
      </div>
    </section>

    <!-- 数据导入占位 -->
    <section class="section">
      <h2 class="section-title">数据导入</h2>
      <div class="import-placeholder">
        <span class="import-icon">📊</span>
        <p class="import-text">CSV / XLSX 导入功能即将支持</p>
        <p class="import-hint">插件导出的数据文件后续可直接导入本站</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.plugin-page {
  animation: pageEnter 0.2s ease;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 80px 48px;
  text-align: center;
  color: white;
}

.hero-inner {
  max-width: 640px;
  margin: 0 auto;
}

.hero-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.hero-title {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0 0 8px;
}

.hero-version {
  font-size: 14px;
  opacity: 0.6;
  margin: 0 0 16px;
  font-family: monospace;
}

.hero-desc {
  font-size: 16px;
  line-height: 1.8;
  opacity: 0.85;
  margin: 0 0 32px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: #4f46e5;
  color: white;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.download-btn:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4);
}

.download-icon {
  font-size: 18px;
}

/* Section */
.section {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px;
  color: var(--ds-color-black);
}

/* Platforms */
.platform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.platform-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--ds-color-white);
  border: 1px solid var(--ds-color-gray-100);
  border-radius: 12px;
  transition: all 0.2s;
}

.platform-card:hover {
  border-color: var(--ds-color-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.platform-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.platform-name {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 4px;
}

.platform-desc {
  font-size: 13px;
  color: var(--ds-color-gray-400);
}

/* Capabilities */
.capability-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.capability-tag {
  padding: 8px 20px;
  background: var(--ds-color-gray-50);
  border: 1px solid var(--ds-color-gray-100);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  color: var(--ds-color-gray-600);
}

/* Steps */
.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--ds-color-white);
  border: 1px solid var(--ds-color-gray-100);
  border-radius: 10px;
}

.step-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ds-color-primary);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--ds-color-gray-600);
}

/* Safety */
.safety-card {
  padding: 24px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
}

.safety-list {
  margin: 0;
  padding: 0 0 0 20px;
  list-style: disc;
}

.safety-list li {
  font-size: 14px;
  line-height: 2;
  color: #166534;
}

/* Import placeholder */
.import-placeholder {
  padding: 48px;
  text-align: center;
  background: var(--ds-color-gray-50);
  border: 2px dashed var(--ds-color-gray-200);
  border-radius: 16px;
}

.import-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.import-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--ds-color-gray-600);
  margin: 0 0 8px;
}

.import-hint {
  font-size: 14px;
  color: var(--ds-color-gray-400);
  margin: 0;
}

@keyframes pageEnter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
