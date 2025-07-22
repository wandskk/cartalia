<script lang="ts">
import { defineComponent } from 'vue'
import { useLoadingStore } from "./stores/loading"
import { useErrorStore } from "./stores/error"
import Header from "./components/layout/Header.vue"
import Loading from "./components/common/Loading.vue"
import Notification from "./components/common/Notification.vue"
import ErrorModal from "./components/common/ErrorModal.vue"

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Loading,
    Notification,
    ErrorModal
  },
  setup() {
    const loadingStore = useLoadingStore()
    const errorStore = useErrorStore()
    
    return {
      loadingStore,
      errorStore
    }
  }
})
</script>

<template>
  <div id="app">
    <Header />
    <Notification />
    <Loading v-if="loadingStore.isLoading" />
    <ErrorModal :is-open="errorStore.isErrorModalOpen" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding: 2rem;
}
</style>
