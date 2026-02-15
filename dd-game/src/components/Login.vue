<template>
  <div class="login-container">
    <div class="login-form">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="输入用户名"
            required
            data-testid="username-input"
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="输入密码"
            required
            data-testid="password-input"
          />
        </div>
        <button
          type="submit"
          class="btn-primary"
          :disabled="isLoading"
          data-testid="login-button"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
        <div v-if="error" class="error-message" data-testid="error-message">
          {{ error }}
        </div>
      </form>
      <div class="register-link">
        <p>还没有账号？</p>
        <button
          type="button"
          class="btn-secondary"
          @click="handleRegister"
          data-testid="register-button"
        >
          注册新账号
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref<string | null>(null)

const handleLogin = async () => {
  if (!username.value || !password.value) return
  
  isLoading.value = true
  error.value = null

  try {
    await authStore.login(username.value, password.value)
    
    // Redirect to home or previous page
    const redirect = router.currentRoute.value.query.redirect as string
    await router.push(redirect || '/')
  } catch (err) {
    error.value = '登录失败，请检查用户名和密码'
    console.error('Login error:', err)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  try {
    await authStore.register(username.value, `${username.value}@example.com`, password.value)
    
    // Redirect to home after registration
    await router.push('/')
  } catch (err) {
    error.value = '注册失败，请重试'
    console.error('Registration error:', err)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 2rem;
}

.login-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  border: 2px solid #4a4a6a;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.login-form h2 {
  margin: 0 0 2rem 0;
  text-align: center;
  color: #ffd700;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e8e8e8;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #4a4a6a;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.3);
  color: #e8e8e8;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ffd700;
}

.form-group input::placeholder {
  color: #888;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-primary {
  background: #ffd700;
  color: #1a1a2e;
}

.btn-primary:hover:not(:disabled) {
  background: #ffed4a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e8e8e8;
  border: 2px solid #4a4a6a;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #ffd700;
}

.error-message {
  color: #ff6b6b;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.register-link {
  margin-top: 2rem;
  text-align: center;
}

.register-link p {
  color: #e8e8e8;
  margin-bottom: 0.5rem;
}

.register-link button {
  margin-top: 0.5rem;
}
</style>