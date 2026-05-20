import { computed } from 'vue'
import { useUserData } from './useUserData'

export function useAuth() {
  const { registrationData } = useUserData()

  const isRegistered = computed({
    get: () => !!registrationData.value,
    set: (val) => {
      if (!val) {
        registrationData.value = null
      }
    }
  })

  return {
    isRegistered,
  }
}
