<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { usePlayerStore } from '@/stores/playerStore'

const authStore = useAuthStore()
const playerStore = usePlayerStore()

// Initialize stores on app start
onMounted(() => {
  // Check if user is already authenticated (from localStorage or session)
  const savedToken = localStorage.getItem('authToken')
  const savedUser = localStorage.getItem('authUser')
  
  if (savedToken && savedUser) {
    try {
      authStore.setToken(savedToken)
      authStore.setUser(JSON.parse(savedUser))
    } catch (e) {
      console.warn('Failed to restore auth state')
    }
  }
})
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
