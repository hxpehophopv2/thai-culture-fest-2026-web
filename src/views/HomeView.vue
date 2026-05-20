<script setup>
import { onMounted, ref } from 'vue'
import { initLineAuth } from '@/services/lineAuthService'
import { useAuth } from '@/composables/useAuth'
import { useUserData } from '@/composables/useUserData'

import HomeLanding from '@/components/home/HomeLanding.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const { isUserDataLoaded, fetchUserData } = useUserData()
// const isBooting = ref(!isUserDataLoaded.value)
const isBooting = ref(false)
const { isRegistered } = useAuth()

const checkUserStatus = async () => {
  isBooting.value = !isUserDataLoaded.value
  try {
    const auth = await initLineAuth()
    if (auth.redirected) return

    await fetchUserData()
    isRegistered.value = true
  } catch {
    isRegistered.value = false
  } finally {
    isBooting.value = false
  }
}

// onMounted(checkUserStatus)
</script>

<template>
  <LoadingScreen v-if="isBooting" text="กำลังตรวจสอบข้อมูล..." />
  <HomeLanding v-else />
</template>
