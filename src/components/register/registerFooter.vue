<script setup>
import { defineProps, defineEmits } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
defineProps({ step: Number, consent: Boolean })
const emit = defineEmits([
  'goToStep1',
  'goToStep2',
  'goToStep3',
  'goToHomeUnregistered',
  'registerIn',
])
</script>

<template>
  <section id="register-footer">
    <footer v-show="step === 1">
      <button class="secondary" @click="() => emit('goToHomeUnregistered')">
        <p>{{ t({ 'th-TH': 'ย้อนกลับ', 'en-US': 'Back' }) }}</p>
      </button>
      <button class="primary" @click="() => emit('goToStep2')">
        <p>{{ t({ 'th-TH': 'ถัดไป', 'en-US': 'Next' }) }}</p>
      </button>
    </footer>
    <footer v-show="step === 2">
      <button class="secondary" @click="() => emit('goToStep1')">
        <p>{{ t({ 'th-TH': 'ย้อนกลับ', 'en-US': 'Back' }) }}</p>
      </button>
      <button class="primary" @click="() => emit('goToStep3')">
        <p>{{ t({ 'th-TH': 'ถัดไป', 'en-US': 'Next' }) }}</p>
      </button>
    </footer>
    <footer v-show="step === 3">
      <button class="secondary" @click="() => emit('goToStep2')">
        <p>{{ t({ 'th-TH': 'ย้อนกลับ', 'en-US': 'Back' }) }}</p>
      </button>
      <button class="primary" @click="() => emit('registerIn')" :disabled="!consent">
        <p>{{ t({ 'th-TH': 'ลงทะเบียน', 'en-US': 'Register' }) }}</p>
      </button>
    </footer>
  </section>
</template>
