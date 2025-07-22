# 🧪 Estratégia de Testes

Este documento descreve a estratégia de testes implementada no projeto Cartalia, incluindo ferramentas, padrões e exemplos práticos.

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🛠️ Ferramentas](#️-ferramentas)
- [📁 Estrutura de Testes](#-estrutura-de-testes)
- [🧪 Tipos de Testes](#-tipos-de-testes)
- [📝 Padrões de Teste](#-padrões-de-teste)
- [🔧 Configuração](#-configuração)
- [📊 Cobertura](#-cobertura)
- [🚀 CI/CD](#-cicd)

## 🎯 Visão Geral

O projeto Cartalia utiliza uma estratégia de testes abrangente que cobre diferentes camadas da aplicação, garantindo qualidade e confiabilidade do código.

### 🎨 Stack de Testes

```
Vitest (Test Runner)
├── Vue Test Utils (Component Testing)
├── Testing Library (User-Centric Testing)
├── JSDOM (DOM Environment)
├── MSW (API Mocking)
└── Coverage Reports
```

### 📊 Objetivos de Testes

- **Confiabilidade**: Garantir que o código funciona conforme esperado
- **Manutenibilidade**: Facilitar refatorações e mudanças
- **Documentação**: Testes como documentação viva do código
- **Regressão**: Prevenir quebras em funcionalidades existentes
- **Qualidade**: Manter padrões de qualidade do código

## 🛠️ Ferramentas

### 🏃‍♂️ Vitest

Framework de testes principal, escolhido por sua integração nativa com Vite e performance superior.

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});
```

### 🧩 Vue Test Utils

Biblioteca oficial do Vue para testar componentes.

```typescript
import { mount } from '@vue/test-utils';
import BaseButton from '../BaseButton.vue';

const wrapper = mount(BaseButton, {
  props: { color: 'primary' },
  slots: { default: 'Click me' }
});
```

### 👤 Testing Library

Ferramentas para testar componentes como o usuário os utiliza.

```typescript
import { render, screen, fireEvent } from '@testing-library/vue';
import LoginForm from '../LoginForm.vue';

const { getByLabelText, getByRole } = render(LoginForm);
const emailInput = getByLabelText('Email');
const submitButton = getByRole('button', { name: /entrar/i });
```

### 🌐 JSDOM

Ambiente DOM para testes de componentes Vue.

```typescript
// src/test/setup.ts
import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;
```

## 📁 Estrutura de Testes

```
src/
├── components/
│   ├── __tests__/           # Testes de componentes
│   │   ├── common/         # Testes dos componentes base
│   │   ├── features/       # Testes dos componentes de features
│   │   └── layout/         # Testes dos componentes de layout
│   └── ComponentName.vue
├── stores/
│   ├── __tests__/          # Testes de stores
│   │   ├── auth.test.ts
│   │   ├── cards.test.ts
│   │   └── trades.test.ts
│   └── storeName.ts
├── utils/
│   ├── __tests__/          # Testes de utilitários
│   │   ├── validation.test.ts
│   │   └── errorHandler.test.ts
│   └── utilName.ts
└── test/
    ├── setup.ts            # Configuração global de testes
    ├── mocks/              # Mocks globais
    └── helpers/            # Funções auxiliares
```

### 📂 Convenções de Nomenclatura

- **Arquivos de teste**: `ComponentName.test.ts` ou `ComponentName.spec.ts`
- **Pastas de teste**: `__tests__` dentro da pasta do módulo
- **Testes de integração**: `ComponentName.integration.test.ts`
- **Testes E2E**: `ComponentName.e2e.test.ts`

## 🧪 Tipos de Testes

### 🧩 Testes Unitários

Testes isolados de funções, métodos e componentes individuais.

#### 📝 Exemplo: Teste de Utilitário

```typescript
// src/utils/__tests__/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from '../validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
    });

    it('should return false for empty email', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', () => {
      expect(validatePassword('password123')).toBe(true);
    });

    it('should return false for short password', () => {
      expect(validatePassword('123')).toBe(false);
    });
  });
});
```

#### 📝 Exemplo: Teste de Store

```typescript
// src/stores/__tests__/auth.test.ts
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../auth';
import { AuthServices } from '../../services/modules/auth';

