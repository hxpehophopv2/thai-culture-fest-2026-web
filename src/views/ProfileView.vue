<script setup>
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
  reservations: { 'th-TH': 'รายการจองกิจกรรมของฉัน', 'en-US': 'My Reservations' },
  noBooking: { 'th-TH': 'คุณยังไม่มีรายการจองกิจกรรม', 'en-US': 'You have no reservations yet.' },
}

const qr = computed(() => qrData.value)
const lineProfile = computed(() => profileData.value)

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
    }
  })
})

const editBooking = (act) => {
  const zoneId = act.id === 'STG' ? 'stage' : 'lab'
  router.push(`/activities/${zoneId}?modal=true&activity=${act.id}`)
}

const playAnimation = async () => {
  await nextTick()

  if (ctx) ctx.revert()

  ctx = gsap.context(() => {
    const tl = gsap.timeline()

    tl.from('.ticket-card', {
      y: 40,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    })

    tl.from(
      '.user-info > *, .qr-wrapper',
      {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.3',
    )

    tl.from(
      '.my-schedules h3',
      {
        x: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.2',
    )

    if (document.querySelectorAll('.schedule-item').length > 0) {
      tl.from(
        '.schedule-item',
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
    } else {
      tl.from('.empty-state', { opacity: 0, duration: 0.5 }, '-=0.3')
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
                ? `${registrationData.firstName} ${registrationData.lastName}`
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

      <section class="my-schedules">
        <h3>{{ t(i18n.reservations) }}</h3>
        <div v-if="bookedActivities.length > 0" class="schedule-grid">
          <div
            v-for="act in bookedActivities"
            :key="act.id"
            class="schedule-item clickable"
            @click="editBooking(act)"
          >
            <span class="code-tag">{{ act.id }}</span>
            <div class="item-details">
              <p>{{ act.name }}</p>
              <time>{{ act.time }}</time>
            </div>
            <div class="arrow-indicator">
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
        <p v-else class="empty-state">{{ t(i18n.noBooking) }}</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import url('@/assets/styles/profile.css');

.schedule-item.clickable {
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
  position: relative;
  padding-right: 40px !important;
}

.schedule-item.clickable:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
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

.schedule-item.clickable:hover .arrow-indicator {
  color: white;
  transform: translateY(-50%) translateX(2px);
}
</style>
