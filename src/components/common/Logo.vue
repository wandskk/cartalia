<template>
  <div class="logo">
    <span class="logo-icon">🃏</span>
    <span class="logo-text">CardCollect</span>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.logo-icon {
  font-size: 1.6rem;
}
.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: $gray-900;
  letter-spacing: 0.5px;
}
</style> 