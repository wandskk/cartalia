import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock do router
const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  go: vi.fn(),
  replace: vi.fn()
};

// Mock do Pinia
const mockPinia = {
  install: vi.fn(),
  state: {},
  _s: new Map()
};

// Configuração global
config.global.mocks = {
  $router: mockRouter,
  $route: {
    path: '/',
    name: 'home',
    params: {},
    query: {}
  }
};

// Mock de localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
});

// Mock de sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  },
  writable: true
});

// Mock de fetch
global.fetch = vi.fn();

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

export { mockRouter, mockPinia }; 
