<template>
  <Header />
  <Sidebar />
  <v-main
    :class="{
      'with-sidebar': !sidebarStore.isCollapsed && !sidebarStore.isMobileOpen,
      'with-sidebar-collapsed': sidebarStore.isCollapsed && !sidebarStore.isMobileOpen,
    }"
    class="main-content"
  >
    <router-view />
    <BackToTop />
  </v-main>
</template>

<script setup lang="ts">
import { useSidebarStore } from "../../stores/sidebar";
import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";
import BackToTop from "../common/BackToTop.vue";

const sidebarStore = useSidebarStore();
</script>

<style scoped lang="scss">
.main-content {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.v-main {
  transition: margin-left 0.3s ease;
  padding: 0;

  &.with-sidebar {
    margin-left: 280px;
  }

  &.with-sidebar-collapsed {
    margin-left: 80px;
  }
}

@media (max-width: 768px) {
  .v-main {
    margin-left: 0 !important;
  }
}
</style>
