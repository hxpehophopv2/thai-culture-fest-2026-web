import { ref } from 'vue'

const isRegistered = ref(false)

export function useAuth() {
  return {
    isRegistered,
  }
}
