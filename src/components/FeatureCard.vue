<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  actionLabel: {
    type: String,
    required: true
  },
  targetPage: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['select-page'])
</script>

<template>
  <article class="feature-card h-100">
    <div class="feature-card-icon" aria-hidden="true">+</div>
    <h2 class="h4">{{ props.title }}</h2>
    <p class="text-muted mb-4">{{ props.description }}</p>
    <button
      type="button"
      class="btn btn-link feature-link mt-auto"
      @click="emit('select-page', targetPage)"
    >
      {{ props.actionLabel }} <span aria-hidden="true">→</span>
    </button>
  </article>
</template>
