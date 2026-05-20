<script setup>
import { ref, onMounted } from 'vue'
import StaffLogin from '@/components/staff/StaffLogin.vue'
import StaffScannerActive from '@/components/staff/StaffScannerActive.vue'
import '@/assets/styles/register.css'

const isBooting = ref(true)
const isLoggedIn = ref(false)

const checkStaffAuth = async () => {
  isBooting.value = true
  try {
    const sessionId = localStorage.getItem('staff_session_id')
    if (sessionId) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  } catch {
    isLoggedIn.value = false
  } finally {
    isBooting.value = false
  }
}

// Handle login success made at StaffLogin
const handleLoginSuccess = (staffData) => {
  localStorage.setItem('staff_session_id', staffData.staffSessionId)
  localStorage.setItem('staff_fullname', staffData.fullname)
  localStorage.setItem('staff_booth_code', staffData.boothCode)
  localStorage.setItem('staff_zone', staffData.activity?.zone || '')
  localStorage.setItem('staff_activity_name', staffData.activity?.nameTh || staffData.activity?.name || '')

  isLoggedIn.value = true
}

// Handle logout made at StaffScannerActive
const handleLogout = () => {
  localStorage.removeItem('staff_session_id')
  localStorage.removeItem('staff_fullname')
  localStorage.removeItem('staff_booth_code')
  localStorage.removeItem('staff_zone')
  localStorage.removeItem('staff_activity_name')

  isLoggedIn.value = false
}

onMounted(checkStaffAuth)
</script>

<template>
  <!-- Loading State -->
  <section v-if="isBooting" class="loading-screen">
    <p>Loading Staff System...</p>
  </section>
  <section v-else>
    <!-- Show Login View (Not logged in) -->
    <StaffLogin
      v-if="!isLoggedIn"
      class="register staff-login-screen"
      @login-success="handleLoginSuccess"
    />
    <!-- Show Scanner View (Logged in) -->
    <StaffScannerActive v-else class="staff-scan-screen" @logout="handleLogout" />
  </section>
</template>

<style scoped>
.loading-screen {
  display: grid;
  place-items: center;
  min-height: 100vh;
  background-color: var(--clr-200, #000);
  color: var(--clr-900);
}

.staff-login-screen {
  display: flex;
  min-height: 100vh;
  justify-content: center;
}
</style>
