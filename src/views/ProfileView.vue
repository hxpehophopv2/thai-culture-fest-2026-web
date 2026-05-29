<script setup>
// TODO: Fetch and get REAL data, check if:
//    the general zones (walk-in), has the user checked-in yet? if true, stamp them
//    the pre-booked activities, has the user checked-in yet? if true, stamp them
// TODO: Add redirection to Identity, Khon, and Play Zone after clicking on the cards respectively

import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'

import LangToggle from '@/components/LangToggle.vue'
import { useUserData } from '@/composables/useUserData'
import { useLocale } from '@/composables/useLocale'
import LoadingScreen from '@/components/LoadingScreen.vue'

const router = useRouter()
const { t, locale } = useLocale()
const { registrationData, qrData, profileData, isUserDataLoaded, fetchUserData } = useUserData()

const isLoading = ref(!isUserDataLoaded.value)
const profileRef = ref(null)
let ctx

// --- i18n Dictionary ---
const i18n = {
  loading: { 'th-TH': 'กำลังโหลดโปรไฟล์...', 'en-US': 'Loading profile...' },
  participant: { 'th-TH': 'ผู้เข้าร่วมงาน', 'en-US': 'Participant' },
  registeredBadge: { 'th-TH': 'ลงทะเบียนสำเร็จ', 'en-US': 'Registered Participant' },
  reservations: {
    'th-TH': 'พาสปอร์ตและรายการจองกิจกรรม',
    'en-US': 'My Passport & Reservations',
  },
  generalZones: { 'th-TH': 'โซนกิจกรรมทั่วไป (Walk-in)', 'en-US': 'General Zones (Walk-in)' },
  reservedActivities: { 'th-TH': 'กิจกรรมที่จองล่วงหน้า', 'en-US': 'Pre-booked Activities' },
  noBooking: { 'th-TH': 'คุณยังไม่มีรายการจองกิจกรรม', 'en-US': 'You have no reservations yet.' },
  stamped: { 'th-TH': 'ผ่านแล้ว', 'en-US': 'PASSED' },
  reserveNowBtn: { 'th-TH': 'จองเลย!', 'en-US': 'Reserve Now!' },
}

const qr = computed(() => qrData.value)
const lineProfile = computed(() => profileData.value)

const hasAttended = (activityId) => {
  const checkedInZones = registrationData.value?.checkIns || []
  return checkedInZones.includes(activityId)
}

const bookedActivities = computed(() => {
  const regData = registrationData.value
  if (!regData?.bookings) return []

  const orderToKey = {
    1: 'LAB1',
    2: 'LAB2',
    3: 'LAB3',
    4: 'LAB4',
    5: 'LAB5',
    6: 'STG',
  }

  const formatTime = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString(locale.value, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Bangkok',
    })
  }

  return regData.bookings.map((b) => {
    const activity = b.session.activity
    const key = orderToKey[activity.sortOrder] || 'ACT'
    const suffix = locale.value === 'th-TH' ? ' น.' : ''

    return {
      id: key,
      name: locale.value === 'th-TH' ? activity.nameTh : activity.nameEn || activity.nameTh,
      time: `${formatTime(b.session.startTime)} - ${formatTime(b.session.endTime)}${suffix}`,
      isAttended: b.isAttended || false,
    }
  })
})

const editBooking = (act) => {
  if (hasAttended(act.id)) return
  const zoneId = act.id === 'STG' ? 'stage' : 'lab'
  router.push(`/activities/${zoneId}?modal=true&activity=${act.id}`)
}

