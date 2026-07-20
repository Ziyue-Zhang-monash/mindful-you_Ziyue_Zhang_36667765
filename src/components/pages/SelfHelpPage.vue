<script setup>
import PlaceholderPage from '../PlaceholderPage.vue'

const emit = defineEmits(['select-page'])
</script>

<template>
  <PlaceholderPage
    eyebrow="Small actions can help"
    title="Self-Help Resources"
    description="Breathing exercises, emotion regulation methods, and short practical tools will be collected on this page."
    @select-page="emit('select-page', $event)"
  />
</template>
