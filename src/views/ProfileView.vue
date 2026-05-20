<script setup>
import { ref, onMounted, computed } from 'vue'
import LangToggle from '@/components/LangToggle.vue'
import { useUserData } from '@/composables/useUserData'
import LoadingScreen from '@/components/LoadingScreen.vue'

const { registrationData, qrData, profileData, isUserDataLoaded, fetchUserData } = useUserData()

const isLoading = ref(!isUserDataLoaded.value)

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
    return d.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Bangkok',
    })
  }

  return regData.bookings.map((b) => {
    const activity = b.session.activity
    const key = orderToKey[activity.sortOrder] || 'ACT'
    return {
      id: key,
      name: activity.nameTh,
      time: `${formatTime(b.session.startTime)} - ${formatTime(b.session.endTime)} น.`,
    }
  })
})

onMounted(async () => {
  isLoading.value = !isUserDataLoaded.value
  try {
    await fetchUserData()
  } catch (err) {
    console.error('Error fetching registration info', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div id="profile-view">
    <div class="orb-bg">
      <div class="orb"></div>
      <div class="orb"></div>
      <div class="orb"></div>
    </div>

    <nav class="profile-nav">
      <LangToggle theme="light" />
    </nav>

    <LoadingScreen v-if="isLoading" text="กำลังโหลดโปรไฟล์" />

    <div v-else class="profile-container">
      <section v-if="qr" class="ticket-card">
        <div class="user-info">
          <img :src="lineProfile?.pictureUrl" alt="Line Profile" class="avatar" />
          <h2>
            {{
              registrationData?.firstName
                ? `${registrationData.firstName} ${registrationData.lastName}`
                : lineProfile?.displayName || 'Participant'
            }}
          </h2>
          <span class="badge">Registered Participant</span>
        </div>

        <div class="qr-wrapper">
          <img :src="qr.dataUrl" alt="Registration QR code" />
          <code>{{ registrationData?.shortCode || qr.shortCode || qr.qrData }}</code>
        </div>
      </section>

      <section class="my-schedules">
        <h3>My Reservations</h3>
        <div v-if="bookedActivities.length > 0" class="schedule-grid">
          <div v-for="act in bookedActivities" :key="act.id" class="schedule-item">
            <span class="code-tag">{{ act.id }}</span>
            <div class="item-details">
              <p>{{ act.name }}</p>
              <time>{{ act.time }}</time>
            </div>
          </div>
        </div>
        <p v-else class="empty-state">คุณยังไม่มีรายการจองกิจกรรม</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
@import url('@/assets/styles/profile.css');
</style>
