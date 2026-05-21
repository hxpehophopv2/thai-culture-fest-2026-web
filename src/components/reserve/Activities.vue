<script setup>
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
            <button v-if="zone.id === 'lab'" @click.stop="goToZone(zone.id)">
              View Activities
            </button>
            <button v-else @click="goToReserve($event, zone.id)">Reserve Now</button>
          </template>

          <small v-else class="zone-status"> This zone does not require pre-reservation </small>
        </div>
      </div>
    </main>
  </main>
</template>
