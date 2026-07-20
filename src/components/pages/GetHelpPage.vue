<script setup>
const emit = defineEmits(['select-page'])

const selectPage = (pageName) => {
  emit('select-page', pageName)
}
</script>

<template>
  <section class="page-section container">
    <div class="get-help-heading text-center">
      <h1>Get Help</h1>
      <p>Choose the support that best matches your needs.</p>
    </div>

    <div class="urgent-panel">
      <div>
        <p class="urgent-title">If you are in immediate danger or having a crisis,<br />help is available right now.</p>
        <p class="mb-0">You are not alone. Support is just a call or click away.</p>
      </div>
      <div class="d-flex flex-column flex-sm-row gap-2">
        <button type="button" class="wireframe-button">
          Call 24/7 Hotline
        </button>
        <button type="button" class="wireframe-button">
          Emergency Contacts
        </button>
      </div>
    </div>

    <div class="row g-3 support-grid">
      <div class="col-12 col-md-6">
        <article class="support-card h-100">
          <div class="photo-placeholder small-photo">Photo</div>
          <div>
            <h2>Online<br />Counselling</h2>
            <button type="button" class="wireframe-button">Start Chat</button>
          </div>
        </article>
      </div>

      <div class="col-12 col-md-6">
        <article class="support-card h-100">
          <div class="photo-placeholder small-photo">Photo</div>
          <div>
            <h2>Local Services</h2>
            <button type="button" class="wireframe-button">⌕ Find Services</button>
          </div>
        </article>
      </div>

      <div class="col-12">
        <article class="support-card support-card-wide">
          <div class="photo-placeholder appointment-photo">Photo</div>
          <div>
            <h2>Book an Appointment</h2>
          </div>
          <button type="button" class="wireframe-button">Book Now</button>
        </article>
      </div>
    </div>

    <div class="start-panel">
      <div class="photo-placeholder tiny-photo">Photo</div>
      <div>
        <h2>Not sure where to begin?</h2>
        <p class="mb-0">We can help you take the first step.</p>
      </div>
      <div class="d-flex flex-column flex-sm-row gap-2">
        <button type="button" class="wireframe-button" @click="selectPage('assessment')">
          Take Self-Assessment
        </button>
        <button type="button" class="wireframe-button">
          Read Crisis Guide
        </button>
      </div>
    </div>
  </section>
</template>
