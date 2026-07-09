<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/core/stores/user'
import { validateCompanyEmail } from './email'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const emailError = ref('')
const successMessage = ref('')

function onEmailBlur() {
  if (email.value.trim()) {
    const result = validateCompanyEmail(email.value)
    emailError.value = result.valid ? '' : (result.error ?? '')
  }
}

async function handleRegister() {
  error.value = ''
  successMessage.value = ''
  emailError.value = ''

  const emailResult = validateCompanyEmail(email.value)
  if (!emailResult.valid) {
    emailError.value = emailResult.error ?? ''
    return
  }

  if (!password.value) {
    error.value = '请填写密码'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  if (password.value.length < 6) {
    error.value = '密码长度不能少于6位'
    return
  }

  try {
    const message = await userStore.register({
      email: email.value.trim(),
      password: password.value,
    })
    successMessage.value = message || '注册成功，等待管理员审批'
    // 注册成功后跳转登录页
    setTimeout(() => {
      router.push({ name: 'Login' })
    }, 2000)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '注册失败，请稍后重试'
  }
}

function goLogin() {
  router.push({ name: 'Login' })
}

function closeModal() {
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="register-modal" @click.self="closeModal">
    <div class="register-modal-content">
      <div class="register-modal-header">
        <h3>注册</h3>
        <button class="register-modal-close" @click="closeModal">&times;</button>
      </div>

      <div v-if="successMessage" class="success-message">
        <div class="success-icon">✅</div>
        <h4>注册成功！</h4>
        <p>{{ successMessage }}</p>
        <p class="success-hint">正在跳转到登录页面...</p>
      </div>

      <template v-else>
        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="form-group">
          <label>企业微信邮箱</label>
          <input
            v-model="email"
            type="email"
            data-testid="register-email"
            placeholder="请输入企业微信邮箱"
            @blur="onEmailBlur"
          />
          <p v-if="emailError" class="field-error" data-testid="email-error">{{ emailError }}</p>
          <p class="field-hint">仅支持 @menglihudong.com 企业邮箱</p>
        </div>

        <div class="form-group">
          <label>密码</label>
          <input
            v-model="password"
            type="password"
            data-testid="register-password"
            placeholder="请输入密码（至少6位）"
          />
        </div>

        <div class="form-group">
          <label>确认密码</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            @keyup.enter="handleRegister"
          />
        </div>

        <button
          class="register-submit-btn"
          data-testid="register-submit"
          :disabled="userStore.loading || !email || !password || !confirmPassword"
          @click="handleRegister"
        >
          {{ userStore.loading ? '注册中...' : '注册' }}
        </button>

        <div class="register-footer">
          已有账号？
          <a class="register-link" @click="goLogin">立即登录</a>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.register-modal {
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

.register-modal-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.register-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.register-modal-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.register-modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  line-height: 1;
}

.register-modal-close:hover {
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

.field-error {
  margin: 4px 0 0;
  font-size: 12px;
  color: #ef4444;
}

.field-hint {
  margin: 4px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 12px;
  background: #fee2e2;
  border-radius: 8px;
}

.success-message {
  text-align: center;
  padding: 24px 0;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.success-message h4 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #166534;
}

.success-message p {
  font-size: 14px;
  color: #6b7280;
}

.success-hint {
  margin-top: 12px;
  font-size: 13px;
  color: #9ca3af;
}

.register-submit-btn {
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

.register-submit-btn:hover {
  background: var(--ds-color-primary-light);
}

.register-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.register-link {
  color: var(--ds-color-primary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
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
