import { createRouter, createWebHistory } from 'vue-router'
import ActivitiesView from '@/views/ActivitiesView.vue'
import Activities from '@/components/reserve/Activities.vue'
import ZoneDetail from '@/components/reserve/ZoneDetail.vue'
import { initLineAuth } from '@/services/lineAuthService'
import { useUserData } from '@/composables/useUserData'
import { useAuth } from '@/composables/useAuth'
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
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/activities',
      component: ActivitiesView,
      children: [
        {
          path: '',
          name: 'activities',
          component: Activities,
        },
        {
          path: ':id',
          name: 'zone-detail',
          component: ZoneDetail,
          props: true,
        },
      ],
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
  const DEV_MODE_BYPASS = false // เปลี่ยนเป็น false เมื่อต้องการเชื่อมต่อ LINE จริงๆ

  if (DEV_MODE_BYPASS) {
    const { isRegistered } = useAuth()

    // เปลี่ยนค่านี้เป็น true ถ้าอยากดูหน้าเว็บในมุมมอง registered
    isRegistered.value = false

    return true // อนุญาตให้ผ่านเข้าเว็บได้เลย โดยไม่ต้องรันโค้ดเช็ค LINE ด้านล่าง
  }

  // -----------------------------------------------------------------
  if (to.path === '/staff-login') {
    return
  }

  try {
    // Only force login if NOT on public routes (Home page "/" or paths starting with "/activities")
    const isPublicRoute = to.path === '/' || to.path.startsWith('/activities')
    const auth = await initLineAuth(to.fullPath, !isPublicRoute)
    if (auth.redirected) {
      return false
    }
    const { fetchUserData, registrationData } = useUserData()
    const { isRegistered } = useAuth()

    if (liff.isLoggedIn()) {
      await fetchUserData()

      if (registrationData.value) {
        isRegistered.value = true
        if (to.path === '/register') {
          return '/'
        }
      } else {
        isRegistered.value = false
        if (to.path !== '/register' && to.path !== '/' && !to.path.startsWith('/activities')) {
          return '/register'
        }
      }
    } else {
      isRegistered.value = false
      registrationData.value = null

      if (to.path !== '/register' && to.path !== '/' && !to.path.startsWith('/activities')) {
        return '/register'
      }
    }
  } catch (error) {
    console.error('LIFF Router Auth Guard Error:', error)
  }
})

// Dismiss initial loading screen after first navigation
let isFirstNavigation = true
router.afterEach(() => {
  if (isFirstNavigation) {
    isFirstNavigation = false
    const loader = document.getElementById('initial-loader')
    if (loader) {
      loader.classList.add('fade-out')
      setTimeout(() => loader.remove(), 400)
    }
  }
})

export default router
