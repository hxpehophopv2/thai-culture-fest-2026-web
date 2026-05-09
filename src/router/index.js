import { createRouter, createWebHistory } from 'vue-router'
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

export default router
