<script setup>
import { RouterLink, useRouter } from 'vue-router'
import posterHero from '@/assets/images/posterHero.png'

const router = useRouter()

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <section id="home-unregistered">
    <header>
      <h2><RouterLink to="/staff-login">KMUTT ROOTED</RouterLink></h2>
      <h1>Thai Sustainable Culture Fest 2026</h1>
      <small>
        โครงการรณรงค์และส่งเสริมค่านิยมความเป็นไทย เพื่อขับเคลื่อนวัฒนธรรมไทยสู่ความยั่งยืน
      </small>
      <div>
        <img :src="posterHero" alt="" />
      </div>
    </header>
    <footer>
      <button type="button" class="primary" @click="goToRegister"><p>ลงทะเบียน</p></button>
      <button type="button" class="secondary"><p>ดูรายละเอียดของงาน</p></button>
    </footer>
  </section>
</template>

<style scoped>
@import url('@/assets/styles/home.css');
</style>
