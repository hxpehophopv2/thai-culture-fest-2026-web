<script setup>
import { ref, onMounted } from 'vue'
import { getMyQr, getMyRegistration } from '@/services/registrationService'
import { getLineProfile } from '@/services/lineAuthService'
import LangToggle from '@/components/LangToggle.vue'

const qr = ref(null)
const lineProfile = ref(null)
const isLoading = ref(true)
const bookedActivities = ref([])

onMounted(async () => {
  lineProfile.value = getLineProfile()
  
  try {
    qr.value = await getMyQr()
  } catch (err) {
    console.error('Error fetching QR', err)
  }

  try {
    const regData = await getMyRegistration()
    if (regData?.bookings) {
      const orderToKey = {
        1: 'LAB1',
        2: 'LAB2',
        3: 'LAB3',
        4: 'LAB4',
        5: 'LAB5',
        6: 'STG'
      }
      
      const formatTime = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' })
      }

      bookedActivities.value = regData.bookings.map(b => {
        const activity = b.session.activity
        const key = orderToKey[activity.sortOrder] || 'ACT'
        return {
          id: `${key}-${formatTime(b.session.startTime).replace(':', '.')}`,
          name: activity.nameTh,
          time: `${formatTime(b.session.startTime)} - ${formatTime(b.session.endTime)} น.`
        }
      })
    }
  } catch (err) {
    console.error('Error fetching registration info', err)
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
