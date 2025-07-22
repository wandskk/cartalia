<script setup lang="ts">
import { useLoadingStore } from "./stores/loading";
import { useErrorStore } from "./stores/error";

const loadingStore = useLoadingStore();
const errorStore = useErrorStore();
</script>

<template>
  <div id="app">
    <h1>Cartalia</h1>
    <p>Marketplace de Cartas</p>
    <router-view />
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
}
</style>
