<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScanLine, ClipboardList } from '@lucide/vue'
import { useLocale } from '@/composables/useLocale'

const props = defineProps({
  currentTab: {
    type: String,
    required: true,
    validator: (v) => ['scanner', 'dashboard'].includes(v),
  },
})

const emit = defineEmits({
  'tab-change': (tab) => typeof tab === 'string',
})

const { t } = useLocale()

const i18n = {
  tabScanner: { 'th-TH': 'สแกน', 'en-US': 'Scanner' },
  tabDashboard: { 'th-TH': 'รายชื่อ', 'en-US': 'List' },
}

const navItems = [
  { id: 'scanner', icon: ScanLine, label: i18n.tabScanner },
  { id: 'dashboard', icon: ClipboardList, label: i18n.tabDashboard },
]

const activeIndex = computed(() => (props.currentTab === 'dashboard' ? 1 : 0))

const navRef = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.staff-nav-container', {
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.5)',
    })
  }, navRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <nav class="staff-nav" :style="{ '--active-idx': activeIndex }" ref="navRef">
    <div class="staff-nav-container">
      <div class="staff-nav-indicator"></div>

      <label
        v-for="(item, index) in navItems"
        :key="item.id"
        class="staff-nav-item"
        :class="{ 'is-active': activeIndex === index }"
      >
        <input
          type="radio"
          name="staff_nav"
          :value="item.id"
          :checked="activeIndex === index"
          @change="emit('tab-change', item.id)"
        />
        <span class="staff-nav-icon">
          <component :is="item.icon" :size="22" stroke-width="2.5" />
        </span>
        <span class="staff-nav-label">{{ t(item.label) }}</span>
      </label>
    </div>
  </nav>
</template>

<style scoped>
.staff-nav {
  position: fixed;
  width: calc(100% - 2 * var(--sp-l));
  max-width: 420px;
  bottom: var(--sp-l);
  left: 50%;
  transform: translateX(-50%);
  z-index: 99990;
  padding: 0;
}

.staff-nav-container {
  width: 100%;
  display: flex;
  position: relative;
  background: rgba(26, 80, 133, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  padding: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

.staff-nav-indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  width: calc((100% - 12px) / 2);
  background: white;
  border-radius: 100px;
  z-index: 0;
  transform: translateX(calc(100% * var(--active-idx)));
  transition: transform 0.3s cubic-bezier(0.34, 1.25, 0.14, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.staff-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 8px 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.staff-nav-item input[type='radio'] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.staff-nav-item.is-active {
  color: var(--clr-pri-500, #1a4f85);
}

.staff-nav-icon {
  transition: transform 0.3s cubic-bezier(0.1, 1.56, 0.64, 1);
}

.staff-nav-item.is-active .staff-nav-icon {
  transform: scale(1.1);
}

.staff-nav-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2px;
}
</style>
