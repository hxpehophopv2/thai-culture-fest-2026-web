<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLocale } from '@/composables/useLocale'

const emit = defineEmits(['login-success'])

const router = useRouter()
const { t } = useLocale()

// Fields
const fullname = ref('')
const zoneCodeArray = ref(Array(7).fill(''))
const inputRefs = ref([])
const showError = ref(false)

const isZoneCodeValid = computed(() => {
  return zoneCodeArray.value.every((char) => char !== '')
})

const handleInput = (event, index) => {
  let val = event.target.value
  val = val.slice(-1).toUpperCase()

  if (!/^[A-Z0-9]$/.test(val)) {
    zoneCodeArray.value[index] = ''
    event.target.value = ''
    return
  }

  zoneCodeArray.value[index] = val

  if (index < 6 && val) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handleKeydown = (event, index) => {
  if (event.key === 'Backspace') {
    if (!zoneCodeArray.value[index] && index > 0) {
      inputRefs.value[index - 1]?.focus()
    } else {
      zoneCodeArray.value[index] = ''
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < 6) {
    inputRefs.value[index + 1]?.focus()
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text')

  const cleanData = pastedData
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 7)

  for (let i = 0; i < cleanData.length; i++) {
    zoneCodeArray.value[i] = cleanData[i]
  }

  const nextIndex = Math.min(cleanData.length, 6)
  inputRefs.value[nextIndex]?.focus()
}

const handleLogin = () => {
  if (!fullname.value.trim() || !isZoneCodeValid.value) {
    showError.value = true
    return
  }

  showError.value = false

  const finalZoneCode = `${zoneCodeArray.value.slice(0, 3).join('')}-${zoneCodeArray.value.slice(3).join('')}`

  emit('login-success', {
    fullname: fullname.value.trim(),
    zoneCode: finalZoneCode,
  })
}

const goBack = () => {
  router.push('/')
}

const i18n = {
  title: { 'th-TH': 'ลงทะเบียนสตาฟ', 'en-US': 'Staff Registration' },
  fullnameLabel: { 'th-TH': 'ชื่อ-สกุล (ผู้เข้าใช้งาน)', 'en-US': 'Full Name' },
  fullnamePlc: { 'th-TH': 'เช่น สมชาย ใจดี', 'en-US': 'e.g. John Doe' },
  zoneCodeLabel: { 'th-TH': 'รหัส ZONE ที่ดูแล', 'en-US': 'Assigned Zone Code' },
  errorRequired: { 'th-TH': 'กรุณากรอกข้อมูลให้ครบถ้วน', 'en-US': 'This field is required' },
  loginBtn: { 'th-TH': 'เข้าสู่ระบบ / เริ่มสแกน', 'en-US': 'Login / Start Scanning' },
  backBtn: { 'th-TH': 'ย้อนกลับ', 'en-US': 'Back' },
}
</script>

<template>
  <section id="register-main">
    <main>
      <h4 style="margin-bottom: 1em">{{ t(i18n.title) }}</h4>
      <form @submit.prevent="handleLogin">
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

        <div class="field">
          <label>{{ t(i18n.zoneCodeLabel) }}</label>

          <div class="otp-container">
            <template v-for="(_, index) in 7" :key="index">
              <input
                type="text"
                maxlength="1"
                v-model="zoneCodeArray[index]"
                :ref="
                  (el) => {
                    if (el) inputRefs[index] = el
                  }
                "
                @input="handleInput($event, index)"
                @keydown="handleKeydown($event, index)"
                @paste="handlePaste"
                :class="['otp-input', { 'error-border': showError && !isZoneCodeValid }]"
              />
              <span v-if="index === 2" class="otp-separator">-</span>
            </template>
          </div>

          <small
            class="error-text"
            v-if="showError && !isZoneCodeValid"
            style="color: var(--clr-sem-err)"
          >
            {{ t(i18n.errorRequired) }}
          </small>
        </div>

        <div class="form-actions">
          <button type="submit" class="primary">
            {{ t(i18n.loginBtn) }}
          </button>

          <button type="button" class="secondary" @click="goBack">
            {{ t(i18n.backBtn) }}
          </button>
        </div>
      </form>
    </main>
  </section>
</template>

<style scoped>
.otp-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-s);
  width: 100%;
}

.otp-input {
  width: 100%;
  text-align: center !important;
  font-size: 1rem !important;
  font-weight: 400;
  text-transform: uppercase;
  padding: var(--sp-s) !important;
  border-radius: var(--sp-s);
  border: 1px solid var(--clr-200);
  background: var(--clr-100);
  outline: none;
  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.otp-input:focus {
  box-shadow: 0 0 0 1px var(--clr-pri-500) !important;
  border-color: var(--clr-pri-500);
}

.otp-separator {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--clr-500);
  flex-shrink: 0;
  margin: 0 -2px;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
  width: 100%;
  margin-top: var(--sp-m);
}

.form-actions button {
  width: 100%;
  padding: var(--sp-s) var(--sp-m);
  border-radius: var(--sp-s);
  font-weight: 600;
  cursor: pointer;
}

button.secondary {
  background: var(--clr-200, #e2e8f0);
  color: var(--clr-900, #0f172a);
  border: none;
  transition: background 0.2s;
}

button.secondary:hover {
  background: var(--clr-300, #cbd5e1);
}
</style>
