<template>
  <nav class="header-nav">
    <a href="#" class="nav-link">Home</a>
    <a href="#" class="nav-link">Browse</a>
    <a href="#" class="nav-link">Sell</a>
    <a href="#" class="nav-link nav-help">Help</a>
  </nav>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;
.header-nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.nav-link {
  font-size: 1rem;
  color: $gray-900;
  text-decoration: none;
  font-weight: 500;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}
.nav-link:hover {
  background: $gray-100;
  color: $primary;
}
.nav-help {
  background: $gray-200;
  color: $gray-900;
  font-weight: 600;
}
@media (max-width: 700px) {
  .header-nav {
    gap: 0.5rem;
  }
}
</style> 