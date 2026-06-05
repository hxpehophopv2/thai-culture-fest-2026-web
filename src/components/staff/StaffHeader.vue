<script setup>
import { ref } from 'vue'
import { Copy, Check, User, LogOut } from '@lucide/vue'
import LangToggle from '@/components/LangToggle.vue'
import { useLocale } from '@/composables/useLocale'

const props = defineProps({
  staffName: {
    type: String,
    required: true,
  },
  zoneName: {
    type: String,
    required: true,
  },
  zoneCode: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['logout'])

const { t } = useLocale()

const isDropdownOpen = ref(false)
const isCopied = ref(false)
const showLogoutModal = ref(false)

const i18n = {
  logOutConfirmTitle: {
    'th-TH': 'ต้องการออกจากระบบหรือไม่?',
    'en-US': 'Are you sure you want to log out?',
  },
  logOut: { 'th-TH': 'ออกจากระบบ', 'en-US': 'Log Out' },
  cancel: { 'th-TH': 'ยกเลิก', 'en-US': 'Cancel' },
  copiedText: { 'th-TH': 'คัดลอกรหัสโซนแล้ว!', 'en-US': 'Zone code copied!' },
}

const copyZoneCode = async () => {
  try {
    await navigator.clipboard.writeText(props.zoneCode)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

const triggerLogout = () => {
  isDropdownOpen.value = false
  showLogoutModal.value = true
}

const confirmLogOut = () => {
  showLogoutModal.value = false
  emit('logout')
}
</script>

<template>
  <div class="staff-header-wrapper">
    <!-- Dropdown Backdrop Overlay -->
    <Transition name="fade">
      <div
        v-if="isDropdownOpen"
        class="dropdown-overlay-close"
        @click="isDropdownOpen = false"
      ></div>
    </Transition>

    <!-- Top Navigation -->
    <nav class="staff-header-nav">
      <LangToggle theme="light" />
      <div class="user-menu-wrapper">
        <button
          class="user-avatar-btn"
          :class="{ 'active-avatar': isDropdownOpen }"
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

    <!-- Logout Confirmation Modal -->
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

    <!-- Copy Notification Toast -->
    <Transition name="toast-slide">
      <div v-if="isCopied" class="copy-toast">
        {{ t(i18n.copiedText) }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.staff-header-wrapper {
  position: relative;
  z-index: 100000;
}

.staff-header-nav {
  z-index: 99999;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--sp-m);
  background: transparent;
  padding: var(--sp-xl) var(--sp-l) var(--sp-l);
  pointer-events: none;
}

.staff-header-nav > * {
  pointer-events: auto;
}

/* User Menu */
.user-menu-wrapper {
  position: relative;
}

.user-avatar-btn {
  display: grid;
  place-items: center;
  background: transparent;
  color: var(--clr-100);
  padding: var(--sp-s);
  border: 1px solid var(--clr-100);
  border-radius: 50%;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  box-shadow: var(--sd-2);
}

.user-avatar-btn:hover,
.user-avatar-btn.active-avatar {
  background: var(--clr-110);
  transform: scale(1.05);
}

.dropdown-overlay-close {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 99998;
}

/* Dropdown Menu */
.profile-dropdown {
  position: absolute;
  top: calc(100% + var(--sp-s));
  right: 0;
  background: var(--clr-100);
  width: max-content;
  min-width: 180px;
  max-width: 70vw;
  border-radius: var(--sp-s);
  box-shadow: var(--sd-5);
  z-index: 100000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dropdown-header {
  padding: var(--sp-m);
  text-align: left;
}

.staff-name {
  color: var(--clr-900);
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: var(--sp-s);
}

.staff-zone-badge {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sp-s);
  background: var(--clr-200);
  color: var(--clr-700);
  padding: var(--sp-xs) var(--sp-s);
  border-radius: var(--sp-xs);
  font-size: 0.8rem;
  border: none;
  box-shadow: none;
  cursor: pointer;
}

.staff-zone-badge strong {
  font-size: var(--fs-p1);
  color: var(--clr-900);
  text-align: left;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--clr-200);
  width: 100%;
}

.dropdown-logout-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-xs);
  width: 100%;
  padding: var(--sp-m);
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
  color: var(--clr-sem-err);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
}

.dropdown-copy-btn {
  display: flex;
  gap: var(--sp-s);
  align-items: center;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 0;
  color: var(--clr-700);
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: none;
}

.dropdown-copy-code {
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 0.05em;
  color: var(--clr-700);
}

/* Dropdown Animation */
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}
.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Modal (Logout Confirm) */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 999999;
}

.confirm-container {
  width: 80vw;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--sp-m);
  background: var(--clr-100);
  border-radius: var(--sp-m);
  padding: var(--sp-xl) var(--sp-l) var(--sp-l);
  box-shadow: var(--sd-5);
}

.confirm-container h5 {
  text-align: center;
  margin-bottom: var(--sp-xs);
  color: var(--clr-900);
  font-weight: 700;
  font-size: 1.1rem;
}

.confirm-btn-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sp-s);
}

.confirm-btn-container button {
  padding: var(--sp-m);
  border-radius: var(--sp-s);
  font-weight: bold;
  cursor: pointer;
  border: none;
  display: grid;
  place-items: center;
  width: 100%;
}

.confirm-btn-container button.secondary {
  background: var(--clr-200);
  color: var(--clr-900);
}

.confirm-btn-container button.discard {
  background: var(--clr-sem-err);
  color: var(--clr-100);
}

.confirm-btn-container button.discard:hover {
  background: var(--clr-sem-err-700);
}

/* Copy Toast */
.copy-toast {
  position: fixed;
  top: var(--sp-xl);
  left: 50%;
  transform: translateX(-50%);
  background: var(--clr-800);
  color: var(--clr-100);
  padding: var(--sp-s) var(--sp-l);
  border-radius: var(--sp-s);
  font-size: 0.85rem;
  font-weight: 500;
  z-index: 999999;
  box-shadow: var(--sd-4);
  pointer-events: none;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
