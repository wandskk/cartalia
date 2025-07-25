<template>
  <v-container class="container" max-width="1200">
    <slot />
  </v-container>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  overflow-x: hidden;
  padding: 2rem !important;

  @media screen and (max-width: 768px) {
    padding-top: 5rem !important;
  }
}
</style>
