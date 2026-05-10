<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import RegisterHeader from '@/components/register/registerHeader.vue'
import RegisterMain from '@/components/register/registerMain.vue'
import RegisterFooter from '@/components/register/registerFooter.vue'
import ConfirmDiscard from '@/components/register/confirmDiscard.vue'
import ConfirmSubmit from '@/components/register/confirmSubmit.vue'
import {
  getActivities,
  getMyQr,
  getMyRegistration,
  submitRegistration,
} from '@/services/registrationService'
import { getLineProfile, initLineAuth } from '@/services/lineAuthService'

const router = useRouter()
const registerStep = ref(1)
const selectedType = ref('')
const step1Error = ref(false)
const step2Error = ref(false)
const showingConfirmDiscard = ref(false)
const showingConfirmSubmit = ref(false)
const pdpaConsent = ref(false)
const mediaConsent = ref(false)
const regisData = ref({})
const isSubmitting = ref(false)
const submitError = ref('')
const isBooting = ref(true)
const lineProfile = ref(null)
const activities = ref([])
const qr = ref(null)
const registeredParticipant = ref(null)

const isRegistered = computed(() => Boolean(registeredParticipant.value && qr.value))

const isStep2Valid = (data) => {
  const requiredKeys = [
    'title',
    'firstName',
    'lastName',
    'nickname',
    'dateOfBirth',
    'email',
    'phoneNumber',
    'nationality',
  ]
  return requiredKeys.every((key) => {
    const val = data[key]
    return val !== undefined && val !== null && String(val).trim() !== ''
  })
}

watch(
  regisData,
  (newData) => {
    if (step2Error.value && isStep2Valid(newData)) {
      step2Error.value = false
    }
  },
  { deep: true },
)

const showConfirmDiscard = () => {
  if (!selectedType.value) {
    goToHomeUnregistered()
  } else {
    showingConfirmDiscard.value = true
  }
}

const showConfirmSubmit = () => {
  showingConfirmSubmit.value = true
}

const goToHomeUnregistered = () => {
  router.push('/')
}

const getFallbackSessionIds = () => {
  const firstAvailableSession = activities.value
    .flatMap((activity) => activity.sessions || [])
    .find((session) => !session.isFull)

  return firstAvailableSession ? [firstAvailableSession.id] : []
}

const registerIn = async () => {
  isSubmitting.value = true
  submitError.value = ''

  try {
    const selectedSessionIds = getFallbackSessionIds()
    if (selectedSessionIds.length === 0) {
      throw new Error('ยังไม่มีรอบกิจกรรมที่เปิดให้ลงทะเบียน')
    }

    const payload = {
      nationality: regisData.value.nationality,
      title: regisData.value.title,
      firstName: regisData.value.firstName,
      lastName: regisData.value.lastName,
      nickname: regisData.value.nickname,
      dateOfBirth: regisData.value.dateOfBirth,
      email: regisData.value.email,
      phoneNumber: regisData.value.phoneNumber,
      participantType: selectedType.value,
      organization: regisData.value.organization ?? null,
      faculty: regisData.value.faculty ?? null,
      facultyOther: regisData.value.facultyOther ?? null,
      department: regisData.value.department ?? null,
      departmentOther: regisData.value.departmentOther ?? null,
      consent: pdpaConsent.value && mediaConsent.value,
      selectedSessionIds,
    }

    registeredParticipant.value = await submitRegistration(payload, selectedSessionIds)
    qr.value = await getMyQr()
    showingConfirmSubmit.value = false
  } catch (err) {
    submitError.value = err.message
    showingConfirmSubmit.value = false
  } finally {
    isSubmitting.value = false
  }
}

const bootstrap = async () => {
  isBooting.value = true
  submitError.value = ''

  try {
    const auth = await initLineAuth()
    if (auth.redirected) return

    lineProfile.value = getLineProfile()
    activities.value = await getActivities()

    try {
      registeredParticipant.value = await getMyRegistration()
      qr.value = await getMyQr()
    } catch (err) {
      if (err.status !== 404) throw err
    }
  } catch (err) {
    submitError.value = err.message
  } finally {
    isBooting.value = false
  }
}

