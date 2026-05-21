<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { zones } from '@/data/zonesData.js'
import { useLocale } from '@/composables/useLocale'
import LangToggle from '../LangToggle.vue'
import '@/assets/styles/reserve.css'

import { Theater, Drama } from '@lucide/vue'
import { TShirt, MedicalFlask, Running, Store } from '@boxicons/vue'

const router = useRouter()
const route = useRoute()
const { t } = useLocale()

const iconMap = {
  Theater,
  MedicalFlask,
  TShirt,
  Drama,
  Running,
  Store,
}

// --- i18n Dictionary ---
const i18n = {
  pageTitle: {
    'th-TH': 'กิจกรรมและการจองกิจกรรม',
    'en-US': 'ACTIVITIES & RESERVATIONS',
  },
  btnViewActivities: {
    'th-TH': 'ดูรายละเอียด',
    'en-US': 'View Details',
  },
  btnReserveNow: {
    'th-TH': 'จองกิจกรรม',
    'en-US': 'Reserve Now',
  },
  noReservation: {
    'th-TH': 'โซนนี้ไม่ต้องจองล่วงหน้า',
    'en-US': 'This zone does not require pre-reservation',
  },
}

const isMainActivitiesPage = () => route.path === '/activities'

const goToZone = (zoneId) => {
  router.push({ name: 'zone-detail', params: { id: zoneId } })
}

const goToReserve = (event, zoneId) => {
  event.stopPropagation()
  router.push({ name: 'zone-detail', params: { id: zoneId }, query: { modal: 'true' } })
}
</script>

<template>
  <main id="reserve-layout">
    <div class="bubbles-bg">
      <div class="orb"></div>
      <div class="orb"></div>
      <div class="orb"></div>
    </div>

    <nav class="hero-nav" v-if="isMainActivitiesPage()">
      <LangToggle theme="light" />
    </nav>
    <main id="reserve">
      <h3>{{ t(i18n.pageTitle) }}</h3>

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
          <div class="actual-card-footer">
            <small v-if="zone.id !== 'stage' && zone.id !== 'lab'" class="zone-status">
              {{ t(i18n.noReservation) }}
            </small>
            <small v-else class="zone-status"></small>

            <button v-if="zone.id === 'stage'" @click="goToReserve($event, zone.id)">
              {{ t(i18n.btnReserveNow) }}
            </button>

            <button v-else-if="zone.id === 'lab'" @click.stop="goToZone(zone.id)">
              {{ t(i18n.btnReserveNow) }}
            </button>

            <button v-else @click.stop="goToZone(zone.id)">
              {{ t(i18n.btnViewActivities) }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </main>
</template>
