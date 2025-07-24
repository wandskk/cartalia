<template>
  <v-app-bar
    v-if="showHamburger"
    class="header"
    elevation="2"
    color="rgba(255, 255, 255, 0.95)"
    style="backdrop-filter: blur(20px);"
  >
    <v-app-bar-nav-icon
      @click="toggleMobile"
      :icon="isMobileOpen ? 'mdi-close' : 'mdi-menu'"
      variant="text"
    />
    
    <v-app-bar-title class="header-center">
      <Logo />
    </v-app-bar-title>
    
    <template v-slot:append>
      <div class="header-right">
        <!-- Espaço para futuras ações -->
      </div>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useSidebarStore } from '../../stores/sidebar';
import Logo from '../common/Logo.vue';

const sidebarStore = useSidebarStore();
const isMobile = ref(false);

const isMobileOpen = computed(() => sidebarStore.isMobileOpen);
const showHamburger = computed(() => isMobile.value);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const toggleMobile = () => {
  sidebarStore.toggleMobile();
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.header-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (min-width: 769px) {
  .header {
    display: none;
  }
}
</style> 