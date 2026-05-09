<script setup>
import { useLocale } from '@/composables/useLocale'
const { locale, toggleLocale } = useLocale()
</script>

<template>
  <nav>
    <button
      class="lang-toggle"
      @click="toggleLocale"
      :aria-label="`Switch to ${locale === 'th-TH' ? 'English' : 'ภาษาไทย'}`"
    >
      <span :class="{ active: locale === 'th-TH' }">TH</span>
      /
      <span :class="{ active: locale === 'en-US' }">EN</span>
    </button>
  </nav>
</template>

<style scoped>
@import url('@/assets/styles/langToggle.css');
</style>
