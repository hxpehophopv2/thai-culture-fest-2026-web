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
  // 1. Skip auth check for staff page
  if (to.path === '/staff-login') {
    return
  }

  try {
    // 2. Initialize LIFF and authenticate with the target path as redirect URI
    const auth = await initLineAuth(to.fullPath)
    if (auth.redirected) {
      return false // Halt navigation, redirecting to LINE Login
    }

    const { fetchUserData, registrationData } = useUserData()
    const { isRegistered } = useAuth()

    // 3. Pre-fetch user data to populate the profile and ticket QR code
    try {
      await fetchUserData()
      isRegistered.value = true

      // If registered and trying to go to /register, redirect to Home
      if (to.path === '/register') {
        return '/'
      }
    } catch (err) {
      // If the error is 404 (Not Registered), handle redirection
      if (err.status === 404) {
        isRegistered.value = false
        registrationData.value = null

        // If not registered and not on register or home page, redirect to Register
        if (to.path !== '/register' && to.path !== '/') {
          return '/register'
        }
      } else {
        throw err // Other API errors
      }
    }
  } catch (error) {
    console.error('LIFF Router Auth Guard Error:', error)
  }
})

export default router
