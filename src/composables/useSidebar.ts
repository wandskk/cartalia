import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSidebarStore } from '../stores/sidebar';
import { NAVIGATION_ITEMS, SIDEBAR_TEXTS } from '../constants';

export function useSidebar() {
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const sidebarStore = useSidebarStore();

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const user = computed(() => authStore.user);
  const isCollapsed = computed(() => sidebarStore.isCollapsed);
  const isMobileOpen = computed(() => sidebarStore.isMobileOpen);

  const userInitials = computed(() => {
    if (!user.value?.name) return 'U';
    return user.value.name
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  const navigationItems = computed(() => {
    return NAVIGATION_ITEMS.filter(
      (item) => !item.requiresAuth || isAuthenticated.value
    );
  });

  const activePath = computed(() => route.path);

  const isActiveRoute = (path: string): boolean => {
    if (path === '/dashboard') {
      return activePath.value === '/dashboard';
    }
    if (path === '/my-trades') {
      return activePath.value === '/my-trades';
    }

    if (path === '/marketplace') {
      return activePath.value === '/marketplace';
    }
    if (path === '/cards') {
      return activePath.value.startsWith('/cards');
    }
    return activePath.value === path;
  };

  const toggleCollapse = () => {
    sidebarStore.toggleCollapse();
  };

  const toggleMobile = () => {
    sidebarStore.toggleMobile();
  };

  const closeMobile = () => {
    sidebarStore.closeMobile();
  };

  const handleLogout = () => {
    authStore.logout();
    closeMobile();
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
    closeMobile();
  };

  const collapseButtonTitle = computed(() => 
    isCollapsed.value ? SIDEBAR_TEXTS.EXPAND : SIDEBAR_TEXTS.COLLAPSE
  );

  const collapseButtonIcon = computed(() => '←');

  const userDisplayName = computed(() => 
    user.value?.name || SIDEBAR_TEXTS.DEFAULT_USER
  );

  const userDisplayEmail = computed(() => 
    user.value?.email || SIDEBAR_TEXTS.DEFAULT_EMAIL
  );

  return {
    isCollapsed,
    isMobileOpen,
    isAuthenticated,
    user,
    userInitials,
    navigationItems,
    activePath,
    isActiveRoute,
    toggleCollapse,
    toggleMobile,
    closeMobile,
    handleLogout,
    handleLogin,
    collapseButtonTitle,
    collapseButtonIcon,
    userDisplayName,
    userDisplayEmail
  };
} 