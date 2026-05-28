<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home, Ticket, UserRound } from '@lucide/vue'

import { useAuth } from '@/composables/useAuth'
import { useLocale } from '@/composables/useLocale'
import { useUserData } from '@/composables/useUserData'

const route = useRoute()
const router = useRouter()
const { isRegistered } = useAuth()
const { t } = useLocale()
const { registrationData } = useUserData()

const i18n = {
  navHome: { 'th-TH': 'หน้าหลัก', 'en-US': 'Home' },
  navReserve: { 'th-TH': 'จองกิจกรรม', 'en-US': 'Reserve' },
  navProfile: { 'th-TH': 'โปรไฟล์', 'en-US': 'My Profile' },
}

const navItems = [
  { id: 'home', path: '/', icon: Home, label: i18n.navHome },
  { id: 'reserve', path: '/activities', icon: Ticket, label: i18n.navReserve },
  { id: 'profile', path: '/profile', icon: UserRound, label: i18n.navProfile },
]

const activeIndex = computed(() => {
  const path = route.path
  if (path.startsWith('/activities')) return 1
  if (path.startsWith('/profile')) return 2
  return 0
})

const isHiddenRoute = computed(() => {
  return ['/staff-login', '/register'].includes(route.path) || !isRegistered.value
})

const hasSeenReserveAlert = ref(false)
onMounted(() => {
  hasSeenReserveAlert.value = localStorage.getItem('hasSeenReserveAlert') === 'true'
})

watch(
  activeIndex,
  (newVal) => {
    if (newVal === 1 && !hasSeenReserveAlert.value) {
      hasSeenReserveAlert.value = true
      localStorage.setItem('hasSeenReserveAlert', 'true')
    }
  },
  { immediate: true },
)

const showReserveAlert = computed(() => {
  if (!isRegistered.value) return false
  if (!registrationData.value) return false
  if (hasSeenReserveAlert.value) return false

  const bookings = registrationData.value.bookings || []
  return bookings.length === 0
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
        :class="{
          'is-active': activeIndex === index,
          'is-alert': item.id === 'reserve' && showReserveAlert,
        }"
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
          <span v-if="item.id === 'reserve' && showReserveAlert" class="alert-dot"></span>
        </span>
        <span class="label">{{ t(item.label) }}</span>
      </label>
    </div>
  </nav>
</template>

<style scoped>
@import url('@/assets/styles/globalNav.css');

/* ---------- ALERT ANIMATION (WIGGLE BOUNCE) ---------- */
.nav-item.is-alert .icon-wrapper {
  position: relative;
  animation: wiggle-bounce 2s infinite;
}

.alert-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  background-color: var(--clr-sem-err);
  border-radius: 50%;
  border: 2px solid white;
  z-index: 10;
}

@keyframes wiggle-bounce {
  0%,
  35%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  10% {
    transform: translateY(-2px) rotate(-20deg);
  }
  15% {
    transform: translateY(-2px) rotate(16deg);
  }
  20% {
    transform: translateY(-2px) rotate(-12deg);
  }
  25% {
    transform: translateY(-2px) rotate(8deg);
  }
  30% {
    transform: translateY(-2px) rotate(-4deg);
  }
}
</style>