const playAnimation = async () => {
  await nextTick()

  if (ctx) ctx.revert()

  ctx = gsap.context(() => {
    const tl = gsap.timeline()
    tl.from('.ticket-card', { y: 40, opacity: 0, duration: 0.6, ease: 'power3.out' })

    tl.from(
      '.user-info > *, .qr-wrapper',
      { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.3',
    )

    tl.from(
      '.my-passport-and-schedules h3, .subsection-title',
      { x: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
      '-=0.2',
    )

    const scheduleItems = document.querySelectorAll('.schedule-item')
    if (scheduleItems.length > 0) {
      tl.from(
        scheduleItems,
        {
          y: 30,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.1,
          clearProps: 'transform',
        },
        '-=0.3',
      )
    }

    const emptyState = document.querySelector('.empty-state-wrapper')
    if (emptyState) {
      tl.from(emptyState, { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
    }

    const stamps = document.querySelectorAll('.passport-stamp')
    if (stamps.length > 0) {
      tl.from(
        stamps,
        { scale: 2, opacity: 0, rotation: 15, duration: 0.4, stagger: 0.1, ease: 'back.out(2)' },
        '-=0.2',
      )
    }
  }, profileRef.value)
}

watch(isLoading, (newVal) => {
  if (!newVal) playAnimation()
})

onMounted(async () => {
  isLoading.value = !isUserDataLoaded.value
  try {
    await fetchUserData()
  } catch (err) {
    console.error('Error fetching registration info', err)
  } finally {
    isLoading.value = false
    if (!isLoading.value) playAnimation()
  }
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <div id="profile-view" ref="profileRef">
    <div class="orb-bg">
      <div class="orb"></div>
      <div class="orb"></div>
      <div class="orb"></div>
    </div>

    <nav class="profile-nav">
      <LangToggle theme="light" />
    </nav>

    <LoadingScreen v-if="isLoading" :text="t(i18n.loading)" />

    <div v-else class="profile-container">
      <section v-if="qr" class="ticket-card">
        <div class="user-info">
          <img :src="lineProfile?.pictureUrl" alt="Line Profile" class="avatar" />
          <h2>
            {{
              registrationData?.firstName
                ? `${registrationData.firstName} ${registrationData.lastName} (${registrationData?.nickname})`
                : lineProfile?.displayName || t(i18n.participant)
            }}
          </h2>
          <span class="badge">{{ t(i18n.registeredBadge) }}</span>
        </div>

        <div class="qr-wrapper">
          <img :src="qr.dataUrl" alt="Registration QR code" />
          <code>{{ registrationData?.shortCode || qr.shortCode || qr.qrData }}</code>
        </div>
      </section>

      <section class="my-passport-and-schedules">
        <h3>{{ t(i18n.reservations) }}</h3>

        <div class="subsection">
          <h4 class="subsection-title">{{ t(i18n.generalZones) }}</h4>
          <div class="schedule-grid">
            <div class="schedule-item clickable" :class="{ 'is-completed': hasAttended('IDY') }">
              <span class="code-tag">IDY</span>
              <div class="item-details">
                <p>IDENTITY ZONE</p>
              </div>
              <div v-if="hasAttended('IDY')" class="passport-stamp">
                <span>{{ t(i18n.stamped) }}</span>
              </div>
              <div v-if="!hasAttended('IDY')" class="arrow-indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>

            <div class="schedule-item clickable" :class="{ 'is-completed': hasAttended('KHN') }">
              <span class="code-tag">KHN</span>
              <div class="item-details">
                <p>KHON ZONE</p>
              </div>
              <div v-if="hasAttended('KHN')" class="passport-stamp">
                <span>{{ t(i18n.stamped) }}</span>
              </div>
              <div v-if="!hasAttended('KHN')" class="arrow-indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>

            <div class="schedule-item clickable" :class="{ 'is-completed': hasAttended('PLY') }">
              <span class="code-tag">PLY</span>
              <div class="item-details">
                <p>PLAY ZONE</p>
              </div>
              <div v-if="hasAttended('PLY')" class="passport-stamp">
                <span>{{ t(i18n.stamped) }}</span>
              </div>
              <div v-if="!hasAttended('PLY')" class="arrow-indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="subsection">
          <h4 class="subsection-title">{{ t(i18n.reservedActivities) }}</h4>

          <div v-if="bookedActivities.length > 0" class="schedule-grid">
            <div
              v-for="act in bookedActivities"
              :key="act.id"
              class="schedule-item clickable"
              :class="{ 'is-completed': hasAttended(act.id) || act.isAttended }"
              @click="editBooking(act)"
            >
              <span class="code-tag">{{ act.id }}</span>
              <div class="item-details">
                <p>{{ act.name }}</p>
                <time>{{ act.time }}</time>
              </div>
              <div v-if="hasAttended(act.id) || act.isAttended" class="passport-stamp">
                <span>{{ t(i18n.stamped) }}</span>
              </div>
              <div v-else class="arrow-indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div v-else class="empty-state-wrapper">
            <p class="empty-state">{{ t(i18n.noBooking) }}</p>
            <button class="reserve-now-btn" @click="router.push('/activities')">
              {{ t(i18n.reserveNowBtn) }}
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import url('@/assets/styles/profile.css');

/* ---------- SUBSECTION STYLES ---------- */
.subsection {
  margin-bottom: var(--sp-xl);
}

.subsection:last-child {
  margin-bottom: 0;
}

.subsection-title {
  font-size: 0.95rem;
  color: var(--clr-300);
  margin-bottom: var(--sp-s);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.schedule-grid {
  display: flex;
  flex-direction: column;
  gap: var(--sp-s);
}

.schedule-item {
  backdrop-filter: blur(8px);
}

.schedule-item.clickable {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
  position: relative;
  padding-right: 40px !important;
  overflow: hidden;
}

.schedule-item.clickable:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
}

.schedule-item.is-completed {
  background: rgba(34, 197, 94, 0.05) !important;
  border-color: rgba(34, 197, 94, 0.3) !important;
  opacity: 0.9;
  cursor: default;
}
.schedule-item.is-completed:hover {
  transform: none;
}

.arrow-indicator {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  transition:
    transform 0.2s ease,
    color 0.2s ease;
  display: flex;
  align-items: center;
}

.schedule-item.clickable:not(.is-completed):hover .arrow-indicator {
  color: white;
  transform: translateY(-50%) translateX(2px);
}

/* ---------- STAMP CSS ---------- */
.passport-stamp {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%) rotate(-6deg);
  border: 2px solid #22c55e;
  color: #22c55e;
  padding: 4px 12px;
  border-radius: 8px;
  font-family: 'IBM Plex Sans Thai', sans-serif;
  font-weight: 900;
  text-transform: uppercase;
  pointer-events: none;
  z-index: 5;
  box-shadow:
    0 0 4px rgba(34, 197, 94, 0.3),
    inset 0 0 4px rgba(34, 197, 94, 0.3);
  text-shadow: 0 0 2px rgba(34, 197, 94, 0.4);
}

/* ---------- EMPTY STATE CSS ---------- */
.empty-state-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--sp-xl) 0;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--sp-s);
  gap: var(--sp-l);
}

.empty-state {
  text-align: center;
  color: var(--clr-300);
  margin: 0;
  font-size: 0.95rem;
}

.reserve-now-btn {
  background: var(--clr-100);
  color: var(--clr-pri-500);
  border: none;
  padding: var(--sp-s) var(--sp-l);
  border-radius: 100px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.reserve-now-btn:hover {
  transform: translateY(-2px) scale(1.05);
  background: white;
}
</style>
