<script setup>
import { onMounted, ref } from 'vue'
import { initLineAuth } from '@/services/lineAuthService'
import { useAuth } from '@/composables/useAuth'
import { useUserData } from '@/composables/useUserData'

import HomeLanding from '@/components/home/HomeLanding.vue'

import liff from '@line/liff'

const { isUserDataLoaded, fetchUserData } = useUserData()
const isBooting = ref(!isUserDataLoaded.value)
const { isRegistered } = useAuth()

const checkUserStatus = async () => {
  isBooting.value = !isUserDataLoaded.value
  try {
    const auth = await initLineAuth(undefined, false)
    if (auth.redirected) return

    if (liff.isLoggedIn()) {
      await fetchUserData()
      isRegistered.value = true
    } else {
      isRegistered.value = false
    }
  } catch {
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
