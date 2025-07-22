<script setup lang="ts">
import Header from "./components/layout/Header.vue";
import Loading from "./components/common/Loading.vue";
import Notification from "./components/common/Notification.vue";
import ErrorModal from "./components/common/ErrorModal.vue";
import { useLoadingStore } from "./stores/loading";
import { useErrorStore } from "./stores/error";

const loadingStore = useLoadingStore();
const errorStore = useErrorStore();
</script>

<template>
  <Header />
  <Notification />
  <Loading v-if="loadingStore.isLoading" />
  <ErrorModal :is-open="errorStore.isErrorModalOpen" />
  <router-view />
</template>

<style scoped></style>
