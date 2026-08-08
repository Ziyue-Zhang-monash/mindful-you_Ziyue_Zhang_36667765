<script setup>
import { computed, ref, watch } from 'vue'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth } from './firebase'

// Track the page currently shown in the main content.
const currentPage = ref('home')
const menuOpen = ref(false)

// Navigation items used to build the header links.
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'learn', label: 'Learn' },
  { id: 'assessment', label: 'Self-Assessment' },
  { id: 'get-help', label: 'Get Help' },
  { id: 'email', label: 'Email' },
  { id: 'self-help', label: 'Self-Help' },
  { id: 'family', label: 'For Family' },
  { id: 'about', label: 'About Us' }
]

// Content for the homepage cards.
const featureCards = [
  { title: 'Learn', action: 'Learn More', page: 'learn' },
  { title: 'Self-Assessment', action: 'Take Assessment', page: 'assessment' },
  { title: 'Get Help', action: 'Get Help', page: 'get-help' },
  { title: 'Self-Help', action: 'Explore Tools', page: 'self-help' },
  { title: 'For Family', action: 'Learn More', page: 'family' },
  { title: 'About Us', action: 'Learn More', page: 'about' }
]

// Support options displayed on the Get Help page.
// The template renders these options with v-for.
const supportOptions = [
  {
    title: 'Online Counselling',
    button: 'Start Chat',
    page: 'online-counselling',
    image: '/assets/online-counselling.png',
    description: 'Talk with a counsellor from a place that feels comfortable.',
    details: 'Online counselling can be a useful first step when you want to talk privately. Choose a time and write down the main thing you would like help with.'
  },
  {
    title: 'Local Services',
    button: 'Find Services',
    page: 'local-services',
    image: '/assets/local-services.png',
    description: 'Explore support options available in your local community.',
    details: 'Local services may include a GP, counsellor, community centre or university support service. Ask about cost, availability and how to make an appointment.'
  },
  {
    title: 'Book an Appointment',
    button: 'Book Now',
    page: 'appointment',
    image: '/assets/book-appointment.png',
    description: 'Choose a time to discuss the support that works for you.',
    details: 'Before an appointment, write down your questions and any changes you have noticed. This can make it easier to explain what support you need.'
  }
]

const urgentSupportPage = {
  title: 'Urgent Support',
  image: '/assets/family-support.png',
  description: 'Immediate support is available when you need it.',
  details: 'If someone is in immediate danger, contact local emergency services. If you need to talk, contact a 24/7 crisis support service in your area or speak with a trusted person now.'
}

const supportPageIds = ['online-counselling', 'local-services', 'appointment', 'urgent-support']

const currentSupportPage = computed(() => {
  if (currentPage.value === 'urgent-support') {
    return urgentSupportPage
  }

  return supportOptions.find((option) => option.page === currentPage.value)
})

// Articles displayed on the Learn page.
const learnCards = [
  {
    title: 'Understanding Your Feelings',
    image: '/assets/learn.png',
    text: 'Learn how to notice changes in your mood, energy and daily routine.',
    content: [
      'Feelings can change from day to day. Paying attention to patterns can help you understand what affects your wellbeing.',
      'Try noting your mood, energy, sleep and social connection for one week. You may notice that certain routines help you feel more settled.',
      'If difficult feelings are lasting or affecting daily life, speaking with someone you trust can be a helpful next step.'
    ]
  },
  {
    title: 'Small Steps Matter',
    image: '/assets/mindful-you-hero.png',
    text: 'Simple habits such as rest, movement and regular meals can support wellbeing.',
    content: [
      'Wellbeing does not need one big solution. Small actions repeated over time can make a difference.',
      'Choose one realistic action for today, such as taking a short walk, drinking water, preparing a meal or messaging a friend.',
      'Keep the action simple enough that it fits your current routine. You can add more when it starts to feel natural.'
    ]
  },
  {
    title: 'When to Ask for Help',
    image: '/assets/online-counselling.png',
    text: 'Talking with someone early can make it easier to find the right support.',
    content: [
      'You do not need to wait until a situation feels overwhelming before asking for support.',
      'It can help to speak with a friend, family member, counsellor, doctor or student support service about what has been happening.',
      'If you are in immediate danger, contact emergency services or a crisis support service in your area.'
    ]
  }
]

// Learning resources displayed in the Learn tables.
const learningResources = [
  { topic: 'Understanding stress', type: 'Guide', audience: 'Everyone' },
  { topic: 'Healthy sleep habits', type: 'Article', audience: 'Adults' },
  { topic: 'Managing strong feelings', type: 'Guide', audience: 'Everyone' },
  { topic: 'Building social connection', type: 'Article', audience: 'Young adults' },
  { topic: 'Asking for support', type: 'Checklist', audience: 'Everyone' },
  { topic: 'Supporting a friend', type: 'Guide', audience: 'Family and friends' },
  { topic: 'Preparing for counselling', type: 'Checklist', audience: 'Everyone' },
  { topic: 'Looking after your routine', type: 'Article', audience: 'Everyone' },
  { topic: 'Work and study wellbeing', type: 'Guide', audience: 'Students' },
  { topic: 'Finding local support', type: 'Directory', audience: 'Everyone' },
  { topic: 'Relaxation basics', type: 'Guide', audience: 'Everyone' }
]

