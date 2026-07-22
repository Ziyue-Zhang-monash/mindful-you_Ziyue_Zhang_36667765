<script setup>
import { computed, ref } from 'vue'

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

// This array is the data source for the support cards on the Get Help page.
// Keeping repeated content in data makes the template shorter and easier to read.
const supportOptions = [
  { title: 'Online Counselling', button: 'Start Chat', wide: false },
  { title: 'Local Services', button: 'Find Services', wide: false },
  { title: 'Book an Appointment', button: 'Book Now', wide: true }
]

// Store a small local account list for this assignment's authentication demo.
// New registrations always receive the normal user role.
const defaultAdmin = {
  name: 'Administrator',
  email: 'admin@mindfulyou.com',
  password: 'admin123',
  role: 'admin'
}
const savedUsers = localStorage.getItem('mindfulYouUsers')
const loadedUsers = savedUsers ? JSON.parse(savedUsers) : []
const userList = ref(loadedUsers.map((user) => ({ ...user, role: user.role || 'user' })))

// Add one fixed administrator account so the second role can be tested immediately.
if (!userList.value.some((user) => user.role === 'admin')) {
  userList.value.push(defaultAdmin)
  localStorage.setItem('mindfulYouUsers', JSON.stringify(userList.value))
}

const savedUser = localStorage.getItem('mindfulYouCurrentUser')
const savedUserData = savedUser ? JSON.parse(savedUser) : null
const currentUser = ref(
  savedUserData ? { ...savedUserData, role: savedUserData.role || 'user' } : null
)

// This computed value controls administrator-only navigation and page content.
const isAdmin = computed(() => currentUser.value?.role === 'admin')

// Header buttons, homepage cards, and authentication actions use this function
// to change the visible page. Admin pages are protected by this small check.
const selectPage = (pageName) => {
  if (pageName === 'admin' && !isAdmin.value) {
    currentPage.value = 'home'
    return
  }

  currentPage.value = pageName
  menuOpen.value = false
  window.scrollTo(0, 0)
}

// These refs control the login/register form and its simple validation messages.
const registerMode = ref(false)
const authForm = ref({ name: '', email: '', password: '' })
const authErrors = ref({})
const authMessage = ref('')

// Check required values, email format, and password length before authentication.
const validateAuthForm = () => {
  const errors = {}

  if (registerMode.value && !authForm.value.name.trim()) {
    errors.name = 'Name is required.'
  }

  if (!authForm.value.email.trim()) {
    errors.email = 'Email is required.'
  } else if (!/^\S+@\S+\.\S+$/.test(authForm.value.email)) {
    errors.email = 'Please enter a valid email.'
  }

  if (authForm.value.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  authErrors.value = errors
  return Object.keys(errors).length === 0
}

// Register a user or check the entered details against the saved user list.
const submitAuthForm = () => {
  authMessage.value = ''

  if (!validateAuthForm()) {
    return
  }

  const email = authForm.value.email.trim().toLowerCase()

  if (registerMode.value) {
    const userExists = userList.value.some((user) => user.email === email)

    if (userExists) {
      authMessage.value = 'This email is already registered.'
      return
    }

    userList.value.push({
      name: authForm.value.name.trim(),
      email,
      password: authForm.value.password,
      role: 'user'
    })
    localStorage.setItem('mindfulYouUsers', JSON.stringify(userList.value))
    authMessage.value = 'Account created. You can now log in.'
    registerMode.value = false
    authForm.value = { name: '', email, password: '' }
    return
  }

  const user = userList.value.find(
    (savedAccount) => savedAccount.email === email && savedAccount.password === authForm.value.password
  )

  if (!user) {
    authMessage.value = 'Email or password is incorrect.'
    return
  }

  currentUser.value = { name: user.name, email: user.email, role: user.role }
  localStorage.setItem('mindfulYouCurrentUser', JSON.stringify(currentUser.value))
  authForm.value = { name: '', email: '', password: '' }
  selectPage('home')
}

// Clear the current user and return to the homepage.
const logout = () => {
  currentUser.value = null
  localStorage.removeItem('mindfulYouCurrentUser')
  selectPage('home')
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
          <li v-if="!currentUser">
            <button
              type="button"
              :class="['nav-link', { active: currentPage === 'login' }]"
              @click="selectPage('login')"
            >
              Login
            </button>
          </li>
          <li v-else class="user-menu">
            <span class="user-label">Hi, {{ currentUser.name }} ({{ currentUser.role }})</span>
            <button class="nav-link" type="button" @click="logout">Logout</button>
          </li>
          <li v-if="isAdmin">
            <button
              class="nav-link"
              type="button"
              :class="{ active: currentPage === 'admin' }"
              @click="selectPage('admin')"
            >
              Admin Dashboard
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
        <article
          v-for="option in supportOptions"
          :key="option.title"
          :class="['help-card', { 'appointment-card': option.wide }]"
        >
          <div class="small-photo photo-placeholder">Photo</div>
          <h2>{{ option.title }}</h2>
          <button class="action-button" type="button">{{ option.button }}</button>
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

    <!-- This page provides the simple register and login flow required by C.1. -->
    <main v-else-if="currentPage === 'login'" class="auth-page page-padding">
      <div class="page-title">
        <h1>{{ registerMode ? 'Register' : 'Login' }}</h1>
        <p>{{ registerMode ? 'Create an account to continue.' : 'Log in to your account.' }}</p>
      </div>

      <form class="auth-form" @submit.prevent="submitAuthForm">
        <label v-if="registerMode">
          Name
          <input v-model="authForm.name" type="text" />
          <span v-if="authErrors.name" class="form-error">{{ authErrors.name }}</span>
        </label>

        <label>
          Email
          <input v-model="authForm.email" type="text" />
          <span v-if="authErrors.email" class="form-error">{{ authErrors.email }}</span>
        </label>

        <label>
          Password
          <input v-model="authForm.password" type="password" />
          <span v-if="authErrors.password" class="form-error">{{ authErrors.password }}</span>
        </label>

        <button class="action-button" type="submit">
          {{ registerMode ? 'Create Account' : 'Login' }}
        </button>
      </form>

      <p v-if="authMessage" class="auth-message">{{ authMessage }}</p>

    <button class="switch-auth-button" type="button" @click="registerMode = !registerMode">
        {{ registerMode ? 'Already have an account? Login' : 'Need an account? Register' }}
      </button>
    </main>

    <!-- Only administrators can reach this page through the guarded navigation. -->
    <main v-else-if="currentPage === 'admin'" class="admin-page page-padding">
      <div class="page-title">
        <h1>Admin Dashboard</h1>
        <p>Administrator-only information.</p>
      </div>

      <section class="admin-panel">
        <h2>Registered Users</h2>
        <p>Total accounts: {{ userList.length }}</p>

        <ul class="user-list">
          <li v-for="user in userList" :key="user.email">
            <span>{{ user.name }} - {{ user.email }}</span>
            <strong>{{ user.role }}</strong>
          </li>
        </ul>
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
