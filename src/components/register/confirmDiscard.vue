<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['discard', 'stay'])
</script>

<template>
  <section id="confirm-discard" @click.self="() => emit('stay')">
    <div class="confirm-container">
      <h5>ยืนยันการละทิ้ง?</h5>
      <div class="confirm-btn-container">
        <button class="secondary" style="color: var(--clr-900)" @click="() => emit('stay')">
          <p>ไม่</p>
        </button>
        <button class="discard" @click="() => emit('discard')"><p>ละทิ้ง</p></button>
      </div>
    </div>
  </section>
</template>
