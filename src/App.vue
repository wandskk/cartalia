<script lang="ts">
import { defineComponent } from "vue";
import { useLoadingStore } from "./stores/loading";
import { useErrorStore } from "./stores/error";
import MainLayout from "./components/layout/MainLayout.vue";
import Loading from "./components/common/Loading.vue";
import Notification from "./components/common/Notification.vue";
import ErrorModal from "./components/common/ErrorModal.vue";
import ErrorBoundary from "./components/common/ErrorBoundary.vue";

export default defineComponent({
  name: "App",
  components: {
    MainLayout,
    Loading,
    Notification,
    ErrorModal,
    ErrorBoundary,
  },
  setup() {
    const loadingStore = useLoadingStore();
    const errorStore = useErrorStore();

    return {
      loadingStore,
      errorStore,
    };
  },
});
</script>

<template>
  <v-app>
    <ErrorBoundary>
      <Notification />
      <Loading v-if="loadingStore.isLoading" />
      <ErrorModal :is-open="errorStore.isErrorModalOpen" />
      <MainLayout />
    </ErrorBoundary>
  </v-app>
</template>

<style scoped>
.v-application {
  min-height: 100vh;
}
</style>
