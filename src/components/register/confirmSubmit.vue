<script setup>
defineProps({ isSubmitting: Boolean })
const emit = defineEmits(['submit', 'stay'])
</script>

<template>
  <section id="confirm-submit" @click.self="() => emit('stay')">
    <div class="confirm-container">
      <h5>ยืนยันการส่งข้อมูล?</h5>
      <div class="confirm-btn-container">
        <button @click="() => emit('stay')" :disabled="isSubmitting"><p>ไม่</p></button>
        <button class="submit" @click="() => emit('submit')" :disabled="isSubmitting">
          <p>{{ isSubmitting ? 'กำลังส่ง...' : 'ยืนยัน' }}</p>
        </button>
      </div>
    </div>
  </section>
</template>
