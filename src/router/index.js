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
      }, 0)
    })
  },
})

router.beforeEach(async (to) => {
  const DEV_MODE_BYPASS = false // เปลี่ยนเป็น false เมื่อต้องการเชื่อมต่อ LINE จริง

  if (DEV_MODE_BYPASS) {
    const { isRegistered } = useAuth()
    const { profileData, qrData, isUserDataLoaded } = useUserData()

    isRegistered.value = true
    isUserDataLoaded.value = true

    if (!profileData.value) {
      profileData.value = {
        displayName: 'Hope (Dev Bypass)',
        pictureUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      }
    }

    if (!qrData.value) {
      qrData.value = {
        dataUrl:
          'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
      }
    }

    window.liff = window.liff || {}
    if (typeof window.liff.isLoggedIn !== 'function') {
      window.liff.isLoggedIn = () => true
    }

    return true
  }

  // -----------------------------------------------------------------
  if (to.path === '/staff-login') {
    return
  }

  try {
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
