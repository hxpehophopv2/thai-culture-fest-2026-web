<script setup>
import { ref, onMounted } from 'vue'
import { getActivityBookings, scanCheckin } from '@/services/staffService'
import StaffNav from './StaffNav.vue'

const emit = defineEmits(['logout', 'tab-change'])

const bookings = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const zoneName = ref('')
const zoneCode = ref('')
const staffName = ref('')

onMounted(async () => {
  zoneCode.value = localStorage.getItem('staff_booth_code') || localStorage.getItem('staff_zone') || 'UNKNOWN'
  staffName.value = localStorage.getItem('staff_fullname') || 'Staff'
  zoneName.value = localStorage.getItem('staff_activity_name') || 'Activity'
  await fetchData()
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

const handleManualCheckIn = async (shortCode) => {
  if (!shortCode) return
  try {
    const res = await scanCheckin(shortCode)
    if (res.result === 'checked_in') {
      alert('เช็คอินสำเร็จ')
      await fetchData()
    } else {
      alert(`สถานะ: ${res.message || res.result}`)
      await fetchData()
    }
  } catch (err) {
    alert(`เกิดข้อผิดพลาด: ${err.message}`)
  }
}
</script>

<template>
  <div>
    <!-- Tab Nav Header -->
    <nav>
      <StaffNav current-tab="dashboard" @tab-change="$emit('tab-change', $event)" />
      <button @click="$emit('logout')">Log Out</button>
    </nav>

    <!-- Main Content (Raw Data View) -->
    <div>
      <h2>{{ zoneName }} ({{ zoneCode }})</h2>
      <p>Staff: {{ staffName }}</p>

      <div>
        <p>ทั้งหมด: {{ bookings.length }} | เข้างานแล้ว: {{ bookings.filter(b => b.isAttended).length }}</p>
        <button @click="fetchData">Refresh</button>
      </div>

      <div v-if="isLoading">Loading...</div>
      <div v-else-if="errorMessage" style="color: red;">{{ errorMessage }}</div>
      <div v-else>
        <h3>รายชื่อผู้ลงทะเบียน</h3>
        <ul>
          <li v-for="b in bookings" :key="b.bookingId">
            {{ b.startTime }} - {{ b.endTime }} | 
            {{ b.person?.name }} ({{ b.person?.nickname }}) - {{ b.person?.org }} - Code: {{ b.person?.shortCode }} |
            Status: {{ b.isAttended ? 'เข้างานแล้ว' : 'ยังไม่มา' }}
            <button v-if="!b.isAttended" @click="handleManualCheckIn(b.person?.shortCode)">Check In</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
