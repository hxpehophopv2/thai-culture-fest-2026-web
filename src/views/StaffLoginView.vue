<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import LangToggle from '@/components/LangToggle.vue'
import StaffRegister from '@/components/staffLogin/StaffLogin.vue'
import '@/assets/styles/register.css'

const router = useRouter()
const staffData = ref({})
const showError = ref(false)

const goToHomeUnregistered = () => {
  router.push('/')
}

const handleSubmit = () => {
  if (!staffData.value.isValid) {
    showError.value = true
    return
  }

  // Submit ข้อมูล
  console.log('Submit Staff:', staffData.value.fullname, staffData.value.zoneCode)
}
</script>

<template>
  <nav>
    <LangToggle />
  </nav>
  <section class="register">
    <StaffRegister v-model:staffData="staffData" v-model:showError="showError" />

    <section class="register-footer">
      <footer>
        <button class="secondary" @click="goToHomeUnregistered">
          <p>ย้อนกลับ</p>
        </button>
        <button class="primary" @click="handleSubmit"><p>เข้าสู่ระบบ</p></button>
      </footer>
    </section>
  </section>
</template>
