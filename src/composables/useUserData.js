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
    // DEV MODE TOGGLE HERE (DO NOT DELETE)
    const DEV_MODE_BYPASS = false

    if (DEV_MODE_BYPASS) {
      isUserDataLoaded.value = true
      profileData.value = {
        displayName: 'Hope (Dev Bypass)',
        pictureUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
      }
      qrData.value = {
        dataUrl:
          'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
      }
      registrationData.value = {
        firstName: 'Hope',
        lastName: 'Dev Mode',
        shortCode: 'KMUTT-DEV',
        checkIns: ['IDY', 'PLY'],
        bookings: [
          // COMMENT THE FOLLOWING OBJECT TO SEE THE RUNNING BORDER
          // {
          //   session: {
          //     id: 'mock-session-1',
          //     startTime: '2026-06-07T14:00:00',
          //     endTime: '2026-06-07T15:30:00',
          //     activity: {
          //       sortOrder: 6,
          //       nameTh: 'กิจกรรมเสวนา (STAGE ZONE)',
          //       nameEn: 'ROOTED Talks',
          //     },
          //   },
          //   isAttended: false,
          // },
        ],
      }
      return
    }

    // PRODUCTION CODE
    if (isUserDataLoaded.value && !force) {
      getActivities()
        .then((acts) => (activitiesData.value = acts))
        .catch(console.error)
      getMyRegistration()
        .then((reg) => (registrationData.value = reg))
        .catch(console.error)
      getMyQr()
        .then((qr) => (qrData.value = qr))
        .catch(console.error)
      return
    }

    profileData.value = getLineProfile()

    try {
      activitiesData.value = await getActivities()
    } catch (err) {
      console.error('Failed to fetch activities', err)
    }

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