// Simple activities displayed in the second Learn table.
const learningTools = [
  { tool: 'Breathing exercise', time: '2 minutes', focus: 'Calm the body' },
  { tool: 'Mood check-in', time: '5 minutes', focus: 'Notice feelings' },
  { tool: 'Sleep routine plan', time: '10 minutes', focus: 'Improve sleep' },
  { tool: 'Thought journal', time: '10 minutes', focus: 'Reflect on thoughts' },
  { tool: 'Grounding exercise', time: '5 minutes', focus: 'Return to the present' },
  { tool: 'Weekly support plan', time: '15 minutes', focus: 'Plan next steps' },
  { tool: 'Gratitude note', time: '3 minutes', focus: 'Notice positive moments' },
  { tool: 'Gentle movement', time: '10 minutes', focus: 'Release tension' },
  { tool: 'Contact list', time: '5 minutes', focus: 'Prepare support contacts' },
  { tool: 'Digital break plan', time: '10 minutes', focus: 'Create healthy boundaries' },
  { tool: 'Self-care checklist', time: '5 minutes', focus: 'Check daily needs' }
]

// Questions and choices used by the self-assessment page.
const assessmentQuestions = [
  {
    id: 'mood',
    question: 'How often have you felt low or worried recently?',
    options: ['Rarely', 'Sometimes', 'Often']
  },
  {
    id: 'sleep',
    question: 'How often has your sleep been difficult?',
    options: ['Rarely', 'Sometimes', 'Often']
  },
  {
    id: 'energy',
    question: 'How often have you had little energy for daily tasks?',
    options: ['Rarely', 'Sometimes', 'Often']
  },
  {
    id: 'connection',
    question: 'How often have you felt disconnected from other people?',
    options: ['Rarely', 'Sometimes', 'Often']
  },
  {
    id: 'support',
    question: 'How comfortable would you feel asking for support?',
    options: ['Comfortable', 'Not sure', 'Uncomfortable']
  }
]

// Tools shown on the Self-Help page.
const selfHelpTools = [
  {
    id: 'breathing',
    title: 'Breathing Space',
    image: '/assets/self-help.png',
    text: 'Pause for one minute. Breathe in slowly, then breathe out slowly.'
  },
  {
    id: 'check-in',
    title: 'Daily Check-in',
    image: '/assets/learn.png',
    text: 'Write down one feeling, one need and one small action for today.'
  },
  {
    id: 'sleep',
    title: 'Sleep Routine',
    image: '/assets/book-appointment.png',
    text: 'Keep a regular bedtime and reduce screen use before going to sleep.'
  }
]

// Information blocks shown on the For Family page.
const familySteps = [
  {
    title: 'Notice changes',
    text: 'Look for changes in mood, sleep, energy or usual routines.',
    details: 'Changes may include withdrawing from people, missing usual activities, sleeping much more or less, or finding routine tasks difficult. One change does not explain everything, but it can be a reason to check in.'
  },
  {
    title: 'Start a gentle conversation',
    text: 'Choose a quiet moment and listen without judging or rushing.',
    details: 'Start with what you have noticed, such as “I have noticed you seem tired lately.” Ask open questions and give the person time to answer. You do not need to solve everything in one conversation.'
  },
  {
    title: 'Find support together',
    text: 'Offer to help contact a counsellor, doctor or community service.',
    details: 'You can help by looking up local services, sitting with them while they make a call, or offering transport to an appointment. Remember that supporters also need breaks and support.'
  }
]

// Values shown on the About Us page.
const aboutValues = [
  { title: 'Respect', text: 'Everyone deserves to be heard and treated with dignity.' },
  { title: 'Accessibility', text: 'Information should be simple to understand and easy to find.' },
  { title: 'Connection', text: 'The right support can help people feel less alone.' }
]

// Local profiles store names and roles, not passwords.
const defaultAdmin = {
  name: 'Administrator',
  email: 'admin@mindfulyou.com',
  role: 'admin'
}
const savedUsers = localStorage.getItem('mindfulYouUsers')
const loadedUsers = savedUsers ? JSON.parse(savedUsers) : []
const userList = ref(
  loadedUsers.map((user) => ({ name: user.name, email: user.email, role: user.role || 'user' }))
)

// Keep an administrator role profile for the dashboard.
if (!userList.value.some((user) => user.role === 'admin')) {
  userList.value.push(defaultAdmin)
}
localStorage.setItem('mindfulYouUsers', JSON.stringify(userList.value))

const currentUser = ref(null)

// Show administrator-only navigation and pages.
const isAdmin = computed(() => currentUser.value?.role === 'admin')

// Change the current page and close the mobile menu.
// The admin page is allowed only for administrators.
const selectPage = (pageName) => {
  if (pageName === 'admin' && !isAdmin.value) {
    currentPage.value = 'home'
    return
  }

  currentPage.value = pageName
  menuOpen.value = false
  window.scrollTo(0, 0)
}

// State used by the login and registration form.
const registerMode = ref(false)
const authForm = ref({ name: '', email: '', password: '' })
const authErrors = ref({})
const authMessage = ref('')
const authBusy = ref(false)

// Validate the form before registration or login.
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

// Save local role profiles after a change.
const saveUsers = () => {
  localStorage.setItem('mindfulYouUsers', JSON.stringify(userList.value))
}

