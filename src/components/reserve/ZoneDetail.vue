<script setup>
import { computed, ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { zones } from '@/data/zonesData.js'
import { useLocale } from '@/composables/useLocale'
import { updateMyRegistration } from '@/services/registrationService'
import { useUserData } from '@/composables/useUserData'
import { X, CircleAlert } from '@lucide/vue'

import LangToggle from '../LangToggle.vue'
import LabZoneContent from '@/components/reserve/LabZone.vue'
import StageZoneContent from '@/components/reserve/StageZone.vue'
import PlayZoneContent from '@/components/reserve/PlayZone.vue'

const route = useRoute()
const router = useRouter()
const { t, locale } = useLocale()

// --- i18n Dictionary ---
const i18n = {
  back: { 'th-TH': 'ย้อนกลับ', 'en-US': 'Back' },
  loadingStatus: {
    'th-TH': 'กำลังโหลดข้อมูลสิทธิ์การจอง...',
    'en-US': 'Checking registration status...',
  },
  editBooking: { 'th-TH': 'แก้ไขการจอง - ', 'en-US': 'Edit Booking - ' },
  reserveSeat: { 'th-TH': 'จองที่นั่ง - ', 'en-US': 'Reserve - ' },
  selectTimeSlot: {
    'th-TH': 'เลือกรอบเวลาที่ต้องการจอง:',
    'en-US': 'Select your preferred time slot:',
  },
  booked: { 'th-TH': 'จองแล้ว', 'en-US': 'Booked' },
  full: { 'th-TH': 'เต็มแล้ว', 'en-US': 'Full' },
  rule1: {
    'th-TH': '* ระบบจะไม่อนุญาตให้จองในเวลาที่ซ้อนทับกับกิจกรรมอื่น',
    'en-US': '* Booking overlapping time slots is not allowed.',
  },
  rule2: {
    'th-TH': '* สามารถเปลี่ยนแปลงหรือยกเลิกรอบได้ล่วงหน้า 1 วันก่อนวันงาน',
    'en-US': '* Changes or cancellations can be made up to 1 day before the event.',
  },
  rule3: {
    'th-TH': '* สามารถแก้ไขได้โดยการเลือกเวลาที่ต้องการจองและกดยืนยันอีกครั้ง',
    'en-US': '* To change your booking, select a new time slot and confirm.',
  },
  cancelBooking: { 'th-TH': 'ยกเลิกการจอง', 'en-US': 'Cancel Booking' },
  cancel: { 'th-TH': 'ยกเลิก', 'en-US': 'Cancel' },
  confirmBooking: { 'th-TH': 'ยืนยันการจอง', 'en-US': 'Confirm Booking' },

  // Auth Modal
  notRegisteredTitle: { 'th-TH': 'ยังไม่ได้ลงทะเบียนเข้าร่วมงาน', 'en-US': 'Not Registered Yet' },
  notRegisteredDesc: {
    'th-TH': 'ขออภัย คุณต้องลงทะเบียนเข้าร่วมงานก่อนจึงจะสามารถจองรอบเวลาในกิจกรรมต่าง ๆ',
    'en-US': 'Sorry, you must register for the event before booking activity slots.',
  },
  registerNowBtn: { 'th-TH': 'ลงทะเบียนตอนนี้', 'en-US': 'Register Now' },

  // Toasts
  reserveSuccess: { 'th-TH': 'ยืนยันการจองสำเร็จ', 'en-US': 'Reservation successful' },
  cancelSuccess: { 'th-TH': 'ยกเลิกการจองสำเร็จ', 'en-US': 'Reservation cancelled' },
  cancelFail: { 'th-TH': 'ยกเลิกไม่สำเร็จ', 'en-US': 'Cancellation failed' },
  timeSlotLbl: { 'th-TH': 'รอบเวลา', 'en-US': 'Time slot' },

  // Errors
  errFullTitle: { 'th-TH': 'รอบกิจกรรมเต็ม', 'en-US': 'Session Full' },
  errFullMsg: {
    'th-TH': 'รอบนี้เต็มแล้ว กรุณาเลือกรอบอื่น',
    'en-US': 'This session is full. Please choose another.',
  },
  errOverlapTitle: { 'th-TH': 'เวลาชนกัน', 'en-US': 'Time Conflict' },
  errOverlapMsg: {
    'th-TH': 'เวลาซ้อนกับกิจกรรมอื่นที่จองไว้ กรุณาเลือกรอบอื่น',
    'en-US': 'Time conflict with another booking. Please choose another.',
  },
  errDupTitle: { 'th-TH': 'ไม่สามารถจองซ้ำได้', 'en-US': 'Duplicate Booking' },
  errDupMsg: {
    'th-TH': 'คุณได้ทำการจองกิจกรรมนี้ไปแล้ว (จองได้สูงสุด 1 รอบต่อกิจกรรม)',
    'en-US': 'You have already booked this activity (Max 1 session per activity).',
  },
  errRegTitle: { 'th-TH': 'ลงทะเบียนซ้ำ', 'en-US': 'Already Registered' },
  errRegMsg: {
    'th-TH': 'คุณได้ลงทะเบียนไปแล้ว กรุณาใช้ฟังก์ชันแก้ไขแทน',
    'en-US': 'You are already registered. Please use the edit function instead.',
  },
  errNotFoundTitle: { 'th-TH': 'ไม่พบข้อมูล', 'en-US': 'Not Found' },
  errNotFoundMsg: {
    'th-TH': 'ไม่พบข้อมูลรอบกิจกรรม กรุณาลองใหม่',
    'en-US': 'Session data not found. Please try again.',
  },
  errInvalidTitle: { 'th-TH': 'ข้อมูลไม่ถูกต้อง', 'en-US': 'Invalid Data' },
  errInvalidMsg: {
    'th-TH': 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง',
    'en-US': 'Invalid data. Please check and try again.',
  },
  errConnTitle: { 'th-TH': 'เชื่อมต่อไม่ได้', 'en-US': 'Connection Failed' },
  errConnMsg: {
    'th-TH': 'ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่',
    'en-US': 'Connection failed. Please check your internet connection and try again.',
  },
  errGenTitle: { 'th-TH': 'เกิดข้อผิดพลาด', 'en-US': 'Error Occurred' },
  errGenMsg: {
    'th-TH': 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    'en-US': 'An error occurred. Please try again.',
  },
}

const zone = computed(() => zones.find((z) => z.id === route.params.id))
const showModal = ref(false)
const showAuthModal = ref(false)
const isLoadingData = ref(true)
const isUserRegistered = ref(false)
const selectedActivity = ref('')
const selectedSlot = ref(null)
const isSubmitting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success' | 'error' | 'warn'
let toastTimeout = null

const triggerToast = (msg, type = 'success') => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  toastTimeout = setTimeout(
    () => {
      showToast.value = false
    },
    type === 'error' ? 5000 : 4000,
  )
}

