<script setup>
import { ref } from 'vue'
import { Phone, MapPin, X, Camera, Info } from '@lucide/vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()

const currentYear = new Date().getFullYear()
const activeModal = ref(null)

const openModal = (type) => {
  activeModal.value = type
}

const closeModal = () => {
  activeModal.value = null
}

// --- i18n Dictionary ---
const i18n = {
  description: {
    'th-TH': 'โครงการรณรงค์และส่งเสริมค่านิยมความเป็นไทย เพื่อขับเคลื่อนวัฒนธรรมไทยสู่ความยั่งยืน',
    'en-US': 'A campaign to promote Thai values and drive Thai culture towards sustainability',
  },
  contactTitle: {
    'th-TH': 'ติดต่อทีมงาน',
    'en-US': 'Contact Us',
  },
  punch: {
    'th-TH': '(พั้นซ์)',
    'en-US': '(Punch)',
  },
  fern: {
    'th-TH': '(เฟิร์น)',
    'en-US': '(Fern)',
  },
  address: {
    'th-TH': '126 ถ.ประชาอุทิศ แขวงบางมด เขตทุ่งครุ กรุงเทพมหานคร 10140',
    'en-US': '126 Pracha Uthit Rd., Bang Mod, Thung Khru, Bangkok 10140',
  },
  privacyTitle: {
    'th-TH': 'ยินยอมการใช้ข้อมูล (Consent for Data Usage)',
    'en-US': 'Consent for Data Usage',
  },
  privacyDesc: {
    'th-TH':
      'ข้าพเจ้ายินยอมให้ผู้จัดงานเก็บรวบรวม ใช้ และประมวลผลข้อมูลส่วนบุคคลที่ให้ไว้ในแบบฟอร์มนี้ เพื่อวัตถุประสงค์ในการลงทะเบียน การยืนยันตัวตน การจัดกิจกรรม การติดต่อสื่อสาร และการบริหารจัดการงาน KMUTT ROOTED เท่านั้น',
    'en-US':
      'I consent to the collection, use, and processing of my personal data provided in this form for registration, identity verification, event communication, and event management purposes for KMUTT ROOTED only.',
  },
  termsTitle: {
    'th-TH': 'ยินยอมการบันทึกภาพ (Consent for Photo/Video)',
    'en-US': 'Consent for Photo/Video',
  },
  termsDesc: {
    'th-TH':
      'ข้าพเจ้ายินยอมให้ผู้จัดงานบันทึกภาพนิ่ง วิดีโอ หรือเสียงของข้าพเจ้าในระหว่างการเข้าร่วมกิจกรรม และนำไปใช้เพื่อการประชาสัมพันธ์ รายงานผลกิจกรรม หรือเผยแพร่ผ่านช่องทางของมหาวิทยาลัยและผู้จัดงาน โดยไม่ใช้ในเชิงพาณิชย์',
    'en-US':
      'I consent to the organizer capturing my photos, videos, or audio during the event and using them for public relations, event reporting, or publication through the university and organizer channels, without commercial use.',
  },
}
</script>

