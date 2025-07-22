<template>
  <div class="container">
    <slot />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 1024px) {
    max-width: 100%;
    padding: 0 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 0 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 0 1rem;
  }
}
</style> 