// Watch modal state to toggle scrolling and global navigation bar visibility
watch([showModal, showAuthModal], ([modalOpen, authOpen]) => {
  if (modalOpen || authOpen) {
    document.body.classList.add('modal-open')
  } else {
    document.body.classList.remove('modal-open')
  }
})

onUnmounted(() => {
  if (toastTimeout) clearTimeout(toastTimeout)
  document.body.classList.remove('modal-open')
})

const contentMap = {
  lab: LabZoneContent,
  stage: StageZoneContent,
  play: PlayZoneContent,
}

const { registrationData, activitiesData, isUserDataLoaded, fetchUserData } = useUserData()

const activities = computed({
  get: () => activitiesData.value || [],
  set: (val) => {
    activitiesData.value = val
  },
})
const myRegistration = computed({
  get: () => registrationData.value,
  set: (val) => {
    registrationData.value = val
  },
})

const mapKeyToOrder = {
  LAB1: 1,
  LAB2: 2,
  LAB3: 3,
  LAB4: 4,
  LAB5: 5,
  STG: 6,
}

// ดึงชื่อกิจกรรมตามภาษาปัจจุบัน หากไม่มีให้ Fallback กลับไปใช้ค่าเริ่มต้นแบบสองภาษา
const activityNames = computed(() => {
  const names = {}
  for (const [key, order] of Object.entries(mapKeyToOrder)) {
    const act = activities.value.find((a) => a.sortOrder === order)
    if (act) {
      names[key] = locale.value === 'th-TH' ? act.nameTh : act.nameEn || act.nameTh
    }
  }

  if (Object.keys(names).length > 0) return names

  return {
    LAB1: t({ 'th-TH': 'กิจกรรมเวิร์กช็อปร้อยพวงมาลัยไทย', 'en-US': 'Hand Garland Workshop' }),
    LAB2: t({ 'th-TH': 'กิจกรรมเวิร์กช็อปพวงมโหตร', 'en-US': 'Phuang Mahot Workshop' }),
    LAB3: t({
      'th-TH': 'กิจกรรมเวิร์กช็อปพัดสานไม้ไผ่ไทย',
      'en-US': 'Thai Bamboo Hand Fans Workshop',
    }),
    LAB4: t({
      'th-TH': 'กิจกรรมเวิร์กช็อปประดิษฐ์เครื่องประดับนาฏศิลป์ไทย',
      'en-US': 'Thai Dance Ornament Crafting Workshop',
    }),
    LAB5: t({
      'th-TH': 'กิจกรรมการเขียนสี - เขียนหน้าหัวโขน',
      'en-US': 'Khon Mask Painting Workshop',
    }),
    STG: t({
      'th-TH': 'กิจกรรมเสวนาและการแสดง (STAGE ZONE)',
      'en-US': 'ROOTED Talks & Performance (STAGE ZONE)',
    }),
  }
})

