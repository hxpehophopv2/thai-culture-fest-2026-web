<script setup>
defineProps({ isSubmitting: Boolean })
const emit = defineEmits(['submit', 'stay'])
</script>

<template>
  <section id="confirm-submit" @click.self="() => emit('stay')">
    <div class="confirm-container">
      <h5>ยืนยันการส่งข้อมูล?</h5>
      <div class="confirm-btn-container">
        <button class="primary submit" @click="() => emit('submit')" :disabled="isSubmitting">
          <p>{{ isSubmitting ? 'กำลังส่ง...' : 'ยืนยัน' }}</p>
        </button>
        <button class="secondary" @click="() => emit('stay')" :disabled="isSubmitting">
          <p>ไม่</p>
        </button>
      </div>
    </div>
  </section>
</template>
