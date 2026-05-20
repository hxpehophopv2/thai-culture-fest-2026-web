<script setup>
import { onMounted, ref } from 'vue'
import { initLineAuth } from '@/services/lineAuthService'
import { useAuth } from '@/composables/useAuth'
import { useUserData } from '@/composables/useUserData'

import HomeLanding from '@/components/home/HomeLanding.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

import liff from '@line/liff'

const { isUserDataLoaded, fetchUserData, registrationData } = useUserData()
const isBooting = ref(!isUserDataLoaded.value)
const { isRegistered } = useAuth()

const checkUserStatus = async () => {
  isBooting.value = !isUserDataLoaded.value
  try {
    const auth = await initLineAuth(undefined, false)
    if (auth.redirected) return

    if (liff.isLoggedIn()) {
      await fetchUserData()
      isRegistered.value = !!registrationData.value
    } else {
      isRegistered.value = false
    }
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
