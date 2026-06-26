<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'
import DsButton from '@/design-system/components/DsButton.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await authStore.login(username.value, password.value)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (e) {
    error.value = '登录失败，请检查用户名和密码'
  } finally {
    loading.value = false
  }
}

function goRegister() {
  router.push({ name: 'Register' })
}
</script>

<template>
  <div class="login-page">
    <h2 class="auth-heading">登录</h2>
    <p class="auth-subheading">欢迎回来</p>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="form-group">
      <label class="form-label">用户名</label>
      <input
        v-model="username"
        type="text"
        class="form-input"
        placeholder="请输入用户名"
        @keyup.enter="handleLogin"
      />
    </div>

    <div class="form-group">
      <label class="form-label">密码</label>
      <input
        v-model="password"
        type="password"
        class="form-input"
        placeholder="请输入密码"
        @keyup.enter="handleLogin"
      />
    </div>

    <DsButton :loading="loading" size="lg" style="width: 100%" @click="handleLogin">
      登录
    </DsButton>

    <div class="auth-footer">
      还没有账号？
      <a class="auth-link" @click="goRegister">立即注册</a>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  background: var(--ds-color-white);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.auth-heading {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
}

.auth-subheading {
  font-size: 14px;
  color: var(--ds-color-gray-400);
  margin-bottom: 32px;
}

.error-message {
  padding: 12px 16px;
  background: var(--ds-color-error-bg);
  color: var(--ds-color-error);
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-color-gray-600);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid var(--ds-color-gray-200);
  border-radius: 8px;
  font-size: 15px;
  font-family: var(--ds-font-family);
  outline: none;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: var(--ds-color-primary);
  box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.2);
}

.form-input::placeholder {
  color: var(--ds-color-gray-300);
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: var(--ds-color-gray-400);
}

.auth-link {
  color: var(--ds-color-primary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
