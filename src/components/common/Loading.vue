<script setup lang="ts">
import LoadingSpinner from "./LoadingSpinner.vue";
</script>

<template>
  <div class="loading-overlay d-flex align-center justify-center">
    <LoadingSpinner size="56" />
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  z-index: 99999;
}
</style>
