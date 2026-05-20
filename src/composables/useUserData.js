import { ref } from 'vue'
import { getMyRegistration, getMyQr, getActivities } from '@/services/registrationService'
import { getLineProfile } from '@/services/lineAuthService'

const registrationData = ref(null)
const qrData = ref(null)
const profileData = ref(null)
const activitiesData = ref(null)
const isUserDataLoaded = ref(false)

export function useUserData() {
  const fetchUserData = async (force = false) => {
    // If already loaded and not forcing, return immediately and refetch in background silently
    if (isUserDataLoaded.value && !force) {
      getActivities()
        .then((acts) => (activitiesData.value = acts))
        .catch(console.error)
      getMyRegistration()
        .then((reg) => (registrationData.value = reg))
        .catch(() => (registrationData.value = null))
      getMyQr()
        .then((qr) => (qrData.value = qr))
        .catch(() => (qrData.value = null))
      return
    }

    profileData.value = getLineProfile()

    // 1. Activities data
    try {
      activitiesData.value = await getActivities()
    } catch (err) {
      console.error('Failed to fetch activities', err)
    }

    // 2. โหลดข้อมูลส่วนตัว (ถ้าได้ 404 ก็แค่ปล่อยให้ค่าเป็น null ระบบจะได้รู้ว่ายังไม่ลงทะเบียน)
    try {
      const [reg, qr] = await Promise.all([getMyRegistration(), getMyQr()])
      registrationData.value = reg
      qrData.value = qr
    } catch (err) {
      registrationData.value = null
      qrData.value = null
    }

    isUserDataLoaded.value = true
  }

  const clearUserDataCache = () => {
    registrationData.value = null
    qrData.value = null
    profileData.value = null
    activitiesData.value = null
    isUserDataLoaded.value = false
  }

  return {
    registrationData,
    qrData,
    profileData,
    activitiesData,
    isUserDataLoaded,
    fetchUserData,
    clearUserDataCache,
  }
}
