import { vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { VueWrapper, mount, config } from '@vue/test-utils';
import type { ComponentMountingOptions } from '@vue/test-utils';


if (typeof globalThis.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}


config.global = config.global || {};
config.global.stubs = {
  ...(config.global.stubs || {}),
  'v-card': {
    template: '<div class="v-card" :class="$attrs.class" v-bind="$attrs"><slot /></div>',
    props: ['hover', 'clickable', 'variant']
  },
  'v-img': {
    template: '<img class="v-img" v-bind="$attrs" />',
    props: ['src', 'alt', 'width', 'height', 'cover']
  },
  'v-progress-circular': {
    template: '<div class="v-progress-circular" v-bind="$attrs" :style="{ width: $attrs.size + \'px\', height: $attrs.size + \'px\' }"><slot /></div>',
    props: ['size', 'width', 'color']
  }
};


const localStorageMock = {
  _data: {} as Record<string, string>,
  getItem: vi.fn((key: string) => localStorageMock._data[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    localStorageMock._data[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete localStorageMock._data[key];
  }),
  clear: vi.fn(() => {
    localStorageMock._data = {};
  }),
  length: 0,
  key: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});


const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});


global.fetch = vi.fn();


global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));


global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));


Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});


export function createTestPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}


export function mountWithPinia<T>(
  component: T,
  options: ComponentMountingOptions<T> = {}
): VueWrapper<any> {
  const pinia = createTestPinia();
  
  return mount(component, {
    global: {
      plugins: [pinia],
      stubs: {
        'router-link': true,
        'router-view': true
      }
    },
    ...options
  });
}


export function clearAllMocks() {
  vi.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
}


export function useFakeTimers() {
  vi.useFakeTimers();
}

export function useRealTimers() {
  vi.useRealTimers();
}


export function mockConsole() {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    console.info = vi.fn();
  });
  
  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
  });
}


beforeEach(() => {
  clearAllMocks();
  createTestPinia();
});

afterEach(() => {
  vi.clearAllMocks();
}); 