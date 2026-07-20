<script setup>
import { ref } from 'vue'

// The current page is the only piece of state needed for this small assignment.
const currentPage = ref('home')
const menuOpen = ref(false)

// The navigation labels are stored in an array so v-for can render them simply.
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'learn', label: 'Learn' },
  { id: 'assessment', label: 'Self-Assessment' },
  { id: 'get-help', label: 'Get Help' },
  { id: 'self-help', label: 'Self-Help' },
  { id: 'family', label: 'For Family' },
  { id: 'about', label: 'About Us' }
]

// The card content is also data so the six repeated cards only need one template.
const featureCards = [
  { title: 'Learn', action: 'Learn More', page: 'learn' },
  { title: 'Self-Assessment', action: 'Take Assessment', page: 'assessment' },
  { title: 'Get Help', action: 'Get Help', page: 'get-help' },
  { title: 'Self-Help', action: 'Explore Tools', page: 'self-help' },
  { title: 'For Family', action: 'Learn More', page: 'family' },
  { title: 'About Us', action: 'Learn More', page: 'about' }
]

// Header buttons, homepage cards, and selected call-to-action buttons use this
// same small function to change the visible page.
const selectPage = (pageName) => {
  currentPage.value = pageName
  menuOpen.value = false
  window.scrollTo(0, 0)
}
</script>

<template>
  <div class="app-shell">
    <!-- The header is shared by every visible page in this small single-file app. -->
    <header class="site-header">
      <nav class="navigation" aria-label="Main navigation">
        <button class="brand" type="button" @click="selectPage('home')">
          <span class="brand-name">Mindful You</span>
          <span class="brand-tagline">Mental Health Support</span>
        </button>

        <button class="menu-button" type="button" @click="menuOpen = !menuOpen">
          Menu
        </button>

        <ul :class="['nav-list', { open: menuOpen }]">
          <li v-for="item in navItems" :key="item.id">
            <button
              type="button"
              :class="['nav-link', { active: currentPage === item.id }]"
              @click="selectPage(item.id)"
            >
              {{ item.label }}
            </button>
          </li>
          <li>
            <button class="emergency-button" type="button" @click="selectPage('get-help')">
              Emergency Help
            </button>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Home is the first confirmed screen from the supplied wireframe. -->
    <main v-if="currentPage === 'home'">
      <!-- The homepage follows the first supplied wireframe from top to bottom. -->
      <section class="hero page-padding">
        <div class="photo-placeholder">Photo</div>
        <div class="hero-content">
          <h1>Mental Health<br />Support Starts<br />Here</h1>
          <div class="button-row">
            <button class="action-button" type="button" @click="selectPage('assessment')">
              Start Self-<br />Assessment
            </button>
            <button class="action-button" type="button" @click="selectPage('get-help')">
              Get Help
            </button>
          </div>
        </div>
      </section>

      <section class="feature-grid page-padding" aria-label="Website sections">
        <article v-for="card in featureCards" :key="card.page" class="feature-card">
          <h2>{{ card.title }}</h2>
          <button class="card-link" type="button" @click="selectPage(card.page)">
            {{ card.action }} →
          </button>
        </article>
      </section>

      <section class="support-banner page-padding">
        <div>
          <h2>Need Immediate Support?</h2>
          <p>
            If you are in crisis or having thoughts of harming yourself or others,<br />
            help is available 24 hours a day, 7 days a week.
          </p>
        </div>
        <button class="action-button" type="button" @click="selectPage('get-help')">
          Get Urgent Help (24/7)
        </button>
      </section>
    </main>

    <!-- Get Help is the second confirmed screen from the supplied wireframe. -->
    <main v-else-if="currentPage === 'get-help'" class="get-help page-padding">
      <!-- The Get Help page follows the second supplied wireframe. -->
      <div class="page-title">
        <h1>Get Help</h1>
        <p>Choose the support that best matches your needs.</p>
      </div>

      <section class="crisis-panel">
        <div>
          <h2>
            If you are in immediate danger or having a crisis,<br />
            help is available right now.
          </h2>
          <p>You are not alone. Support is just a call or click away.</p>
        </div>
        <div class="button-column">
          <button class="action-button" type="button">Call 24/7 Hotline</button>
          <button class="action-button" type="button">Emergency Contacts</button>
        </div>
      </section>

      <section class="help-grid">
        <article class="help-card">
          <div class="small-photo photo-placeholder">Photo</div>
          <div>
            <h2>Online<br />Counselling</h2>
            <button class="action-button" type="button">Start Chat</button>
          </div>
        </article>

        <article class="help-card">
          <div class="small-photo photo-placeholder">Photo</div>
          <div>
            <h2>Local Services</h2>
            <button class="action-button" type="button">⌕ Find Services</button>
          </div>
        </article>

        <article class="help-card appointment-card">
          <div class="small-photo photo-placeholder">Photo</div>
          <h2>Book an Appointment</h2>
          <button class="action-button" type="button">Book Now</button>
        </article>
      </section>

      <section class="start-panel">
        <div class="tiny-photo photo-placeholder">Photo</div>
        <div>
          <h2>Not sure where to begin?</h2>
          <p>We can help you take the first step.</p>
        </div>
        <div class="button-row">
          <button class="action-button" type="button" @click="selectPage('assessment')">
            Take Self-Assessment
          </button>
          <button class="action-button" type="button">Read Crisis Guide</button>
        </div>
      </section>
    </main>

    <!-- Unspecified pages intentionally remain empty until their content is confirmed. -->
    <main v-else class="blank-page"></main>

    <!-- The footer uses the two different column arrangements shown in the wireframes. -->
    <footer class="site-footer page-padding">
      <div v-if="currentPage === 'get-help'" class="footer-grid">
        <h2>Quick Links</h2>
        <h2>Resources</h2>
        <div>
          <h2>Contact Us</h2>
          <p>123 Way<br />Care City, CA 12345</p>
          <p>info@mindfulyou.com</p>
          <p>(123) 456-7890</p>
          <p>Mon - Sun: 24/7</p>
        </div>
        <h2>Follow Us</h2>
      </div>

      <div v-else class="footer-grid">
        <div>
          <button class="brand footer-brand" type="button" @click="selectPage('home')">
            <span class="brand-name">Mindful You</span>
            <span class="brand-tagline">Mental Health Support</span>
          </button>
          <p>Empowering minds. Supporting<br />well-being. Building a healthier<br />tomorrow.</p>
        </div>
        <h2>Quick Links</h2>
        <h2>Resources</h2>
        <div>
          <h2>Contact Us</h2>
          <p>123 Way<br />Care City, CA 12345</p>
          <p>info@mindfulyou.com</p>
          <p>(123) 456-7890</p>
          <p>Mon - Sun: 24/7</p>
        </div>
      </div>
    </footer>
  </div>
</template>
