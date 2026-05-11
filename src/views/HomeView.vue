<script setup>
import { ref, onMounted } from 'vue'
import { getMyRegistration } from '@/services/registrationService'
import { initLineAuth } from '@/services/lineAuthService'
import HomeUnregistered from '@/components/homeUnregistered/homeUnregistered.vue'
import HomeRegistered from '@/views/HomeRegisteredView.vue'

const isBooting = ref(true)
const isRegistered = ref(false)

const checkUserStatus = async () => {
  isBooting.value = true
  try {
    const auth = await initLineAuth()
    if (auth.redirected) return // Stop if LINE is redirecting

    // Try to fetch the registration
    await getMyRegistration()
    // If succeeds, registered
    isRegistered.value = true
  } catch (err) {
    // If error, not registered
    isRegistered.value = false
  } finally {
    isBooting.value = false
  }
}

onMounted(checkUserStatus)
</script>

<template>
  <!-- Loading State -->
  <div v-if="isBooting" class="loading-screen">
    <p>Loading...</p>
  </div>

  <!-- Show Registered View -->
  <HomeRegistered v-else-if="isRegistered" />

  <!-- Show Unregistered View (Landing Page) -->
  <main v-else>
    <HomeUnregistered />
  </main>
</template>

<style scoped>
.loading-screen {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
</style>
