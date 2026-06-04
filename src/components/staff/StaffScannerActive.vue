<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import LangToggle from '@/components/LangToggle.vue'
import { useLocale } from '@/composables/useLocale'
import { Copy, Check, User, LogOut } from '@lucide/vue'
import { EditAlt } from '@boxicons/vue'
import { scanCheckin, overrideScan, rejectScan } from '@/services/staffService'
import StaffNav from './StaffNav.vue'

const emit = defineEmits({
  logout: () => true,
  'tab-change': (tab) => typeof tab === 'string',
})

const { t } = useLocale()

const isCameraReady = ref(false)
const isProcessing = ref(false)
const isActionProcessing = ref(false)
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
  scanLogId: null,
  canOverride: false
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
  scanningFor: { 'th-TH': 'กำลังสแกนสำหรับ', 'en-US': 'SCANNING FOR' },
  scanProcessing: { 'th-TH': 'กำลังประมวลผล...', 'en-US': 'PROCESSING' },
  manualBtn: { 'th-TH': 'กรอกรหัสเอง', 'en-US': 'Manual Entry' },
  modalTitle: { 'th-TH': 'กรอกรหัสผู้เข้าร่วม', 'en-US': 'Enter Participant Code' },
  modalPlc: { 'th-TH': 'เช่น A3K9F', 'en-US': 'e.g. A3K9F' },
  cancel: { 'th-TH': 'ยกเลิก', 'en-US': 'Cancel' },
  submit: { 'th-TH': 'เช็กอิน', 'en-US': 'Check In' },
  camError: { 'th-TH': 'ไม่สามารถเข้าถึงกล้องได้', 'en-US': 'Camera access denied' },
  logOut: { 'th-TH': 'ออกจากระบบ', 'en-US': 'Log Out' },
  logOutConfirmTitle: { 'th-TH': 'ยืนยันการออกจากระบบ?', 'en-US': 'Confirm Log Out?' },
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
  btnApprove: { 'th-TH': 'อนุมัติพิเศษ', 'en-US': 'Approve' },
  btnReject: { 'th-TH': 'ปฏิเสธ', 'en-US': 'Reject' },
  processing: { 'th-TH': 'กำลังบันทึก...', 'en-US': 'Saving...' },
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

const showPopup = (type, title, message, detail = '', scanLogId = null, canOverride = false) => {
  scanResult.value = { type, title, message, detail, scanLogId, canOverride }
  showResultPopup.value = true

  if (popupTimeout) clearTimeout(popupTimeout)
  if (!canOverride) {
    popupTimeout = setTimeout(() => {
      showResultPopup.value = false
    }, 5000)
  }
}

const onToastClick = () => {
  if (!scanResult.value.canOverride) {
    showResultPopup.value = false
  }
}

const handleOverride = async (scanLogId) => {
  if (!scanLogId || isActionProcessing.value) return
  isActionProcessing.value = true
  try {
    const res = await overrideScan(scanLogId)
    showPopup('success', t(i18n.popupCheckedIn), res.message || 'อนุมัติพิเศษเรียบร้อย', scanResult.value.detail, null, false)
  } catch (err) {
    console.error('Override error:', err)
    showPopup('error', t(i18n.popupError), err.message || 'อนุมัติล้มเหลว', scanResult.value.detail, null, false)
  } finally {
    isActionProcessing.value = false
  }
}

const handleReject = async (scanLogId) => {
  if (!scanLogId || isActionProcessing.value) return
  isActionProcessing.value = true
  try {
    const res = await rejectScan(scanLogId)
    showPopup('error', t(i18n.popupRejected), res.message || 'ปฏิเสธเช็คอินเรียบร้อย', scanResult.value.detail, null, false)
  } catch (err) {
    console.error('Reject error:', err)
    showPopup('error', t(i18n.popupError), err.message || 'ปฏิเสธล้มเหลว', scanResult.value.detail, null, false)
  } finally {
    isActionProcessing.value = false
  }
}

