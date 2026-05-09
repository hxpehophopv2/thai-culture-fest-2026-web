<script setup>
import RegisterView from '@/views/registerView.vue'
import LangToggle from '@/components/LangToggle.vue'
</script>

<template>
  <nav>
    <LangToggle />
  </nav>
  <section id="register">
    <RegisterView />
  </section>
</template>

<style>
@import url('../assets/styles/register.css');
</style>
