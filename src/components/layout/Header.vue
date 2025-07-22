<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <button
          v-if="showHamburger"
          class="mobile-menu-btn"
          @click="toggleMobile"
          :title="isMobileOpen ? 'Fechar menu' : 'Abrir menu'"
        >
          <span class="hamburger-icon">{{ isMobileOpen ? '✕' : '☰' }}</span>
        </button>
      </div>
      <div class="header-center">
        <Logo />
      </div>
      <div class="header-right">
        <!-- Espaço para futuras ações -->
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../../stores/sidebar';
import Logo from '../common/Logo.vue';

const sidebarStore = useSidebarStore();

const isMobileOpen = computed(() => sidebarStore.isMobileOpen);
const showHamburger = computed(() => window.innerWidth <= 768);

const toggleMobile = () => {
  sidebarStore.toggleMobile();
};
</script>

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;

.header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  z-index: 200;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: block;
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: 1rem;
}

.header-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 2;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  flex: 1;
}

.mobile-menu-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
}

.hamburger-icon {
  font-size: 1.25rem;
  color: #64748b;
  font-weight: 600;
  transition: all 0.2s ease;
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 0.75rem;
  }

  .mobile-menu-btn {
    padding: 0.625rem;
    min-width: 2.25rem;
    height: 2.25rem;
  }

  .hamburger-icon {
    font-size: 1.125rem;
  }
}
</style> 