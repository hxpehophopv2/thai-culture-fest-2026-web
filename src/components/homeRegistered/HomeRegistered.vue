<script setup>
import { ref, onMounted } from 'vue'
import { getMyQr } from '@/services/registrationService'
import { getLineProfile } from '@/services/lineAuthService'

const qr = ref(null)
const lineProfile = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  lineProfile.value = getLineProfile()
  try {
    qr.value = await getMyQr()
  } catch (err) {
    console.error('Error fetching QR', err)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <nav>
    <LangToggle />
  </nav>
  <section id="registered-home">
    <section v-if="isBooting" class="line-state">
      <p>Loading your ticket...</p>
    </section>

    <section v-else-if="qr" class="registered-qr">
      <h2>Registration Complete</h2>
      <p>{{ lineProfile?.displayName }}</p>
      <img :src="qr.dataUrl" alt="Registration QR code" />
      <code>{{ qr.qrData }}</code>
    </section>

    <p v-if="errorMsg" style="color: var(--clr-sem-err); text-align: center">
      {{ errorMsg }}
    </p>
  </section>
</template>

<style scoped>
#registered-home {
  padding-top: 2rem;
}

.line-state,
.registered-qr {
  display: grid;
  gap: 1rem;
  place-items: center;
  padding: 2rem 1rem;
  text-align: center;
}

.registered-qr img {
  width: min(320px, 100%);
  border-radius: 1rem;
}

.registered-qr code {
  max-width: min(520px, 100%);
  overflow-wrap: anywhere;
}
</style>
