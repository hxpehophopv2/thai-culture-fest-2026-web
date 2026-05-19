<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { zones } from '@/data/zonesData.js'
import { useLocale } from '@/composables/useLocale'
import { getMyRegistration } from '@/services/registrationService' // อิมพอร์ตตัวเช็คสถานะลงทะเบียนมาใช้งาน

import LabZoneContent from '@/components/reserve/LabZone.vue'
import StageZoneContent from '@/components/reserve/StageZone.vue'

const route = useRoute()
const router = useRouter()
const { t } = useLocale()

const zone = computed(() => zones.find((z) => z.id === route.params.id))
const showModal = ref(false)
const showAuthModal = ref(false) // สถานะโมดอลแจ้งเตือน (ยังไม่ได้ลงทะเบียน)
const isUserRegistered = ref(false) // สถานะเช็คว่าลงทะเบียนหรือยัง
const selectedActivity = ref('') // เก็บค่าเป็นรหัสแทน เช่น 'LAB1', 'STG'
const selectedSlot = ref(null)

const contentMap = {
  lab: LabZoneContent,
  stage: StageZoneContent,
}

const activityNames = {
  LAB1: 'กิจกรรมเวิร์กช็อปร้อยพวงมาลัยไทย',
  LAB2: 'กิจกรรมเวิร์กช็อปพวงมโหตร',
  LAB3: 'กิจกรรมเวิร์กช็อปพัดสานไม้ไผ่ไทย',
  LAB4: 'กิจกรรมเวิร์กช็อปประดิษฐ์เครื่องประดับนาฏศิลป์ไทย',
  LAB5: 'กิจกรรมการเขียนสี - เขียนหน้าหัวโขน',
  STG: 'กิจกรรมเสวนาและการแสดง (STAGE ZONE)',
}

const schedulesData = {
  LAB1: [
    { id: 'LAB1-1', time: '09.00 - 10.30 น.', capacity: 8, booked: 0 },
    { id: 'LAB1-2', time: '10.30 - 12.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB1-3', time: '13.00 - 14.30 น.', capacity: 8, booked: 0 },
    { id: 'LAB1-4', time: '14.30 - 16.00 น.', capacity: 8, booked: 0 },
  ],
  LAB2: [
    { id: 'LAB2-1', time: '09.00 - 10.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB2-2', time: '10.00 - 11.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB2-3', time: '11.00 - 12.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB2-4', time: '13.00 - 14.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB2-5', time: '14.00 - 15.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB2-6', time: '15.00 - 16.00 น.', capacity: 8, booked: 0 },
  ],
  LAB3: [
    { id: 'LAB3-1', time: '09.00 - 10.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB3-2', time: '10.00 - 11.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB3-3', time: '11.00 - 12.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB3-4', time: '13.00 - 14.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB3-5', time: '14.00 - 15.00 น.', capacity: 8, booked: 0 },
    { id: 'LAB3-6', time: '15.00 - 16.00 น.', capacity: 8, booked: 0 },
  ],
  LAB4: [
    { id: 'LAB4-1', time: '09.00 - 12.00 น.', capacity: 10, booked: 0 },
    { id: 'LAB4-2', time: '13.00 - 16.00 น.', capacity: 10, booked: 0 },
  ],
  LAB5: [
    { id: 'LAB5-1', time: '10.00 - 12.00 น.', capacity: 10, booked: 0 },
    { id: 'LAB5-2', time: '13.00 - 15.00 น.', capacity: 10, booked: 0 },
  ],
  STG: [{ id: 'STG', time: '14.00 - 15.30 น.', capacity: 50, booked: 0 }],
}

const availableSlots = computed(() => schedulesData[selectedActivity.value] || [])

const openReserve = (activityKey) => {
  // 🎯 จุดสกัดกั้นหลัก: ถ้าตรวจสอบแล้วว่ายังไม่ได้ลงทะเบียนงาน ให้เปิดโมดอลแจ้งเตือนลงทะเบียนแทนทันที
  if (!isUserRegistered.value) {
    showAuthModal.value = true
    return
  }
  selectedActivity.value = activityKey || ''
  selectedSlot.value = null
  showModal.value = true
}

