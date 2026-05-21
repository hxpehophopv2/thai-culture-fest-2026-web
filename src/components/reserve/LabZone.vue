<script setup>
import { useLocale } from '@/composables/useLocale'

const { locale, t } = useLocale()
const emit = defineEmits(['open-reserve'])

// --- i18n Dictionary ---
const i18n = {
  description: {
    'th-TH':
      'สัมผัสเสน่ห์ของงานหัตถศิลป์ไทยผ่านกิจกรรมเวิร์กช็อป ที่เปิดโอกาสให้ผู้เข้าร่วมได้ลงมือทำ เรียนรู้ และสร้างผลงานด้วยตนเอง',
    'en-US':
      'Create • Craft • Discover Thai Wisdom \n Experience the charm of Thai craftsmanship through creative hands-on workshops that encourage participants to learn, create, and express themselves through contemporary interpretations of Thai wisdom and cultural arts.',
  },
  notePrefix: {
    'th-TH': 'หมายเหตุ:',
    'en-US': 'Note:',
  },
  noteText: {
    'th-TH': 'ผู้เข้าร่วมกิจกรรมจะต้องมีอายุตั้งแต่ 10 ปีขึ้นไป',
    'en-US': 'Participants must be at least 10 years old.',
  },
  btnReserve: {
    'th-TH': 'จองกิจกรรม',
    'en-US': 'Reserve',
  },
}

const workshopsList = [
  {
    id: 'LAB1',
    title: {
      'th-TH': 'กิจกรรมเวิร์กช็อปร้อยพวงมาลัยไทย',
      'en-US': 'Hand Garland Workshop',
    },
    desc: {
      'th-TH': 'เรียนรู้เทคนิคพื้นฐานการร้อยพวงมาลัยจากดอกไม้สด',
      'en-US':
        'Discover the elegance of traditional Thai flower garlands through a fun and creative hands-on experience. Learn basic garland-making techniques, explore the cultural meaning behind Thai floral crafts, and create your own beautiful handmade garland to take home. Perfect for anyone who wants to experience Thai culture through art, creativity, and tradition.',
    },
  },
  {
    id: 'LAB2',
    title: {
      'th-TH': 'กิจกรรมเวิร์กช็อปพวงมโหตร',
      'en-US': 'Phuang Mahot Workshop',
    },
    desc: {
      'th-TH':
        'เรียนรู้ศิลปะการตัดกระดาษแบบโบราณ “พวงมโหตร” เครื่องแขวนตกแต่งแบบไทย ที่มักพบในงานวัด งานบุญ',
      'en-US':
        'Discover the beauty of “Phuang Mahot”, a traditional Thai hanging decoration commonly seen at temple fairs, religious ceremonies, and auspicious events. Participants will learn about its cultural significance and experience creating colorful paper decorations inspired by traditional Thai craftsmanship. This activity reflects the charm of Thai folk wisdom, creativity, and local identity through delicate handmade patterns and vibrant decorative art that has been passed down through generations.',
    },
  },
  {
    id: 'LAB3',
    title: {
      'th-TH': 'กิจกรรมเวิร์กช็อปพัดสานไม้ไผ่ไทย',
      'en-US': 'Thai Bamboo Hand Fans Workshop',
    },
    desc: {
      'th-TH':
        'เรียนรู้ภูมิปัญญาการทำพัดสาน ซึ่งไม่เพียงเป็นงานศิลป์ที่สะท้อนภูมิปัญญาไทย แต่ยังเป็นของใช้และของที่ระลึกที่สวยงาม เป็นมิตรต่อสิ่งแวดล้อม และเหมาะกับการใช้งานในชีวิตประจำวัน',
      'en-US':
        'Create your own traditional Thai bamboo hand fan and discover the charm of Thai handmade craftsmanship. Explore beautiful Thai-inspired patterns, learn simple crafting techniques, and enjoy decorating a lightweight eco-friendly souvenir that is both stylish and practical. Perfect for anyone who loves Thai culture, creativity, and sustainable design.',
    },
  },
  {
    id: 'LAB4',
    title: {
      'th-TH': 'กิจกรรมเวิร์กช็อปประดิษฐ์เครื่องประดับนาฏศิลป์ไทย',
      'en-US': 'Thai Dance Ornament Crafting Workshop',
    },
    desc: {
      'th-TH':
        'เรียนรู้การประดิษฐ์เครื่องประดับที่ได้รับแรงบันดาลใจจากนาฏศิลป์ไทย ผ่านการสร้างสรรค์งานฝีมือที่สะท้อนความประณีต งดงาม และเอกลักษณ์ของศิลปวัฒนธรรมไทย',
      'en-US':
        'Learn how to create accessories inspired by traditional Thai dance through handcrafted designs that reflect the elegance, delicacy, and unique identity of Thai cultural arts.',
    },
  },
  {
    id: 'LAB5',
    title: {
      'th-TH': 'กิจกรรมการเขียนสี - เขียนหน้าหัวโขน',
      'en-US': 'Khon Mask Painting Workshop',
    },
    desc: {
      'th-TH':
        'เรียนรู้เอกลักษณ์ของตัวละครในศิลปะการแสดงโขนไทยผ่านเขียนสี - เขียนหน้าหัวโขนขนาดเล็ก',
      'en-US':
        'Experience the creativity of Thai traditional arts through Khon mask painting and face design activities. Discover the unique patterns, colors, and identities of characters from Thailand’s classical Khon performance while creating your own artistic interpretation.',
    },
  },
]
</script>

