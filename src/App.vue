<script setup lang="ts">
import Loading from "./components/common/Loading.vue";
import { useLoadingStore } from "./stores/loading";
const loadingStore = useLoadingStore();
</script>

<template>
  <Loading v-if="loadingStore.isLoading" />
  <router-view />
</template>

<style scoped></style>
