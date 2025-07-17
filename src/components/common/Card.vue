<template>
  <div class="card">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;
.card {
  background: $white;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(63, 140, 255, 0.06);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}
</style> 