<template>
  <div class="lab-content">
    <p class="desc-text">{{ t(i18n.description) }}</p>

    <div class="highlight-note">
      <strong>{{ t(i18n.notePrefix) }}</strong>
      <span>{{ t(i18n.noteText) }}</span>
    </div>

    <ol class="workshop-list">
      <li v-for="item in workshopsList" :key="item.id">
        <div class="item-info">
          <h5>{{ t(item.title) }}</h5>
          <p>{{ t(item.desc) }}</p>
        </div>
        <button
          v-if="item.id === 'LAB5'"
          class="item-reserve-btn"
          disabled
        >
          Coming soon ..
        </button>
        <button
          v-else
          class="item-reserve-btn"
          @click="emit('open-reserve', item.id)"
        >
          {{ t(i18n.btnReserve) }}
        </button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.lab-content {
  color: var(--clr-100);
}
.lab-content p.desc-text {
  margin-bottom: var(--sp-m);
  white-space: pre-line;
}

.highlight-note {
  background: var(--clr-920);
  border-left: 4px solid var(--clr-acc-400);
  padding: var(--sp-m);
  margin: 0 -0.5em var(--sp-m);
  border-radius: 0 var(--sp-s) var(--sp-s) 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.highlight-note strong {
  color: var(--clr-acc-300);
  font-family: 'IBM Plex Sans Thai', sans-serif;
  font-size: 1rem;
  font-weight: bold;
}

.highlight-note span {
  color: var(--clr-100);
  font-size: var(--fs-p1);
  line-height: 1.4;
}

.workshop-list {
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
  list-style: none;
  counter-reset: workshop-counter;
}

.workshop-list li {
  counter-increment: workshop-counter;
  background: var(--clr-110);
  border: 1px solid var(--clr-130);
  padding: var(--sp-m);
  margin: 0 -0.5em;
  border-radius: var(--sp-m);
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
}

.item-info h5 {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: var(--sp-xs);
  color: var(--clr-100);
  display: flex;
  gap: var(--sp-s);
}

.item-info h5::before {
  font-weight: bold;
  content: counter(workshop-counter) '.';
}

.item-info p {
  color: var(--clr-190);
  margin-bottom: 0;
  font-weight: normal;
  line-height: 1.6;
}

.item-reserve-btn {
  background: var(--clr-100);
  color: var(--clr-pri-500);
  border: none;
  padding: var(--sp-s) var(--sp-m);
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.item-reserve-btn:hover:not(:disabled) {
  transform: scale(1.05);
  background: white;
}

.item-reserve-btn:disabled {
  background: var(--clr-500);
  color: var(--clr-200);
  cursor: not-allowed;
  opacity: 0.8;
}

@media (min-width: 500px) {
  .workshop-list li {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .item-reserve-btn {
    align-self: center;
  }
}
</style>
