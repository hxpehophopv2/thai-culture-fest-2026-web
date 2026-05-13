<script setup>
import { useLocale } from '@/composables/useLocale'

const { locale, toggleLocale } = useLocale()

const props = defineProps({
  theme: {
    type: String,
    default: 'dark',
  },
})
</script>

<template>
  <button
    class="lang-toggle"
    :class="`theme-${theme}`"
    @click="toggleLocale"
    :aria-label="`Switch to ${locale === 'th-TH' ? 'English' : 'ภาษาไทย'}`"
  >
    <span :class="{ active: locale === 'th-TH' }">TH</span>
    /
    <span :class="{ active: locale === 'en-US' }">EN</span>
  </button>
</template>

<style scoped>
@import url('@/assets/styles/langToggle.css');
</style>
