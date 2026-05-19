<script setup>
import { useLocale } from '@/composables/useLocale'
const { locale } = useLocale()

// เพิ่มการส่งสัญญาณเปิด Modal
const emit = defineEmits(['open-reserve'])
</script>

<template>
  <div class="lab-content">
    <p class="highlight-text">
      สัมผัสเสน่ห์ของงานหัตถศิลป์ไทยผ่านกิจกรรมเวิร์กช็อป ที่เปิดโอกาสให้ผู้เข้าร่วมได้ลงมือทำ
      เรียนรู้ และสร้างผลงานด้วยตนเอง
    </p>

    <ol class="workshop-list">
      <li>
        <div class="item-info">
          <h5>กิจกรรมเวิร์กช็อปร้อยพวงมาลัยไทย</h5>
          <p>
            สัมผัสเสน่ห์ของพวงมาลัยไทยผ่านกิจกรรมเวิร์กช็อปที่สนุกและสร้างสรรค์
            เรียนรู้เทคนิคพื้นฐานการร้อยพวงมาลัย...
          </p>
        </div>
        <button class="item-reserve-btn" @click="emit('open-reserve', 'LAB1')">Reserve</button>
      </li>

      <li>
        <div class="item-info">
          <h5>กิจกรรมเวิร์กช็อปพวงมโหตร</h5>
          <p>เรียนรู้เสน่ห์ของ "พวงมโหตร" เครื่องแขวนตกแต่งแบบไทยที่มักพบในงานวัด งานบุญ...</p>
        </div>
        <button class="item-reserve-btn" @click="emit('open-reserve', 'LAB2')">Reserve</button>
      </li>

      <li>
        <div class="item-info">
          <h5>กิจกรรมเวิร์กช็อปพัดสานไม้ไผ่ไทย</h5>
          <p>
            ร่วมสร้างสรรค์พัดสานไม้ไผ่ไทยด้วยตนเอง พร้อมสัมผัสเสน่ห์ของงานหัตถกรรมไทยแบบดั้งเดิม...
          </p>
        </div>
        <button class="item-reserve-btn" @click="emit('open-reserve', 'LAB3')">Reserve</button>
      </li>

      <li>
        <div class="item-info">
          <h5>กิจกรรมเวิร์กช็อปประดิษฐ์เครื่องประดับนาฏศิลป์ไทย</h5>
          <p>เรียนรู้การประดิษฐ์เครื่องประดับที่ได้รับแรงบันดาลใจจากนาฏศิลป์ไทย...</p>
        </div>
        <button class="item-reserve-btn" @click="emit('open-reserve', 'LAB4')">Reserve</button>
      </li>

      <li>
        <div class="item-info">
          <h5>กิจกรรมการเขียนสี - เขียนหน้าหัวโขน</h5>
          <p>
            เรียนรู้ศิลปะการวาดลวดลายและลงสีหน้าหัวโขนขนาดย่อส่วน
            ด้วยเทคนิคช่างสิบหมู่แบบดั้งเดิม...
          </p>
        </div>
        <button class="item-reserve-btn" @click="emit('open-reserve', 'LAB5')">Reserve</button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.lab-content {
  color: var(--clr-100);
}

.highlight-text {
  color: #ffca28; /* ปรับสีให้สว่างขึ้นบนพื้นหลังสีน้ำเงิน */
  font-weight: bold;
  margin-bottom: var(--sp-m);
  line-height: 1.5;
}

.workshop-list {
  padding-left: 0; /* เอา padding ออกเพราะเราจะใส่กรอบให้แต่ละ item */
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
  list-style: none; /* ซ่อนตัวเลขเดิมไปก่อน */
  counter-reset: workshop-counter; /* สร้างตัวนับใหม่ */
}

/* จัด Layout กล่องกิจกรรมแต่ละอันให้มีปุ่มจอง */
.workshop-list li {
  counter-increment: workshop-counter;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--sp-m);
  border-radius: var(--sp-m);
  display: flex;
  flex-direction: column;
  gap: var(--sp-m);
}

.item-info h5 {
  font-size: 1.1rem;
  margin-bottom: var(--sp-xs);
  color: var(--clr-100);
  display: flex;
  gap: var(--sp-s);
}

.item-info h5::before {
  content: counter(workshop-counter) '.'; /* ใส่ตัวเลขกลับมาแบบ custom */
  color: var(--clr-pri-500);
}

.item-info p {
  color: var(--clr-200);
  line-height: 1.6;
}

/* สไตล์ปุ่มกด */
.item-reserve-btn {
  background: var(--clr-100);
  color: var(--clr-900);
  border: none;
  padding: var(--sp-s) var(--sp-m);
  border-radius: 100px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
  transition:
    transform 0.2s,
    background-color 0.2s;
  align-self: flex-start; /* ปุ่มชิดซ้ายบนมือถือ */
}

.item-reserve-btn:hover {
  transform: scale(1.05);
  background: white;
}

/* ถ้าหน้าจอใหญ่ขึ้น ให้ปุ่มไปอยู่ด้านขวา */
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
