<script setup>
import { useRouter } from 'vue-router'
import { zones } from '@/data/zonesData.js'
import { useLocale } from '@/composables/useLocale'

// Import ไอคอนทั้งหมดที่ต้องใช้
import { Theater, Drama } from '@lucide/vue'
import { TShirt, MedicalFlask, Running, Store } from '@boxicons/vue'

const router = useRouter()
const { t } = useLocale()

// สร้าง Object เพื่อจับคู่ String กับ Component จริง
const iconMap = {
  Theater,
  MedicalFlask,
  TShirt,
  Drama,
  Running,
  Store,
}

const goToZone = (zoneId) => {
  router.push({ name: 'zone-detail', params: { id: zoneId } })
}

const goToReserve = (event, zoneId) => {
  event.stopPropagation() // ไม่ให้ bubble ขึ้นไปที่การ์ด
  router.push({ name: 'zone-detail', params: { id: zoneId }, query: { modal: 'true' } })
}
</script>

<template>
  <main id="reserve">
    <h3>ACTIVITIES & RESERVATIONS</h3>

    <div
      v-for="zone in zones"
      :key="zone.id"
      class="zone-card"
      role="button"
      tabindex="0"
      @click="goToZone(zone.id)"
      @keydown.enter="goToZone(zone.id)"
    >
      <div class="card-header">
        <h4>
          <span><component :is="iconMap[zone.icon]" /></span>
          {{ t(zone.title) }}
        </h4>
        <img class="zone-img" :src="zone.image" alt="" />
      </div>
      <div class="card-footer">
        <p>{{ t(zone.description) }}</p>

        <template v-if="zone.requiresReservation">
          <button v-if="zone.id === 'lab'" @click.stop="goToZone(zone.id)">View Activities</button>
          <button v-else @click="goToReserve($event, zone.id)">Reserve Now</button>
        </template>

        <small v-else class="zone-status"> This zone does not require pre-registration </small>
      </div>
    </div>
  </main>
</template>
