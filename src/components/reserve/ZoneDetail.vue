<script setup>
import { computed, ref, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { zones } from '@/data/zonesData.js'
import { useLocale } from '@/composables/useLocale'
import { updateMyRegistration } from '@/services/registrationService'
import { useUserData } from '@/composables/useUserData'

import LabZoneContent from '@/components/reserve/LabZone.vue'
import StageZoneContent from '@/components/reserve/StageZone.vue'

const route = useRoute()
const router = useRouter()
const { t } = useLocale()

const zone = computed(() => zones.find((z) => z.id === route.params.id))
const showModal = ref(false)
const showAuthModal = ref(false)
const isLoadingData = ref(true)
const isUserRegistered = ref(false)
const selectedActivity = ref('')
const selectedSlot = ref(null)
const isSubmitting = ref(false)

// Custom Toast Notification State
const showToast = ref(false)
const toastMessage = ref('')
let toastTimeout = null

const triggerToast = (msg) => {
  if (toastTimeout) clearTimeout(toastTimeout)
  toastMessage.value = msg
  showToast.value = true
  toastTimeout = setTimeout(() => {
    showToast.value = false
  }, 4000)
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

const activityNames = computed(() => {
  const names = {}
  for (const [key, order] of Object.entries(mapKeyToOrder)) {
    const act = activities.value.find((a) => a.sortOrder === order)
    if (act) {
      names[key] = act.nameTh
    }
  }
  // Fallback in case not loaded yet
  return Object.keys(names).length > 0
    ? names
    : {
        LAB1: 'กิจกรรมเวิร์กช็อปร้อยพวงมาลัยไทย',
        LAB2: 'กิจกรรมเวิร์กช็อปพวงมโหตร',
        LAB3: 'กิจกรรมเวิร์กช็อปพัดสานไม้ไผ่ไทย',
        LAB4: 'กิจกรรมเวิร์กช็อปประดิษฐ์เครื่องประดับนาฏศิลป์ไทย',
        LAB5: 'กิจกรรมการเขียนสี - เขียนหน้าหัวโขน',
        STG: 'กิจกรรมเสวนาและการแสดง (STAGE ZONE)',
      }
})

const formatTime = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('th-TH', {
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
    return {
      id: s.id,
      time: `${formatTime(s.startTime)} - ${formatTime(s.endTime)} น.`,
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

    // If selecting the slot already booked, just close the modal
    if (currentSessionIds.includes(selectedSlot.value.id)) {
      showModal.value = false
      return
    }

    // Find the target activity being booked/updated
    const order = mapKeyToOrder[selectedActivity.value]
    const targetActivity = activities.value.find((a) => a.sortOrder === order)

    if (!targetActivity) {
      throw new Error('ไม่พบข้อมูลกิจกรรม / Activity not found')
    }

    // Filter out any existing booking belonging to this activity to allow reschedule/change of time slot
    const filteredSessionIds = currentBookings
      .filter((b) => b.session.activity.id !== targetActivity.id)
      .map((b) => b.session.id)

    const newSessionIds = [...filteredSessionIds, selectedSlot.value.id]
    await updateMyRegistration({ selectedSessionIds: newSessionIds })

    triggerToast(
      `ยืนยันการจองสำเร็จ / Reservation successful:\n${activityNames.value[selectedActivity.value]}\nรอบเวลา: ${selectedSlot.value.time}`,
    )
    showModal.value = false

    // Refresh Data
    await fetchUserData(true)
  } catch (err) {
    const errorMsg = err.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาลองใหมี่อีกครั้ง'
    triggerToast(`เกิดข้อผิดพลาดในการจอง / Error booking:\n${errorMsg}`)
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
    router.replace({ params: route.params })
    setTimeout(() => {
      const defaultKey = route.params.id === 'stage' ? 'STG' : ''
      openReserve(defaultKey)
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
        Back
      </button>

      <img :src="zone.image" alt="" class="detail-img" />
      <div class="detail-content">
        <h3>{{ t(zone.title) }}</h3>

        <div v-if="isLoadingData" class="loading-activities">
          <p>กำลังโหลดข้อมูลสิทธิ์การจอง / Checking registration status...</p>
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
                selectedActivity
                  ? activityNames[selectedActivity]
                  : 'จองที่นั่ง — ' + (zone ? t(zone.title) : '')
              }}
            </h5>
            <button class="close-btn" @click="showModal = false">✕</button>
          </div>

          <div class="modal-body">
            <p class="instruction">เลือกรอบเวลาที่ต้องการจอง:</p>

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
                  จองแล้ว / Booked
                </span>
                <span v-else class="capacity" :class="{ full: slot.isFull }">
                  {{
                    slot.capacity - slot.booked > 0
                      ? `เหลือ ${slot.capacity - slot.booked} ที่นั่ง`
                      : 'เต็มแล้ว'
                  }}
                </span>
              </button>
            </div>

            <ul class="booking-rules">
              <li>* ระบบจะไม่อนุญาตให้จองในเวลาที่ซ้อนทับกับกิจกรรมอื่น</li>
              <li>* สามารถเปลี่ยนแปลงหรือยกเลิกรอบได้ล่วงหน้า 1 วันก่อนวันงาน</li>
            </ul>
          </div>

          <div class="modal-actions">
            <button class="secondary" @click="showModal = false">ยกเลิก</button>
            <button class="primary" :disabled="!selectedSlot" @click="confirmReservation">
              ยืนยันการจอง
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showAuthModal" class="modal-backdrop" @click.self="showAuthModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h5 class="error-title">ยังไม่ได้ลงทะเบียนเข้าร่วมงาน</h5>
            <button class="close-btn" @click="showAuthModal = false">✕</button>
          </div>

          <div class="modal-body">
            <p style="color: var(--clr-700, #475569); line-height: 1.5">
              ขออภัยด้วยครับ คุณจำเป็นต้องลงทะเบียนเข้าร่วมงานหลักก่อน
              จึงจะสามารถใช้สิทธิ์การจองที่นั่งหรือรอบเวลาในกิจกรรมต่างๆ ได้ครับ
            </p>
          </div>

          <div class="modal-actions">
            <button class="secondary" @click="showAuthModal = false">ยกเลิก</button>
            <button class="primary register-btn" @click="router.push('/register')">
              ลงทะเบียนตอนนี้
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Beautiful Custom Toast Notification -->
    <Transition name="toast-fade">
      <div v-if="showToast" class="custom-toast" @click="showToast = false">
        <div class="toast-content">
          <div class="toast-icon">✨</div>
          <div class="toast-text">
            <p v-for="line in toastMessage.split('\n')" :key="line">{{ line }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.zone-detail-wrapper {
  padding: 0 var(--sp-l) var(--sp-3xl);
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
  background: white;
  color: #111;
  border-radius: var(--sp-m);
  padding: var(--sp-l);
  width: min(90%, 450px);
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--sp-m);
}

.modal-header h5 {
  font-size: 1.1rem;
  color: var(--clr-pri-500);
  margin: 0;
  line-height: 1.4;
}

/* ตั้งค่าหัวข้อ Warning แจ้งเตือนสีแดง */
.modal-header h5.error-title {
  color: var(--clr-sem-err, #e53935);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--clr-500);
  padding: 0;
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
  justify-content: flex-end;
  gap: var(--sp-s);
  margin-top: var(--sp-s);
}
.modal-actions button {
  padding: var(--sp-s) var(--sp-m);
  border-radius: var(--sp-s);
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.modal-actions button.secondary {
  background: var(--clr-200);
  color: var(--clr-900);
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

/* Beautiful Custom Glassmorphic Toast */
.custom-toast {
  position: fixed;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 80, 133, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--sp-m, 12px);
  padding: 14px 20px;
  color: white;
  z-index: 10000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: min(90%, 380px);
  cursor: pointer;
  box-sizing: border-box;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  font-size: 1.6rem;
  line-height: 1;
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