const formatTime = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleTimeString(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  })
}

const availableSlots = computed(() => {
  if (!selectedActivity.value || !activities.value.length) return []
  const order = mapKeyToOrder[selectedActivity.value]
  const act = activities.value.find((a) => a.sortOrder === order)
  if (!act) return []

  const myBookedSessionIds = (myRegistration.value?.bookings || []).map((b) => b.session.id)

  return act.sessions.map((s) => {
    const isBookedByMe = myBookedSessionIds.includes(s.id)
    const suffix = locale.value === 'th-TH' ? ' น.' : ''

    return {
      id: s.id,
      time: `${formatTime(s.startTime)} - ${formatTime(s.endTime)}${suffix}`,
      capacity: s.capacity,
      booked: s.bookedCount,
      isBooked: isBookedByMe,
      isFull: s.capacity - s.bookedCount <= 0 && !isBookedByMe,
    }
  })
})

const openReserve = (activityKey) => {
  if (isLoadingData.value) {
    return
  }
  if (!isUserRegistered.value) {
    showAuthModal.value = true
    return
  }
  selectedActivity.value = activityKey || ''

  // Set selectedSlot to null so no slot is pre-selected as active, preventing weird overlapping selections
  selectedSlot.value = null

  showModal.value = true
}

const confirmReservation = async () => {
  if (!selectedSlot.value) return

  isSubmitting.value = true
  try {
    const currentBookings = myRegistration.value?.bookings || []
    const currentSessionIds = currentBookings.map((b) => b.session.id)

    if (currentSessionIds.includes(selectedSlot.value.id)) {
      showModal.value = false
      return
    }

    const order = mapKeyToOrder[selectedActivity.value]
    const targetActivity = activities.value.find((a) => a.sortOrder === order)

    if (!targetActivity) {
      throw new Error(t(i18n.errNotFoundMsg))
    }

    const filteredSessionIds = currentBookings
      .filter((b) => b.session.activity.id !== targetActivity.id)
      .map((b) => b.session.id)

    const newSessionIds = [...filteredSessionIds, selectedSlot.value.id]
    await updateMyRegistration({ selectedSessionIds: newSessionIds })
    triggerToast(
      `${t(i18n.reserveSuccess)}:\n${activityNames.value[selectedActivity.value]}\n${t(i18n.timeSlotLbl)}: ${selectedSlot.value.time}`,
    )
    showModal.value = false

    await fetchUserData(true)
  } catch (err) {
    const rawMsg = err.message || ''
    const errorCode = err.payload?.error?.code || ''

    let titleKey = i18n.errGenTitle
    let msgKey = i18n.errGenMsg
    let type = 'warn'

    if (errorCode === 'SESSION_FULL' || rawMsg.includes('เต็ม') || rawMsg.includes('full')) {
      titleKey = i18n.errFullTitle
      msgKey = i18n.errFullMsg
    } else if (
      errorCode === 'TIME_OVERLAP' ||
      rawMsg.includes('ทับซ้อน') ||
      rawMsg.includes('ซ้อนทับ') ||
      rawMsg.includes('conflict')
    ) {
      titleKey = i18n.errOverlapTitle
      msgKey = i18n.errOverlapMsg
    } else if (
      errorCode === 'DUPLICATE_ACTIVITY' ||
      rawMsg.includes('DUPLICATE') ||
      rawMsg.includes('more than once')
    ) {
      titleKey = i18n.errDupTitle
      msgKey = i18n.errDupMsg
    } else if (errorCode === 'ALREADY_REGISTERED' || rawMsg.includes('ALREADY_REGISTERED')) {
      titleKey = i18n.errRegTitle
      msgKey = i18n.errRegMsg
    } else if (
      errorCode === 'NOT_FOUND' ||
      rawMsg.includes('ไม่พบ') ||
      rawMsg.includes('NOT_FOUND')
    ) {
      titleKey = i18n.errNotFoundTitle
      msgKey = i18n.errNotFoundMsg
    } else if (errorCode === 'VALIDATION_ERROR' || err.status === 400) {
      titleKey = i18n.errInvalidTitle
      msgKey = i18n.errInvalidMsg
    } else if (
      rawMsg.includes('Failed to fetch') ||
      rawMsg.includes('NetworkError') ||
      rawMsg.includes('ติดต่อ')
    ) {
      titleKey = i18n.errConnTitle
      msgKey = i18n.errConnMsg
      type = 'error'
    } else {
      type = 'error'
    }
    triggerToast(`${t(titleKey)}\n${t(msgKey)}`, type)
  } finally {
    isSubmitting.value = false
  }
}

