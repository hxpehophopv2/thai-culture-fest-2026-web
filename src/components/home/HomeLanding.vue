<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowDown, ArrowUp, MapPin, Calendar, Map } from '@lucide/vue'
import { useAuth } from '@/composables/useAuth'

import posterHero from '@/assets/images/posterHero.png'
import Activities from '@/components/reserve/Activities.vue'
import LangToggle from '../LangToggle.vue'

const router = useRouter()
const { isRegistered } = useAuth()

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
        // ถ้าอยากให้มันเล่นซ้ำตอนเลื่อนกลับขึ้นไป ให้เอา else ออก
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
          โครงการรณรงค์และส่งเสริมค่านิยมความเป็นไทย เพื่อขับเคลื่อนวัฒนธรรมไทยสู่ความยั่งยืน
        </small>

        <button type="button" class="primary cta-button stagger-item" @click="handleCtaAction">
          {{ isRegistered ? 'จองกิจกรรมภายในงาน' : 'ลงทะเบียนเข้าร่วมงาน' }}
        </button>
      </div>

      <div class="hero-image">
        <img :src="posterHero" alt="Event Poster" />
      </div>

      <div class="scroll-indicator" :class="{ 'is-hidden': hasScrolled }">
        <ArrowDown class="bounce-anim" />
        <span>Scroll to explore</span>
      </div>
    </header>

    <section class="event-details-section animate-on-scroll">
      <div class="container">
        <h3>Event Details</h3>
        <div class="details-wrapper">
          <div class="detail-item stagger-item">
            <MapPin class="icon" />
            <div class="info">
              <p class="label">Location</p>
              <p>พื้นที่สนับสนุนด้านการเรียนรู้ (Science Learning Space), KMUTT Bangmod Campus</p>
              <a href="https://maps.app.goo.gl/TjVshrDnxDvQwumbA" class="nav-link">
                <Map class="sm-icon" /> How to get there?
              </a>
            </div>
          </div>
          <div class="detail-item stagger-item">
            <Calendar class="icon" />
            <div class="info">
              <p class="label">Date & Time</p>
              <p>7 มิถุนายน 2569, 09.00 - 16.30 น.</p>
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
          {{
            isRegistered
              ? 'เลือกหัวข้อเวิร์กช็อปที่คุณสนใจ'
              : 'พร้อมที่จะสร้างการเปลี่ยนแปลงหรือยัง?'
          }}
        </h3>
        <button
          type="button"
          class="cta-button primary large-btn glow-effect"
          @click="handleCtaAction"
        >
          <span>{{ isRegistered ? 'ไปหน้ากิจกรรม' : 'ลงทะเบียนเข้าร่วมงานตอนนี้' }}</span>
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
  </div>
</template>

<style scoped>
@import url('@/assets/styles/home-unregistered.css');
</style>
