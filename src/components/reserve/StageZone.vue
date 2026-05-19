<script setup>
import { useLocale } from '@/composables/useLocale'
const { locale } = useLocale()

// เพิ่มการส่งสัญญาณเปิด Modal
const emit = defineEmits(['open-reserve'])
</script>

<template>
  <div class="stage-content">
    <p class="highlight-text">
      พื้นที่ที่นำเสนอศิลปวัฒนธรรมไทยในรูปแบบร่วมสมัย ผ่านการแสดงนาฏศิลป์ การแสดงโขน
      และกิจกรรมเสวนาสร้างแรงบันดาลใจ เปิดโอกาสให้ผู้เข้าร่วมงานได้สัมผัส เรียนรู้
      และมองเห็นคุณค่าของวัฒนธรรมไทยในมุมมองใหม่ที่เข้าถึงง่ายและใกล้ชิดกับคนรุ่นปัจจุบันมากยิ่งขึ้น
    </p>

    <div class="schedule-box">
      <h5>กิจกรรมเสวนา “เด็กวิทย์หัวใจศิลป์” และรับชมการแสดงนาฏศิลป์</h5>
      <time>14:00 - 15:30 น.</time>
      <ul class="schedule-list">
        <li><p>พิธีเปิดกิจกรรมเสวนา</p></li>
        <li><p>การแสดงนาฏศิลป์สร้างสรรค์ ชุด รากไทย</p></li>
        <li>
          <p>กิจกรรมเสวนา หัวข้อ เด็กวิทย์หัวใจศิลป์: บทบาทคนรุ่นใหม่ในการสืบสานวัฒนธรรมไทย</p>
        </li>
        <li><p>การแสดงโขน ชุด ยกรบ</p></li>
        <li><p>การแสดงนาฏศิลป์สร้างสรรค์ ชุด ระบำสุธาภิรมย์</p></li>
      </ul>
    </div>

    <div class="stage-highlight">
      <button class="main-reserve-btn" @click="emit('open-reserve', 'STG')">
        Reserve Seats Now
      </button>
    </div>
  </div>
</template>

<style scoped>
.stage-content {
  color: var(--clr-100);
}

.highlight-text {
  color: #ffca28; /* ปรับสีให้สว่างขึ้นอ่านง่าย */
  font-weight: bold;
  margin-bottom: var(--sp-l);
  line-height: 1.6;
}

/* จัดตารางเวลาให้อยู่ในกรอบดูเป็นสัดส่วน */
.schedule-box {
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--sp-m);
  padding: var(--sp-m);
  margin-bottom: var(--sp-l);
}

.schedule-box h5 {
  font-size: 1.1rem;
  color: var(--clr-100);
  margin-bottom: 4px;
}

.schedule-box time {
  display: inline-block;
  font-size: 0.9rem;
  color: #4caf50;
  font-weight: bold;
  margin-bottom: var(--sp-m);
}

.schedule-list {
  padding-left: var(--sp-l);
  display: flex;
  flex-direction: column;
  gap: var(--sp-s);
}

.schedule-list li p {
  color: var(--clr-200);
  line-height: 1.5;
  margin: 0;
}

/* สไตล์กล่องและปุ่มจองใหญ่ */
.stage-highlight {
  display: flex;
  justify-content: center;
  margin-top: var(--sp-xl);
}

.main-reserve-btn {
  width: 100%;
  max-width: 320px;
  background: var(--clr-100);
  color: var(--clr-pri-500); /* ให้ตัวหนังสือเป็นสีหลักเพื่อให้เด่นขึ้น */
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
