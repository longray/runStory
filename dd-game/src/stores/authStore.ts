import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface AuthUser {
  id: string
  username: string
  email?: string
  role: 'player' | 'admin'
  createdAt: number
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const userId = computed(() => user.value?.id || null)
  const username = computed(() => user.value?.username || null)
  const role = computed(() => user.value?.role || 'player')

  function setUser(userData: AuthUser): void {
    user.value = userData
    isAuthenticated.value = true
  }

  function setToken(newToken: string): void {
    token.value = newToken
  }

  function login(username: string, _password: string): Promise<void> {
    isLoading.value = true
    error.value = null

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const mockUser: AuthUser = {
            id: crypto.randomUUID(),
            username,
            role: 'player',
            createdAt: Date.now()
          }
          
          setUser(mockUser)
          setToken(crypto.randomUUID())
          resolve()
        } catch (err) {
          error.value = 'Login failed'
          reject(err)
        } finally {
          isLoading.value = false
        }
      }, 1000)
    })
  }

  function logout(): void {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    error.value = null
  }

  function register(username: string, email: string, _password: string): Promise<void> {
    isLoading.value = true
    error.value = null

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const mockUser: AuthUser = {
            id: crypto.randomUUID(),
            username,
            email,
            role: 'player',
            createdAt: Date.now()
          }
          
          setUser(mockUser)
          setToken(crypto.randomUUID())
          resolve()
        } catch (err) {
          error.value = 'Registration failed'
          reject(err)
        } finally {
          isLoading.value = false
        }
      }, 1500)
    })
  }

  function refreshToken(): Promise<void> {
    if (!token.value) {
      return Promise.reject('No token to refresh')
    }

    isLoading.value = true
    error.value = null

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          setToken(crypto.randomUUID())
          resolve()
        } catch (err) {
          error.value = 'Token refresh failed'
          reject(err)
        } finally {
          isLoading.value = false
        }
      }, 500)
    })
  }

  function clearAuth(): void {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    isLoading.value = false
    error.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    userId,
    username,
    role,
    setUser,
    setToken,
    login,
    logout,
    register,
    refreshToken,
    clearAuth
  }
})