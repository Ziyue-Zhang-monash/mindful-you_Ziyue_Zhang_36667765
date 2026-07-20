<script setup>
import PlaceholderPage from '../PlaceholderPage.vue'

const emit = defineEmits(['select-page'])
</script>

<template>
  <PlaceholderPage
    eyebrow="About Mindful You"
    title="Our Mission"
    description="This page will explain the charity's purpose, team, values, and approach to accessible mental health support."
    @select-page="emit('select-page', $event)"
  />
</template>
