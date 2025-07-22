<template>
  <span class="nav-avatar">
    <img :src="src" alt="avatar" />
  </span>
</template>

<script setup lang="ts">
defineProps<{ src: string }>()
</script>

<style scoped lang="scss">
@use '../../styles/_variables.scss' as *;
.nav-avatar {
  margin-left: 0.5rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid $gray-200;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 
