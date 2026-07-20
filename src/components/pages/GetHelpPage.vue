<script setup>
import { ref } from 'vue'
import EmergencyBanner from '../EmergencyBanner.vue'

const emit = defineEmits(['select-page'])

// This message makes demo-only actions honest without displaying fake phone
// numbers or pretending that the student project is a live crisis service.
const demoNotice = 'This demonstration page does not connect to a live service yet.'
const noticeVisible = ref(false)

const showDemoNotice = () => {
  noticeVisible.value = true
}

const selectPage = (pageName) => {
  emit('select-page', pageName)
}
</script>

<template>
  <section class="page-section container py-5">
    <div class="section-heading text-center mx-auto mb-5">
      <p class="eyebrow">Support pathways</p>
      <h1>Get Help</h1>
      <p class="lead text-muted">Choose the support that best matches your needs.</p>
    </div>

    <div class="urgent-panel mb-4">
      <div>
        <p class="eyebrow mb-2">If you are in immediate danger or having a crisis</p>
        <h2 class="h4">Urgent help should be easy to find.</h2>
        <p class="mb-0">Contact local emergency services if someone is at immediate risk.</p>
      </div>
      <div class="d-flex flex-column flex-sm-row gap-2">
        <button type="button" class="btn btn-danger" @click="showDemoNotice">
          Call 24/7 Hotline
        </button>
        <button type="button" class="btn btn-outline-danger" @click="showDemoNotice">
          Emergency Contacts
        </button>
      </div>
    </div>

    <div v-if="noticeVisible" class="alert alert-warning" role="status">
      {{ demoNotice }} Verified Australian support contacts can be added when the service list is
      confirmed.
    </div>

    <div class="row g-4">
      <div class="col-12 col-md-6">
        <article class="support-card h-100">
          <div class="support-icon" aria-hidden="true">01</div>
          <h2>Online Counselling</h2>
          <p class="text-muted">Learn about speaking with a trained professional online.</p>
          <button type="button" class="btn btn-primary" @click="showDemoNotice">Start Chat</button>
        </article>
      </div>

      <div class="col-12 col-md-6">
        <article class="support-card h-100">
          <div class="support-icon" aria-hidden="true">02</div>
          <h2>Local Services</h2>
          <p class="text-muted">Find out what to look for when choosing a local support service.</p>
          <button type="button" class="btn btn-primary" @click="showDemoNotice">
            Find Services
          </button>
        </article>
      </div>

      <div class="col-12">
        <article class="support-card support-card-wide">
          <div class="support-icon" aria-hidden="true">03</div>
          <div>
            <h2>Book an Appointment</h2>
            <p class="text-muted mb-0">Prepare questions and information before contacting a provider.</p>
          </div>
          <button type="button" class="btn btn-primary" @click="showDemoNotice">Book Now</button>
        </article>
      </div>
    </div>

    <div class="start-panel mt-4">
      <div>
        <p class="eyebrow mb-2">Not sure where to begin?</p>
        <h2 class="h4 mb-1">You can take the first step at your own pace.</h2>
        <p class="text-muted mb-0">Try a private self-assessment or read the crisis guidance.</p>
      </div>
      <div class="d-flex flex-column flex-sm-row gap-2">
        <button type="button" class="btn btn-primary" @click="selectPage('assessment')">
          Take Self-Assessment
        </button>
        <button type="button" class="btn btn-outline-primary" @click="showDemoNotice">
          Read Crisis Guide
        </button>
      </div>
    </div>

    <div class="mt-4">
      <EmergencyBanner @open-help="selectPage('get-help')" />
    </div>
  </section>
</template>
