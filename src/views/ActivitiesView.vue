<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="reserve-layout">
    <RouterView v-slot="{ Component, route }">
      <transition name="slide" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </RouterView>
  </div>
</template>
