<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navLinks = [
  { name: '首页', path: '/', routeName: 'Home' },
  { name: '智能媒体库', path: '/media', routeName: 'Media' },
  { name: '图片生成', path: '/image', routeName: 'Image' },
  { name: '文案撰写', path: '/copy', routeName: 'Copy' },
  { name: '公众号写稿', path: '/article', routeName: 'Article' },
  { name: '品牌知识库', path: '/knowledge', routeName: 'Knowledge' },
  { name: '素材库', path: '/assets', routeName: 'Assets' },
  { name: '数据中心', path: '/datacenter', routeName: 'DataCenter' },
  { name: '历史记录', path: '/history', routeName: 'History' },
]

const isActive = (routeName: string) => {
  return route.name === routeName
}

const handleLogin = () => {
  router.push({ name: 'Login' })
}

const handleRegister = () => {
  router.push({ name: 'Register' })
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="navbar-logo">
        <img src="/logo.jpg" alt="萌力互动" class="logo-image" />
        <span class="logo-text">萌力互动</span>
      </router-link>

      <div class="navbar-links">
        <router-link
          v-for="link in navLinks"
          :key="link.routeName"
          :to="link.path"
          class="nav-link"
          :class="{ active: isActive(link.routeName) }"
        >
          {{ link.name }}
        </router-link>
      </div>
    </div>

    <div class="navbar-right">
      <template v-if="!authStore.isAuthenticated">
        <button class="btn-register" @click="handleRegister">注册</button>
        <button class="btn-login" @click="handleLogin">登录</button>
      </template>
      <template v-else>
        <div class="user-info">
          <span class="username">用户</span>
          <button class="btn-logout" @click="authStore.logout()">退出</button>
        </div>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 72px;
  padding: 0 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--ds-color-gray-100);
  animation: slideDown 0.8s ease;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 48px;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--ds-color-black);
}

.logo-image {
  height: 40px;
  width: auto;
  border-radius: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.navbar-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  position: relative;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ds-color-gray-500);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--ds-color-primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 80%;
}

.nav-link:hover {
  color: var(--ds-color-black);
  background: var(--ds-color-gray-50);
}

.nav-link.active {
  color: var(--ds-color-black);
  background: var(--ds-color-gray-100);
}

.navbar-right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  white-space: nowrap;
}

.btn-register {
  padding: 8px 16px;
  background: transparent;
  color: var(--ds-color-primary);
  border: 1.5px solid var(--ds-color-primary);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-register:hover {
  background: var(--ds-color-primary);
  color: var(--ds-color-white);
}

.btn-login {
  padding: 8px 24px;
  background: var(--ds-color-primary);
  color: var(--ds-color-white);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-login:hover {
  background: var(--ds-color-primary-light);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-size: 14px;
  font-weight: 600;
}

.btn-logout {
  padding: 6px 12px;
  background: transparent;
  color: var(--ds-color-gray-500);
  border: 1px solid var(--ds-color-gray-200);
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  color: var(--ds-color-error);
  border-color: var(--ds-color-error);
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
