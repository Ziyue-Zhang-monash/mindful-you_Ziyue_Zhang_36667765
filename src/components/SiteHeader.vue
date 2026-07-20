<script setup>
import { ref } from 'vue'

const props = defineProps({
  activePage: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select-page'])
const mobileMenuOpen = ref(false)

// These labels are kept in one small array so the desktop and mobile navigation
// use exactly the same page names and do not drift apart.
const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'learn', label: 'Learn' },
  { id: 'assessment', label: 'Self-Assessment' },
  { id: 'get-help', label: 'Get Help' },
  { id: 'self-help', label: 'Self-Help' },
  { id: 'family', label: 'For Family' },
  { id: 'about', label: 'About Us' }
]

// Selecting a page also closes the mobile menu, so the user can immediately see
// the selected content on a small screen.
const selectPage = (pageName) => {
  emit('select-page', pageName)
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="site-header border-bottom">
    <nav class="navbar navbar-expand-lg" aria-label="Main navigation">
      <div class="container">
        <button class="navbar-brand brand-button" type="button" @click="selectPage('home')">
          <span class="brand-name">Mindful You</span>
          <span class="brand-tagline">Mental Health Support</span>
        </button>

        <button
          class="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          :aria-expanded="mobileMenuOpen"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div :class="['navbar-collapse', 'collapse', { show: mobileMenuOpen }]">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li v-for="item in menuItems" :key="item.id" class="nav-item">
              <button
                type="button"
                :class="['nav-link nav-button', { active: props.activePage === item.id }]"
                @click="selectPage(item.id)"
              >
                {{ item.label }}
              </button>
            </li>
            <li class="nav-item ms-lg-2 mt-2 mt-lg-0">
              <button
                type="button"
                class="btn btn-emergency"
                @click="selectPage('get-help')"
              >
                Emergency Help
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