const hasBookingForSelectedActivity = computed(() => {
  if (!selectedActivity.value || !myRegistration.value?.bookings) return false
  const order = mapKeyToOrder[selectedActivity.value]
  return myRegistration.value.bookings.some((b) => b.session.activity.sortOrder === order)
})

const cancelReservation = async () => {
  isSubmitting.value = true
  try {
    const currentBookings = myRegistration.value?.bookings || []
    const order = mapKeyToOrder[selectedActivity.value]
    const targetActivity = activities.value.find((a) => a.sortOrder === order)

    if (!targetActivity) {
      throw new Error(t(i18n.errNotFoundMsg))
    }

    const newSessionIds = currentBookings
      .filter((b) => b.session.activity.id !== targetActivity.id)
      .map((b) => b.session.id)

    await updateMyRegistration({ selectedSessionIds: newSessionIds })

    triggerToast(
      `${t(i18n.cancelSuccess)}:\n${activityNames.value[selectedActivity.value]}`,
      'success',
    )
    showModal.value = false

    await fetchUserData(true)
  } catch (err) {
    console.error('Failed to cancel reservation', err)
    triggerToast(`${t(i18n.cancelFail)}:\n${err.message || t(i18n.errGenMsg)}`, 'error')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  isLoadingData.value = !isUserDataLoaded.value

  try {
    await fetchUserData()
    isUserRegistered.value = !!registrationData.value
  } catch (err) {
    console.error('Failed to load user data', err)
    isUserRegistered.value = false
  } finally {
    isLoadingData.value = false
  }

  if (route.query.modal === 'true') {
    const activityKey = route.query.activity || (route.params.id === 'stage' ? 'STG' : '')
    router.replace({ params: route.params })
    setTimeout(() => {
      openReserve(activityKey)
    }, 350)
  }
})

