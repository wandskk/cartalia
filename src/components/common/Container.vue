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
  padding: 0 1rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 100%;
}
</style> 