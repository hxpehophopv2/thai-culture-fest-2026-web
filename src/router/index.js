import { createRouter, createWebHistory } from 'vue-router'
import ActivitiesView from '@/views/ActivitiesView.vue'
import Activities from '@/components/reserve/Activities.vue'
import ZoneDetail from '@/components/reserve/ZoneDetail.vue'
import { initLineAuth } from '@/services/lineAuthService'
import { useUserData } from '@/composables/useUserData'
import { useAuth } from '@/composables/useAuth'

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
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
  ],

  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
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
  if (to.path === '/staff-login') {
    return
  }

  try {
    const auth = await initLineAuth(to.fullPath)
    if (auth.redirected) {
      return false
    }

    const { fetchUserData, registrationData } = useUserData()
    const { isRegistered } = useAuth()

    try {
      await fetchUserData()
      isRegistered.value = true

      if (to.path === '/register') {
        return '/'
      }
    } catch (err) {
      if (err.status === 404) {
        isRegistered.value = false
        registrationData.value = null

        /* * 🎯 แก้ไขจุดนี้: อนุญาตให้ผู้ใช้ที่ยังไม่ลงทะเบียนเข้าหน้าใด ๆ ก็ตามที่ขึ้นต้นด้วย /activities ได้
         * แต่ถ้าพยายามจะไปหน้าอื่นที่ต้องล็อกอิน (เช่น /profile) ระบบจะยังเตะไปหน้าลงทะเบียนตามเดิม
         */
        if (to.path !== '/register' && to.path !== '/' && !to.path.startsWith('/activities')) {
          return '/register'
        }
      } else {
        throw err
      }
    }
  } catch (error) {
    console.error('LIFF Router Auth Guard Error:', error)
  }
})

export default router
