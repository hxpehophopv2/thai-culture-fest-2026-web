<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowDown, ArrowUp, MapPin, Calendar, Map } from '@lucide/vue'
import { useAuth } from '@/composables/useAuth'
import { useLocale } from '@/composables/useLocale'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import posterHero from '@/assets/images/posterHero.png'
import Activities from '@/components/reserve/Activities.vue'
import LangToggle from '../LangToggle.vue'
import GlobalFooter from '@/components/GlobalFooter.vue'

gsap.registerPlugin(ScrollTrigger)
const router = useRouter()
const { isRegistered } = useAuth()
const { t } = useLocale()
const hasScrolled = ref(false)
const showBackToTop = ref(false)

const handleCtaAction = () => {
  if (isRegistered.value) {
    router.push('/activities')
  } else {
    router.push('/register')
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Hero Section Animation
  const heroTl = gsap.timeline()
  heroTl.from('.hero-content > *', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.15,
  })

  // Event Details Section
  gsap.from('.event-details-section h3', {
    scrollTrigger: {
      trigger: '.event-details-section',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  })

  gsap.from('.detail-item', {
    scrollTrigger: {
      trigger: '.details-wrapper',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.2,
  })

  // Bottom CTA Section
  gsap.from('.cta-wrapper', {
    scrollTrigger: {
      trigger: '.bottom-cta-section',
      start: 'top 65%',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(1.5)',
  })

  gsap.to('.cta-card', {
    y: -10,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // ล้าง ScrollTrigger ทิ้งเพื่อป้องกันบักตอนเปลี่ยนหน้า
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
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
      'พื้นที่สนับสนุนด้านการเรียนรู้ (Science Learning Space), มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (บางมด)',
    'en-US':
      "Science Learning Space, King Mongkut's University of Technology Thonburi (Bangmod Campus)",
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
    <header class="hero-section">
      <nav class="hero-nav">
        <LangToggle theme="dark" />
      </nav>

      <div class="hero-content">
        <h3><RouterLink to="#">KMUTT ROOTED</RouterLink></h3>
        <h1>Thai Sustainable Culture Fest 2026</h1>
        <small>
          {{ t(i18n.heroDesc) }}
        </small>

        <div>
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

    <section class="event-details-section">
      <div class="container">
        <h3>{{ t(i18n.eventDetailsTitle) }}</h3>
        <div class="details-wrapper">
          <div class="detail-item">
            <MapPin class="icon" />
            <div class="info">
              <p class="label">{{ t(i18n.locationLabel) }}</p>
              <p>{{ t(i18n.locationValue) }}</p>
              <a href="https://maps.app.goo.gl/TjVshrDnxDvQwumbA" class="nav-link">
                <Map class="sm-icon" /> {{ t(i18n.howToGetThere) }}
              </a>
            </div>
          </div>
          <div class="detail-item">
            <Calendar class="icon" />
            <div class="info">
              <p class="label">{{ t(i18n.dateTimeLabel) }}</p>
              <p>{{ t(i18n.dateTimeValue) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="activities-section">
      <Activities hideOrbs />
    </section>

    <footer class="bottom-cta-section animate-on-scroll">
      <div class="cta-wrapper" style="display: flex; justify-content: center">
        <div class="cta-card">
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
