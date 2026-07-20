<script setup>
import PlaceholderPage from '../PlaceholderPage.vue'

const emit = defineEmits(['select-page'])
</script>

<template>
  <PlaceholderPage
    eyebrow="Learn at your own pace"
    title="Learn About Mental Health"
    description="Short, plain-English explanations about anxiety, stress, sleep, and common mental health concerns will be added here."
    @select-page="emit('select-page', $event)"
  />
</template>
