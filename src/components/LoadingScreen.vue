<script setup>
import { defineProps } from 'vue'

defineProps({
  text: {
    type: String,
    default: 'Loading...',
  },
})
</script>

<template>
  <div class="loading-container">
    <div class="loader-anim"></div>
    <p class="loading-text">{{ text }}</p>
  </div>
</template>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--clr-100, #fbfdfe);

  background: #3182de;
  background: -webkit-linear-gradient(
    180deg,
    rgba(49, 130, 222, 1) 0%,
    rgba(42, 105, 168, 1) 50%,
    rgba(24, 42, 125, 1) 100%
  );
  background: -moz-linear-gradient(
    180deg,
    rgba(49, 130, 222, 1) 0%,
    rgba(42, 105, 168, 1) 50%,
    rgba(24, 42, 125, 1) 100%
  );
  background: linear-gradient(
    180deg,
    rgba(49, 130, 222, 1) 0%,
    rgba(42, 105, 168, 1) 50%,
    rgba(24, 42, 125, 1) 100%
  );
}

.loader-anim {
  width: 150px;
  height: 75px;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><path fill="none" stroke="%23FBFDFE" stroke-width="16" stroke-linecap="round" stroke-dasharray="300 385" stroke-dashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"><animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate></path></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: var(--sp-m, 1rem);
}

.loading-text {
  font-weight: bold;
  letter-spacing: 0.5px;
  animation: pulse-text 1.5s infinite ease-in-out alternate;
}

@keyframes pulse-text {
  0% {
    opacity: 0.5;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