// WHAT TO DO WITH THE CODE
const handleProcessCode = async (code) => {
  try {
    const result = await scanCheckin(code)

    let type = 'success'
    let title = t(i18n.popupSuccess)
    let canOverride = false

    if (['wrong_base', 'wrong_time', 'no_booking'].includes(result.result)) {
      type = 'warning'
      title = t(i18n.popupWarning)
      canOverride = true
    } else if (['already_stamped', 'gate_already'].includes(result.result)) {
      type = 'warning'
      title = t(i18n.popupWarning)
    } else if (['rejected', 'not_gate_checked_in'].includes(result.result)) {
      type = 'error'
      title = t(i18n.popupRejected)
    } else if (result.result === 'checked_in' || result.result === 'gate_checked_in') {
      type = 'success'
      title = t(i18n.popupCheckedIn)
    }

    const message = result.message || `Result: ${result.result}`

    let detailText = `${t(i18n.detailCode)}: ${code}`
    if (result.person) {
      const shortCodeStr = result.person.shortCode ? ` (${result.person.shortCode})` : ''
      detailText = `${result.person.name}${shortCodeStr}`
    }

    showPopup(type, title, message, detailText, result.scanLogId, canOverride)
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
      <StaffNav current-tab="scanner" @tab-change="$emit('tab-change', $event)" />
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
              <button class="staff-zone-badge" @click="copyZoneCode">
                <strong>{{ zoneName }}</strong>
                <div class="dropdown-copy-btn">
                  <span class="dropdown-copy-code">{{ zoneCode }}</span>
                  <Copy v-if="!isCopied" :size="16" />
                  <Check v-else :size="16" />
                </div>
              </button>
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

          <div class="zone-badge">
            <span class="z-name">{{ zoneName }}</span>
          </div>

          <div class="scan-frame">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>

          <button class="fab-manual" @click="showManualModal = true">
            <EditAlt pack="filled" />
            {{ t(i18n.manualBtn) }}
          </button>
        </div>
      </qrcode-stream>

      <div v-if="scanError" class="cam-error-msg">
        <p>{{ t(i18n.camError) }}</p>
        <small>{{ scanError }}</small>
      </div>
    </div>

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

    <Transition name="toast-pop">
      <div
        v-if="showResultPopup"
        :key="scanResult.title + scanResult.detail"
        class="scan-toast"
        :class="`toast-${scanResult.type}`"
        @click="onToastClick"
      >
        <div class="toast-accent"></div>
        <div class="toast-body">
          <span class="toast-title">{{ scanResult.title }}</span>
          <span class="toast-msg">{{ scanResult.message }}</span>
          <span v-if="scanResult.detail" class="toast-detail">{{ scanResult.detail }}</span>

          <!-- Actions for Override -->
          <div v-if="scanResult.canOverride" class="toast-actions" @click.stop>
            <button class="toast-btn-approve" @click="handleOverride(scanResult.scanLogId)" :disabled="isActionProcessing">
              {{ isActionProcessing ? t(i18n.processing) : t(i18n.btnApprove) }}
            </button>
            <button class="toast-btn-reject" @click="handleReject(scanResult.scanLogId)" :disabled="isActionProcessing">
              {{ t(i18n.btnReject) }}
            </button>
          </div>
        </div>
        <button class="toast-close-btn" @click.stop="showResultPopup = false" aria-label="Close">✕</button>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
@import url('@/assets/styles/staffScanner.css');

.toast-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  width: 100%;
}

.toast-btn-approve {
  background: #10b981;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s, transform 0.1s;
}

.toast-btn-approve:hover {
  opacity: 0.9;
}

.toast-btn-approve:active {
  transform: scale(0.96);
}

.toast-btn-reject {
  background: rgba(0, 0, 0, 0.05);
  color: var(--clr-700);
  border: 1px solid var(--clr-300);
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  box-shadow: none;
}

.toast-btn-reject:hover {
  background: rgba(0, 0, 0, 0.1);
}

.toast-btn-reject:active {
  transform: scale(0.96);
}

.toast-close-btn {
  background: transparent;
  border: none;
  color: var(--clr-500);
  font-size: 1.1rem;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: grid;
  place-items: center;
  margin: auto 8px auto 0;
  border-radius: 50%;
  transition: background 0.2s;
  box-shadow: none;
}

.toast-close-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.toast-btn-approve:disabled,
.toast-btn-reject:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

nav {
  justify-content: space-between !important;
  align-items: center !important;
}
</style>