vi.mock('../../services/modules/auth');

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const store = useAuthStore();
    
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('should login successfully', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    const mockToken = 'mock-token';
    
    vi.mocked(AuthServices.login).mockResolvedValue({
      user: mockUser,
      token: mockToken
    });

    const store = useAuthStore();
    await store.login({ email: 'test@example.com', password: 'password' });

    expect(store.user).toEqual(mockUser);
    expect(store.token).toBe(mockToken);
    expect(store.isAuthenticated).toBe(true);
  });

  it('should handle login error', async () => {
    const error = new Error('Invalid credentials');
    vi.mocked(AuthServices.login).mockRejectedValue(error);

    const store = useAuthStore();
    await store.login({ email: 'test@example.com', password: 'wrong' });

    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });
});
```

### 🧩 Testes de Componentes

Testes de componentes Vue isolados, verificando props, eventos e renderização.

#### 📝 Exemplo: Teste de Componente Base

```typescript
// src/components/common/__tests__/BaseButton.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BaseButton from '../BaseButton.vue';

describe('BaseButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Click me' }
    });

    expect(wrapper.text()).toContain('Click me');
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.classes()).toContain('base-btn');
  });

  it('applies color class correctly', () => {
    const wrapper = mount(BaseButton, {
      props: { color: 'primary' },
      slots: { default: 'Button' }
    });

    expect(wrapper.classes()).toContain('primary');
  });

  it('shows loading state', () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: 'Button' }
    });

    expect(wrapper.find('.btn-spinner').exists()).toBe(true);
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('emits click event', async () => {
    const wrapper = mount(BaseButton, {
      slots: { default: 'Button' }
    });

    await wrapper.find('button').trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Button' }
    });

    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});
```

#### 📝 Exemplo: Teste de Componente Complexo

```typescript
// src/components/features/auth/__tests__/LoginForm.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import LoginForm from '../LoginForm.vue';
import { useAuthStore } from '../../../stores/auth';

vi.mock('../../../stores/auth');

describe('LoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders login form correctly', () => {
    const wrapper = mount(LoginForm);

    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('validates form inputs', async () => {
    const wrapper = mount(LoginForm);
    const emailInput = wrapper.find('input[type="email"]');
    const passwordInput = wrapper.find('input[type="password"]');

    // Test invalid email
    await emailInput.setValue('invalid-email');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.text()).toContain('Email inválido');

    // Test valid inputs
    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');
    
    expect(wrapper.text()).not.toContain('Email inválido');
  });

  it('calls login method on form submit', async () => {
    const mockLogin = vi.fn();
    vi.mocked(useAuthStore).mockReturnValue({
      login: mockLogin,
      loading: false,
      error: null
    });

    const wrapper = mount(LoginForm);
    
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('shows loading state during submission', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      login: vi.fn(),
      loading: true,
      error: null
    });

    const wrapper = mount(LoginForm);
    const submitButton = wrapper.find('button[type="submit"]');

    expect(submitButton.props('loading')).toBe(true);
  });
});
```

### 🔗 Testes de Integração

Testes que verificam a interação entre múltiplos componentes ou módulos.

#### 📝 Exemplo: Teste de Integração

```typescript
// src/components/features/cards/__tests__/CardList.integration.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import CardList from '../CardList.vue';
import { useCardsStore } from '../../../stores/cards';

vi.mock('../../../stores/cards');

