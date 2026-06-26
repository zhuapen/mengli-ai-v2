<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/core/stores/auth'
import { mockUser } from '@/mocks/user'

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
    // Mock 登录
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (username.value === 'admin' && password.value === '123456') {
      // 模拟登录成功
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    } else {
      error.value = '用户名或密码错误'
    }
  } catch (e) {
    error.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function goRegister() {
  router.push({ name: 'Register' })
}

function closeModal() {
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="login-modal" @click.self="closeModal">
    <div class="login-modal-content">
      <div class="login-modal-header">
        <h3>登录</h3>
        <button class="login-modal-close" @click="closeModal">&times;</button>
      </div>

      <div class="login-error">{{ error }}</div>

      <div class="form-group">
        <label>用户名</label>
        <input
          v-model="username"
          type="text"
          placeholder="请输入用户名"
          @keyup.enter="handleLogin"
        />
      </div>

      <div class="form-group">
        <label>密码</label>
        <input
          v-model="password"
          type="password"
          placeholder="请输入密码"
          @keyup.enter="handleLogin"
        />
      </div>

      <button
        class="login-submit-btn"
        :disabled="loading || !username || !password"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <div class="login-footer">
        还没有账号？
        <a class="login-link" @click="goRegister">立即注册</a>
      </div>

      <div class="login-hint">
        <p>测试账号：admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.login-modal-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-modal-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.login-modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  line-height: 1;
}

.login-modal-close:hover {
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
  font-family: var(--ds-font-family);
}

.form-group input:focus {
  outline: none;
  border-color: var(--ds-color-primary);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.login-error {
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 16px;
  min-height: 20px;
}

.login-submit-btn {
  width: 100%;
  padding: 14px;
  background: var(--ds-color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--ds-font-family);
}

.login-submit-btn:hover {
  background: var(--ds-color-primary-light);
}

.login-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.login-link {
  color: var(--ds-color-primary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

.login-hint {
  margin-top: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  text-align: center;
}

.login-hint p {
  margin: 0;
  font-size: 12px;
  color: #9ca3af;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