// Find a profile by its Firebase email address.
const getUserProfile = (email) => {
  return userList.value.find((user) => user.email === email)
}

// Show a short message instead of a Firebase error code.
const getAuthErrorMessage = (error) => {
  if (error.code === 'auth/email-already-in-use') {
    return 'This email is already registered.'
  }

  if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
    return 'Email or password is incorrect.'
  }

  if (error.code === 'auth/operation-not-allowed') {
    return 'Email/password sign-in must be enabled in Firebase.'
  }

  return 'Authentication failed. Please try again.'
}

// Register a new Firebase account or sign in to an existing one.
const submitAuthForm = async () => {
  authMessage.value = ''

  if (!validateAuthForm()) {
    return
  }

  const email = authForm.value.email.trim().toLowerCase()

  authBusy.value = true

  try {
    if (registerMode.value) {
      await createUserWithEmailAndPassword(auth, email, authForm.value.password)

      if (!getUserProfile(email)) {
        userList.value.push({ name: authForm.value.name.trim(), email, role: 'user' })
        saveUsers()
      }
    } else {
      await signInWithEmailAndPassword(auth, email, authForm.value.password)
    }

    authForm.value = { name: '', email: '', password: '' }
    selectPage('home')
  } catch (error) {
    authMessage.value = getAuthErrorMessage(error)
  } finally {
    authBusy.value = false
  }
}

// Keep the page in sync with the Firebase login state.
onAuthStateChanged(auth, (firebaseUser) => {
  if (!firebaseUser) {
    currentUser.value = null
    return
  }

  const email = firebaseUser.email.toLowerCase()
  let profile = getUserProfile(email)

  if (!profile) {
    profile = { name: email.split('@')[0], email, role: 'user' }
    userList.value.push(profile)
    saveUsers()
  }

  currentUser.value = profile
})

// Sign out from Firebase and return to the homepage.
const logout = async () => {
  await signOut(auth)
  selectPage('home')
}

// Delete a normal user account from the administrator page.
const deleteUser = (email) => {
  if (!isAdmin.value) {
    return
  }

  const user = userList.value.find((account) => account.email === email)

  if (!user || user.role === 'admin') {
    return
  }

  if (!window.confirm(`Delete the account for ${user.email}?`)) {
    return
  }

  userList.value = userList.value.filter((account) => account.email !== email)
  localStorage.setItem('mindfulYouUsers', JSON.stringify(userList.value))
}

// Each rating stores a service, score, and user email.
const savedRatings = localStorage.getItem('mindfulYouRatings')
const ratings = ref(savedRatings ? JSON.parse(savedRatings) : [])
const selectedScores = ref({})
const ratingMessage = ref('')

// Store answers and the result shown after the assessment is submitted.
const assessmentAnswers = ref({})
const assessmentResult = ref('')

// State used by the Learn, Get Help and Family pages.
const selectedArticle = ref(null)
const activeFamilyStep = ref('')

// State used by the self-help tools.
const activeTool = ref('')
const breathingSteps = ['Breathe in slowly for 4 seconds.', 'Hold your breath gently for 4 seconds.', 'Breathe out slowly for 6 seconds.']
const breathingStep = ref(0)
const dailyCheckIn = ref({ mood: '', note: '' })
const savedCheckIns = localStorage.getItem('mindfulYouCheckIns')
const checkIns = ref(savedCheckIns ? JSON.parse(savedCheckIns) : [])
const checkInMessage = ref('')
const sleepChecklist = ref({ time: false, screen: false, room: false })

// Email form state.
const emailAttachment = ref(null)
const emailBusy = ref(false)
const emailMessage = ref('')
const emailForm = ref({ recipient: '', subject: '', message: '' })
const emailAction = computed(() => `https://formsubmit.co/${encodeURIComponent(emailForm.value.recipient)}`)

// Open and close the selected Learn article.
const openArticle = (article) => {
  selectedArticle.value = article
  window.scrollTo(0, 0)
}

// Open the reviews page from the dedicated navigation button.
const openReviews = () => {
  currentPage.value = 'reviews'
  menuOpen.value = false
  window.scrollTo(0, 0)
}

const closeArticle = () => {
  selectedArticle.value = null
  window.scrollTo(0, 0)
}

// Open the selected support page.
const openSupport = (option) => {
  selectPage(option.page)
}

const showUrgentSupport = () => {
  selectPage('urgent-support')
}

// Open the support details that match the cloud recommendation.
const openAdviceSupport = () => {
  if (supportNeed.value === 'urgent') {
    showUrgentSupport()
    return
  }

  const optionIndex = supportNeed.value === 'talk' ? 0 : 2
  openSupport(supportOptions[optionIndex])
}

// Open one family topic at a time.
const toggleFamilyStep = (title) => {
  activeFamilyStep.value = activeFamilyStep.value === title ? '' : title
}

// Open a self-help tool from its card.
const openTool = (toolId) => {
  activeTool.value = toolId
}

// Move through the three breathing instructions.
const nextBreathingStep = () => {
  breathingStep.value = (breathingStep.value + 1) % breathingSteps.length
}

