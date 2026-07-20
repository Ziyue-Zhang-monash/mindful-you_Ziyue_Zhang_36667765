<script setup>
import PlaceholderPage from '../PlaceholderPage.vue'

const emit = defineEmits(['select-page'])
</script>

<template>
  <PlaceholderPage
    eyebrow="Support someone you care about"
    title="For Family and Carers"
    description="Guidance about noticing changes, starting a conversation, and finding further support will be added here."
    @select-page="emit('select-page', $event)"
  />
</template>
