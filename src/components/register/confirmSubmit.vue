<script setup>
defineProps({ isSubmitting: Boolean })
const emit = defineEmits(['submit', 'stay'])
</script>

<template>
  <section id="confirm-submit" @click.self="() => emit('stay')">
    <div class="confirm-container">
      <h5>ยืนยันการส่งข้อมูล?</h5>
      <div class="confirm-btn-container">
        <button
          class="primary submit"
          :class="{ recording: isSubmitting }"
          @click="() => emit('submit')"
          :disabled="isSubmitting"
        >
          <svg
            class="spinner-icon"
            fill="hsl(228, 97%, 42%)"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="0.75s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </path>
          </svg>

          <span class="btn-text">
            {{ isSubmitting ? 'กำลังส่ง...' : 'ยืนยัน' }}
          </span>
        </button>
        <button class="secondary" @click="() => emit('stay')" :disabled="isSubmitting">
          <p>ไม่</p>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---------- SUBMIT BUTTON TRANSITION ---------- */
.primary.submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  gap: 0rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.spinner-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  fill: #ffffff;

  opacity: 0;
  max-width: 0;
  transform: translateX(-10px);
  transition:
    opacity 0.25s ease,
    max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-text {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ---------- WHEN RECORDING (isSubmitting === true) ---------- */
.primary.submit.recording {
  gap: 0.5rem;
}

/* Fade in */
.primary.submit.recording .spinner-icon {
  opacity: 1;
  max-width: 1.25rem;
  transform: translateX(0);
  margin-right: 0.5rem;
}

.primary.submit.recording .btn-text {
  transform: translateX(0);
}
</style>