// Save a short daily check-in in local storage.
const saveCheckIn = () => {
  checkInMessage.value = ''

  if (!dailyCheckIn.value.mood || !dailyCheckIn.value.note.trim()) {
    checkInMessage.value = 'Please choose a mood and write a short note.'
    return
  }

  checkIns.value.unshift({
    mood: dailyCheckIn.value.mood,
    note: dailyCheckIn.value.note.trim(),
    date: new Date().toLocaleDateString()
  })
  localStorage.setItem('mindfulYouCheckIns', JSON.stringify(checkIns.value))
  dailyCheckIn.value = { mood: '', note: '' }
  checkInMessage.value = 'Your check-in has been saved.'
}

// Validate the email form before the browser uploads it.
const sendEmail = (event) => {
  emailMessage.value = ''

  if (!currentUser.value) {
    emailMessage.value = 'Please log in before sending an email.'
    event.preventDefault()
    return
  }

  if (!emailForm.value.recipient || !emailForm.value.subject || !emailForm.value.message) {
    emailMessage.value = 'Please complete the recipient, subject and message fields.'
    event.preventDefault()
    return
  }

  if (!emailAttachment.value) {
    emailMessage.value = 'Please choose a file to attach.'
    event.preventDefault()
    return
  }

  if (emailAttachment.value.size > 10 * 1024 * 1024) {
    emailMessage.value = 'The attachment must be smaller than 10 MB.'
    event.preventDefault()
    return
  }

  emailBusy.value = true
}

// Check the five answers and show a simple guidance message.
const submitAssessment = () => {
  const answers = assessmentQuestions.map((question) => assessmentAnswers.value[question.id])

  if (answers.some((answer) => !answer)) {
    assessmentResult.value = 'Please answer all questions before viewing your result.'
    return
  }

  const concernScore = answers.filter((answer) => answer === 'Often' || answer === 'Uncomfortable').length

  if (concernScore >= 3) {
    assessmentResult.value = 'You may benefit from talking with a support service.'
  } else if (concernScore >= 1) {
    assessmentResult.value = 'Some support may be useful. Try one of the self-help tools or contact someone you trust.'
  } else {
    assessmentResult.value = 'Your answers suggest that you are managing well today. Keep checking in with yourself.'
  }
}

// Clear the assessment answers and result.
const resetAssessment = () => {
  assessmentAnswers.value = {}
  assessmentResult.value = ''
}

// Calculate the average score for a service.
const getAverageRating = (serviceName) => {
  const serviceRatings = ratings.value.filter((rating) => rating.service === serviceName)

  if (serviceRatings.length === 0) {
    return 'No ratings yet'
  }

  const total = serviceRatings.reduce((sum, rating) => sum + rating.score, 0)
  return (total / serviceRatings.length).toFixed(1)
}

// Format the average score for display.
const formatAverageRating = (serviceName) => {
  const average = getAverageRating(serviceName)
  return average === 'No ratings yet' ? average : `${average} / 5`
}

// Count the ratings for a service.
const getRatingCount = (serviceName) => {
  return ratings.value.filter((rating) => rating.service === serviceName).length
}

// Get the current user's rating for a service.
const getUserRating = (serviceName) => {
  if (!currentUser.value) {
    return 'Not rated'
  }

  const userRating = ratings.value.find(
    (rating) => rating.service === serviceName && rating.userEmail === currentUser.value.email
  )

  return userRating ? `${userRating.score} / 5` : 'Not rated'
}

// Save or update a rating.
const submitRating = (serviceName) => {
  ratingMessage.value = ''

  if (!currentUser.value) {
    ratingMessage.value = 'Please log in before submitting a rating.'
    return
  }

  const selectedScore = selectedScores.value[serviceName] || 0

  if (selectedScore === 0) {
    ratingMessage.value = 'Please choose a score from 1 to 5.'
    return
  }

  const existingRating = ratings.value.find(
    (rating) => rating.service === serviceName && rating.userEmail === currentUser.value.email
  )

  if (existingRating) {
    existingRating.score = selectedScore
  } else {
    ratings.value.push({
      service: serviceName,
      score: selectedScore,
      userEmail: currentUser.value.email
    })
  }

  localStorage.setItem('mindfulYouRatings', JSON.stringify(ratings.value))
  ratingMessage.value = 'Rating saved successfully.'
  selectedScores.value[serviceName] = 0
}

// Search, sort and page state for the two Learn tables.
const resourceSearch = ref({ topic: '', type: '', audience: '' })
const resourceSort = ref({ key: 'topic', direction: 'asc' })
const resourcePage = ref(1)
const toolSearch = ref({ tool: '', time: '', focus: '' })
const toolSort = ref({ key: 'tool', direction: 'asc' })
const toolPage = ref(1)

// State used by the support finder on the Get Help page.
const supportNeed = ref('')
const supportAdvice = ref(null)
const supportAdviceLoading = ref(false)
const supportAdviceError = ref('')
const cloudFunctionUrl = 'https://a3.mindful-you.pages.dev/api/mental-health-tip'

// Return rows that contain the search text in every selected column.
const filterRows = (rows, search) => {
  return rows.filter((row) => {
    return Object.keys(search).every((key) => {
      return String(row[key]).toLowerCase().includes(search[key].toLowerCase())
    })
  })
}

