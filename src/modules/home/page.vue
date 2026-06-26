<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { mockCaseStudies, mockAboutItems } from '@/mocks/home'

const router = useRouter()

// 滚动动画
const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach((el) => {
    observer.value?.observe(el)
  })
})

const features = [
  {
    icon: '🔍',
    title: '达人查找',
    description: 'AI 智能匹配，快速找到最适合品牌合作的达人',
    route: '/media',
    delay: '0.6s',
  },
  {
    icon: '🎨',
    title: '图片生成',
    description: 'AI 创意生图，一键生成营销素材和宣传海报',
    route: '/image',
    delay: '0.8s',
  },
  {
    icon: '✍️',
    title: '文案撰写',
    description: '智能文案创作，适配各平台风格的种草内容',
    route: '/copy',
    delay: '1.0s',
  },
]

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="home-hero">
      <div class="home-content">
        <div class="home-tag fade-in">Mengli Interactive</div>
        <h1 class="home-title fade-in" style="transition-delay: 0.2s">
          萌力互动<br />AI创作平台
        </h1>

        <div class="home-features">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="home-feature-card fade-in"
            :style="{ transitionDelay: feature.delay }"
            @click="navigateTo(feature.route)"
          >
            <div class="home-feature-icon">{{ feature.icon }}</div>
            <div class="home-feature-title">{{ feature.title }}</div>
            <div class="home-feature-desc">{{ feature.description }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Case Studies Section -->
    <section class="home-section">
      <h2 class="home-section-title fade-in">精选案例</h2>
      <p class="home-section-desc fade-in">我们为品牌打造的营销奇迹</p>
      <div class="placeholder-grid">
        <div
          v-for="(item, index) in mockCaseStudies"
          :key="item.id"
          class="placeholder-card"
          :class="index === 0 ? 'fade-in-left' : index === 2 ? 'fade-in-right' : 'fade-in'"
        >
          {{ item.title }}
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="home-section">
      <h2 class="home-section-title fade-in">关于我们</h2>
      <p class="home-section-desc fade-in">萌力互动 — 您的全域营销合作伙伴</p>
      <div class="placeholder-grid">
        <div
          v-for="(item, index) in mockAboutItems"
          :key="item.id"
          class="placeholder-card"
          :class="index === 0 ? 'fade-in-left' : index === 2 ? 'fade-in-right' : 'fade-in'"
        >
          {{ item.title }}
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer fade-in">
      <div class="footer-brand">
        <img src="/logo.jpg" alt="萌力互动" />
        <span>萌力互动</span>
      </div>
      <div class="footer-copy">© 2024 Mengli Interactive. All rights reserved.</div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  animation: pageEnter 0.6s ease;
}

/* ========== HOME HERO ========== */
.home-hero {
  padding: 120px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 72px);
  background: linear-gradient(135deg, var(--ds-color-gray-50) 0%, var(--ds-color-white) 100%);
}

.home-content {
  max-width: 1200px;
  text-align: center;
}

.home-tag {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--ds-color-primary);
  margin-bottom: 24px;
}

.home-title {
  font-size: clamp(48px, 6vw, 80px);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -2px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, var(--ds-color-black) 0%, var(--ds-color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-top: 80px;
}

.home-feature-card {
  position: relative;
  padding: 40px;
  background: var(--ds-color-white);
  border: 1px solid var(--ds-color-gray-100);
  text-align: left;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.home-feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
  border-color: var(--ds-color-primary);
}

.home-feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--ds-color-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.home-feature-card:hover::before {
  transform: scaleX(1);
}

.home-feature-icon {
  font-size: 48px;
  margin-bottom: 24px;
}

.home-feature-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
}

.home-feature-desc {
  font-size: 14px;
  color: var(--ds-color-gray-400);
  line-height: 1.8;
}

/* ========== HOME SECTIONS ========== */
.home-section {
  padding: 120px 48px;
  border-top: 1px solid var(--ds-color-gray-100);
}

.home-section-title {
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 16px;
}

.home-section-desc {
  font-size: 16px;
  color: var(--ds-color-gray-400);
  text-align: center;
  margin-bottom: 64px;
}

.placeholder-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.placeholder-card {
  height: 300px;
  background: var(--ds-color-gray-50);
  border: 2px dashed var(--ds-color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-color-gray-300);
  font-size: 14px;
  transition: all 0.3s ease;
}

.placeholder-card:hover {
  border-color: var(--ds-color-primary);
  color: var(--ds-color-primary);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

/* ========== FOOTER ========== */
.footer {
  padding: 48px;
  text-align: center;
  border-top: 1px solid var(--ds-color-gray-100);
}

.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-brand img {
  height: 32px;
  width: auto;
  border-radius: 8px;
}

.footer-brand span {
  font-size: 18px;
  font-weight: 700;
}

.footer-copy {
  font-size: 13px;
  color: var(--ds-color-gray-400);
}

/* ========== ANIMATIONS ========== */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.fade-in-left {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-left.visible {
  opacity: 1;
  transform: translateX(0);
}

.fade-in-right {
  opacity: 0;
  transform: translateX(30px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-in-right.visible {
  opacity: 1;
  transform: translateX(0);
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
