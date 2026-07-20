<script setup>
import FeatureCard from '../FeatureCard.vue'
import EmergencyBanner from '../EmergencyBanner.vue'

const emit = defineEmits(['select-page'])

// The card list keeps repeated homepage markup small while preserving a simple
// v-for pattern that is also used in the existing library project.
const featureCards = [
  {
    title: 'Learn',
    description: 'Understand anxiety, stress, sleep, and other common concerns.',
    actionLabel: 'Learn More',
    targetPage: 'learn'
  },
  {
    title: 'Self-Assessment',
    description: 'Use a private first step to reflect on how you have been feeling.',
    actionLabel: 'Take Assessment',
    targetPage: 'assessment'
  },
  {
    title: 'Get Help',
    description: 'Explore professional support, counselling, and urgent-help options.',
    actionLabel: 'Get Help',
    targetPage: 'get-help'
  },
  {
    title: 'Self-Help',
    description: 'Find practical exercises for breathing, stress, and emotional regulation.',
    actionLabel: 'Explore Tools',
    targetPage: 'self-help'
  },
  {
    title: 'For Family',
    description: 'Learn how to support someone you care about with patience and respect.',
    actionLabel: 'Learn More',
    targetPage: 'family'
  },
  {
    title: 'About Us',
    description: 'Understand the purpose and values behind the Mindful You project.',
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
            <p class="eyebrow">A calm first step</p>
            <h1 class="display-3 hero-title">Mental health support starts here.</h1>
            <p class="hero-text">
              Clear information, practical tools, and support pathways for moments when you are not
              sure what to do next.
            </p>
            <div class="d-flex flex-column flex-sm-row gap-3">
              <button type="button" class="btn btn-primary btn-lg" @click="selectPage('assessment')">
                Start Self-Assessment
              </button>
              <button
                type="button"
                class="btn btn-outline-primary btn-lg"
                @click="selectPage('get-help')"
              >
                Get Help
              </button>
            </div>
          </div>

          <div class="col-12 col-lg-6">
            <div class="hero-visual" aria-label="Abstract calming blue shapes" role="img">
              <div class="hero-circle hero-circle-one"></div>
              <div class="hero-circle hero-circle-two"></div>
              <div class="hero-line hero-line-one"></div>
              <div class="hero-line hero-line-two"></div>
              <div class="hero-message">Take one small step today.</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-5" aria-labelledby="explore-title">
      <div class="section-heading text-center mx-auto mb-4">
        <p class="eyebrow">Explore support</p>
        <h2 id="explore-title">Choose the kind of help you need right now.</h2>
        <p class="text-muted mb-0">
          You can start quietly, learn at your own pace, and choose a next step that feels realistic.
        </p>
      </div>

      <div class="row g-4">
        <div v-for="card in featureCards" :key="card.targetPage" class="col-12 col-md-6 col-lg-4">
          <FeatureCard v-bind="card" @select-page="selectPage" />
        </div>
      </div>
    </section>

    <section class="container pb-5">
      <EmergencyBanner @open-help="selectPage('get-help')" />
    </section>
  </div>
</template>
