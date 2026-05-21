<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowDown, ArrowUp, MapPin, Calendar, Map } from '@lucide/vue'
import { useAuth } from '@/composables/useAuth'
import { useLocale } from '@/composables/useLocale' // นำเข้า useLocale

import posterHero from '@/assets/images/posterHero.png'
import Activities from '@/components/reserve/Activities.vue'
import LangToggle from '../LangToggle.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'

const router = useRouter()
const { isRegistered } = useAuth()
const { t } = useLocale() // ใช้งานตัวแปลภาษา

const hasScrolled = ref(false)
const showBackToTop = ref(false)

// ปรับปรุงฟังก์ชันหลักให้ทำงานแบบ Dynamic ทันที
const handleCtaAction = () => {
  if (isRegistered.value) {
    router.push('/activities') // ถ้าลงทะเบียนแล้ว -> ส่งไปหน้าเลือกกิจกรรม
  } else {
    router.push('/register') // ถ้ายังไม่ลงทะเบียน -> ส่งไปหน้าฟอร์มลงทะเบียนงาน
  }
}

const handleScroll = () => {
  const currentScroll = window.scrollY
  if (currentScroll > 50 && !hasScrolled.value) {
    hasScrolled.value = true
  }
  showBackToTop.value = currentScroll > window.innerHeight * 0.5
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  },
  { threshold: 0.1 },
)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1 },
  )

  document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  observer.disconnect()
})

// --- i18n Dictionary ---
const i18n = {
  heroDesc: {
    'th-TH': 'โครงการรณรงค์และส่งเสริมค่านิยมความเป็นไทย เพื่อขับเคลื่อนวัฒนธรรมไทยสู่ความยั่งยืน',
    'en-US': 'A campaign to promote Thai values and drive Thai culture towards sustainability',
  },
  ctaReserve: {
    'th-TH': 'จองกิจกรรมภายในงาน',
    'en-US': 'Reserve Activities',
  },
  ctaRegister: {
    'th-TH': 'ลงทะเบียนเข้าร่วมงาน',
    'en-US': 'Register Now',
  },
  scrollToExplore: {
    'th-TH': 'เลื่อนเพื่อดูเพิ่มเติม',
    'en-US': 'Scroll to explore',
  },
  eventDetailsTitle: {
    'th-TH': 'รายละเอียดงาน',
    'en-US': 'Event Details',
  },
  locationLabel: {
    'th-TH': 'สถานที่',
    'en-US': 'Location',
  },
  locationValue: {
    'th-TH':
      'พื้นที่สนับสนุนด้านการเรียนรู้ (Science Learning Space), มจธ. บางมด (KMUTT Bangmod Campus)',
    'en-US': 'Science Learning Space, KMUTT Bangmod Campus',
  },
  howToGetThere: {
    'th-TH': 'วิธีการเดินทาง',
    'en-US': 'How to get there?',
  },
  dateTimeLabel: {
    'th-TH': 'วันและเวลา',
    'en-US': 'Date & Time',
  },
  dateTimeValue: {
    'th-TH': '7 มิถุนายน 2569, 09.00 - 16.30 น.',
    'en-US': 'June 7, 2026, 09:00 AM - 04:30 PM',
  },
  bottomCtaRegistered: {
    'th-TH': 'เลือกหัวข้อเวิร์กช็อปที่คุณสนใจ',
    'en-US': 'Select the workshops you are interested in',
  },
  bottomCtaUnregistered: {
    'th-TH': 'พร้อมยังที่จะไทยแบบตัวมัม?',
    'en-US': 'Ready to slay, Thai style?',
  },
  bottomCtaBtnRegistered: {
    'th-TH': 'ไปหน้ากิจกรรม',
    'en-US': 'Go to Activities',
  },
  bottomCtaBtnUnregistered: {
    'th-TH': 'ลงทะเบียนเข้าร่วมงานตอนนี้',
    'en-US': 'Register Now',
  },
}
</script>

<template>
  <div id="home-unregistered">
    <header class="hero-section animate-on-scroll">
      <nav class="hero-nav">
        <LangToggle theme="dark" />
      </nav>

      <div class="hero-content">
        <h3 class="stagger-item"><RouterLink to="#">KMUTT ROOTED</RouterLink></h3>
        <h1 class="stagger-item">Thai Sustainable Culture Fest 2026</h1>
        <small class="stagger-item">
          {{ t(i18n.heroDesc) }}
        </small>

        <div class="stagger-item">
          <button type="button" class="primary cta-button" @click="handleCtaAction">
            {{ isRegistered ? t(i18n.ctaReserve) : t(i18n.ctaRegister) }}
          </button>
        </div>
      </div>

      <div class="hero-image">
        <img :src="posterHero" alt="Event Poster" />
      </div>

      <div class="scroll-indicator" :class="{ 'is-hidden': hasScrolled }">
        <ArrowDown class="bounce-anim" />
        <span>{{ t(i18n.scrollToExplore) }}</span>
      </div>
    </header>

    <section class="event-details-section animate-on-scroll">
      <div class="container">
        <h3>{{ t(i18n.eventDetailsTitle) }}</h3>
        <div class="details-wrapper">
          <div class="detail-item stagger-item">
            <MapPin class="icon" />
            <div class="info">
              <p class="label">{{ t(i18n.locationLabel) }}</p>
              <p>{{ t(i18n.locationValue) }}</p>
              <a href="https://maps.app.goo.gl/TjVshrDnxDvQwumbA" class="nav-link">
                <Map class="sm-icon" /> {{ t(i18n.howToGetThere) }}
              </a>
            </div>
          </div>
          <div class="detail-item stagger-item">
            <Calendar class="icon" />
            <div class="info">
              <p class="label">{{ t(i18n.dateTimeLabel) }}</p>
              <p>{{ t(i18n.dateTimeValue) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="activities-section animate-on-scroll">
      <Activities />
    </section>

    <footer class="bottom-cta-section animate-on-scroll">
      <div class="container cta-card">
        <h3 class="cta-title">
          {{ isRegistered ? t(i18n.bottomCtaRegistered) : t(i18n.bottomCtaUnregistered) }}
        </h3>
        <button
          type="button"
          class="cta-button primary large-btn glow-effect"
          @click="handleCtaAction"
        >
          <span>{{
            isRegistered ? t(i18n.bottomCtaBtnRegistered) : t(i18n.bottomCtaBtnUnregistered)
          }}</span>
        </button>
      </div>
    </footer>

    <button
      type="button"
      class="back-to-top-fab"
      :class="{ 'is-visible': showBackToTop }"
      @click="scrollToTop"
    >
      <ArrowUp />
    </button>

    <GlobalFooter />
  </div>
</template>

<style scoped>
@import url('@/assets/styles/home-unregistered.css');
</style>
