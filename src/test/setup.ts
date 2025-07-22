import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as Storage
global.localStorage = localStorageMock

// Mock do console.error para evitar spam nos testes
global.console.error = vi.fn()

// Configuração global do Vue Test Utils
config.global.stubs = {
  'router-link': true,
  'router-view': true,
}

// Mock do router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    go: vi.fn(),
  }),
  useRoute: () => ({
    params: {},
    query: {},
  }),
})) 