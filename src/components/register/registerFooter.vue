<script setup>
import { defineProps, defineEmits } from 'vue'

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
  <footer v-show="step === 1">
    <button class="secondary" @click="() => emit('goToHomeUnregistered')"><p>ย้อนกลับ</p></button>
    <button class="primary" @click="() => emit('goToStep2')"><p>ถัดไป</p></button>
  </footer>
  <footer v-show="step === 2">
    <button class="secondary" @click="() => emit('goToStep1')"><p>ย้อนกลับ</p></button>
    <button class="primary" @click="() => emit('goToStep3')"><p>ถัดไป</p></button>
  </footer>
  <footer v-show="step === 3">
    <button class="secondary" @click="() => emit('goToStep2')"><p>ย้อนกลับ</p></button>
    <button class="primary" @click="() => emit('registerIn')" :disabled="!consent">
      <p>ลงทะเบียน</p>
    </button>
  </footer>
</template>
