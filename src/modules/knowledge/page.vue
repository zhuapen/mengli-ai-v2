<script setup lang="ts">
import { ref } from 'vue'

// 知识库数据
const brands = ref([
  {
    id: '1',
    name: '萌力互动',
    slogan: '创意 · 高效 · 品质',
    personality: '年轻、活力、创新、专业、值得信赖',
    style: '简洁有力、有记忆点、拒绝废话、拒绝AI腔',
    standard: 'Awwwards 级别文案，苹果式简洁 + 耐克式力量感',
    isOpen: false,
  },
  {
    id: '2',
    name: '听研 BIOLAB',
    slogan: '科技护肤，精准高效',
    personality: '专业、科技感、高端、值得信赖',
    style: '专业术语+生活化表达，数据说话，成分党友好',
    standard: '参考修丽可、SK-II 的品牌调性',
    isOpen: false,
  },
])

const templates = ref([
  {
    id: '1',
    name: '小红书种草模板',
    steps: [
      '标题：用数字+痛点+解决方案，如「3步搞定XX」',
      '开头：用真实场景引入，制造共鸣',
      '正文：分点说明，每点配emoji',
      '结尾：总结+互动引导',
      '标签：5-8个相关标签',
    ],
    isOpen: false,
  },
  {
    id: '2',
    name: '朋友圈文案模板',
    steps: [
      '第一行：吸引眼球的开头',
      '中间：2-3个核心卖点',
      '结尾：行动号召',
      '配图建议：产品图+使用场景图',
    ],
    isOpen: false,
  },
])

// 切换展开/折叠
function toggleBrand(id: string) {
  const brand = brands.value.find((b) => b.id === id)
  if (brand) brand.isOpen = !brand.isOpen
}

function toggleTemplate(id: string) {
  const tpl = templates.value.find((t) => t.id === id)
  if (tpl) tpl.isOpen = !tpl.isOpen
}
</script>

<template>
  <div class="knowledge-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-inner">
        <div>
          <h1 class="page-title">品牌知识库</h1>
          <p class="page-desc">萌力互动 · 品牌调性与写作规范</p>
        </div>
      </div>
    </div>

    <div class="knowledge-layout">
      <!-- Brand Voice Section -->
      <div class="knowledge-section">
        <div class="section-header">
          <h2 class="knowledge-title">品牌调性</h2>
          <button class="add-btn">＋ 添加品牌</button>
        </div>

        <div class="knowledge-grid">
          <div
            v-for="brand in brands"
            :key="brand.id"
            class="knowledge-card"
            :class="{ open: brand.isOpen }"
            @click="toggleBrand(brand.id)"
          >
            <div class="knowledge-card-header">
              <span>{{ brand.name }}</span>
              <span class="knowledge-arrow">→</span>
            </div>
            <div class="knowledge-card-body">
              <div class="knowledge-item">
                <span class="knowledge-label">标语</span>
                {{ brand.slogan }}
              </div>
              <div class="knowledge-item">
                <span class="knowledge-label">个性</span>
                {{ brand.personality }}
              </div>
              <div class="knowledge-item">
                <span class="knowledge-label">语言风格</span>
                {{ brand.style }}
              </div>
              <div class="knowledge-item">
                <span class="knowledge-label">对标水准</span>
                {{ brand.standard }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Writing Templates Section -->
      <div class="knowledge-section">
        <h2 class="knowledge-title">写作模板</h2>

        <div class="knowledge-grid">
          <div
            v-for="tpl in templates"
            :key="tpl.id"
            class="knowledge-card"
            :class="{ open: tpl.isOpen }"
            @click="toggleTemplate(tpl.id)"
          >
            <div class="knowledge-card-header">
              <span>{{ tpl.name }}</span>
              <span class="knowledge-arrow">→</span>
            </div>
            <div class="knowledge-card-body">
              <div class="knowledge-template">
                <div
                  v-for="(step, index) in tpl.steps"
                  :key="index"
                  class="knowledge-step"
                >
                  {{ index + 1 }}. {{ step }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-page {
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
.knowledge-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px;
}

.knowledge-section {
  margin-bottom: 64px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.knowledge-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--ds-color-black);
}

.section-header .knowledge-title {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.add-btn {
  padding: 8px 16px;
  background: var(--ds-color-primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  font-family: var(--ds-font-family);
  transition: all 0.2s;
}

.add-btn:hover {
  background: var(--ds-color-black);
  transform: translateY(-2px);
}

/* Knowledge Grid */
.knowledge-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.knowledge-card {
  background: var(--ds-color-white);
  border: 1px solid var(--ds-color-gray-100);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.knowledge-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
  border-color: var(--ds-color-primary);
}

.knowledge-card-header {
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 700;
  background: var(--ds-color-gray-50);
  border-bottom: 1px solid var(--ds-color-gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.knowledge-arrow {
  font-size: 18px;
  color: var(--ds-color-gray-400);
  transition: transform 0.3s;
}

.knowledge-card:hover .knowledge-arrow {
  transform: translateX(4px);
}

.knowledge-card.open .knowledge-arrow {
  transform: rotate(90deg);
}

.knowledge-card-body {
  padding: 24px;
  display: none;
}

.knowledge-card.open .knowledge-card-body {
  display: block;
}

.knowledge-item {
  font-size: 14px;
  line-height: 1.8;
  padding: 8px 0;
  border-bottom: 1px solid var(--ds-color-gray-50);
  transition: all 0.2s ease;
}

.knowledge-item:last-child {
  border-bottom: none;
}

.knowledge-item:hover {
  background: var(--ds-color-gray-50);
  padding-left: 8px;
}

.knowledge-label {
  display: inline-block;
  min-width: 80px;
  font-weight: 600;
  color: var(--ds-color-primary);
}

/* Template */
.knowledge-template {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.knowledge-step {
  font-size: 13px;
  line-height: 1.6;
  padding: 12px 16px;
  background: var(--ds-color-gray-50);
  border-left: 3px solid var(--ds-color-primary);
  transition: all 0.3s ease;
  animation: slideInLeft 0.4s ease;
}

.knowledge-step:hover {
  background: var(--ds-color-white);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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
