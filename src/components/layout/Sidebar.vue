<template>
  <aside class="sidebar" :class="{ 
    'sidebar-collapsed': isCollapsed,
    'sidebar-mobile-open': isMobileOpen 
  }">
    <div class="sidebar-header">
      <h3 class="sidebar-title">{{ SIDEBAR_TEXTS.TITLE }}</h3>
      <button
        class="collapse-btn"
        @click="toggleCollapse"
        :title="collapseButtonTitle"
      >
        <span class="collapse-icon">{{ collapseButtonIcon }}</span>
      </button>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li v-for="item in navigationItems" :key="item.path" class="nav-item">
          <router-link
            :to="item.path"
            class="nav-link"
            :class="{ active: isActiveRoute(item.path) }"
            :title="isCollapsed ? item.label : ''"
            @click="closeMobile"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span v-if="!isCollapsed || isMobileOpen" class="nav-label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer" v-if="!isCollapsed || isMobileOpen">
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-details">
          <p class="user-name">{{ userDisplayName }}</p>
          <p class="user-email">{{ userDisplayEmail }}</p>
        </div>
      </div>
      <BaseButton 
        v-if="isAuthenticated"
        @click="handleLogout" 
        color="secondary"
        class="logout-btn"
      >
        Sair
      </BaseButton>
    </div>
  </aside>

  <!-- Overlay para mobile -->
  <div 
    v-if="isMobileOpen" 
    class="sidebar-overlay"
    @click="closeMobile"
  ></div>
</template>

<script setup lang="ts">
import { useSidebar } from '../../composables/useSidebar';
import { SIDEBAR_TEXTS } from '../../constants';
import BaseButton from '../common/BaseButton.vue';

const {
  isCollapsed,
  isMobileOpen,
  isAuthenticated,
  navigationItems,
  isActiveRoute,
  toggleCollapse,
  closeMobile,
  handleLogout,
  collapseButtonTitle,
  collapseButtonIcon,
  userInitials,
  userDisplayName,
  userDisplayEmail
} = useSidebar();
</script>

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;

.sidebar {
  width: 280px;
  height: calc(100vh - 64px);
  background: $white;
  border-right: 1px solid $gray-200;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 64px;
  z-index: 100;

  &.sidebar-collapsed {
    width: 60px;

    .nav-link {
      justify-content: flex-start;
      padding: 0.75rem 0.5rem;
    }

    .nav-icon {
      margin-right: 0;
    }
  }
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid $gray-200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
}

.sidebar-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: $gray-900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;

  &:hover {
    background: $gray-100;
  }
}

.collapse-icon {
  font-size: 1rem;
  color: $gray-600;
  transition: transform 0.2s;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0.75rem 1rem;
  color: $gray-700;
  text-decoration: none;
  transition: all 0.2s;
  border-radius: 0;
  margin: 0 0.5rem;
  border-radius: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: $gray-100;
    color: $gray-900;
  }

  &.active {
    background: $primary;
    color: $white;
    font-weight: 600;
  }
}

.nav-icon {
  font-size: 1.2rem;
  min-width: 1.2rem;
  transition: margin-right 0.3s ease;
}

.nav-label {
  font-size: 0.95rem;
  font-weight: 500;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid $gray-200;
  background: $gray-50;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: $primary;
  color: $white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: $gray-900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  margin: 0;
  font-size: 0.8rem;
  color: $gray-600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  width: 100%;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    width: 280px;
    height: calc(100vh - 51px);
    top: 51px;

    &.sidebar-mobile-open {
      transform: translateX(0);
    }

    &.sidebar-collapsed {
      width: 280px;
    }
  }

  .sidebar-header {
    display: none;
  }

  .collapse-btn {
    display: none;
  }
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: $gray-300;
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: $gray-400;
}
</style>
