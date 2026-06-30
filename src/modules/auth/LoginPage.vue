<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/core/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = '请输入邮箱和密码'
    return
  }

  error.value = ''

  try {
    await userStore.login({ email: email.value, password: password.value })
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '登录失败，请稍后重试'
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
        <label>邮箱</label>
        <input
          v-model="email"
          type="email"
          data-testid="login-email"
          placeholder="请输入邮箱"
          @keyup.enter="handleLogin"
        />
      </div>

      <div class="form-group">
        <label>密码</label>
        <input
          v-model="password"
          type="password"
          data-testid="login-password"
          placeholder="请输入密码"
          @keyup.enter="handleLogin"
        />
      </div>

      <button
        class="login-submit-btn"
        data-testid="login-submit"
        :disabled="userStore.loading || !email || !password"
        @click="handleLogin"
      >
        {{ userStore.loading ? '登录中...' : '登录' }}
      </button>

      <div class="login-footer">
        还没有账号？
        <a class="login-link" @click="goRegister">立即注册</a>
      </div>

      <div class="login-hint">
        <p>测试账号：admin@mengli.ai / 123456</p>
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
