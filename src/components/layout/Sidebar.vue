<template>
  <aside
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
          <button
            v-if="!isMobileOpen"
            class="collapse-btn"
            @click="toggleCollapse"
            :title="collapseButtonTitle"
          >
            <span class="collapse-icon">←</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Navegação principal -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h4 v-if="!isCollapsed" class="nav-section-title">Navegação</h4>
        <ul class="nav-list">
          <li v-for="item in navigationItems" :key="item.path" class="nav-item">
            <router-link
              :to="item.path"
              class="nav-link"
              :class="{ active: isActiveRoute(item.path) }"
              :title="isCollapsed ? item.label : ''"
              @click="closeMobile"
            >
              <div class="nav-icon-wrapper">
                <span class="nav-icon">{{ item.icon }}</span>
              </div>
              <div v-if="!isCollapsed || isMobileOpen" class="nav-content">
                <span class="nav-label">{{ item.label }}</span>
              </div>
              <div
                v-if="
                  isActiveRoute(item.path) && (!isCollapsed || isMobileOpen)
                "
                class="active-indicator"
              ></div>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Footer com informações do usuário -->
    <div class="sidebar-footer" v-if="!isCollapsed || isMobileOpen">
      <div class="user-section">
        <div v-if="isAuthenticated" class="user-info">
          <div class="user-avatar">
            <span class="avatar-text">{{ userInitials }}</span>
            <div class="online-indicator"></div>
          </div>
          <div class="user-details">
            <p class="user-name">{{ userDisplayName }}</p>
            <p class="user-email">{{ userDisplayEmail }}</p>
          </div>
        </div>
        <BaseButton
          v-if="isAuthenticated"
          @click="
            () => {
              handleLogout();
            }
          "
          color="secondary"
          class="logout-btn"
        >
          <span class="logout-icon">🚪</span>
          <span class="logout-text">Sair</span>
        </BaseButton>
        <BaseButton
          v-else
          @click="handleLogin"
          color="primary"
          class="login-btn"
        >
          <span class="login-icon">🔑</span>
          <span class="login-text">Entrar</span>
        </BaseButton>
      </div>
    </div>
  </aside>

  <!-- Overlay para mobile com backdrop blur -->
  <div v-if="isMobileOpen" class="sidebar-overlay" @click="closeMobile"></div>
</template>

<script setup lang="ts">
import { useSidebar } from "../../composables/useSidebar";
import BaseButton from "../common/BaseButton.vue";
import Logo from "../common/Logo.vue";

const {
  isCollapsed,
  isMobileOpen,
  isAuthenticated,
  navigationItems,
  isActiveRoute,
  toggleCollapse,
  closeMobile,
  handleLogout,
  handleLogin,
  collapseButtonTitle,
  userInitials,
  userDisplayName,
  userDisplayEmail,
} = useSidebar();
</script>

<style scoped lang="scss">
@use "../../styles/_variables.scss" as *;

.sidebar {
  width: 280px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &.sidebar-collapsed {
    width: 80px;

    .nav-link {
      justify-content: center;
      padding: 0.875rem 0.5rem;
      gap: 0.5rem;
    }

    .nav-icon-wrapper {
      margin-right: 0;
    }

    .header-content {
      justify-content: center;
    }

    .collapse-btn {
      margin: 0 auto;
    }

    .collapse-icon {
      transform: rotate(180deg);
    }
  }
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  background: rgba(248, 250, 252, 0.5);
  flex-shrink: 0;
  min-height: 80px;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  flex: 1;
  min-width: 0;
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  backdrop-filter: blur(10px);
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(59, 130, 246, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.collapse-icon {
  font-size: 0.875rem;
  color: #64748b;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  transform: rotate(0deg);
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
  min-height: 0;
}

.nav-section {
  .nav-section-title {
    margin: 0 0 1rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
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
  padding: 0.875rem 1.5rem;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
  margin: 0 0.75rem 0.25rem 0.75rem;
  border-radius: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;

  &:hover {
    background: rgba(248, 250, 252, 0.8);
    color: #1e293b;
    transform: translateX(4px);
  }

  &.active {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.1) 0%,
      rgba(59, 130, 246, 0.05) 100%
    );
    color: #3b82f6;
    font-weight: 600;
    border: 1px solid rgba(59, 130, 246, 0.2);

    .nav-icon-wrapper {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  }
}

.nav-icon-wrapper {
  width: 2.25rem;
  height: 2.25rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.875rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.nav-icon {
  font-size: 1rem;
  color: #64748b;
  transition: color 0.2s ease;
}

.nav-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.nav-label {
  font-size: 0.9375rem;
  font-weight: 500;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active-indicator {
  width: 0.375rem;
  height: 0.375rem;
  background: #3b82f6;
  border-radius: 50%;
  margin-left: auto;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  background: rgba(248, 250, 252, 0.5);
  flex-shrink: 0;
}

.user-section {
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 0.75rem;
    border: 1px solid rgba(226, 232, 240, 0.6);
    backdrop-filter: blur(10px);
  }
}

.user-avatar {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.avatar-text {
  color: white;
}

.online-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 0.75rem;
  height: 0.75rem;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.user-email {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }
}

.logout-icon {
  font-size: 1rem;
}

.logout-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.login-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }
}

.login-icon {
  font-size: 1rem;
}

.login-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 99;
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    width: 280px;
    height: calc(100vh - 60px);
    top: 60px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1),
      0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    &.sidebar-mobile-open {
      transform: translateX(0);
    }

    &.sidebar-collapsed {
      width: 280px;

      .logo-section {
        display: flex;
      }
    }
  }

  .sidebar-header {
    padding: 1.25rem;
  }

  .header-actions {
    gap: 0.5rem;
  }

  .logo-section {
    gap: 0.75rem;
  }

  .nav-link {
    padding: 0.75rem 1.25rem;
    margin: 0 0.5rem 0.125rem 0.5rem;
  }

  .nav-icon-wrapper {
    width: 2rem;
    height: 2rem;
    margin-right: 0.75rem;
  }

  .sidebar-footer {
    padding: 1.25rem;
  }

  .user-info {
    padding: 0.625rem;
    gap: 0.75rem;
  }

  .user-avatar {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.8125rem;
  }

  .online-indicator {
    width: 0.625rem;
    height: 0.625rem;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 260px;
  }

  .sidebar-header {
    padding: 1rem;
  }

  .header-actions {
    gap: 0.4rem;
  }

  .nav-link {
    padding: 0.625rem 1rem;
    margin: 0 0.375rem 0.125rem 0.375rem;
  }

  .nav-icon-wrapper {
    width: 1.875rem;
    height: 1.875rem;
    margin-right: 0.625rem;
  }

  .sidebar-footer {
    padding: 1rem;
  }

  .user-info {
    padding: 0.5rem;
    gap: 0.625rem;
  }

  .user-avatar {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }

  .online-indicator {
    width: 0.5rem;
    height: 0.5rem;
  }
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 225, 0.5);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(203, 213, 225, 0.8);
}
</style>
