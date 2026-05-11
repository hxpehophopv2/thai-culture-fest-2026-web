<script setup>
import { defineProps, defineEmits, ref, watch, computed } from 'vue'
import { useLocale } from '@/composables/useLocale'

const props = defineProps({
  showError: Boolean,
  staffData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:staffData', 'update:showError'])

const { t } = useLocale()

// Fields
const fullname = ref(props.staffData.fullname || '')
const zoneCode = ref(props.staffData.zoneCode || '')

// ตรวจสอบความถูกต้องของข้อมูล
const isValid = computed(() => {
  return fullname.value.trim() !== '' && zoneCode.value.trim() !== ''
})

// อัปเดตข้อมูลกลับไป Parent
watch(
  [fullname, zoneCode],
  () => {
    emit('update:staffData', {
      fullname: fullname.value.trim(),
      zoneCode: zoneCode.value.trim(),
      isValid: isValid.value,
    })

    // เคลียร์ error state ถ้ากรอกครบแล้ว
    if (props.showError && isValid.value) {
      emit('update:showError', false)
    }
  },
  { immediate: true },
)

const i18n = {
  title: {
    'th-TH': 'ลงทะเบียนสตาฟ',
    'en-US': 'Staff Registration',
  },
  fullnameLabel: {
    'th-TH': 'ชื่อ-สกุล (ผู้เข้าใช้งาน)',
    'en-US': 'Full Name',
  },
  fullnamePlc: {
    'th-TH': 'เช่น สมชาย ใจดี',
    'en-US': 'e.g. John Doe',
  },
  zoneCodeLabel: {
    'th-TH': 'รหัส ZONE ที่ดูแล',
    'en-US': 'Assigned Zone Code',
  },
  zoneCodePlc: {
    'th-TH': 'เช่น A1, B2',
    'en-US': 'e.g. A1, B2',
  },
  errorRequired: {
    'th-TH': 'กรุณากรอกข้อมูลให้ครบถ้วน',
    'en-US': 'This field is required',
  },
}
</script>

<template>
  <section id="register-main">
    <main>
      <h6>{{ t(i18n.title) }}</h6>

      <form @submit.prevent>
        <!-- Fullname Field -->
        <div class="field">
          <label for="staff-fullname">{{ t(i18n.fullnameLabel) }}</label>
          <input
            id="staff-fullname"
            v-model="fullname"
            type="text"
            :placeholder="t(i18n.fullnamePlc)"
            :class="{ 'error-border': showError && !fullname.trim() }"
          />
          <small class="error-text" v-if="showError && !fullname.trim()">
            {{ t(i18n.errorRequired) }}
          </small>
        </div>

        <!-- Zone Code Field -->
        <div class="field">
          <label for="staff-zone">{{ t(i18n.zoneCodeLabel) }}</label>
          <input
            id="staff-zone"
            v-model="zoneCode"
            type="text"
            :placeholder="t(i18n.zoneCodePlc)"
            :class="{ 'error-border': showError && !zoneCode.trim() }"
          />
          <small class="error-text" v-if="showError && !zoneCode.trim()">
            {{ t(i18n.errorRequired) }}
          </small>
        </div>
      </form>
    </main>
  </section>
</template>
