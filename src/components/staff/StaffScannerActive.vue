<script setup>
import { ref, onMounted } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import LangToggle from '@/components/LangToggle.vue'
import { useLocale } from '@/composables/useLocale'
import { Copy, Check, User, LogOut } from '@lucide/vue'
import { EditAlt } from '@boxicons/vue'

const emit = defineEmits(['logout'])

const { t } = useLocale()

// States
const isCameraReady = ref(false)
const showManualModal = ref(false)
const isDropdownOpen = ref(false)
const showLogoutModal = ref(false)
const manualCode = ref('')
const scanError = ref('')
const zoneCode = ref('')
const zoneName = ref('Loading...')
const staffName = ref('Loading...')
const isCopied = ref(false)

onMounted(() => {
  const codeFromStorage = localStorage.getItem('staff_zone') || 'UNKNOWN'
  const nameFromStorage = localStorage.getItem('staff_fullname') || 'Staff Member'

  zoneCode.value = codeFromStorage
  staffName.value = nameFromStorage

  // TODO: fetch (req) actual zone name from leaf's backend instead of using the zone's code
  // TEMPORARY ZONE NAME API
  zoneName.value = 'Khon Zone'
})

const i18n = {
  scanTitle: { 'th-TH': 'สแกน QR Code', 'en-US': 'Scan QR Code' },
  manualBtn: { 'th-TH': 'กรอกรหัสเอง', 'en-US': 'Manual Entry' },
  modalTitle: { 'th-TH': 'กรอกรหัสผู้เข้าร่วม', 'en-US': 'Enter Participant Code' },
  modalPlc: { 'th-TH': 'เช่น 67', 'en-US': 'e.g. 67' },
  cancel: { 'th-TH': 'ยกเลิก', 'en-US': 'Cancel' },
  submit: { 'th-TH': 'เช็กอิน', 'en-US': 'Check In' },
  camError: { 'th-TH': 'ไม่สามารถเข้าถึงกล้องได้', 'en-US': 'Camera access denied' },
  logOut: { 'th-TH': 'ออกจากระบบ', 'en-US': 'Log Out' },
  logOutConfirmTitle: { 'th-TH': 'ยืนยันการออกจากระบบ?', 'en-US': 'Confirm Log Out?' },
  copiedToast: { 'th-TH': 'คัดลอกรหัสโซนแล้ว', 'en-US': 'Zone code copied!' },
}

// LOGOUT TRIGGER
const triggerLogout = () => {
  isDropdownOpen.value = false
  showLogoutModal.value = true
}

// LOGOUT CONFIRM
const confirmLogOut = () => {
  showLogoutModal.value = false
  emit('logout')
}

// COPY LOGIC
const copyZoneCode = async () => {
  try {
    await navigator.clipboard.writeText(zoneCode.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000) // 2s
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

// DETECT CODE
const onDetect = (detectedCodes) => {
  if (detectedCodes && detectedCodes.length > 0) {
    const code = detectedCodes[0].rawValue
    console.log('Scanned Code:', code)
    handleProcessCode(code)
  }
}

// IF ERROR
const onError = (err) => {
  scanError.value = err.message
  console.error(err)
}

const onCameraReady = () => {
  isCameraReady.value = true
}

const submitManualCode = () => {
  if (!manualCode.value.trim()) return

  console.log('Manual Code:', manualCode.value)
  handleProcessCode(manualCode.value)

  showManualModal.value = false
  manualCode.value = ''
}

// WHAT TO DO WITH THE CODE
const handleProcessCode = (code) => {
  alert(`Code received: ${code}\nCalling leaf's API now... (Zone: ${zoneCode.value})`)
}
</script>

<template>
  <section id="scanner-view">
    <Transition name="fade">
      <div
        v-if="isDropdownOpen"
        class="dropdown-overlay-close"
        @click="isDropdownOpen = false"
      ></div>
    </Transition>
    <nav>
      <LangToggle theme="light" />
      <div class="user-menu-wrapper">
        <button
          class="user-avatar-btn"
          @click="isDropdownOpen = !isDropdownOpen"
          aria-label="User Profile"
        >
          <User :size="20" />
        </button>

        <!-- Dropdown Menu -->
        <Transition name="dropdown-slide">
          <div v-if="isDropdownOpen" class="profile-dropdown">
            <div class="dropdown-header">
              <p class="staff-name">{{ staffName }}</p>
              <div class="staff-zone-badge">
                <strong>{{ zoneName }} ({{ zoneCode }})</strong>
              </div>
            </div>

            <div class="dropdown-divider"></div>

            <button class="dropdown-logout-btn" @click="triggerLogout">
              <LogOut :size="16" />
              {{ t(i18n.logOut) }}
            </button>
          </div>
        </Transition>
      </div>
    </nav>

    <!-- Camera Section -->
    <div class="camera-container">
      <qrcode-stream @detect="onDetect" @error="onError" @camera-on="onCameraReady">
        <div class="scan-overlay">
          <small class="scan-text">SCANNING FOR</small>

          <!-- Zone Badge -->
          <div class="zone-badge">
            <span class="z-name">{{ zoneName }}</span>
            <div class="z-divider"></div>
            <button class="z-code-btn" @click="copyZoneCode" title="Copy Zone Code">
              <span>{{ zoneCode }}</span>
              <Copy v-if="!isCopied" :size="16" remove-padding />
              <Check v-else :size="16" remove-padding />
            </button>
          </div>

          <div class="scan-frame">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>
        </div>
      </qrcode-stream>

      <!-- Error if !Permission -->
      <div v-if="scanError" class="cam-error-msg">
        <p>{{ t(i18n.camError) }}</p>
        <small>{{ scanError }}</small>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast-slide">
      <div v-if="isCopied" class="copy-toast">
        {{ t(i18n.copiedToast) }}
      </div>
    </Transition>

    <!-- Manual Entry -->
    <button class="fab-manual" @click="showManualModal = true">
      <EditAlt pack="filled" />
      {{ t(i18n.manualBtn) }}
    </button>

    <!-- Modal Manual Entry -->
    <Transition name="fade">
      <div v-if="showManualModal" class="modal-backdrop" @click.self="showManualModal = false">
        <div class="modal-container">
          <h6>{{ t(i18n.modalTitle) }}</h6>
          <input
            v-model="manualCode"
            type="text"
            :placeholder="t(i18n.modalPlc)"
            class="manual-input"
            @keyup.enter="submitManualCode"
          />
          <div class="modal-actions">
            <button class="cancel" @click="showManualModal = false">
              {{ t(i18n.cancel) }}
            </button>
            <button class="primary" @click="submitManualCode">
              {{ t(i18n.submit) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Confirm Logout -->
    <Transition name="fade">
      <div v-if="showLogoutModal" class="modal-backdrop" @click.self="showLogoutModal = false">
        <div class="confirm-container">
          <h5>{{ t(i18n.logOutConfirmTitle) }}</h5>
          <div class="confirm-btn-container">
            <button class="discard" @click="confirmLogOut">
              {{ t(i18n.logOut) }}
            </button>
            <button class="secondary" @click="showLogoutModal = false">
              {{ t(i18n.cancel) }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
@import url('@/assets/styles/staffScanner.css');
</style>
