<script setup lang="ts">
import Header from "./components/layout/Header.vue";
import Loading from "./components/common/Loading.vue";
import Notification from "./components/common/Notification.vue";
import { useLoadingStore } from "./stores/loading";
const loadingStore = useLoadingStore();
</script>

<template>
  <Header />
  <Notification />
  <Loading v-if="loadingStore.isLoading" />
  <router-view />
</template>

<style scoped></style>