const confirmReservation = () => {
  if (!selectedSlot.value) return
  alert(
    `ยืนยันการจอง: ${activityNames[selectedActivity.value]}\nรหัสรอบ: ${selectedSlot.value.id}\nรอบเวลา: ${selectedSlot.value.time}`,
  )
  showModal.value = false
}

onMounted(async () => {
  // ตรวจสอบข้อมูลการลงทะเบียนของ User ทันทีที่เข้าหน้านี้
  try {
    await getMyRegistration()
    isUserRegistered.value = true
  } catch (err) {
    isUserRegistered.value = false // หากยิงไม่ผ่าน (เช่น ได้ 404) แปลว่ายังไม่เคยลงทะเบียน
  }

  if (route.query.modal === 'true') {
    router.replace({ params: route.params })
    setTimeout(() => {
      const defaultKey = route.params.id === 'stage' ? 'STG' : ''
      openReserve(defaultKey)
    }, 350)
  }
})

const goBack = () => router.push({ name: 'activities' })
</script>

<template>
  <div class="zone-detail-wrapper">
    <main v-if="zone" id="zone-detail">
      <button class="back-btn" @click="goBack">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back
      </button>

      <img :src="zone.image" alt="" class="detail-img" />
      <div class="detail-content">
        <h3>{{ t(zone.title) }}</h3>

        <component
          v-if="contentMap[zone.id]"
          :is="contentMap[zone.id]"
          @open-reserve="openReserve"
        />
        <p v-else>{{ t(zone.description) }}</p>
      </div>
    </main>

    <Transition name="fade">
      <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h5>
              {{
                selectedActivity
                  ? activityNames[selectedActivity]
                  : 'จองที่นั่ง — ' + (zone ? t(zone.title) : '')
              }}
            </h5>
            <button class="close-btn" @click="showModal = false">✕</button>
          </div>

          <div class="modal-body">
            <p class="instruction">เลือกรอบเวลาที่ต้องการจอง:</p>

            <div class="slot-grid">
              <button
                v-for="slot in availableSlots"
                :key="slot.id"
                class="slot-btn"
                :class="{ selected: selectedSlot?.id === slot.id }"
                :disabled="slot.capacity - slot.booked <= 0"
                @click="selectedSlot = slot"
              >
                <span class="time">{{ slot.time }}</span>
                <span class="capacity" :class="{ full: slot.capacity - slot.booked <= 0 }">
                  {{
                    slot.capacity - slot.booked > 0
                      ? `เหลือ ${slot.capacity - slot.booked} ที่นั่ง`
                      : 'เต็มแล้ว'
                  }}
                </span>
              </button>
            </div>

            <ul class="booking-rules">
              <li>* ระบบจะไม่อนุญาตให้จองในเวลาที่ซ้อนทับกับกิจกรรมอื่น</li>
              <li>* สามารถเปลี่ยนแปลงหรือยกเลิกรอบได้ล่วงหน้า 1 วันก่อนวันงาน</li>
            </ul>
          </div>

          <div class="modal-actions">
            <button class="secondary" @click="showModal = false">ยกเลิก</button>
            <button class="primary" :disabled="!selectedSlot" @click="confirmReservation">
              ยืนยันการจอง
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showAuthModal" class="modal-backdrop" @click.self="showAuthModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h5 class="error-title">ยังไม่ได้ลงทะเบียนเข้าร่วมงาน</h5>
            <button class="close-btn" @click="showAuthModal = false">✕</button>
          </div>

          <div class="modal-body">
            <p style="color: var(--clr-700, #475569); line-height: 1.5">
              ขออภัยด้วยครับ คุณจำเป็นต้องลงทะเบียนเข้าร่วมงานหลักก่อน
              จึงจะสามารถใช้สิทธิ์การจองที่นั่งหรือรอบเวลาในกิจกรรมต่างๆ ได้ครับ
            </p>
          </div>

          <div class="modal-actions">
            <button class="secondary" @click="showAuthModal = false">ยกเลิก</button>
            <button class="primary register-btn" @click="router.push('/register')">
              ลงทะเบียนตอนนี้
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.zone-detail-wrapper {
  padding: 0 var(--sp-l) var(--sp-xl);
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
}

