<script setup>
import Reserve from '@/components/reserve/reserve.vue'
</script>

<template>
  <nav>
    <LangToggle />
  </nav>
  <section class="register">
    <section v-if="isBooting" class="line-state">
      <p>Connecting LINE...</p>
    </section>

    <section v-else>
      <registerHeader :step="registerStep" />
      <registerMain
        :step="registerStep"
        :step1Error="step1Error"
        :step2Error="step2Error"
        v-model:selectedType="selectedType"
        v-model:step1Error="step1Error"
        v-model:pdpaConsent="pdpaConsent"
        v-model:mediaConsent="mediaConsent"
        v-model:regisData="regisData"
      />
      <registerFooter
        :step="registerStep"
        :consent="pdpaConsent && mediaConsent"
        @goToHomeUnregistered="showConfirmDiscard"
        @goToStep1="goToStep1"
        @goToStep2="goToStep2"
        @goToStep3="goToStep3"
        @registerIn="showConfirmSubmit"
      />

      <p v-if="submitError" style="color: var(--clr-sem-err)">{{ submitError }}</p>
    </section>

    <Reserve />
  </section>
</template>
