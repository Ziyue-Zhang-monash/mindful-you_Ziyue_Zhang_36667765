<script setup>
const emit = defineEmits(['open-help'])
</script>

<template>
  <section class="emergency-banner" aria-labelledby="emergency-title">
    <div>
      <h2 id="emergency-title" class="h4 mb-2">Need Immediate Support?</h2>
      <p class="mb-0">
        If you are in crisis or having thoughts of harming yourself or others,<br />
        help is available 24 hours a day, 7 days a week.
      </p>
    </div>
    <button type="button" class="emergency-action" @click="emit('open-help')">
      Get Urgent Help (24/7)
    </button>
  </section>
</template>