describe('CardList Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('loads and displays cards from store', async () => {
    const mockCards = [
      { id: '1', name: 'Card 1', description: 'Description 1' },
      { id: '2', name: 'Card 2', description: 'Description 2' }
    ];

    vi.mocked(useCardsStore).mockReturnValue({
      cards: mockCards,
      loading: false,
      error: null,
      fetchCards: vi.fn()
    });

    const wrapper = mount(CardList);

    expect(wrapper.findAll('.card-item')).toHaveLength(2);
    expect(wrapper.text()).toContain('Card 1');
    expect(wrapper.text()).toContain('Card 2');
  });

  it('handles card selection and emits events', async () => {
    const mockCards = [{ id: '1', name: 'Card 1' }];
    
    vi.mocked(useCardsStore).mockReturnValue({
      cards: mockCards,
      loading: false,
      error: null,
      fetchCards: vi.fn()
    });

    const wrapper = mount(CardList);
    const cardItem = wrapper.find('.card-item');

    await cardItem.trigger('click');

    expect(wrapper.emitted('card-click')).toBeTruthy();
    expect(wrapper.emitted('card-click')?.[0]).toEqual([mockCards[0]]);
  });
});
```

### 🌐 Testes E2E (End-to-End)

Testes que simulam o comportamento real do usuário na aplicação.

```typescript
// src/tests/e2e/login.e2e.test.ts
import { test, expect } from '@playwright/test';

test('user can login successfully', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});

test('shows error for invalid credentials', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[type="email"]', 'invalid@example.com');
  await page.fill('input[type="password"]', 'wrongpassword');
  await page.click('button[type="submit"]');
  
  await expect(page.locator('.error-message')).toContainText('Credenciais inválidas');
});
```

## 📝 Padrões de Teste

### 🎯 AAA Pattern (Arrange, Act, Assert)

```typescript
describe('UserService', () => {
  it('should create user successfully', async () => {
    // Arrange
    const userData = { name: 'John', email: 'john@example.com' };
    const mockResponse = { id: '1', ...userData };
    vi.mocked(api.post).mockResolvedValue({ data: mockResponse });

    // Act
    const result = await UserService.createUser(userData);

    // Assert
    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith('/users', userData);
  });
});
```

### 🎭 Test Doubles (Mocks, Stubs, Spies)

```typescript
// Mock de serviço
vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

// Spy de função
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

// Stub de localStorage
const localStorageStub = {
  getItem: vi.fn().mockReturnValue('mock-token'),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageStub });
```

### 🧹 Cleanup e Setup

```typescript
describe('Component Tests', () => {
  beforeEach(() => {
    // Setup antes de cada teste
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup após cada teste
    vi.restoreAllMocks();
  });

  afterAll(() => {
    // Cleanup após todos os testes
    vi.clearAllTimers();
  });
});
```

## 🔧 Configuração

### 📝 Setup Global

```typescript
// src/test/setup.ts
import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
} as Storage;
global.localStorage = localStorageMock;

// Mock console.error para evitar logs nos testes
global.console.error = vi.fn();

// Configuração global do Vue Test Utils
config.global.stubs = {
  'router-link': true,
  'router-view': true
};

// Mock do vue-router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn()
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/'
  })
}));
```

### 📝 Helpers de Teste

```typescript
// src/test/helpers/index.ts
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import type { ComponentMountingOptions } from '@vue/test-utils';

export function createTestPinia() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
}

export function mountWithPinia(
  component: any,
  options: ComponentMountingOptions<any> = {}
) {
  const pinia = createTestPinia();
  
  return mount(component, {
    global: {
      plugins: [pinia],
      ...options.global
    },
    ...options
  });
}

export function createMockUser(overrides = {}) {
  return {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
}

export function createMockCard(overrides = {}) {
  return {
    id: '1',
    name: 'Test Card',
    description: 'Test Description',
    imageUrl: 'https://example.com/card.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides
  };
}
```

## 📊 Cobertura

### 🎯 Configuração de Cobertura

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
```

### 📈 Relatórios de Cobertura

```bash
# Gerar relatório de cobertura
npm run test:coverage

# Visualizar relatório HTML
open coverage/index.html
```

### 🎯 Métricas de Cobertura

| Tipo | Meta | Atual |
|------|------|-------|
| **Statements** | 80% | 85% |
| **Branches** | 80% | 82% |
| **Functions** | 80% | 88% |
| **Lines** | 80% | 86% |

## 🚀 CI/CD

### 📝 GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:run
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/coverage-final.json
```

### 🔧 Scripts de Teste

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:debug": "vitest --inspect-brk"
  }
}
```

### 🎯 Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:run",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

---

## 📚 Referências

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 