<script setup>
import { useLocale } from '@/composables/useLocale'

defineProps({
  currentTab: {
    type: String,
    required: true,
  },
})

defineEmits(['tab-change'])

const { t } = useLocale()

const i18n = {
  tabScanner: { 'th-TH': 'แสกน QR', 'en-US': 'QR Scanner' },
  tabDashboard: { 'th-TH': 'รายชื่อคนจอง', 'en-US': 'Registered List' },
}
</script>

<template>
  <div style="display: flex; gap: 8px;">
    <button
      :style="currentTab === 'scanner' ? 'font-weight: bold; background: #ddd;' : ''"
      @click="$emit('tab-change', 'scanner')"
    >
      {{ t(i18n.tabScanner) }}
    </button>
    <button
      :style="currentTab === 'dashboard' ? 'font-weight: bold; background: #ddd;' : ''"
      @click="$emit('tab-change', 'dashboard')"
    >
      {{ t(i18n.tabDashboard) }}
    </button>
  </div>
</template>
