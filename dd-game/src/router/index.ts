import { createRouter, createWebHistory } from 'vue-router'
import GameUI from '@/components/GameUI.vue'
import CharacterCreation from '@/components/CharacterCreation.vue'
import CombatUI from '@/components/CombatUI.vue'
import MapDisplay from '@/components/MapDisplay.vue'
import Login from '@/components/Login.vue'
import NotFound from '@/components/NotFound.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: GameUI,
      meta: { title: '游戏主界面', requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { title: '登录', requiresAuth: false }
    },
    {
      path: '/character-creation',
      name: 'CharacterCreation',
      component: CharacterCreation,
      meta: { title: '角色创建', requiresAuth: true }
    },
    {
      path: '/combat',
      name: 'Combat',
      component: CombatUI,
      meta: { title: '战斗界面', requiresAuth: true }
    },
    {
      path: '/map',
      name: 'Map',
      component: MapDisplay,
      meta: { title: '地图显示', requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
      meta: { title: '页面未找到' }
    }
  ]
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login with redirect query
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // If already logged in, redirect to home
    next({ name: 'Home' })
  } else {
    next()
  }
})

// Title management
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router
