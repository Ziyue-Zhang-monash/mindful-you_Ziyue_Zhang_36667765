<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  eyebrow: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select-page'])
</script>

<template>
  <section class="placeholder-page container py-5">
    <div class="placeholder-card text-center mx-auto">
      <p class="eyebrow">{{ props.eyebrow }}</p>
      <h1>{{ props.title }}</h1>
      <p class="lead text-muted">{{ props.description }}</p>
      <p class="small text-muted">
        This page is part of the project structure and will be expanded in the next development
        stage.
      </p>
      <button type="button" class="btn btn-primary" @click="emit('select-page', 'home')">
        Return Home
      </button>
    </div>
  </section>
</template>
