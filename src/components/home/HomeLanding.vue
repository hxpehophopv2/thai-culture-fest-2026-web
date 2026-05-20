<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowDown, ArrowUp } from '@lucide/vue'
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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav>
    <LangToggle theme="dark" />
  </nav>
  <div id="home-unregistered">
    <header class="hero-section">
      <div class="hero-content">
        <h3><RouterLink to="/staff-login">KMUTT ROOTED</RouterLink></h3>
        <h1>Thai Sustainable Culture Fest 2026</h1>
        <small>
          โครงการรณรงค์และส่งเสริมค่านิยมความเป็นไทย เพื่อขับเคลื่อนวัฒนธรรมไทยสู่ความยั่งยืน
        </small>
      </div>
      <button type="button" class="primary" @click="handleCtaAction">
        {{ isRegistered ? 'จองกิจกรรมภายในงาน' : 'ลงทะเบียนเข้าร่วมงาน' }}
      </button>

      <div class="hero-image">
        <img :src="posterHero" alt="Event Poster" />
      </div>

      <div class="scroll-indicator" :class="{ 'is-hidden': hasScrolled }">
        <ArrowDown class="bounce-anim" />
        <span>Scroll to explore</span>
      </div>
    </header>

    <section class="event-details-section">
      <div class="container">
        <h3>Event Details</h3>
        <p>สถานที่: KMUTT Bangmod Campus</p>
        <p>วันที่: XX เดือน XXXX 2026</p>
      </div>
    </section>

    <section class="activities-section">
      <Activities />
    </section>

    <footer class="bottom-cta-section">
      <div class="container">
        <h3>
          {{
            isRegistered
              ? 'เลือกหัวข้อเวิร์กช็อปที่คุณสนใจ'
              : 'พร้อมที่จะเป็นส่วนหนึ่งของงานหรือยัง?'
          }}
        </h3>
        <button type="button" class="primary large-btn" @click="handleCtaAction">
          {{ isRegistered ? 'ดูรอบเวลาและจองกิจกรรม' : 'ลงทะเบียนเข้าร่วมงานตอนนี้' }}
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