// Sort text and number columns in either direction.
const sortRows = (rows, sortState) => {
  return [...rows].sort((first, second) => {
    const firstValue = first[sortState.key]
    const secondValue = second[sortState.key]
    const result = typeof firstValue === 'number'
      ? firstValue - secondValue
      : String(firstValue).localeCompare(String(secondValue))

    return sortState.direction === 'asc' ? result : -result
  })
}

const getPageRows = (rows, page) => rows.slice((page - 1) * 10, page * 10)

const filteredResourceRows = computed(() => filterRows(learningResources, resourceSearch.value))
const sortedResourceRows = computed(() => sortRows(filteredResourceRows.value, resourceSort.value))
const resourcePageRows = computed(() => getPageRows(sortedResourceRows.value, resourcePage.value))
const resourcePageCount = computed(() => Math.max(1, Math.ceil(sortedResourceRows.value.length / 10)))

const filteredToolRows = computed(() => filterRows(learningTools, toolSearch.value))
const sortedToolRows = computed(() => sortRows(filteredToolRows.value, toolSort.value))
const toolPageRows = computed(() => getPageRows(sortedToolRows.value, toolPage.value))
const toolPageCount = computed(() => Math.max(1, Math.ceil(sortedToolRows.value.length / 10)))

// Change a table sort column or reverse its direction.
const changeTableSort = (sortState, key) => {
  if (sortState.key === key) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortState.key = key
    sortState.direction = 'asc'
  }
}

const sortMark = (sortState, key) => {
  if (sortState.key !== key) {
    return ''
  }

  return sortState.direction === 'asc' ? ' ↑' : ' ↓'
}

// Ask the serverless function for advice based on the selected need.
const findSupport = async () => {
  if (!supportNeed.value) {
    supportAdviceError.value = 'Please choose the type of support you need.'
    return
  }

  supportAdviceLoading.value = true
  supportAdviceError.value = ''

  try {
    const response = await fetch(`${cloudFunctionUrl}?need=${supportNeed.value}`)

    if (!response.ok) {
      throw new Error('The support service is not available.')
    }

    supportAdvice.value = await response.json()
  } catch (error) {
    supportAdviceError.value = 'Support advice is not available right now.'
  } finally {
    supportAdviceLoading.value = false
  }
}

watch(resourceSearch, () => {
  resourcePage.value = 1
}, { deep: true })

watch(toolSearch, () => {
  toolPage.value = 1
}, { deep: true })

</script>

