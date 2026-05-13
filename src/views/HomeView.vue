<script setup>
import { ref, onMounted } from 'vue'
import { getMyRegistration } from '@/services/registrationService'
import { initLineAuth } from '@/services/lineAuthService'
import HomeUnregistered from '@/components/homeUnregistered/homeUnregistered.vue'
import HomeRegistered from '@/components/homeRegistered/HomeRegistered.vue'

const isBooting = ref(false)
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

// onMounted(checkUserStatus)
</script>

<template>
  <!-- Loading State -->
  <section v-if="isBooting" class="loading-screen">
    <p>Loading...</p>
  </section>
  <section id="home-view" v-else>
    <!-- Show Login View (Not logged in) -->
    <HomeUnregistered v-if="!isRegistered" />
    <!-- Show Scanner View (Logged in) -->
    <HomeRegistered v-else />
  </section>
</template>

<style scoped>
.loading-screen {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
</style>
