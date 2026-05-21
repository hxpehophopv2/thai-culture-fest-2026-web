<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="reserve-layout">
    <RouterView v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </RouterView>
  </div>
</template>