const goBack = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="zone-detail-wrapper">
    <nav class="hero-nav">
      <LangToggle theme="light" />
    </nav>

    <main v-if="zone" id="zone-detail">
      <button class="back-btn" @click="goBack">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        {{ t(i18n.back) }}
      </button>

      <img :src="zone.image" alt="" class="detail-img" />
      <div class="detail-content">
        <h3>{{ t(zone.title) }}</h3>

        <div v-if="isLoadingData" class="loading-activities">
          <p>{{ t(i18n.loadingStatus) }}</p>
        </div>
        <component
          v-else-if="contentMap[zone.id]"
          :is="contentMap[zone.id]"
          @open-reserve="openReserve"
        />
        <p v-else>{{ t(zone.description) }}</p>
      </div>
    </main>

    <Transition name="fade">
      <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h5>
              {{
                hasBookingForSelectedActivity
                  ? t(i18n.editBooking) + (selectedActivity ? activityNames[selectedActivity] : '')
                  : selectedActivity
                    ? activityNames[selectedActivity]
                    : t(i18n.reserveSeat) + (zone ? t(zone.title) : '')
              }}
            </h5>
            <button class="close-btn" @click="showModal = false">✕</button>
          </div>

          <div class="modal-body">
            <p class="instruction">{{ t(i18n.selectTimeSlot) }}</p>

            <div class="slot-grid">
              <button
                v-for="slot in availableSlots"
                :key="slot.id"
                class="slot-btn"
                :class="{ selected: selectedSlot?.id === slot.id }"
                :disabled="slot.isFull || slot.isBooked"
                @click="selectedSlot = slot"
              >
                <span class="time">{{ slot.time }}</span>
                <span
                  v-if="slot.isBooked"
                  class="capacity"
                  style="color: var(--clr-pri-500); font-weight: bold"
                >
                  {{ t(i18n.booked) }}
                </span>
                <span v-else class="capacity" :class="{ full: slot.isFull }">
                  {{
                    slot.capacity - slot.booked > 0
                      ? locale === 'th-TH'
                        ? `เหลือ ${slot.capacity - slot.booked} ที่นั่ง`
                        : `${slot.capacity - slot.booked} seats left`
                      : t(i18n.full)
                  }}
                </span>
              </button>
            </div>

            <ul class="booking-rules">
              <li>{{ t(i18n.rule1) }}</li>
              <li>{{ t(i18n.rule2) }}</li>
              <li>{{ t(i18n.rule3) }}</li>
            </ul>
          </div>

          <div class="modal-actions">
            <button
              v-if="hasBookingForSelectedActivity"
              class="danger"
              style="margin-right: auto"
              :disabled="isSubmitting"
              @click="cancelReservation"
            >
              {{ t(i18n.cancelBooking) }}
            </button>
            <button class="secondary" @click="showModal = false">{{ t(i18n.cancel) }}</button>
            <button class="primary" :disabled="!selectedSlot" @click="confirmReservation">
              {{ t(i18n.confirmBooking) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showAuthModal" class="modal-backdrop" @click.self="showAuthModal = false">
        <div class="modal-box">
          <button class="close-btn" @click="showAuthModal = false"><X /></button>
          <div class="modal-text">
            <div class="modal-header">
              <div class="alert-icon">
                <CircleAlert :size="128" :strokeWidth="4" absoluteStrokeWidth />
              </div>
              <h5 class="error-title">{{ t(i18n.notRegisteredTitle) }}</h5>
            </div>

            <div class="modal-body">
              <p style="color: var(--clr-600, #475569); line-height: 1.5; text-align: center">
                {{ t(i18n.notRegisteredDesc) }}
              </p>
            </div>
          </div>

          <div class="modal-actions">
            <button class="primary register-btn" @click="router.push('/register')">
              {{ t(i18n.registerNowBtn) }}
            </button>
            <button class="secondary" @click="showAuthModal = false">{{ t(i18n.cancel) }}</button>
          </div>
        </div>
      </div>
    </Transition>

    <Teleport to="body">
      <Transition name="toast-fade">
        <div v-if="showToast" class="custom-toast" :class="toastType" @click="showToast = false">
          <div class="toast-content">
            <div class="toast-icon">
              <span v-if="toastType === 'success'">✅</span>
              <span v-else-if="toastType === 'warn'">⚠️</span>
              <span v-else>❌</span>
            </div>
            <div class="toast-text">
              <p v-for="(line, idx) in toastMessage.split('\n')" :key="idx">{{ line }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.zone-detail-wrapper {
  padding: 6rem var(--sp-l) var(--sp-3xl);
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
}

#zone-detail {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--sp-m);
  padding: var(--sp-m);
  color: white;
  -webkit-box-shadow: 0 8px 16px 0 rgba(24, 42, 125, 0.2);
  box-shadow: 0 8px 16px 0 rgba(24, 42, 125, 0.2);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.detail-img {
  width: 100%;
  border-radius: var(--sp-s);
  margin-bottom: var(--sp-m);
}
.detail-content {
  padding: 0 var(--sp-s);
}
.detail-content h3 {
  margin-bottom: var(--sp-s);
  color: var(--clr-100);
}
.detail-content p {
  color: var(--clr-200);
  line-height: 1.6;
}

.back-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  color: white;
  margin-bottom: var(--sp-m);
  font-size: 0.95rem;
  padding: var(--sp-xs) var(--sp-m) var(--sp-xs) var(--sp-s);
  border-radius: 100px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ---------- MODAL & SLOTS ---------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  position: relative;
  background: white;
  color: #111;
  border-radius: var(--sp-m);
  padding: var(--sp-l);
  padding-top: var(--sp-2xl);
  width: min(90%, 450px);
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-text {
  display: flex;
  flex-direction: column;
  gap: var(--sp-s);
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-m);
}

.alert-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--clr-sem-err);
}

