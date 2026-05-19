import { createRouter, createWebHistory } from 'vue-router'
import ActivitiesView from '@/views/ActivitiesView.vue'
import Activities from '@/components/reserve/Activities.vue'
import ZoneDetail from '@/components/reserve/ZoneDetail.vue'
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
      component: () => import('../views/StaffView.vue'),
    },
    {
      path: '/activities',
      component: ActivitiesView,
      children: [
        { path: '', name: 'activities', component: Activities },
        { path: ':id', name: 'zone-detail', component: ZoneDetail },
      ],
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      // หน่วงเวลา 300ms ให้สอดคล้องกับเวลาของ Transition สลับหน้า (0.3s)
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition)
        } else {
          resolve({ top: 0 })
        }
      }, 300)
    })
  },
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
