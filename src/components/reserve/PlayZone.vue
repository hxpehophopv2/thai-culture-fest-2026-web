<script setup>
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()

// --- i18n Dictionary ---
const i18n = {
  description: {
    'th-TH':
      'สัมผัสความสนุกและเสน่ห์ของการละเล่นพื้นบ้านไทย เปิดโอกาสให้ผู้เข้าร่วมทุกช่วงวัยได้ร่วมเล่น เรียนรู้ และสร้างประสบการณ์ร่วมกัน ได้แก่',
    'en-US':
      'Enjoy the fun and charm of traditional Thai folk games through interactive and energetic activities designed for all ages. PLAY ZONE invites participants to experience classic Thai playground games such as Mak Kep, Mak Khom, Kradod Yang, and Coconut Shell Walking while learning about Thai culture through movement, teamwork, and play.',
  },
  notePrefix: {
    'th-TH': 'หมายเหตุ',
    'en-US': 'Note',
  },
  noteText: {
    'th-TH': 'ผู้เข้าร่วมที่มีอายุน้อยกว่า 7 ปี จะต้องมีผู้ปกครองอยู่กับผู้เข้าร่วมตลอดกิจกรรม',
    'en-US': 'Participants under 7 must be accompanied by a parent or guardian.',
  },
}

const gamesList = [
  {
    title: { 'th-TH': '1. หมากเก็บ', 'en-US': '1. Pebble Jacks (Mak Kep)' },
    desc: {
      'th-TH': '',
      'en-US':
        '“Mak Kep” is a classic Thai folk game played with five small pebbles. Players toss one pebble into the air while quickly picking up the others and catching the falling pebble before it lands.',
    },
  },
  {
    title: { 'th-TH': '2. หมากขุม', 'en-US': '2. Mak Khom' },
    desc: {
      'th-TH': '',
      'en-US':
        'Mak Khom is a traditional Thai mancala-style board game that challenges players’ calculation and strategic thinking.',
    },
  },
  {
    title: { 'th-TH': '3. กระโดดยาง', 'en-US': '3. Kradod Yang (Jump Rope Rubber Band)' },
    desc: {
      'th-TH': '',
      'en-US':
        'Experience a classic Thai playground game where players jump over elastic bands at different heights using balance, agility, and creativity.',
    },
  },
  {
    title: { 'th-TH': '4. เดินกะลา', 'en-US': '4. Coconut Shell Walking' },
    desc: {
      'th-TH': '',
      'en-US':
        'A traditional Thai balancing game where players race while walking on coconut-shell shoes connected with ropes, testing coordination and balance.',
    },
  },
]
</script>

<template>
  <div class="play-content">
    <p class="zone-desc">
      {{ t(i18n.description) }}
    </p>

    <div class="games-container">
      <div v-for="(game, index) in gamesList" :key="index" class="game-item">
        <h6>{{ t(game.title) }}</h6>
        <p v-if="t(game.desc)" class="game-desc">{{ t(game.desc) }}</p>
      </div>
    </div>

    <div class="highlight-note">
      <strong>{{ t(i18n.notePrefix) }}</strong>
      <span>{{ t(i18n.noteText) }}</span>
    </div>
  </div>
</template>

<style scoped>
.play-content {
  color: var(--clr-100);
}

.zone-desc {
  margin-bottom: var(--sp-l);
  line-height: 1.6;
}

.games-container {
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
  margin-bottom: var(--sp-xl);
}

.game-item h6 {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--clr-100, #93c5fd);
  margin-bottom: 4px;
}

.game-desc {
  color: var(--clr-100);
  opacity: 0.8;
  font-size: var(--fs-p1);
  font-weight: normal;
  line-height: 1.5;
  margin: 0;
  padding-left: var(--sp-m);
  margin-left: var(--sp-s);
  border-left: 2px solid rgba(255, 255, 255, 0.5);
}

.highlight-note {
  background: var(--clr-920);
  border-left: 4px solid var(--clr-acc-400);
  padding: var(--sp-m);
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

@media (min-width: 768px) {
  .highlight-note {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--sp-s);
  }
}
</style>
