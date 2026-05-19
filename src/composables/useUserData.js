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
      Promise.all([getMyRegistration(), getMyQr(), getActivities()])
        .then(([reg, qr, acts]) => {
          registrationData.value = reg
          qrData.value = qr
          activitiesData.value = acts
        })
        .catch((err) => console.error('Background refresh failed', err))
      return
    }

    profileData.value = getLineProfile()
    const [reg, qr, acts] = await Promise.all([
      getMyRegistration(),
      getMyQr(),
      getActivities()
    ])
    registrationData.value = reg
    qrData.value = qr
    activitiesData.value = acts
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
