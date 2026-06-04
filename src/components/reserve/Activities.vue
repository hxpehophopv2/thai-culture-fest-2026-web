<script setup>
// อย่าลืม import nextTick เข้ามาด้วยครับ เพื่อความชัวร์ว่า DOM เรนเดอร์เสร็จก่อน
import { computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { zones } from '@/data/zonesData.js'
import { useLocale } from '@/composables/useLocale'
import LangToggle from '../LangToggle.vue'
import '@/assets/styles/reserve.css'

import { Theater, Drama } from '@lucide/vue'
import { TShirt, MedicalFlask, Running, Store } from '@boxicons/vue'

// --- Import GSAP ---
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const route = useRoute()
const { t } = useLocale()

defineProps({
  hideOrbs: {
    type: Boolean,
    default: false,
  },
})

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

// --- GSAP Animations ---
let ctx
onMounted(async () => {
  await nextTick()

  ctx = gsap.context(() => {
    gsap.from('#reserve h3', {
      scrollTrigger: {
        trigger: '#reserve',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    })

    const cards = gsap.utils.toArray('.zone-card')

    gsap.from(cards, {
      scrollTrigger: {
        trigger: '#reserve',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        onLeaveBack: () => {
          cards.forEach((c) => c.classList.remove('hover-ready'))
        },
      },
      x: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: {
        each: 0.15,
        onComplete: function () {
          const el = this.targets()[0]
          gsap.set(el, { clearProps: 'transform' })
          el.classList.add('hover-ready')
        },
      },
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})

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
    <div class="bubbles-bg" v-if="!hideOrbs">
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

            <button
              v-if="zone.id === 'stage'"
              class="main-reserve-btn"
              @click="goToReserve($event, zone.id)"
            >
              {{ t(i18n.btnReserveNow) }}
            </button>

            <button
              v-else-if="zone.id === 'lab'"
              class="main-reserve-btn"
              @click.stop="goToZone(zone.id)"
            >
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
