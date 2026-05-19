<script setup>
import { ref, onMounted } from 'vue'
import { getMyQr } from '@/services/registrationService'
import { getLineProfile } from '@/services/lineAuthService'
import LangToggle from '@/components/LangToggle.vue'

const qr = ref(null)
const lineProfile = ref(null)
const isLoading = ref(true)

// TODO: Fetch user's booked activities from API
const bookedActivities = ref([
  { id: 'LAB1-1', name: 'เวิร์กช็อปร้อยพวงมาลัยไทย', time: '09.00 - 10.30 น.' },
  { id: 'STG', name: 'กิจกรรมเสวนา “เด็กวิทย์หัวใจศิลป์”', time: '14.00 - 15.30 น.' },
])

onMounted(async () => {
  lineProfile.value = getLineProfile()
  try {
    qr.value = await getMyQr()
  } catch (err) {
    console.error('Error fetching QR', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div id="profile-view">
    <nav class="profile-nav">
      <LangToggle />
    </nav>

    <section v-if="isLoading" class="profile-state">
      <p>Loading your profile...</p>
    </section>

    <div v-else class="profile-container">
      <section v-if="qr" class="ticket-card">
        <div class="user-info">
          <img :src="lineProfile?.pictureUrl" alt="Line Profile" class="avatar" />
          <h2>{{ lineProfile?.displayName }}</h2>
          <span class="badge">Registered Participant</span>
        </div>

        <div class="qr-wrapper">
          <img :src="qr.dataUrl" alt="Registration QR code" />
          <code>{{ qr.qrData }}</code>
        </div>
      </section>

      <section class="my-schedules">
        <h3>My Reservations</h3>
        <div v-if="bookedActivities.length > 0" class="schedule-grid">
          <div v-for="act in bookedActivities" :key="act.id" class="schedule-item">
            <span class="code-tag">{{ act.id }}</span>
            <div class="item-details">
              <h4>{{ act.name }}</h4>
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
