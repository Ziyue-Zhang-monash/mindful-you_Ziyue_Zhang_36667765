<script setup>
const emit = defineEmits(['open-help'])
</script>

<template>
  <section class="emergency-banner" aria-labelledby="emergency-title">
    <div>
      <p class="eyebrow mb-2">Need immediate support?</p>
      <h2 id="emergency-title" class="h4 mb-2">You do not have to handle a crisis alone.</h2>
      <p class="mb-0">
        If you may be in immediate danger, contact local emergency services. This website provides
        information only and is not an emergency service.
      </p>
    </div>
    <button type="button" class="btn btn-light emergency-action" @click="emit('open-help')">
      Get Urgent Help <span aria-hidden="true">→</span>
    </button>
  </section>
</template>
