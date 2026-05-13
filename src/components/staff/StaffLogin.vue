<script setup>
import { ref } from 'vue'
import { useLocale } from '@/composables/useLocale'

const emit = defineEmits(['login-success'])

const { t } = useLocale()

// Fields
const fullname = ref('')
const zoneCode = ref('')
const showError = ref(false)

const handleLogin = () => {
  if (!fullname.value.trim() || !zoneCode.value.trim()) {
    showError.value = true
    return
  }

  showError.value = false
  emit('login-success', {
    fullname: fullname.value.trim(),
    zoneCode: zoneCode.value.trim(),
  })
}

const i18n = {
  title: { 'th-TH': 'ลงทะเบียนสตาฟ', 'en-US': 'Staff Registration' },
  fullnameLabel: { 'th-TH': 'ชื่อ-สกุล (ผู้เข้าใช้งาน)', 'en-US': 'Full Name' },
  fullnamePlc: { 'th-TH': 'เช่น สมชาย ใจดี', 'en-US': 'e.g. John Doe' },
  zoneCodeLabel: { 'th-TH': 'รหัส ZONE ที่ดูแล', 'en-US': 'Assigned Zone Code' },
  zoneCodePlc: { 'th-TH': 'เช่น A1, B2', 'en-US': 'e.g. A1, B2' },
  errorRequired: { 'th-TH': 'กรุณากรอกข้อมูลให้ครบถ้วน', 'en-US': 'This field is required' },
  loginBtn: { 'th-TH': 'เข้าสู่ระบบ / เริ่มสแกน', 'en-US': 'Login / Start Scanning' },
}
</script>

<template>
  <section id="register-main">
    <main>
      <h4 style="margin-bottom: 1em">{{ t(i18n.title) }}</h4>

      <form @submit.prevent="handleLogin">
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
          <small
            class="error-text"
            v-if="showError && !fullname.trim()"
            style="color: var(--clr-sem-err)"
          >
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
          <small
            class="error-text"
            v-if="showError && !zoneCode.trim()"
            style="color: var(--clr-sem-err)"
          >
            {{ t(i18n.errorRequired) }}
          </small>
        </div>

        <button type="submit" class="primary" style="width: 100%; margin-top: var(--sp-m)">
          {{ t(i18n.loginBtn) }}
        </button>
      </form>
    </main>
  </section>
</template>
