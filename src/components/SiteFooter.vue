<script setup>
const props = defineProps({
  activePage: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select-page'])

// The brand button returns the visitor to the homepage without adding another
// navigation system to the footer.
const selectPage = (pageName) => {
  emit('select-page', pageName)
}
</script>

<template>
  <footer class="site-footer mt-5">
    <div class="container py-5">
      <div v-if="props.activePage !== 'get-help'" class="row g-4">
        <div class="col-12 col-md-3 footer-column">
          <button class="footer-brand" type="button" @click="selectPage('home')">
            <span class="brand-name">Mindful You</span>
            <span class="brand-tagline">Mental Health Support</span>
          </button>
          <p class="mt-3 mb-0 footer-copy">
            Empowering minds. Supporting<br />
            well-being. Building a healthier<br />
            tomorrow.
          </p>
        </div>

        <div class="col-6 col-md-3 footer-column">
          <h2 class="footer-heading">Quick Links</h2>
        </div>

        <div class="col-6 col-md-3 footer-column">
          <h2 class="footer-heading">Resources</h2>
        </div>

        <div class="col-12 col-md-3 footer-column">
          <h2 class="footer-heading">Contact Us</h2>
          <p class="contact-copy">
            123 Way<br />
            Care City, CA 12345<br /><br />
            info@mindfulyou.com<br /><br />
            (123) 456-7890<br /><br />
            Mon - Sun: 24/7
          </p>
        </div>
      </div>

      <div v-else class="row g-4">
        <div class="col-6 col-md-3 footer-column">
          <h2 class="footer-heading">Quick Links</h2>
        </div>

        <div class="col-6 col-md-3 footer-column">
          <h2 class="footer-heading">Resources</h2>
        </div>

        <div class="col-6 col-md-3 footer-column">
          <h2 class="footer-heading">Contact Us</h2>
          <p class="contact-copy">
            123 Way<br />
            Care City, CA 12345<br /><br />
            info@mindfulyou.com<br /><br />
            (123) 456-7890<br /><br />
            Mon - Sun: 24/7
          </p>
        </div>

        <div class="col-6 col-md-3 footer-column">
          <h2 class="footer-heading">Follow Us</h2>
        </div>
      </div>
    </div>
  </footer>
</template>
