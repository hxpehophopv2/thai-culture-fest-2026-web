<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { useLocale } from '@/composables/useLocale'
import LangToggle from '@/components/LangToggle.vue'
import { ArrowLeft } from '@lucide/vue'

const router = useRouter()
const { t } = useLocale()

const notFoundRef = ref(null)
let ctx

const i18n = {
  title: { 'th-TH': 'ไม่พบหน้าดังกล่าว', 'en-US': 'Page Not Found' },
  desc: {
    'th-TH':
      'ขออภัย หน้าที่คุณกำลังพยายามเข้าถึงอาจไม่มีอยู่จริง ถูกลบไปแล้ว เปลี่ยนชื่อ หรือไม่สามารถให้บริการชั่วคราวได้',
    'en-US':
      'Sorry, the page you are looking for might have never existed, have been removed, had its name changed, or is temporarily unavailable.',
  },
  goBackHome: { 'th-TH': 'กลับสู่หน้าหลัก', 'en-US': 'Back to Homepage' },
}

onMounted(() => {
  ctx = gsap.context(() => {
    const tl = gsap.timeline()
    tl.from('.glitch-404', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' })
    tl.from(
      '.not-found-content > *',
      { y: 20, opacity: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out' },
      '-=0.3',
    )
    tl.from(
      '.cta-btn-group button',
      { scale: 0.9, opacity: 0, duration: 0.4, ease: 'back.out(1.2)' },
      '-=0.2',
    )
  }, notFoundRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div id="not-found-view" ref="notFoundRef">
    <div class="orb-bg">
      <div class="orb"></div>
      <div class="orb"></div>
    </div>

    <nav class="not-found-nav">
      <LangToggle theme="light" />
    </nav>

    <main class="not-found-container">
      <div class="glitch-404">404</div>

      <div class="not-found-content">
        <h2>{{ t(i18n.title) }}</h2>
        <p>{{ t(i18n.desc) }}</p>

        <div class="cta-btn-group">
          <button class="primary go-home-btn" @click="goHome">
            <ArrowLeft :size="18" />
            <span>{{ t(i18n.goBackHome) }}</span>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
#not-found-view {
  min-height: 100vh;
  background-color: var(--clr-900);
  color: var(--clr-100);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.orb-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;
}

.orb:nth-child(1) {
  top: 10%;
  left: -20%;
  width: 60vw;
  height: 60vw;
  background: var(--clr-pri-500);
}

.orb:nth-child(2) {
  bottom: -10%;
  right: -20%;
  width: 50vw;
  height: 50vw;
  background: var(--clr-acc-500);
}

.not-found-nav {
  position: absolute;
  top: 0;
  right: 0;
  padding: var(--sp-xl) var(--sp-l);
  z-index: 10;
}

.not-found-container {
  max-width: 480px;
  width: 90vw;
  text-align: center;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-m);
}

.glitch-404 {
  font-family: ClashGrotesk-Bold, sans-serif;
  font-size: 8rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -2px;
  background: linear-gradient(135deg, var(--clr-pri-200) 0%, var(--clr-acc-300) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: var(--sp-s);
}

.not-found-content h2 {
  font-family: ClashGrotesk-Bold, 'IBM Plex Sans Thai', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--clr-100);
  margin-bottom: var(--sp-m);
}

.not-found-content p {
  font-weight: normal;
  font-size: 0.95rem;
  color: var(--clr-300);
  line-height: 1.6;
  margin-bottom: var(--sp-xl);
}

.cta-btn-group {
  display: flex;
  justify-content: center;
}

.go-home-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-s);
  background: var(--clr-pri-500);
  color: white;
  border-radius: 100px;
  padding: var(--sp-m) var(--sp-l);
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(26, 80, 133, 0.3);
}

.go-home-btn:hover {
  background: var(--clr-pri-600);
  transform: translateY(-2px);
}
</style>