const goToStep1 = () => {
  step1Error.value = false
  registerStep.value = 1
}

const goToStep2 = () => {
  if (!regisData.value.isStep1Valid) {
    step1Error.value = true
  } else {
    step1Error.value = false
    registerStep.value = 2
  }
}

const goToStep3 = () => {
  if (isStep2Valid(regisData.value) && regisData.value.isFormatValid) {
    step2Error.value = false
    registerStep.value = 3
  } else {
    step2Error.value = true
  }
}

onMounted(bootstrap)
</script>

<template>
  <section v-if="isBooting" class="line-state">
    <p>Connecting LINE...</p>
  </section>

  <section v-else-if="isRegistered" class="registered-qr">
    <h2>Registration Complete</h2>
    <p>{{ lineProfile?.displayName }}</p>
    <img :src="qr.dataUrl" alt="Registration QR code" />
    <code>{{ qr.qrData }}</code>
  </section>

  <section v-else>
    <registerHeader :step="registerStep" />
    <registerMain
      :step="registerStep"
      :step1Error="step1Error"
      :step2Error="step2Error"
      v-model:selectedType="selectedType"
      v-model:step1Error="step1Error"
      v-model:pdpaConsent="pdpaConsent"
      v-model:mediaConsent="mediaConsent"
      v-model:regisData="regisData"
    />
    <registerFooter
      :step="registerStep"
      :consent="pdpaConsent && mediaConsent"
      @goToHomeUnregistered="showConfirmDiscard"
      @goToStep1="goToStep1"
      @goToStep2="goToStep2"
      @goToStep3="goToStep3"
      @registerIn="showConfirmSubmit"
    />

    <p v-if="submitError" style="color: var(--clr-sem-err)">{{ submitError }}</p>
  </section>

  <Transition name="fade">
    <div class="" v-show="showingConfirmDiscard">
      <ConfirmDiscard
        :selectedType="selectedType"
        @discard="goToHomeUnregistered"
        @stay="showingConfirmDiscard = false"
      />
    </div>
  </Transition>

  <Transition name="fade-confirm">
    <div class="" v-show="showingConfirmSubmit">
      <ConfirmSubmit
        :selectedType="selectedType"
        :isSubmitting="isSubmitting"
        @submit="registerIn"
        @stay="showingConfirmSubmit = false"
      />
    </div>
  </Transition>
</template>

<style scoped>
.line-state,
.registered-qr {
  display: grid;
  gap: 1rem;
  place-items: center;
  padding: 2rem 1rem;
  text-align: center;
}

.registered-qr img {
  width: min(320px, 100%);
  border-radius: 1rem;
}

.registered-qr code {
  max-width: min(520px, 100%);
  overflow-wrap: anywhere;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-active :deep(.confirm-container) {
  animation: bounce-shake 0.2s ease-out;
}
.fade-leave-active :deep(.confirm-container) {
  transition: transform 0.2s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-from :deep(.confirm-container),
.fade-leave-to :deep(.confirm-container) {
  transform: scale(0.9);
}

.fade-confirm-enter-active,
.fade-confirm-leave-active {
  transition: opacity 0.2s ease;
}
.fade-confirm-enter-active :deep(.confirm-container),
.fade-confirm-leave-active :deep(.confirm-container) {
  transition: transform 0.2s ease-in;
}

.fade-confirm-enter-from,
.fade-confirm-leave-to {
  opacity: 0;
}
.fade-confirm-enter-from :deep(.confirm-container) {
  transform: scale(0.95);
}
.fade-confirm-leave-to :deep(.confirm-container) {
  transform: scale(0.9);
}

@keyframes bounce-shake {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  50% {
    transform: scale(1.05) rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}
</style>
