<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { initLineAuth } from '@/services/lineAuthService'
import { useAuth } from '@/composables/useAuth'
import { useUserData } from '@/composables/useUserData'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()

import GlobalNav from './components/GlobalNav.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import liff from '@line/liff'

const { isUserDataLoaded, fetchUserData, registrationData } = useUserData()
const isBooting = ref(true)
const { isRegistered } = useAuth()

const checkUserStatus = async () => {
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
    await new Promise((resolve) => setTimeout(resolve, 500))
    isBooting.value = false
  }
}

onMounted(() => {
  // สั่งเคลียร์หน้าจอโหลดตัวแรกที่อยู่ใน index.html ทิ้งไป เมื่อ Vue เข้ามาคุมระบบสำเร็จ
  const initialLoader = document.getElementById('initial-loader')
  if (initialLoader) {
    initialLoader.remove()
  }
  checkUserStatus()
})
</script>

<template>
  <LoadingScreen v-if="isBooting" :text="t({ 'th-TH': 'กำลังตรวจสอบข้อมูล...', 'en-US': 'Checking user information...' })" />

  <template v-else>
    <RouterView />
    <GlobalNav />
  </template>
</template>

<style>
.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
