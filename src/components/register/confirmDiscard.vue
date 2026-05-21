<script setup>
import { defineEmits } from 'vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
const emit = defineEmits(['discard', 'stay'])
</script>

<template>
  <section id="confirm-discard" @click.self="() => emit('stay')">
    <div class="confirm-container">
      <h5>{{ t({ 'th-TH': 'ยืนยันการละทิ้งข้อมูล?', 'en-US': 'Confirm discard?' }) }}</h5>
      <div class="confirm-btn-container">
        <button class="discard" @click="() => emit('discard')">
          <p>{{ t({ 'th-TH': 'ละทิ้ง', 'en-US': 'Discard' }) }}</p>
        </button>
        <button class="secondary" style="color: var(--clr-900)" @click="() => emit('stay')">
          <p>{{ t({ 'th-TH': 'ไม่', 'en-US': 'No' }) }}</p>
        </button>
      </div>
    </div>
  </section>
</template>