#zone-detail {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--sp-m);
  padding: var(--sp-m);
  color: white;
  -webkit-box-shadow: 0 8px 16px 0 rgba(24, 42, 125, 0.2);
  box-shadow: 0 8px 16px 0 rgba(24, 42, 125, 0.2);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.detail-img {
  width: 100%;
  border-radius: var(--sp-s);
  margin-bottom: var(--sp-m);
}
.detail-content {
  padding: 0 var(--sp-s);
}
.detail-content h3 {
  margin-bottom: var(--sp-s);
  color: var(--clr-100);
}
.detail-content p {
  color: var(--clr-200);
  line-height: 1.6;
}

.back-btn {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  color: white;
  margin-bottom: var(--sp-m);
  font-size: 0.95rem;
  padding: var(--sp-xs) var(--sp-m) var(--sp-xs) var(--sp-s);
  border-radius: 100px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ---------- MODAL & SLOTS ---------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-box {
  background: white;
  color: #111;
  border-radius: var(--sp-m);
  padding: var(--sp-l);
  width: min(90%, 450px);
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--sp-m);
}

.modal-header h5 {
  font-size: 1.1rem;
  color: var(--clr-pri-500);
  margin: 0;
  line-height: 1.4;
}

/* ตั้งค่าหัวข้อ Warning แจ้งเตือนสีแดง */
.modal-header h5.error-title {
  color: var(--clr-sem-err, #e53935);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--clr-500);
  padding: 0;
}

.instruction {
  font-weight: bold;
  margin-bottom: var(--sp-s);
}
.slot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--sp-s);
  margin-bottom: var(--sp-m);
}

.slot-btn {
  background: var(--clr-100);
  border: 2px solid var(--clr-200);
  border-radius: var(--sp-s);
  padding: var(--sp-s);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.slot-btn:hover:not(:disabled) {
  border-color: var(--clr-pri-500);
}
.slot-btn.selected {
  background: #eef2ff;
  border-color: var(--clr-pri-500);
  box-shadow: 0 0 0 1px var(--clr-pri-500);
}

.slot-btn:disabled {
  background: var(--clr-200);
  opacity: 0.6;
  cursor: not-allowed;
}
.slot-btn .time {
  font-weight: bold;
  color: var(--clr-900);
}
.slot-btn .capacity {
  font-size: 0.8rem;
  color: #4caf50;
}
.slot-btn .capacity.full {
  color: var(--clr-sem-err);
}

.booking-rules {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  color: var(--clr-sem-err);
  background: rgba(229, 57, 53, 0.05);
  padding: var(--sp-s);
  border-radius: var(--sp-s);
}
.booking-rules li {
  margin-bottom: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-s);
  margin-top: var(--sp-s);
}
.modal-actions button {
  padding: var(--sp-s) var(--sp-m);
  border-radius: var(--sp-s);
  font-weight: bold;
  border: none;
  cursor: pointer;
}
.modal-actions button.secondary {
  background: var(--clr-200);
  color: var(--clr-900);
}

.modal-actions button.primary {
  background: var(--clr-pri-500);
  color: white;
  transition: 0.2s;
}
.modal-actions button.primary:disabled {
  background: var(--clr-300);
  cursor: not-allowed;
}

/* ปุ่มสีแจ้งเตือนสำหรับลงทะเบียนเด่นขึ้นมา */
.modal-actions button.register-btn {
  background: var(--clr-sem-err, #e53935);
}
.modal-actions button.register-btn:hover {
  background: #c62828;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
