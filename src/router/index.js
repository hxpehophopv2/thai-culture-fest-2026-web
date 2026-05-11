import { createRouter, createWebHistory } from 'vue-router'
import liff from '@line/liff'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/staff-login',
      name: 'staff login',
      component: () => import('../views/StaffLoginView.vue'),
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
        } catch {}
      }
    }
  }
})

export default router
