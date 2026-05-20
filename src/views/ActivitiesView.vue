<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LangToggle from '@/components/LangToggle.vue'
import '@/assets/styles/reserve.css'

const route = useRoute()
const transitionName = ref('slide-left')

watch(
  () => route.name,
  (newName) => {
    transitionName.value = newName === 'zone-detail' ? 'slide-left' : 'slide-right'
  },
)
</script>

<template>
  <div id="reserve-layout">
    <div class="bubbles-bg">
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
    </div>

    <nav class="reserve-nav">
      <LangToggle />
    </nav>

    <RouterView v-slot="{ Component }">
      <Transition :name="transitionName" mode="out-in">
        <KeepAlive :include="['Activities']">
          <component :is="Component" :key="route.path" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter-from {
  transform: translateX(48px);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-48px);
  opacity: 0;
}
.slide-right-enter-from {
  transform: translateX(-48px);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(48px);
  opacity: 0;
}
</style>
