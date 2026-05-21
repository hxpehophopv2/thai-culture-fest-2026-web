<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Ticket, UserRound } from '@lucide/vue'

import { useAuth } from '@/composables/useAuth'
import { useLocale } from '@/composables/useLocale'

const route = useRoute()
const router = useRouter()
const { isRegistered } = useAuth()
const { t } = useLocale()

const i18n = {
  navHome: { 'th-TH': 'หน้าหลัก', 'en-US': 'Home' },
  navReserve: { 'th-TH': 'จองกิจกรรม', 'en-US': 'Reserve' },
  navProfile: { 'th-TH': 'โปรไฟล์', 'en-US': 'My Profile' },
}

// Nav items configuration
const navItems = [
  { id: 'home', path: '/', icon: Home, label: i18n.navHome },
  { id: 'reserve', path: '/activities', icon: Ticket, label: i18n.navReserve },
  { id: 'profile', path: '/profile', icon: UserRound, label: i18n.navProfile },
]

// Determine active index based on current route path
const activeIndex = computed(() => {
  const path = route.path
  if (path.startsWith('/activities')) return 1
  if (path.startsWith('/profile')) return 2
  return 0 // Fallback to Home
})

// Hide navigation on staff page, registration form, or if user is not registered yet
const isHiddenRoute = computed(() => {
  return ['/staff-login', '/register'].includes(route.path) || !isRegistered.value
})

const navigate = (path) => {
  router.push(path)
}
</script>

<template>
  <nav v-if="!isHiddenRoute" class="global-nav" :style="{ '--active-idx': activeIndex }">
    <div class="nav-container">
      <div class="nav-indicator"></div>

      <label
        v-for="(item, index) in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ 'is-active': activeIndex === index }"
      >
        <input
          type="radio"
          name="global_nav"
          :value="item.id"
          :checked="activeIndex === index"
          @change="navigate(item.path)"
        />
        <span class="icon-wrapper">
          <component :is="item.icon" :size="24" stroke-width="2.5" />
        </span>
        <span class="label">{{ t(item.label) }}</span>
      </label>
    </div>
  </nav>
</template>

<style scoped>
@import url('@/assets/styles/globalNav.css');
</style>
