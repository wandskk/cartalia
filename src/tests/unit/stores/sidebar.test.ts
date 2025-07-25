import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSidebarStore } from '../../../stores/sidebar';

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock das constantes
vi.mock('../../../constants', () => ({
  SIDEBAR: {
    STORAGE_KEY: 'sidebar-collapsed'
  }
}));

describe('useSidebarStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with default values when no stored value', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const sidebarStore = useSidebarStore();
      
      expect(sidebarStore.isCollapsed).toBe(false);
      expect(sidebarStore.isMobileOpen).toBe(false);
    });

    it('should initialize with stored value when available', () => {
      localStorageMock.getItem.mockReturnValue('true');
      
      const sidebarStore = useSidebarStore();
      
      expect(sidebarStore.isCollapsed).toBe(true);
      expect(sidebarStore.isMobileOpen).toBe(false);
    });

    it('should handle invalid stored value', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      
      const sidebarStore = useSidebarStore();
      
      expect(sidebarStore.isCollapsed).toBe(false);
      expect(sidebarStore.isMobileOpen).toBe(false);
    });
  });

  describe('toggleCollapse', () => {
    it('should toggle collapsed state from false to true', () => {
      localStorageMock.getItem.mockReturnValue('false');
      
      const sidebarStore = useSidebarStore();
      
      sidebarStore.toggleCollapse();
      
      expect(sidebarStore.isCollapsed).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('sidebar-collapsed', 'true');
    });

    it('should toggle collapsed state from true to false', () => {
      localStorageMock.getItem.mockReturnValue('true');
      
      const sidebarStore = useSidebarStore();
      
      sidebarStore.toggleCollapse();
      
      expect(sidebarStore.isCollapsed).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('sidebar-collapsed', 'false');
    });
  });

  describe('setCollapsed', () => {
    it('should set collapsed state to true', () => {
      localStorageMock.getItem.mockReturnValue('false');
      
      const sidebarStore = useSidebarStore();
      
      sidebarStore.setCollapsed(true);
      
      expect(sidebarStore.isCollapsed).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('sidebar-collapsed', 'true');
    });

    it('should set collapsed state to false', () => {
      localStorageMock.getItem.mockReturnValue('true');
      
      const sidebarStore = useSidebarStore();
      
      sidebarStore.setCollapsed(false);
      
      expect(sidebarStore.isCollapsed).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('sidebar-collapsed', 'false');
    });
  });

  describe('toggleMobile', () => {
    it('should toggle mobile open state from false to true', () => {
      localStorageMock.getItem.mockReturnValue('false');
      
      const sidebarStore = useSidebarStore();
      
      sidebarStore.toggleMobile();
      
      expect(sidebarStore.isMobileOpen).toBe(true);
    });

    it('should toggle mobile open state from true to false', () => {
      localStorageMock.getItem.mockReturnValue('false');
      
      const sidebarStore = useSidebarStore();
      
      sidebarStore.toggleMobile();
      sidebarStore.toggleMobile();
      
      expect(sidebarStore.isMobileOpen).toBe(false);
    });
  });

  describe('closeMobile', () => {
    it('should close mobile sidebar', () => {
      localStorageMock.getItem.mockReturnValue('false');
      
      const sidebarStore = useSidebarStore();
      
      sidebarStore.toggleMobile(); // Open mobile
      sidebarStore.closeMobile(); // Close mobile
      
      expect(sidebarStore.isMobileOpen).toBe(false);
    });

    it('should keep mobile closed when already closed', () => {
      localStorageMock.getItem.mockReturnValue('false');
      
      const sidebarStore = useSidebarStore();
      
      sidebarStore.closeMobile();
      
      expect(sidebarStore.isMobileOpen).toBe(false);
    });
  });

  describe('localStorage interaction', () => {
    it('should read from localStorage on initialization', () => {
      localStorageMock.getItem.mockReturnValue('true');
      
      useSidebarStore();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('sidebar-collapsed');
    });

    it('should write to localStorage when toggling collapse', () => {
      localStorageMock.getItem.mockReturnValue('false');
      
      const sidebarStore = useSidebarStore();
      sidebarStore.toggleCollapse();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('sidebar-collapsed', 'true');
    });

    it('should write to localStorage when setting collapse', () => {
      localStorageMock.getItem.mockReturnValue('false');
      
      const sidebarStore = useSidebarStore();
      sidebarStore.setCollapsed(true);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('sidebar-collapsed', 'true');
    });
  });
}); 