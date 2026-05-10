import { createRouter, createWebHistory } from 'vue-router'
import liff from '@line/liff'
import HomeView from '../pages/homeUnregistered.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/registerPage.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.path === '/') {
    const params = new URLSearchParams(window.location.search)
    const hasLiffCallback =
      params.has('liffClientId') || params.has('code') || params.has('liffRedirectUri')

    if (hasLiffCallback) {
      const liffId = import.meta.env.VITE_LIFF_ID
      if (liffId) {
        try {
          await liff.init({ liffId })
          if (liff.isLoggedIn()) {
            return '/register'
          }
        } catch {
        }
      }
    }
  }
})

export default router