<template>
  <div class="app-shell">
    <!-- Site header and navigation. -->
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
            <button
              type="button"
              :class="['nav-link', { active: currentPage === 'reviews' }]"
              @click.stop="openReviews"
            >
              Reviews
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

    <!-- Homepage content. -->
    <main v-if="currentPage === 'home'">
      <!-- Main hero section. -->
      <section class="hero page-padding">
        <img
          class="photo-placeholder hero-image"
          src="/assets/mindful-you-hero.png"
          alt="A calm counselling room with a comfortable chair and plants"
        />
        <div class="hero-content">
          <h1>Mental Health Support Starts Here</h1>
          <p class="hero-intro">
            Explore practical information, self-assessment tools and support options in one place.
          </p>
          <div class="button-row hero-actions">
            <button class="action-button" type="button" @click="selectPage('assessment')">
              Start Self-Assessment
            </button>
            <button class="action-button" type="button" @click="selectPage('get-help')">
              Get Help
            </button>
          </div>
          <div class="hero-highlights">
            <span>Learn at your own pace</span>
            <span>Check in with yourself</span>
            <span>Find the right support</span>
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

    <!-- Learn page content. -->
    <main v-else-if="currentPage === 'learn'" class="content-page page-padding">
      <div class="page-title">
        <h1>Learn</h1>
        <p>Explore practical information for everyday mental wellbeing.</p>
      </div>

      <section v-if="selectedArticle" class="article-detail">
        <button class="back-button" type="button" @click="closeArticle">Back to articles</button>
        <img class="article-detail-image" :src="selectedArticle.image" :alt="selectedArticle.title" />
        <div class="article-detail-content">
          <h2>{{ selectedArticle.title }}</h2>
          <p v-for="paragraph in selectedArticle.content" :key="paragraph">{{ paragraph }}</p>
          <button class="action-button" type="button" @click="selectPage('get-help')">
            Explore Support
          </button>
        </div>
      </section>

      <section v-else class="article-grid">
        <article v-for="article in learnCards" :key="article.title" class="info-card">
          <img class="content-image" :src="article.image" :alt="article.title" />
          <div class="info-card-content">
            <h2>{{ article.title }}</h2>
            <p>{{ article.text }}</p>
            <button class="card-link" type="button" @click="openArticle(article)">
              Find Support →
            </button>
          </div>
        </article>
      </section>

      <section class="data-table-section learn-table-section">
        <h2>Mental Health Resources</h2>
        <p>Search the available topics and find a resource that matches your needs.</p>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>
                  <button type="button" @click="changeTableSort(resourceSort, 'topic')">
                    Topic{{ sortMark(resourceSort, 'topic') }}
                  </button>
                  <input v-model="resourceSearch.topic" type="search" placeholder="Search topic" />
                </th>
                <th>
                  <button type="button" @click="changeTableSort(resourceSort, 'type')">
                    Type{{ sortMark(resourceSort, 'type') }}
                  </button>
                  <input v-model="resourceSearch.type" type="search" placeholder="Search type" />
                </th>
                <th>
                  <button type="button" @click="changeTableSort(resourceSort, 'audience')">
                    Audience{{ sortMark(resourceSort, 'audience') }}
                  </button>
                  <input v-model="resourceSearch.audience" type="search" placeholder="Search audience" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in resourcePageRows" :key="row.topic">
                <td>{{ row.topic }}</td>
                <td>{{ row.type }}</td>
                <td>{{ row.audience }}</td>
              </tr>
              <tr v-if="resourcePageRows.length === 0">
                <td colspan="3">No matching resources.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-pagination">
          <button
            class="secondary-button"
            type="button"
            :disabled="resourcePage === 1"
            @click="resourcePage--"
          >
            Previous
          </button>
          <span>Page {{ resourcePage }} of {{ resourcePageCount }}</span>
          <button
            class="secondary-button"
            type="button"
            :disabled="resourcePage === resourcePageCount"
            @click="resourcePage++"
          >
            Next
          </button>
        </div>
      </section>

      <section class="data-table-section learn-table-section">
        <h2>Self-help Tools</h2>
        <p>Compare simple activities by the time they take and the support they provide.</p>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>
                  <button type="button" @click="changeTableSort(toolSort, 'tool')">
                    Tool{{ sortMark(toolSort, 'tool') }}
                  </button>
                  <input v-model="toolSearch.tool" type="search" placeholder="Search tool" />
                </th>
                <th>
                  <button type="button" @click="changeTableSort(toolSort, 'time')">
                    Time{{ sortMark(toolSort, 'time') }}
                  </button>
                  <input v-model="toolSearch.time" type="search" placeholder="Search time" />
                </th>
                <th>
                  <button type="button" @click="changeTableSort(toolSort, 'focus')">
                    Focus{{ sortMark(toolSort, 'focus') }}
                  </button>
                  <input v-model="toolSearch.focus" type="search" placeholder="Search focus" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in toolPageRows" :key="row.tool">
                <td>{{ row.tool }}</td>
                <td>{{ row.time }}</td>
                <td>{{ row.focus }}</td>
              </tr>
              <tr v-if="toolPageRows.length === 0">
                <td colspan="3">No matching tools.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-pagination">
          <button
            class="secondary-button"
            type="button"
            :disabled="toolPage === 1"
            @click="toolPage--"
          >
            Previous
          </button>
          <span>Page {{ toolPage }} of {{ toolPageCount }}</span>
          <button
            class="secondary-button"
            type="button"
            :disabled="toolPage === toolPageCount"
            @click="toolPage++"
          >
            Next
          </button>
        </div>
      </section>
    </main>

    <!-- Self-assessment page content. -->
    <main v-else-if="currentPage === 'assessment'" class="content-page page-padding">
      <div class="page-title">
        <h1>Self-Assessment</h1>
        <p>Answer these questions to reflect on how you have been feeling recently.</p>
      </div>

      <form class="assessment-form" @submit.prevent="submitAssessment">
        <fieldset v-for="question in assessmentQuestions" :key="question.id" class="assessment-question">
          <legend>{{ question.question }}</legend>
          <label v-for="option in question.options" :key="option" class="option-row">
            <input
              v-model="assessmentAnswers[question.id]"
              type="radio"
              :name="question.id"
              :value="option"
            />
            <span>{{ option }}</span>
          </label>
        </fieldset>

        <div class="assessment-actions">
          <button class="action-button" type="submit">View Result</button>
          <button class="secondary-button" type="button" @click="resetAssessment">Reset</button>
        </div>
      </form>

      <div v-if="assessmentResult" class="assessment-result">
        <h2>Your Result</h2>
        <p>{{ assessmentResult }}</p>
        <button class="card-link" type="button" @click="selectPage('get-help')">
          Explore Support →
        </button>
      </div>
    </main>

    <!-- Self-help page content. -->
    <main v-else-if="currentPage === 'self-help'" class="content-page page-padding">
      <div class="page-title">
        <h1>Self-Help</h1>
        <p>Try a small activity that fits into your day.</p>
      </div>

      <section class="tool-grid">
        <article v-for="tool in selfHelpTools" :key="tool.title" class="info-card">
          <img class="content-image" :src="tool.image" :alt="tool.title" />
          <div class="info-card-content">
            <h2>{{ tool.title }}</h2>
            <p>{{ tool.text }}</p>
            <button class="action-button" type="button" @click="openTool(tool.id)">Try This Tool</button>
          </div>
        </article>
      </section>

      <section v-if="activeTool === 'breathing'" class="tool-panel">
        <h2>Breathing Space</h2>
        <p>{{ breathingSteps[breathingStep] }}</p>
        <button class="action-button" type="button" @click="nextBreathingStep">Next Step</button>
      </section>

      <section v-if="activeTool === 'check-in'" class="tool-panel">
        <h2>Daily Check-in</h2>
        <form class="check-in-form" @submit.prevent="saveCheckIn">
          <label>
            Mood
            <select v-model="dailyCheckIn.mood">
              <option value="" disabled>Select your mood</option>
              <option>Good</option>
              <option>Okay</option>
              <option>Low</option>
              <option>Stressed</option>
            </select>
          </label>
          <label>
            What is on your mind?
            <textarea v-model="dailyCheckIn.note" rows="4"></textarea>
          </label>
          <button class="action-button" type="submit">Save Check-in</button>
        </form>
        <p v-if="checkInMessage" class="tool-message">{{ checkInMessage }}</p>
        <ul v-if="checkIns.length" class="check-in-list">
          <li v-for="entry in checkIns.slice(0, 3)" :key="entry.date + entry.note">
            <strong>{{ entry.date }} - {{ entry.mood }}</strong>
            <span>{{ entry.note }}</span>
          </li>
        </ul>
      </section>

      <section v-if="activeTool === 'sleep'" class="tool-panel">
        <h2>Sleep Routine</h2>
        <p>Tick the steps you would like to try tonight.</p>
        <label class="option-row"><input v-model="sleepChecklist.time" type="checkbox" /> Keep a regular bedtime</label>
        <label class="option-row"><input v-model="sleepChecklist.screen" type="checkbox" /> Put screens away before bed</label>
        <label class="option-row"><input v-model="sleepChecklist.room" type="checkbox" /> Prepare a quiet, comfortable room</label>
      </section>
    </main>

    <!-- For Family page content. -->
    <main v-else-if="currentPage === 'family'" class="content-page page-padding">
      <div class="page-title">
        <h1>For Family</h1>
        <p>Learn how to offer calm and practical support to someone you care about.</p>
      </div>

      <section class="family-layout">
        <img
          class="family-image"
          src="/assets/family-support.png"
          alt="Two family members having a supportive conversation"
        />
        <div class="family-content">
          <h2>Supporting someone starts with listening.</h2>
          <div class="family-step-list">
            <article v-for="step in familySteps" :key="step.title" class="family-step">
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
              <button class="card-link" type="button" @click="toggleFamilyStep(step.title)">
                {{ activeFamilyStep === step.title ? 'Hide Details' : 'Read More' }}
              </button>
              <p v-if="activeFamilyStep === step.title" class="family-details">{{ step.details }}</p>
            </article>
          </div>
          <button class="action-button" type="button" @click="selectPage('get-help')">
            Find Support Services
          </button>
        </div>
      </section>
    </main>

    <!-- About page content. -->
    <main v-else-if="currentPage === 'about'" class="content-page page-padding">
      <div class="page-title">
        <h1>About Us</h1>
        <p>Mindful You makes mental health information easier to find.</p>
      </div>

      <section class="about-layout">
        <img
          class="about-image"
          src="/assets/mindful-you-hero.png"
          alt="A calm and welcoming support room"
        />
        <div class="about-content">
          <h2>Our purpose</h2>
          <p>
            Mindful You connects people with clear information, self-help ideas and support services.
            The website is designed to be a calm first step when someone is not sure where to begin.
          </p>
          <div class="value-list">
            <article v-for="value in aboutValues" :key="value.title" class="value-card">
              <h3>{{ value.title }}</h3>
              <p>{{ value.text }}</p>
            </article>
          </div>
          <button class="action-button" type="button" @click="selectPage('get-help')">
            Explore Get Help
          </button>
        </div>
      </section>
    </main>

    <!-- Get Help page content. -->
    <main v-else-if="currentPage === 'get-help'" class="get-help page-padding">
      <!-- Crisis message and support actions. -->
      <div class="page-title">
        <h1>Get Help</h1>
        <p>Choose the support that best matches your needs.</p>
      </div>

      <section class="crisis-panel">
        <div>
          <h2>If you are in immediate danger or having a crisis, help is available now.</h2>
          <p>You are not alone. Support is just a call or click away.</p>
        </div>
        <div class="button-column">
          <button class="action-button" type="button" @click="showUrgentSupport">Call 24/7 Hotline</button>
          <button class="action-button" type="button" @click="showUrgentSupport">Emergency Contacts</button>
        </div>
      </section>

      <section class="support-finder-panel">
        <div>
          <h2>Find the Right Support</h2>
          <p>Choose what you need and receive a suggested next step.</p>
        </div>
        <div class="support-finder-form">
          <label for="support-need">I need help with</label>
          <select id="support-need" v-model="supportNeed">
            <option value="">Select an option</option>
            <option value="urgent">Immediate or urgent support</option>
            <option value="talk">Talking to someone</option>
            <option value="appointment">Booking an appointment</option>
          </select>
          <button class="action-button" type="button" :disabled="supportAdviceLoading" @click="findSupport">
            {{ supportAdviceLoading ? 'Finding Support...' : 'Find Support' }}
          </button>
        </div>
        <p v-if="supportAdviceError" class="form-error">{{ supportAdviceError }}</p>
        <div v-if="supportAdvice" class="support-advice">
          <h3>{{ supportAdvice.title }}</h3>
          <p>{{ supportAdvice.message }}</p>
          <button class="secondary-button" type="button" @click="openAdviceSupport">
            {{ supportAdvice.action }}
          </button>
        </div>
      </section>

      <section class="help-grid">
        <article v-for="option in supportOptions" :key="option.title" class="help-card">
          <img class="service-image" :src="option.image" :alt="option.title" />
          <div class="help-card-content">
            <h2>{{ option.title }}</h2>
            <p>{{ option.description }}</p>
            <button class="action-button" type="button" @click="openSupport(option)">{{ option.button }}</button>
          </div>
        </article>
      </section>

      <section class="start-panel">
        <img
          class="tiny-photo"
          src="/assets/book-appointment.png"
          alt="Calendar and notebook"
        />
        <div>
          <h2>Not sure where to begin?</h2>
          <p>We can help you take the first step.</p>
        </div>
        <div class="button-row">
          <button class="action-button" type="button" @click="selectPage('assessment')">
            Take Self-Assessment
          </button>
          <button class="action-button" type="button" @click="showUrgentSupport">Read Crisis Guide</button>
        </div>
      </section>

    </main>

    <!-- Dedicated support page content. -->
    <main v-else-if="supportPageIds.includes(currentPage)" class="content-page page-padding support-service-page">
      <button class="back-button" type="button" @click="selectPage('get-help')">Back to Get Help</button>
      <div class="page-title">
        <h1>{{ currentSupportPage.title }}</h1>
        <p>{{ currentSupportPage.description }}</p>
      </div>

      <section class="support-service-layout">
        <img class="service-image" :src="currentSupportPage.image" :alt="currentSupportPage.title" />
        <div>
          <h2>How we can help</h2>
          <p>{{ currentSupportPage.details }}</p>
          <button class="action-button" type="button" @click="selectPage('email')">Contact Support</button>
        </div>
      </section>
    </main>

    <!-- Email page. -->
    <main v-else-if="currentPage === 'email'" class="content-page page-padding email-page">
      <div class="page-title">
        <h1>Send an Email</h1>
        <p>Send a message and include a file attachment.</p>
      </div>

      <form
        class="email-form"
        :action="emailAction"
        method="POST"
        target="_blank"
        enctype="multipart/form-data"
        @submit="sendEmail"
      >
        <label>
          Recipient email
          <input v-model="emailForm.recipient" name="to_email" type="email" required />
        </label>

        <label>
          Subject
          <input v-model="emailForm.subject" name="subject" type="text" required />
        </label>

        <label>
          Message
          <textarea v-model="emailForm.message" name="message" rows="6" required></textarea>
        </label>

        <input type="hidden" name="_subject" :value="emailForm.subject" />
        <input type="hidden" name="name" :value="currentUser?.name" />
        <input type="hidden" name="email" :value="currentUser?.email" />

        <label>
          Attachment
          <input
            name="attachment"
            type="file"
            required
            @change="emailAttachment = $event.target.files[0] || null"
          />
        </label>

        <button class="action-button" type="submit" :disabled="emailBusy">
          {{ emailBusy ? 'Sending...' : 'Send Email' }}
        </button>
      </form>

      <p v-if="emailMessage" class="auth-message">{{ emailMessage }}</p>
      <p class="form-note">The first submission to a new recipient may require email confirmation.</p>
    </main>

    <!-- Reviews and rating page. -->
    <main v-else-if="currentPage === 'reviews'" class="reviews-page page-padding">
      <div class="page-title">
        <h1>Reviews</h1>
        <p>See how users rate our support services.</p>
      </div>

      <section class="review-grid">
        <article v-for="option in supportOptions" :key="option.title" class="review-card">
          <img class="review-image" :src="option.image" :alt="option.title" />
          <h2>{{ option.title }}</h2>
          <p class="my-rating">My Rating: {{ getUserRating(option.title) }}</p>
          <p>{{ getRatingCount(option.title) }} rating(s)</p>
          <p class="average-score">Average Rating: {{ formatAverageRating(option.title) }}</p>

          <label class="rating-score-label">
            Score
            <select v-model.number="selectedScores[option.title]">
              <option :value="0" disabled>Select a score</option>
              <option v-for="score in 5" :key="score" :value="score">{{ score }}</option>
            </select>
          </label>

          <button class="action-button" type="button" @click="submitRating(option.title)">
            Submit Rating
          </button>
        </article>
      </section>

      <p v-if="ratingMessage" class="rating-message">{{ ratingMessage }}</p>
      <p v-if="!currentUser" class="login-hint">Log in to submit a rating.</p>
    </main>

    <!-- Login and registration page. -->
    <main v-else-if="currentPage === 'login'" class="auth-page page-padding">
      <div class="page-title">
        <h1>{{ registerMode ? 'Register' : 'Login' }}</h1>
        <p>{{ registerMode ? 'Create an account with Firebase Authentication.' : 'Log in with Firebase Authentication.' }}</p>
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

        <button class="action-button" type="submit" :disabled="authBusy">
          {{ authBusy ? 'Please wait...' : (registerMode ? 'Create Account' : 'Login') }}
        </button>
      </form>

      <p v-if="authMessage" class="auth-message">{{ authMessage }}</p>

    <button class="switch-auth-button" type="button" @click="registerMode = !registerMode">
        {{ registerMode ? 'Already have an account? Login' : 'Need an account? Register' }}
      </button>
    </main>

    <!-- Administrator-only page. -->
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
            <button
              v-if="user.role !== 'admin'"
              class="delete-button"
              type="button"
              @click="deleteUser(user.email)"
            >
              Delete
            </button>
          </li>
        </ul>
      </section>
    </main>

    <!-- Keep an empty page only for an unknown page name. -->
    <main v-else class="blank-page"></main>

    <!-- Footer content. -->
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