.modal-header h5 {
  font-size: 1.1rem;
  color: var(--clr-pri-500);
  margin: 0;
  line-height: 1.4;
}

.modal-header h5.error-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--clr-sem-err, #e53935);
}

.close-btn {
  position: absolute;
  top: var(--sp-l);
  right: var(--sp-l);
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--clr-500);
  padding: 0;
  box-shadow: none;
}

.instruction {
  font-weight: bold;
  margin-bottom: var(--sp-s);
}
.slot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--sp-s);
  margin-bottom: var(--sp-m);
}

.slot-btn {
  background: var(--clr-100);
  border: 2px solid var(--clr-200);
  border-radius: var(--sp-s);
  padding: var(--sp-s);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.slot-btn:hover:not(:disabled) {
  border-color: var(--clr-pri-500);
}
.slot-btn.selected {
  background: #eef2ff;
  border-color: var(--clr-pri-500);
  box-shadow: 0 0 0 1px var(--clr-pri-500);
}

.slot-btn:disabled {
  background: var(--clr-200);
  opacity: 0.6;
  cursor: not-allowed;
}
.slot-btn .time {
  font-weight: bold;
  color: var(--clr-900);
}
.slot-btn .capacity {
  font-size: 0.8rem;
  color: #4caf50;
}
.slot-btn .capacity.full {
  color: var(--clr-sem-err);
}

.booking-rules {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  color: var(--clr-sem-err);
  background: rgba(229, 57, 53, 0.05);
  padding: var(--sp-s);
  border-radius: var(--sp-s);
}
.booking-rules li {
  margin-bottom: 4px;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
  margin-top: var(--sp-s);
}
.modal-actions button {
  border-radius: var(--sp-s);
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.modal-actions button.secondary {
  background: var(--clr-200);
  color: var(--clr-700);
}

.modal-actions button.primary {
  background: var(--clr-pri-500);
  color: white;
  transition: 0.2s;
}
.modal-actions button.primary:disabled {
  background: var(--clr-300);
  cursor: not-allowed;
}

/* ปุ่มสีแจ้งเตือนสำหรับลงทะเบียนเด่นขึ้นมา */
.modal-actions button.register-btn {
  background: var(--clr-sem-err, #e53935);
}
.modal-actions button.register-btn:hover {
  background: #c62828;
}

/* ปุ่มยกเลิกการจอง */
.modal-actions button.danger {
  background: var(--clr-sem-err, #e53935);
  color: white;
  transition: 0.2s;
}
.modal-actions button.danger:hover {
  background: #c62828;
}
.modal-actions button.danger:disabled {
  background: var(--clr-300);
  cursor: not-allowed;
}

.loading-activities {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--sp-xl) 0;
  color: var(--clr-200);
  font-style: italic;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Toast Notification */
.custom-toast {
  position: fixed;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: var(--sp-m, 12px);
  padding: 14px 20px;
  color: white;
  z-index: 999999;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  width: min(90%, 380px);
  cursor: pointer;
  box-sizing: border-box;
}

/* Success toast - green */
.custom-toast.success {
  background: rgba(28, 120, 55, 0.95);
  border: 1px solid rgba(40, 167, 69, 0.5);
}

/* Warning toast - yellow */
.custom-toast.warn {
  background: rgba(215, 154, 0, 0.95);
  border: 1px solid var(--clr-sem-warn, #ffc107);
}

/* Error toast - red */
.custom-toast.error {
  background: rgba(180, 30, 45, 0.95);
  border: 1px solid var(--clr-sem-err, #dc3545);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  font-size: 1.6rem;
  line-height: 1;
  flex-shrink: 0;
}

.toast-text {
  flex: 1;
}

.toast-text p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  text-align: left;
}

.toast-text p:first-child {
  font-weight: bold;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

/* Toast Transition with Bounce */
.toast-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from {
  transform: translate(-50%, -60px);
  opacity: 0;
}
.toast-fade-leave-to {
  transform: translate(-50%, -20px);
  opacity: 0;
}
</style>
