<script setup>
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
const emit = defineEmits(['open-reserve'])

// --- i18n Dictionary ---
const i18n = {
  description: {
    'th-TH':
      'พื้นที่ที่นำเสนอศิลปวัฒนธรรมไทยในรูปแบบร่วมสมัย ผ่านการแสดงนาฏศิลป์ การแสดงโขน และกิจกรรมเสวนาสร้างแรงบันดาลใจ เปิดโอกาสให้ผู้เข้าร่วมงานได้สัมผัส เรียนรู้ และมองเห็นคุณค่าของวัฒนธรรมไทยในมุมมองใหม่ที่เข้าถึงง่ายและใกล้ชิดกับคนรุ่นปัจจุบันมากยิ่งขึ้น',
    'en-US':
      'A vibrant space that brings Thai arts and culture to life through contemporary performances, Khon showcases, and inspiring talks; inviting participants to experience, learn, and rediscover the value of Thai culture through a modern and accessible perspective.',
  },
  scheduleTitle: {
    'th-TH': 'กิจกรรมเสวนา “เด็กวิทย์หัวใจศิลป์” และรับชมการแสดงนาฏศิลป์',
    'en-US': 'ROOTED Talks & Performance',
  },
  time: {
    'th-TH': '14:00 - 15:30 น.',
    'en-US': '02:00 PM - 03:30 PM',
  },
  btnReserve: {
    'th-TH': 'จองที่นั่งตอนนี้',
    'en-US': 'Reserve Seats Now',
  },
}

const scheduleItems = [
  {
    'th-TH': 'พิธีเปิดกิจกรรมเสวนา',
    'en-US': 'Opening Ceremony of the Talk Session',
  },
  {
    'th-TH': 'การแสดงนาฏศิลป์สร้างสรรค์ ชุด รากไทย',
    'en-US': 'Creative Thai Dance Performance: Roots of Thailand',
  },
  {
    'th-TH': 'กิจกรรมเสวนา หัวข้อ เด็กวิทย์หัวใจศิลป์: บทบาทคนรุ่นใหม่ในการสืบสานวัฒนธรรมไทย',
    'en-US':
      'Discussion: Science Hearts, Thai Arts - The Role of the New Generation in Preserving Thai Culture',
  },
  {
    'th-TH': 'การแสดงโขน ชุด ยกรบ',
    'en-US': 'Khon Performance: Battle Scene (Yok Rob)',
  },
  {
    'th-TH': 'การแสดงนาฏศิลป์สร้างสรรค์ ชุด ระบำสุธาภิรมย์',
    'en-US': 'Creative Thai Dance Performance: Suthaphirom Dance',
  },
]
</script>

<template>
  <div class="stage-content">
    <p>{{ t(i18n.description) }}</p>

    <div class="schedule-box">
      <h5>{{ t(i18n.scheduleTitle) }}</h5>
      <time>{{ t(i18n.time) }}</time>

      <ul class="schedule-list">
        <li v-for="(item, index) in scheduleItems" :key="index">
          <p>{{ t(item) }}</p>
        </li>
      </ul>
    </div>

    <div class="stage-highlight">
      <button class="main-reserve-btn" @click="emit('open-reserve', 'STG')">
        {{ t(i18n.btnReserve) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.stage-content {
  color: var(--clr-100);
}
.stage-content p {
  margin-bottom: 1rem;
}

.schedule-box {
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--sp-m);
  padding: var(--sp-m);
  margin-bottom: var(--sp-l);
}

.schedule-box h5 {
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--clr-100);
}

.schedule-box time {
  text-align: center;
  display: block;
  font-size: 0.9rem;
  margin: var(--sp-s) 0 var(--sp-m);
}

.schedule-list {
  padding-left: var(--sp-l);
  display: flex;
  flex-direction: column;
  gap: var(--sp-s);
}

.schedule-list li p {
  color: var(--clr-200);
  font-weight: normal;
  line-height: 1.5;
  margin: 0;
}

.stage-highlight {
  display: flex;
  justify-content: center;
  margin-top: var(--sp-xl);
}

.main-reserve-btn {
  width: 100%;
  max-width: 320px;
  background: var(--clr-100);
  color: var(--clr-pri-500);
  border: none;
  padding: var(--sp-m);
  border-radius: 100px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.main-reserve-btn:hover {
  transform: scale(1.05);
  background: white;
}
</style>
