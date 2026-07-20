<script setup>
const props = defineProps({
  title: {
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
    <h2 class="h4">{{ props.title }}</h2>
    <button
      type="button"
      class="feature-link mt-auto"
      @click="emit('select-page', props.targetPage)"
    >
      {{ props.actionLabel }} <span aria-hidden="true">→</span>
    </button>
  </article>
</template>
