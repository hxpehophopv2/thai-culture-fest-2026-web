<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick, watch } from 'vue'
import { gsap } from 'gsap'
import { RefreshCw, Check, Clock, X, CircleQuestionMark } from '@lucide/vue'
import { getActivityBookings, scanCheckin } from '@/services/staffService'
import { useLocale } from '@/composables/useLocale'
import StaffHeader from './StaffHeader.vue'

const emit = defineEmits(['logout', 'tab-change'])

const { t } = useLocale()

const bookings = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const zoneName = ref('')
const zoneCode = ref('')
const staffName = ref('')

const i18n = {
  title: { 'th-TH': 'รายชื่อผู้ลงทะเบียน', 'en-US': 'Registration List' },
  staffLabel: { 'th-TH': 'เจ้าหน้าที่', 'en-US': 'Staff' },
  totalLabel: { 'th-TH': 'ทั้งหมด', 'en-US': 'Total' },
  attendedLabel: { 'th-TH': 'เช็กแล้ว', 'en-US': 'Checked' },
  pendingLabel: { 'th-TH': 'ยังไม่มา', 'en-US': 'Pending' },
  refreshBtn: { 'th-TH': 'รีเฟรช', 'en-US': 'Refresh' },
  checkinBtn: { 'th-TH': 'เช็กอิน', 'en-US': 'Check In' },
  successMsg: { 'th-TH': 'เช็กอินสำเร็จ', 'en-US': 'Check-In Successful' },
  logoutBtn: { 'th-TH': 'ออกจากระบบ', 'en-US': 'Log Out' },
  emptyMsg: { 'th-TH': 'ไม่มีผู้ลงทะเบียนในโซนนี้', 'en-US': 'No registrations for this zone' },
}

const dashboardRef = ref(null)
let ctx

const animateEntrance = () => {
  if (ctx) ctx.revert()
  ctx = gsap.context(() => {
    const tl = gsap.timeline()
    tl.from('.dashboard-title-card', { y: -20, opacity: 0, duration: 0.6, ease: 'power3.out' })
    tl.from('.stat-card', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
    tl.from('.section-title-bar', { x: -20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')

    // Stagger all booking cards if they are rendered
    const cards = document.querySelectorAll('.booking-card')
    if (cards.length > 0) {
      tl.from(
        cards,
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.05,
          clearProps: 'transform',
        },
        '-=0.2',
      )
    }
  }, dashboardRef.value)
}

watch(isLoading, (newVal) => {
  if (!newVal) {
    nextTick(() => {
      animateEntrance()
    })
  }
})

onMounted(async () => {
  zoneCode.value =
    localStorage.getItem('staff_booth_code') || localStorage.getItem('staff_zone') || 'UNKNOWN'
  staffName.value = localStorage.getItem('staff_fullname') || 'Staff'
  zoneName.value = localStorage.getItem('staff_activity_name') || 'Activity'
  animateEntrance()
  await fetchData()
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})

const fetchData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const data = await getActivityBookings()
    bookings.value = data || []
  } catch (err) {
    console.error('Error fetching bookings:', err)
    errorMessage.value = err.message || 'Failed to fetch bookings data'
  } finally {
    isLoading.value = false
  }
}

// Confirmation modal states
const showConfirmCheckinModal = ref(false)
const pendingCheckinBooking = ref(null)
const pendingCheckinTimeSlot = ref('')
const isSubmittingCheckin = ref(false)

const confirmManualCheckIn = (booking, timeSlot) => {
  pendingCheckinBooking.value = booking
  pendingCheckinTimeSlot.value = timeSlot
  showConfirmCheckinModal.value = true
}

const executeCheckIn = async () => {
  const shortCode = pendingCheckinBooking.value?.person?.shortCode
  if (!shortCode) return

  isSubmittingCheckin.value = true
  try {
    const res = await scanCheckin(shortCode)
    if (res.result === 'checked_in') {
      alert(t(i18n.successMsg))
      showConfirmCheckinModal.value = false
      await fetchData()
    } else {
      alert(`สถานะ: ${res.message || res.result}`)
      showConfirmCheckinModal.value = false
      await fetchData()
    }
  } catch (err) {
    alert(`เกิดข้อผิดพลาด: ${err.message}`)
  } finally {
    isSubmittingCheckin.value = false
  }
}

// Group participants by their reserved time slots
const groupedBookings = computed(() => {
  const groups = {}
  bookings.value.forEach((b) => {
    const timeKey = `${b.startTime || '??:??'} - ${b.endTime || '??:??'}`
    if (!groups[timeKey]) {
      groups[timeKey] = []
    }
    groups[timeKey].push(b)
  })

  // Sort timeslots chronologically
  return Object.keys(groups)
    .sort()
    .map((timeSlot) => ({
      timeSlot,
      bookings: groups[timeSlot],
    }))
})
</script>

