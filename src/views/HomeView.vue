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

  // 🟢 ดักโหมด DEV เพื่อไม่ให้ไปเตะ API หรือ LIFF
  const DEV_MODE_BYPASS = true
  if (DEV_MODE_BYPASS) {
    await fetchUserData() // เรียกใช้ Mock data จาก UseUserData.js
    isRegistered.value = true
    isBooting.value = false
    return
  }

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
    await new Promise((resolve) => setTimeout(resolve, 1000))
    isBooting.value = false
  }
}

onMounted(checkUserStatus)
</script>

<template>
  <LoadingScreen v-if="isBooting" text="กำลังตรวจสอบข้อมูล..." />
  <HomeLanding v-else />
</template>
