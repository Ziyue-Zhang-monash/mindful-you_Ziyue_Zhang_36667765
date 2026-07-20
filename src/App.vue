<script setup>
import { ref } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import HomePage from './components/pages/HomePage.vue'
import LearnPage from './components/pages/LearnPage.vue'
import AssessmentPage from './components/pages/AssessmentPage.vue'
import GetHelpPage from './components/pages/GetHelpPage.vue'
import SelfHelpPage from './components/pages/SelfHelpPage.vue'
import FamilyPage from './components/pages/FamilyPage.vue'
import AboutPage from './components/pages/AboutPage.vue'

// The active page is kept in one simple ref so the navigation is easy to follow.
// This first version does not need a full routing library because the assessment
// asks for a responsive Vue application rather than URL-based navigation.
const activePage = ref('home')

// Shared navigation events from the header, cards, and call-to-action buttons all
// use the same function. Keeping this action in App.vue gives the application one
// clear source of truth for the current page.
const selectPage = (pageName) => {
  activePage.value = pageName
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="app-shell">
    <SiteHeader :active-page="activePage" @select-page="selectPage" />

    <main>
      <!--
        An explicit v-if chain is used instead of a dynamic component registry.
        The repeated structure is easier to read for this beginner-friendly project.
      -->
      <HomePage v-if="activePage === 'home'" @select-page="selectPage" />
      <LearnPage v-else-if="activePage === 'learn'" @select-page="selectPage" />
      <AssessmentPage
        v-else-if="activePage === 'assessment'"
        @select-page="selectPage"
      />
      <GetHelpPage v-else-if="activePage === 'get-help'" @select-page="selectPage" />
      <SelfHelpPage v-else-if="activePage === 'self-help'" @select-page="selectPage" />
      <FamilyPage v-else-if="activePage === 'family'" @select-page="selectPage" />
      <AboutPage v-else-if="activePage === 'about'" @select-page="selectPage" />
    </main>

    <SiteFooter :active-page="activePage" @select-page="selectPage" />
  </div>
</template>
