<script setup>
import { ref, onMounted } from 'vue'
import { getMyRegistration } from '@/services/registrationService'
import { initLineAuth } from '@/services/lineAuthService'
import { useAuth } from '@/composables/useAuth'

import HomeLanding from '@/components/home/HomeLanding.vue'

const isBooting = ref(true)
const { isRegistered } = useAuth()

const checkUserStatus = async () => {
  isBooting.value = true
  try {
    const auth = await initLineAuth()
    if (auth.redirected) return

    await getMyRegistration()
    isRegistered.value = true
  } catch (err) {
    isRegistered.value = false
  } finally {
    isBooting.value = false
  }
}

onMounted(checkUserStatus)
</script>

<template>
  <section v-if="isBooting" class="loading-screen">
    <p>Loading...</p>
  </section>

  <HomeLanding v-else />
</template>

<style scoped>
.loading-screen {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
</style>
