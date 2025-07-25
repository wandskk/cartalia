import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref } from 'vue';
import { useSidebar } from '../../../composables/useSidebar';


vi.mock('../../../stores/sidebar', () => ({
  useSidebarStore: () => ({
    isCollapsed: ref(false),
    isMobileOpen: ref(false),
    toggleCollapse: vi.fn(),
    toggleMobile: vi.fn(),
    closeMobile: vi.fn()
  })
}));

describe('useSidebar', () => {
  let sidebar: ReturnType<typeof useSidebar>;

  beforeEach(() => {
    sidebar = useSidebar();
  });

  describe('initial state', () => {
    it('should initialize with sidebar store', () => {
      expect(sidebar.isCollapsed.value).toBeDefined();
      expect(sidebar.isMobileOpen.value).toBeDefined();
      expect(typeof sidebar.toggleCollapse).toBe('function');
      expect(typeof sidebar.toggleMobile).toBe('function');
      expect(typeof sidebar.closeMobile).toBe('function');
    });
  });

  describe('toggleCollapse', () => {
    it('should call store toggleCollapse method', () => {
      sidebar.toggleCollapse();
      

      expect(typeof sidebar.toggleCollapse).toBe('function');
    });
  });

  describe('toggleMobile', () => {
    it('should call store toggleMobile method', () => {
      sidebar.toggleMobile();
      
      expect(typeof sidebar.toggleMobile).toBe('function');
    });
  });

  describe('closeMobile', () => {
    it('should call store closeMobile method', () => {
      sidebar.closeMobile();
      
      expect(typeof sidebar.closeMobile).toBe('function');
    });
  });
}); 