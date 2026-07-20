<script setup>
const emit = defineEmits(['select-page'])

const quickLinks = [
  { id: 'learn', label: 'Learn' },
  { id: 'get-help', label: 'Get Help' },
  { id: 'self-help', label: 'Self-Help' },
  { id: 'family', label: 'For Family' }
]

// Footer links use the same page-selection event as the header. This keeps the
// footer useful without adding a second navigation system.
const selectPage = (pageName) => {
  emit('select-page', pageName)
}
</script>

<template>
  <footer class="site-footer mt-5">
    <div class="container py-5">
      <div class="row g-4">
        <div class="col-12 col-md-5">
          <button class="footer-brand" type="button" @click="selectPage('home')">
            <span class="brand-name">Mindful You</span>
            <span class="brand-tagline">Mental Health Support</span>
          </button>
          <p class="mt-3 mb-0 footer-copy">
            Empowering minds. Supporting well-being. Building a healthier tomorrow.
          </p>
        </div>

        <div class="col-6 col-md-3">
          <h2 class="footer-heading">Quick Links</h2>
          <ul class="list-unstyled mb-0">
            <li v-for="link in quickLinks" :key="link.id" class="mb-2">
              <button class="footer-link" type="button" @click="selectPage(link.id)">
                {{ link.label }}
              </button>
            </li>
          </ul>
        </div>

        <div class="col-6 col-md-4">
          <h2 class="footer-heading">Contact Us</h2>
          <p class="mb-1">Contact details will be added after verification.</p>
          <p class="mb-0">This student project is not an emergency service.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
