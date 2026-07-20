<script setup>
import PlaceholderPage from '../PlaceholderPage.vue'

const emit = defineEmits(['select-page'])
</script>

<template>
  <PlaceholderPage
    eyebrow="A private first step"
    title="Self-Assessment"
    description="A short reflection tool will help visitors think about their recent feelings without presenting a medical diagnosis."
    @select-page="emit('select-page', $event)"
  />
</template>
