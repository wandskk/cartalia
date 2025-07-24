<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="!isMobile"
    :temporary="isMobile"
    :rail="isCollapsed && !isMobile"
    :width="280"
    :rail-width="80"
    class="sidebar"
    :class="{
      'sidebar-collapsed': isCollapsed,
      'sidebar-mobile-open': isMobileOpen,
    }"
  >
    <!-- Header com logo e botão de colapso -->
    <div class="sidebar-header" v-if="!isMobileOpen">
      <div class="header-content">
        <div v-if="!isCollapsed" class="logo-section">
          <Logo />
        </div>
        <div class="header-actions">
          <v-btn
            v-if="!isMobileOpen"
            icon
            variant="text"
            @click="toggleCollapse"
            :title="collapseButtonTitle"
            size="small"
            class="collapse-btn"
          >
            <v-icon 
              :class="{ 'rotate-icon': isCollapsed }"
            >
              mdi-chevron-left
            </v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Lista de navegação -->
    <v-list class="sidebar-nav">
      <v-list-item
        v-for="item in navigationItems"
        :key="item.path"
        :to="item.path"
        :prepend-icon="item.icon"
        :title="isCollapsed ? '' : item.label"
        class="nav-item"
        :class="{ 'nav-item-active': isActiveRoute(item.path) }"
        @click="handleNavClick"
      />
      
      <!-- Item de autenticação -->
      <v-divider class="my-2" />
      <v-list-item
        v-if="isAuthenticated"
        @click="handleLogout"
        :prepend-icon="'mdi-logout'"
        :title="isCollapsed ? '' : 'Sair'"
        class="nav-item nav-item-logout"
      />
      <v-list-item
        v-else
        to="/login"
        :prepend-icon="'mdi-login'"
        :title="isCollapsed ? '' : 'Entrar'"
        class="nav-item nav-item-login"
        @click="handleNavClick"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSidebarStore } from '../../stores/sidebar';
import { useAuthStore } from '../../stores/auth';
import { NAVIGATION_ITEMS } from '../../constants';
import Logo from '../common/Logo.vue';

const route = useRoute();
const router = useRouter();
const sidebarStore = useSidebarStore();
const userStore = useAuthStore();

const isMobile = ref(false);

const isCollapsed = computed(() => sidebarStore.isCollapsed);
const isMobileOpen = computed(() => sidebarStore.isMobileOpen);
const isAuthenticated = computed(() => userStore.isAuthenticated);

const drawer = computed({
  get: () => isMobile.value ? isMobileOpen.value : true,
  set: (value) => {
    if (isMobile.value && !value) {
      sidebarStore.closeMobile();
    }
  }
});

const navigationItems = computed(() => {
  return NAVIGATION_ITEMS.filter(item => {
    if (item.requiresAuth) {
      return isAuthenticated.value;
    }
    return true;
  });
});
const collapseButtonTitle = computed(() => 
  isCollapsed.value ? 'Expandir menu' : 'Recolher menu'
);

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  if (!isMobile.value) {
    sidebarStore.closeMobile();
  }
};

const toggleCollapse = () => {
  sidebarStore.toggleCollapse();
};

const handleNavClick = () => {
  if (isMobile.value) {
    sidebarStore.closeMobile();
  }
};

const isActiveRoute = (path: string) => {
  return route.path === path;
};

const handleLogout = async () => {
  await userStore.logout();
  router.push('/login');
  if (isMobile.value) {
    sidebarStore.closeMobile();
  }
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
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1001;
  background: white;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &.sidebar-collapsed {
    width: 80px;
  }

  &.sidebar-mobile-open {
    transform: translateX(0);
  }
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
}

.collapse-btn {
  transition: all 0.3s ease;
}

.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.sidebar-nav {
  padding: 1rem 0;
}

.nav-item {
  margin: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &.nav-item-active {
    background: rgba(0, 0, 0, 0.1);
    color: $primary;
  }

  &.nav-item-logout {
    color: $error;
    
    &:hover {
      background: rgba($error, 0.1);
    }
  }

  &.nav-item-login {
    color: $primary;
    
    &:hover {
      background: rgba($primary, 0.1);
    }
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
}
</style>
