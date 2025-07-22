<template>
  <div class="main-layout">
    <Header />
    <Sidebar />
    <main
      class="main-content"
      :class="{
        'with-sidebar':
          !sidebarStore.isCollapsed &&
          !sidebarStore.isMobileOpen,
        'with-sidebar-collapsed':
          sidebarStore.isCollapsed && !sidebarStore.isMobileOpen,
      }"
    >
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSidebarStore } from "../../stores/sidebar";
import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";

const sidebarStore = useSidebarStore();
</script>

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;

.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 0;
  transition: margin-left 0.3s ease;
  padding: 0rem;

  &.with-sidebar {
    margin-left: 280px;
  }

  &.with-sidebar-collapsed {
    margin-left: 80px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    padding: 0rem;
    margin-top: 60px;
  }
}
</style>
