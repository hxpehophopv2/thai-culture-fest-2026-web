<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import LangToggle from '@/components/LangToggle.vue'
import { useLocale } from '@/composables/useLocale'
import { Copy, Check, User, LogOut } from '@lucide/vue'
import { EditAlt } from '@boxicons/vue'
import { scanCheckin } from '@/services/staffService'

const emit = defineEmits({
  logout: () => true,
})

const { t } = useLocale()

const isCameraReady = ref(false)
const isProcessing = ref(false)
const showManualModal = ref(false)
const isDropdownOpen = ref(false)
const showLogoutModal = ref(false)
const manualCode = ref('')
const scanError = ref('')
const zoneCode = ref('')
const zoneName = ref('')
const staffName = ref('')
const isCopied = ref(false)

const showResultPopup = ref(false)
const scanResult = ref({
  type: 'success',
  title: '',
  message: '',
  detail: '',
})
let popupTimeout = null

onBeforeUnmount(() => {
  if (popupTimeout) clearTimeout(popupTimeout)
})

// QR Scanner config — explicitly set format for mobile compatibility
const qrFormats = ['qr_code']

// Prefer rear camera on mobile
const cameraConstraints = { facingMode: 'environment' }

onMounted(() => {
  zoneCode.value =
    localStorage.getItem('staff_booth_code') || localStorage.getItem('staff_zone') || 'UNKNOWN'
  staffName.value = localStorage.getItem('staff_fullname') || t(i18n.fallbackStaffName)
  zoneName.value = localStorage.getItem('staff_activity_name') || t(i18n.fallbackZoneName)
})

const i18n = {
  scanTitle: { 'th-TH': 'สแกน QR Code', 'en-US': 'Scan QR Code' },
  scanningFor: { 'th-TH': 'กำลังสแกนสำหรับ', 'en-US': 'SCANNING FOR' },
  manualBtn: { 'th-TH': 'กรอกรหัสเอง', 'en-US': 'Manual Entry' },
  modalTitle: { 'th-TH': 'กรอกรหัสผู้เข้าร่วม', 'en-US': 'Enter Participant Code' },
  modalPlc: { 'th-TH': 'เช่น A3K9F', 'en-US': 'e.g. A3K9F' },
  cancel: { 'th-TH': 'ยกเลิก', 'en-US': 'Cancel' },
  submit: { 'th-TH': 'เช็กอิน', 'en-US': 'Check In' },
  camError: { 'th-TH': 'ไม่สามารถเข้าถึงกล้องได้', 'en-US': 'Camera access denied' },
  logOut: { 'th-TH': 'ออกจากระบบ', 'en-US': 'Log Out' },
  logOutConfirmTitle: { 'th-TH': 'ยืนยันการออกจากระบบ?', 'en-US': 'Confirm Log Out?' },
  copiedToast: { 'th-TH': 'คัดลอกรหัสโซนแล้ว', 'en-US': 'Zone code copied!' },
  popupSuccess: { 'th-TH': 'สำเร็จ', 'en-US': 'Success' },
  popupCheckedIn: { 'th-TH': 'เช็คอินสำเร็จ', 'en-US': 'Checked In' },
  popupWarning: { 'th-TH': 'แจ้งเตือน', 'en-US': 'Warning' },
  popupRejected: { 'th-TH': 'ปฏิเสธ', 'en-US': 'Rejected' },
  popupError: { 'th-TH': 'เกิดข้อผิดพลาด', 'en-US': 'Error' },
  popupServerError: {
    'th-TH': 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้',
    'en-US': 'Unable to connect to the server',
  },
  detailCode: { 'th-TH': 'รหัส', 'en-US': 'Code' },
  fallbackStaffName: { 'th-TH': 'สตาฟ', 'en-US': 'Staff Member' },
  fallbackZoneName: { 'th-TH': 'ไม่ทราบโซน', 'en-US': 'Unknown Zone' },
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
  if (isProcessing.value) return
  if (detectedCodes && detectedCodes.length > 0) {
    const code = detectedCodes[0].rawValue
    console.log('Scanned Code:', code)
    isProcessing.value = true
    handleProcessCode(code)
  }
}

// IF ERROR
const onError = (err) => {
  scanError.value = err.message
  console.error('QR Scanner Error:', err)
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

// Helper to show popup
const showPopup = (type, title, message, detail = '') => {
  scanResult.value = { type, title, message, detail }
  showResultPopup.value = true

  // Auto-dismiss after 8 seconds (longer for readability)
  if (popupTimeout) clearTimeout(popupTimeout)
  popupTimeout = setTimeout(() => {
    showResultPopup.value = false
  }, 8000)
}

// WHAT TO DO WITH THE CODE
const handleProcessCode = async (code) => {
  try {
    const result = await scanCheckin(code)

    let type = 'success'
    let title = t(i18n.popupSuccess)

    if (['wrong_base', 'wrong_time', 'already_stamped', 'gate_already'].includes(result.result)) {
      type = 'warning'
      title = t(i18n.popupWarning)
    } else if (['no_booking', 'rejected', 'not_gate_checked_in'].includes(result.result)) {
      type = 'error'
      title = t(i18n.popupRejected)
    } else if (result.result === 'checked_in' || result.result === 'gate_checked_in') {
      type = 'success'
      title = t(i18n.popupCheckedIn)
    }

    const message = result.message || `Result: ${result.result}`

    let detailText = `${t(i18n.detailCode)}: ${code}`
    if (result.person) {
      const shortCodeStr = result.person.shortCode
        ? ` | ${t(i18n.detailCode)}: ${result.person.shortCode}`
        : ''
      detailText = `${result.person.name}${shortCodeStr}`
    }

    showPopup(type, title, message, detailText)
  } catch (err) {
    console.error('Scan API error:', err)
    showPopup(
      'error',
      t(i18n.popupError),
      err.message || t(i18n.popupServerError),
      `${t(i18n.detailCode)}: ${code}`,
    )
  } finally {
    // Allow next scan after 1.5 seconds
    setTimeout(() => {
      isProcessing.value = false
    }, 1500)
  }
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
      <qrcode-stream
        :formats="qrFormats"
        :constraints="cameraConstraints"
        @detect="onDetect"
        @error="onError"
        @camera-on="onCameraReady"
      >
        <div class="scan-overlay">
          <small class="scan-text">{{ t(i18n.scanningFor) }}</small>

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
            class="manual-input manual-input-code"
            maxlength="6"
            autocapitalize="characters"
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

    <!-- Modal Scan Result -->
    <Transition name="slide-up">
      <div v-if="showResultPopup" class="scan-result-popup" :class="`popup-${scanResult.type}`">
        <div class="result-icon">
          <Check v-if="scanResult.type === 'success'" :size="32" />
          <span v-else-if="scanResult.type === 'warning'" class="result-icon-text">!</span>
          <span v-else-if="scanResult.type === 'error'" class="result-icon-text">✕</span>
        </div>
        <div class="result-content">
          <h4>{{ scanResult.title }}</h4>
          <p>{{ scanResult.message }}</p>
          <small v-if="scanResult.detail">{{ scanResult.detail }}</small>
        </div>
        <button class="close-popup-btn" @click="showResultPopup = false" aria-label="Close">
          ✕
        </button>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
@import url('@/assets/styles/staffScanner.css');
</style>