<template>
  <footer class="global-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-section brand-section">
          <h3 class="footer-title">KMUTT ROOTED</h3>
          <p class="footer-subtitle">Thai Sustainable Culture Fest 2026</p>
          <p class="footer-desc">{{ t(i18n.description) }}</p>
        </div>

        <div class="footer-section contact-section">
          <h4 class="section-title">{{ t(i18n.contactTitle) }}</h4>
          <div class="contact-item">
            <Phone class="contact-icon" />
            <div>
              <p>
                093-926-2583 <span>{{ t(i18n.punch) }}</span>
              </p>
            </div>
          </div>
          <div class="contact-item">
            <Phone class="contact-icon" />
            <div>
              <p>
                061-396-0779 <span>{{ t(i18n.fern) }}</span>
              </p>
            </div>
          </div>
          <div class="contact-item mt-s">
            <MapPin class="contact-icon" />
            <div>
              <p>{{ t(i18n.address) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="">
          <p>Designed & Developed by Teeruch Songtalay, Jeerayut Rattanamanee</p>
          <p>&copy; {{ currentYear }} KMUTT ROOTED Team. All rights reserved.</p>
        </div>
        <div class="legal-links">
          <span>Version 1.0.0</span>
          <span class="divider">|</span>
          <a href="#" @click.prevent="openModal('privacy')">Privacy Policy</a>
          <span class="divider">|</span>
          <a href="#" @click.prevent="openModal('terms')">Terms of Service</a>
        </div>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="activeModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <button type="button" class="close-btn" @click="closeModal">
            <X class="close-icon" />
          </button>

          <div v-if="activeModal === 'privacy'" class="modal-content">
            <div class="modal-icon">
              <Info :size="128" :strokeWidth="4" absoluteStrokeWidth />
            </div>
            <h4>{{ t(i18n.privacyTitle) }}</h4>
            <div class="lang-block">
              <p>{{ t(i18n.privacyDesc) }}</p>
            </div>
          </div>

          <div v-if="activeModal === 'terms'" class="modal-content">
            <div class="modal-icon">
              <Camera :size="128" :strokeWidth="4" absoluteStrokeWidth />
            </div>
            <h4>{{ t(i18n.termsTitle) }}</h4>
            <div class="lang-block">
              <p>{{ t(i18n.termsDesc) }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </footer>
</template>

<style scoped>
/* ---------- GLOBAL FOOTER ---------- */
.global-footer {
  background: linear-gradient(135deg, var(--clr-800, #0f172a) 0%, #020617 100%);
  color: var(--clr-100, #f8fafc);
  padding: var(--sp-2xl) var(--sp-s) calc(var(--sp-4xl) + env(safe-area-inset-bottom));
  font-family: sans-serif;
  position: relative;
  overflow: hidden;
}

.global-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.footer-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--sp-l);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-2xl);
  margin-bottom: var(--sp-2xl);
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: 2fr 2fr 0.5fr;
    gap: var(--sp-xl);
  }
}

/* ---------- BRAND SECTION ---------- */
.brand-section .footer-title {
  font-family: ClashGrotesk-Bold, sans-serif;
  font-size: 1.5rem;
  color: var(--clr-pri-400, #60a5fa);
  margin-bottom: var(--sp-xs);
}

.brand-section .footer-subtitle {
  font-weight: 600;
  color: var(--clr-200, #e2e8f0);
  margin-bottom: var(--sp-m);
}

.brand-section .footer-desc {
  color: var(--clr-400, #94a3b8);
  line-height: 1.6;
  max-width: 400px;
}

/* ---------- SECTION TITLES ---------- */
.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--clr-100, #f8fafc);
  margin-bottom: var(--sp-m);
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50%;
  height: 2px;
  background: var(--clr-pri-500, #3b82f6);
  border-radius: 2px;
}

/* ---------- HELP SECTION ---------- */
.help-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-list li {
  color: var(--clr-300, #cbd5e1);
  margin-bottom: var(--sp-s);
  position: relative;
  padding-left: 1rem;
}

.help-list li::before {
  content: '•';
  color: var(--clr-pri-500, #3b82f6);
  position: absolute;
  left: 0;
  top: 0;
}

/* ---------- CONTACT SECTION ---------- */
.contact-item {
  display: flex;
  gap: var(--sp-s);
  margin-bottom: var(--sp-s);
  color: var(--clr-300, #cbd5e1);
}

.contact-icon {
  width: 18px;
  height: 18px;
  color: var(--clr-pri-400, #60a5fa);
  flex-shrink: 0;
}

.contact-item span {
  color: var(--clr-400, #94a3b8);
  font-size: 0.9em;
}

/* ---------- FOOTER BOTTOM ---------- */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: var(--sp-l);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--sp-s);
  color: var(--clr-500, #64748b);
  font-size: 0.85rem;
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.legal-links {
  display: flex;
  align-items: center;
  gap: var(--sp-s);
  flex-wrap: wrap;
  justify-content: center;
}

.legal-links a {
  color: var(--clr-400, #94a3b8);
  text-decoration: none;
  transition: color 0.2s ease;
}

.legal-links a:hover {
  color: var(--clr-pri-400, #60a5fa);
}

.divider {
  color: rgba(255, 255, 255, 0.2);
}

/* ---------- MODAL STYLES ---------- */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  padding: var(--sp-m);
  box-sizing: border-box;
}

.modal-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: var(--sp-xl);
  max-width: 550px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  position: relative;
  color: #1e293b;
  text-align: left;
}

.close-btn {
  position: absolute;
  top: var(--sp-m);
  right: var(--sp-m);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--sp-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}

.close-icon {
  width: 20px;
  height: 20px;
  color: var(--clr-500);
  transition: color 0.2s ease;
}

.close-btn:hover .close-icon {
  color: var(--clr-700);
}

.modal-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--clr-pri-500);
  margin-bottom: var(--sp-m);
}

.modal-content h4 {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--clr-pri-500);
  margin: 0 0 var(--sp-m);
  line-height: 1.4;
}
.modal-content p {
  color: var(--clr-500);
}

.lang-block {
  margin-bottom: var(--sp-l);
}
.lang-block:last-child {
  margin-bottom: 0;
}

/* ---------- MODAL ANIMATION ---------- */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-card {
  animation: modal-scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-fade-leave-active .modal-card {
  transition: transform 0.2s ease-in;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-leave-to .modal-card {
  transform: scale(0.95);
}

@keyframes modal-scale-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
