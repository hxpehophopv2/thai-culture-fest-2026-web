<script setup>
import { defineProps } from 'vue'
import { useLocale } from '@/composables/useLocale'

defineProps({ step: Number })

const { t } = useLocale()
const i18n = {
  header: { 'th-TH': 'ลงทะเบียน', 'en-US': 'Register' },
}
</script>

<template>
  <header>
    <h4>{{ t(i18n.header) }}</h4>
    <div class="stepper">
      <!-- วงกลมที่ 1 -->
      <div class="node" :class="{ active: step >= 1 }"></div>

      <!-- เส้นเชื่อมที่ 1 -->
      <div class="line" :class="{ active: step >= 2 }"></div>

      <!-- วงกลมที่ 2 -->
      <div class="node" :class="{ active: step >= 2 }"></div>

      <!-- เส้นเชื่อมที่ 2 -->
      <div class="line" :class="{ active: step >= 3 }"></div>

      <!-- วงกลมที่ 3 -->
      <div class="node" :class="{ active: step >= 3 }"></div>
    </div>
  </header>
</template>
