<template>
  <div class="main-layout">
    <Header />
    <Sidebar v-if="showSidebar" />
    <main
      class="main-content"
      :class="{
        'with-sidebar':
          showSidebar &&
          !sidebarStore.isCollapsed &&
          !sidebarStore.isMobileOpen,
        'with-sidebar-collapsed':
          showSidebar && sidebarStore.isCollapsed && !sidebarStore.isMobileOpen,
      }"
    >
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useSidebarStore } from "../../stores/sidebar";
import Header from "./Header.vue";
import Sidebar from "./Sidebar.vue";

const route = useRoute();
const sidebarStore = useSidebarStore();

const showSidebar = computed(() => {
  const publicRoutes = ["/login", "/register"];
  return !publicRoutes.includes(route.path);
});
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
  margin-top: 64px;
  transition: margin-left 0.3s ease;
  padding: 0rem;

  &.with-sidebar {
    margin-left: 280px;
  }

  &.with-sidebar-collapsed {
    margin-left: 60px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    padding: 0rem;
  }
}
</style>