<template>
  <div id="dashboard-view" ref="dashboardRef">
    <StaffHeader
      :staff-name="staffName"
      :zone-name="zoneName"
      :zone-code="zoneCode"
      @logout="emit('logout')"
    />

    <main class="dashboard-content">
      <!-- Title & Zone Card -->
      <div class="dashboard-title-card">
        <h6>{{ zoneName }}</h6>
        <div class="zone-badge-wrapper">
          <span class="zone-badge-label">{{ zoneCode }}</span>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">{{ t(i18n.totalLabel) }}</span>
          <span class="stat-value">{{ bookings.length }}</span>
        </div>
        <div class="stat-card state-attended">
          <span class="stat-label">{{ t(i18n.attendedLabel) }}</span>
          <span class="stat-value">{{ bookings.filter((b) => b.isAttended).length }}</span>
        </div>
        <div class="stat-card state-pending">
          <span class="stat-label">{{ t(i18n.pendingLabel) }}</span>
          <span class="stat-value">{{ bookings.filter((b) => !b.isAttended).length }}</span>
        </div>
      </div>

      <div class="section-title-bar">
        <h3>{{ t(i18n.title) }}</h3>
        <button class="refresh-btn" @click="fetchData" :disabled="isLoading">
          <RefreshCw :size="14" :class="{ spinning: isLoading }" />
          <span>{{ t(i18n.refreshBtn) }}</span>
        </button>
      </div>

      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
      </div>
      <div v-else-if="errorMessage" class="error-state">
        <p>{{ errorMessage }}</p>
        <button class="secondary" @click="fetchData">{{ t(i18n.refreshBtn) }}</button>
      </div>
      <div v-else-if="bookings.length === 0" class="empty-state">
        <p>{{ t(i18n.emptyMsg) }}</p>
      </div>

      <!-- Grouped Registrations List -->
      <div v-else class="bookings-grouped">
        <div v-for="group in groupedBookings" :key="group.timeSlot" class="time-group">
          <!-- Time slot header -->
          <div class="time-group-header">
            <Clock :size="16" />
            <span class="time-group-slot">{{ group.timeSlot }}</span>
            <span class="time-group-badge">
              {{ group.bookings.filter((b) => b.isAttended).length }} / {{ group.bookings.length }}
            </span>
          </div>

          <!-- Participant list for the slot -->
          <div class="time-group-list">
            <div
              v-for="b in group.bookings"
              :key="b.bookingId"
              class="booking-card"
              :class="{ 'is-attended': b.isAttended }"
            >
              <div class="card-main">
                <div class="person-details">
                  <span class="person-name">
                    {{ b.person?.name || 'Unknown' }}
                    <span v-if="b.person?.nickname">({{ b.person.nickname }})</span>
                  </span>
                  <code class="person-code">{{ b.person?.shortCode }}</code>
                </div>
                <div class="card-action">
                  <span v-if="b.isAttended" class="status-badge attended">
                    <Check :size="12" />
                    {{ t(i18n.attendedLabel) }}
                  </span>
                  <button
                    v-else
                    class="checkin-btn"
                    @click="confirmManualCheckIn(b, group.timeSlot)"
                  >
                    {{ t(i18n.checkinBtn) }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Manual Check-In Confirmation Modal -->
      <Transition name="fade">
        <div
          v-if="showConfirmCheckinModal"
          class="modal-backdrop"
          @click.self="showConfirmCheckinModal = false"
        >
          <div class="modal-box">
            <button class="close-btn" @click="showConfirmCheckinModal = false"><X /></button>
            <div class="modal-text">
              <div class="modal-header">
                <div class="alert-icon confirm-icon">
                  <CircleQuestionMark :size="128" :strokeWidth="4" absoluteStrokeWidth />
                </div>
                <h5 class="confirm-title">
                  {{ t({ 'th-TH': 'ยืนยันการเช็กอิน', 'en-US': 'Confirm Check-In' }) }}
                </h5>
              </div>

              <div class="modal-body">
                <div class="confirm-details">
                  <span class="confirm-label">{{ t({ 'th-TH': 'ชื่อ', 'en-US': 'Name' }) }}</span>
                  <span class="confirm-val">
                    <strong>{{ pendingCheckinBooking?.person?.name || 'Unknown' }}</strong>
                    <span v-if="pendingCheckinBooking?.person?.nickname">
                      ({{ pendingCheckinBooking.person.nickname }})</span
                    >
                  </span>

                  <span class="confirm-label">{{ t({ 'th-TH': 'รหัส', 'en-US': 'Code' }) }}</span>
                  <span class="confirm-val"
                    ><code>{{ pendingCheckinBooking?.person?.shortCode }}</code></span
                  >

                  <span class="confirm-label">{{
                    t({ 'th-TH': 'รอบเวลา', 'en-US': 'Time Slot' })
                  }}</span>
                  <span class="confirm-val">{{ pendingCheckinTimeSlot }}</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button
                class="primary checkin-confirm-btn"
                @click="executeCheckIn"
                :disabled="isSubmittingCheckin"
              >
                {{
                  isSubmittingCheckin
                    ? t({ 'th-TH': 'กำลังประมวลผล...', 'en-US': 'Processing...' })
                    : t(i18n.checkinBtn)
                }}
              </button>
              <button class="secondary" @click="showConfirmCheckinModal = false">
                {{ t({ 'th-TH': 'ยกเลิก', 'en-US': 'Cancel' }) }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<style scoped>
@import url('@/assets/styles/staffDashboard.css');
</style>
