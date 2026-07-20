<script setup>
import FeatureCard from '../FeatureCard.vue'
import EmergencyBanner from '../EmergencyBanner.vue'

const emit = defineEmits(['select-page'])

// The card list keeps repeated homepage markup small while preserving a simple
// v-for pattern that is also used in the existing library project.
const featureCards = [
  {
    title: 'Learn',
    actionLabel: 'Learn More',
    targetPage: 'learn'
  },
  {
    title: 'Self-Assessment',
    actionLabel: 'Take Assessment',
    targetPage: 'assessment'
  },
  {
    title: 'Get Help',
    actionLabel: 'Get Help',
    targetPage: 'get-help'
  },
  {
    title: 'Self-Help',
    actionLabel: 'Explore Tools',
    targetPage: 'self-help'
  },
  {
    title: 'For Family',
    actionLabel: 'Learn More',
    targetPage: 'family'
  },
  {
    title: 'About Us',
    actionLabel: 'Learn More',
    targetPage: 'about'
  }
]

const selectPage = (pageName) => {
  emit('select-page', pageName)
}
</script>

<template>
  <div>
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-12 col-lg-6">
            <div class="photo-placeholder">Photo</div>
          </div>

          <div class="col-12 col-lg-6 hero-copy">
            <h1 class="hero-title">Mental Health<br />Support Starts<br />Here</h1>
            <div class="hero-actions">
              <button type="button" class="wireframe-button" @click="selectPage('assessment')">
                Start Self-<br />Assessment
              </button>
              <button type="button" class="wireframe-button" @click="selectPage('get-help')">
                Get Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container feature-section" aria-label="Main website sections">
      <div class="row g-3">
        <div v-for="card in featureCards" :key="card.targetPage" class="col-6 col-lg-2">
          <FeatureCard v-bind="card" @select-page="selectPage" />
        </div>
      </div>
    </section>

    <section class="container emergency-section">
      <EmergencyBanner @open-help="selectPage('get-help')" />
    </section>
  </div>
</template>
