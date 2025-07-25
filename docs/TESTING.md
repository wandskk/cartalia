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
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'src/tests/e2e/**/*',
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        'packages/*/test{,s}/**',
        '**/*.d.ts',
        'cypress/**',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
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
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src')
    }
  },
  define: {
    global: 'globalThis'
  }
});
```

### 🧩 Vue Test Utils

Biblioteca oficial do Vue para testar componentes.

```typescript
import { mount } from '@vue/test-utils';
import Card from '@/components/common/Card.vue';

const wrapper = mount(Card, {
  props: { 
    card: mockCard,
    selectable: true 
  },
  slots: { default: 'Card Content' }
});
```

### 👤 Testing Library

Ferramentas para testar componentes como o usuário os utiliza.

```typescript
import { render, screen, fireEvent } from '@testing-library/vue';
import LoginForm from '@/components/features/auth/LoginForm.vue';

const { getByLabelText, getByRole } = render(LoginForm);
const emailInput = getByLabelText('Email');
const submitButton = getByRole('button', { name: /entrar/i });
```

### 🌐 JSDOM

Ambiente DOM para testes de componentes Vue.

```typescript
// src/tests/setup.ts
import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Configuração global do Vue Test Utils
config.global.stubs = {
  'router-link': true,
  'router-view': true
};
```

## 📁 Estrutura de Testes

### 📂 Organização

```
src/tests/
├── components/           # Testes de componentes
│   ├── common/          # Componentes base
│   │   ├── Card.test.ts
│   │   ├── LoadingOverlay.test.ts
│   │   └── Pagination.test.ts
│   └── features/        # Componentes específicos
│       ├── auth/
│       │   ├── LoginForm.test.ts
│       │   └── RegisterForm.test.ts
│       ├── cards/
│       │   ├── CardList.test.ts
│       │   └── AddCardModal.test.ts
│       └── trades/
│           ├── TradeList.test.ts
│           └── CreateTradeModal.test.ts
├── composables/         # Testes de composables
│   ├── useApi.test.ts
│   ├── useAuthForm.test.ts
│   ├── useCardFilters.test.ts
│   ├── useCardSelection.test.ts
│   ├── useCardStates.test.ts
│   ├── useDashboard.test.ts
│   ├── useFilters.test.ts
│   ├── useLoadingState.test.ts
│   ├── useMarketplaceFilters.test.ts
│   ├── useModal.test.ts
│   ├── usePagination.test.ts
│   ├── useSearch.test.ts
│   ├── useSidebar.test.ts
│   ├── useSteps.test.ts
│   ├── useTradeCreation.test.ts
│   └── useTradeFilters.test.ts
├── stores/              # Testes de stores
│   ├── auth.test.ts
│   ├── cache.test.ts
│   ├── cards.test.ts
│   ├── error.test.ts
│   ├── loading.test.ts
│   ├── notification.test.ts
│   ├── sidebar.test.ts
│   └── trades.test.ts
├── utils/               # Testes de utilitários
│   ├── formatters.test.ts
│   ├── errorHandler.test.ts
│   └── parseApiError.test.ts
├── mocks/               # Mocks e dados de teste
│   ├── api.ts
│   ├── data.ts
│   ├── stores.ts
│   └── index.ts
└── setup.ts            # Configuração global
```

### 📂 Mocks e Dados

```typescript
// src/tests/mocks/data.ts
export const mockCard = {
  id: '1',
  name: 'Blue-Eyes White Dragon',
  description: 'This legendary dragon...',
  image: '/images/card.jpg',
  rarity: 'legendary' as const,
  type: 'monster' as const,
  attack: 3000,
  defense: 2500,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

export const mockTrade = {
  id: '1',
  userId: '1',
  offeredCards: [mockCard],
  requestedCards: [mockCard],
  description: 'Trade description',
  status: 'pending' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};
```

```typescript
// src/tests/mocks/api.ts
import { vi } from 'vitest';

export const mockApi = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
};

export const mockAxiosResponse = (data: any) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

export const mockAxiosError = (message: string, status: number = 400) => ({
  message,
  response: {
    data: { message },
    status,
    statusText: 'Bad Request',
    headers: {},
    config: {}
  }
});
```

## 🧪 Tipos de Testes

### 🧩 Testes de Componentes

Testes que verificam o comportamento e renderização dos componentes Vue.

#### 📝 Exemplo: Card Component

```typescript
// src/tests/components/common/Card.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import Card from '@/components/common/Card.vue';
import { mockCard } from '@/tests/mocks/data';

describe('Card', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(Card, {
      props: { card: mockCard }
    });
  });

  it('renders card information correctly', () => {
    expect(wrapper.text()).toContain('Blue-Eyes White Dragon');
    expect(wrapper.text()).toContain('This legendary dragon...');
    expect(wrapper.find('img').attributes('src')).toBe('/images/card.jpg');
  });

  it('emits select event when clicked and selectable', async () => {
    wrapper = mount(Card, {
      props: { 
        card: mockCard,
        selectable: true 
      }
    });

    await wrapper.trigger('click');
    
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual([mockCard]);
  });

  it('applies selected class when selected', () => {
    wrapper = mount(Card, {
      props: { 
        card: mockCard,
        selectable: true,
        selected: true 
      }
    });

    expect(wrapper.classes()).toContain('selected');
  });

  it('shows loading state', () => {
    wrapper = mount(Card, {
      props: { 
        card: mockCard,
        loading: true 
      }
    });

    expect(wrapper.find('.loading-overlay').exists()).toBe(true);
  });
});
```

#### 📝 Exemplo: LoginForm Component

```typescript
// src/tests/components/features/auth/LoginForm.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import LoginForm from '@/components/features/auth/LoginForm.vue';

describe('LoginForm', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(LoginForm);
  });

  it('renders form fields correctly', () => {
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('emits submit event with form data', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    await wrapper.find('input[type="email"]').setValue(email);
    await wrapper.find('input[type="password"]').setValue(password);
    await wrapper.find('form').trigger('submit');

    expect(wrapper.emitted('submit')).toBeTruthy();
    expect(wrapper.emitted('submit')?.[0]).toEqual([{
      email,
      password
    }]);
  });

  it('shows loading state', () => {
    wrapper = mount(LoginForm, {
      props: { loading: true }
    });

    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('displays error message', () => {
    const errorMessage = 'Invalid credentials';
    wrapper = mount(LoginForm, {
      props: { error: errorMessage }
    });

    expect(wrapper.text()).toContain(errorMessage);
  });

  it('emits register event when register link is clicked', async () => {
    await wrapper.find('[data-testid="register-link"]').trigger('click');
    
    expect(wrapper.emitted('register')).toBeTruthy();
  });
});
```

### 🔄 Testes de Composables

Testes que verificam a lógica reutilizável dos composables.

#### 📝 Exemplo: useCardFilters

```typescript
// src/tests/composables/useCardFilters.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useCardFilters } from '@/composables/useCardFilters';

describe('useCardFilters', () => {
  let composable: any;

  beforeEach(() => {
    composable = useCardFilters();
  });

  it('initializes with default filters', () => {
    expect(composable.filters.value).toEqual({
      name: '',
      rarity: '',
      type: '',
      minAttack: undefined,
      maxAttack: undefined,
      minDefense: undefined,
      maxDefense: undefined
    });
  });

  it('initializes with provided filters', () => {
    const initialFilters = {
      name: 'dragon',
      rarity: 'legendary'
    };

    composable = useCardFilters(initialFilters);

    expect(composable.filters.value.name).toBe('dragon');
    expect(composable.filters.value.rarity).toBe('legendary');
  });

  it('detects active filters correctly', () => {
    expect(composable.hasActiveFilters.value).toBe(false);

    composable.filters.value.name = 'dragon';
    expect(composable.hasActiveFilters.value).toBe(true);

    composable.filters.value.name = '';
    composable.filters.value.rarity = 'legendary';
    expect(composable.hasActiveFilters.value).toBe(true);
  });

  it('clears all filters', () => {
    composable.filters.value.name = 'dragon';
    composable.filters.value.rarity = 'legendary';

    composable.clearFilters();

    expect(composable.filters.value.name).toBe('');
    expect(composable.filters.value.rarity).toBe('');
    expect(composable.hasActiveFilters.value).toBe(false);
  });

  it('applies new filters', () => {
    const newFilters = {
      name: 'dragon',
      rarity: 'legendary'
    };

    composable.applyFilters(newFilters);

    expect(composable.filters.value.name).toBe('dragon');
    expect(composable.filters.value.rarity).toBe('legendary');
  });
});
```

#### 📝 Exemplo: useApi

```typescript
// src/tests/composables/useApi.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useApi } from '@/composables/useApi';
import { mockApi, mockAxiosResponse, mockAxiosError } from '@/tests/mocks/api';

vi.mock('@/services', () => ({
  api: mockApi
}));

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('makes GET request successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockApi.get.mockResolvedValue(mockAxiosResponse(mockData));

    const { data, loading, error, execute } = useApi('/test');

    await execute();

    expect(mockApi.get).toHaveBeenCalledWith('/test');
    expect(data.value).toEqual(mockData);
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
  });

  it('handles API errors', async () => {
    const errorMessage = 'API Error';
    mockApi.get.mockRejectedValue(mockAxiosError(errorMessage));

    const { data, loading, error, execute } = useApi('/test');

    await execute();

    expect(loading.value).toBe(false);
    expect(error.value).toBe(errorMessage);
    expect(data.value).toBeNull();
  });

  it('shows loading state during request', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockApi.get.mockReturnValue(promise);

    const { loading, execute } = useApi('/test');

    const executePromise = execute();
    expect(loading.value).toBe(true);

    resolvePromise!(mockAxiosResponse({}));
    await executePromise;

    expect(loading.value).toBe(false);
  });
});
```

### 🏪 Testes de Stores

Testes que verificam o gerenciamento de estado com Pinia.

#### 📝 Exemplo: useCardsStore

```typescript
// src/tests/stores/cards.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCardsStore } from '@/stores/cards';
import { mockCard } from '@/tests/mocks/data';
import { mockApi, mockAxiosResponse, mockAxiosError } from '@/tests/mocks/api';

vi.mock('@/services/modules/cards', () => ({
  cardsApi: mockApi
}));

describe('useCardsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const store = useCardsStore();

    expect(store.cards).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('fetches cards successfully', async () => {
    const mockCards = [mockCard];
    const mockResponse = {
      data: mockCards,
      total: 1,
      page: 1,
      limit: 20
    };
    mockApi.get.mockResolvedValue(mockAxiosResponse(mockResponse));

    const store = useCardsStore();

    await store.fetchCards();

    expect(mockApi.get).toHaveBeenCalledWith('/cards', { params: undefined });
    expect(store.cards).toEqual(mockCards);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch cards';
    mockApi.get.mockRejectedValue(mockAxiosError(errorMessage));

    const store = useCardsStore();

    await expect(store.fetchCards()).rejects.toThrow();

    expect(store.loading).toBe(false);
    expect(store.error).toBe('Erro ao carregar cartas');
  });

  it('adds card successfully', async () => {
    const newCard = { ...mockCard, id: '2' };
    mockApi.post.mockResolvedValue(mockAxiosResponse({ card: newCard }));

    const store = useCardsStore();
    store.cards = [mockCard];

    await store.addCard('2');

    expect(mockApi.post).toHaveBeenCalledWith('/cards', { cardId: '2' });
    expect(store.cards).toContain(newCard);
  });

  it('calculates total cards correctly', () => {
    const store = useCardsStore();
    store.cards = [mockCard, { ...mockCard, id: '2' }];

    expect(store.totalCards).toBe(2);
  });

  it('groups cards by rarity correctly', () => {
    const store = useCardsStore();
    store.cards = [
      mockCard,
      { ...mockCard, id: '2', rarity: 'common' },
      { ...mockCard, id: '3', rarity: 'legendary' }
    ];

    expect(store.cardsByRarity).toEqual({
      legendary: 2,
      common: 1
    });
  });
});
```

### 🛠️ Testes de Utilitários

Testes que verificam funções utilitárias.

#### 📝 Exemplo: formatters

```typescript
// src/tests/utils/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatCardName, formatRarity, formatDate } from '@/utils/formatters';

describe('formatters', () => {
  describe('formatCardName', () => {
    it('formats card name correctly', () => {
      expect(formatCardName('blue-eyes-white-dragon')).toBe('Blue Eyes White Dragon');
      expect(formatCardName('dark-magician')).toBe('Dark Magician');
    });

    it('handles empty string', () => {
      expect(formatCardName('')).toBe('');
    });
  });

  describe('formatRarity', () => {
    it('formats rarity correctly', () => {
      expect(formatRarity('common')).toBe('Comum');
      expect(formatRarity('uncommon')).toBe('Incomum');
      expect(formatRarity('rare')).toBe('Rara');
      expect(formatRarity('epic')).toBe('Épica');
      expect(formatRarity('legendary')).toBe('Lendária');
    });

    it('handles unknown rarity', () => {
      expect(formatRarity('unknown')).toBe('Desconhecida');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(formatDate(date)).toBe('15/01/2024');
    });

    it('handles string date', () => {
      expect(formatDate('2024-01-15T10:30:00Z')).toBe('15/01/2024');
    });
  });
});
```

## 📝 Padrões de Teste

### 🎯 AAA Pattern (Arrange, Act, Assert)

```typescript
describe('Component', () => {
  it('should behave correctly', () => {
    // Arrange - Preparar dados e configurações
    const mockData = { id: 1, name: 'Test' };
    const wrapper = mount(Component, {
      props: { data: mockData }
    });

    // Act - Executar a ação
    wrapper.find('button').trigger('click');

    // Assert - Verificar o resultado
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
```

### 🔄 Testes de Integração

```typescript
// src/tests/integration/cardFlow.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CardList from '@/components/features/cards/CardList.vue';
import { useCardsStore } from '@/stores/cards';
import { mockCard } from '@/tests/mocks/data';

describe('Card Flow Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('loads and displays cards', async () => {
    const store = useCardsStore();
    store.cards = [mockCard];

    const wrapper = mount(CardList, {
      props: { cards: store.cards }
    });

    expect(wrapper.find('.card-item').exists()).toBe(true);
    expect(wrapper.text()).toContain('Blue-Eyes White Dragon');
  });
});
```

### 🎭 Testes com Mocks

```typescript
// src/tests/unit/apiService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cardsApi } from '@/services/modules/cards';
import { mockApi, mockAxiosResponse } from '@/tests/mocks/api';

vi.mock('@/services', () => ({
  api: mockApi
}));

describe('cardsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches cards with filters', async () => {
    const filters = { name: 'dragon', rarity: 'legendary' };
    const mockResponse = { data: [], total: 0 };
    mockApi.get.mockResolvedValue(mockAxiosResponse(mockResponse));

    await cardsApi.getCards(filters);

    expect(mockApi.get).toHaveBeenCalledWith('/cards', { params: filters });
  });
});
```

## 🔧 Configuração

### 📦 Scripts de Teste

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch"
  }
}
```

### 🎯 Configuração do Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'src/tests/e2e/**/*',
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        'packages/*/test{,s}/**',
        '**/*.d.ts',
        'cypress/**',
        'test{,s}/**',
        'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
        '**/*{.,-}spec.{js,cjs,mjs,ts,tsx,jsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
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
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src')
    }
  },
  define: {
    global: 'globalThis'
  }
});
```

### 🎨 Configuração do Setup

```typescript
// src/tests/setup.ts
import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// Configuração global do Vue Test Utils
config.global.stubs = {
  'router-link': true,
  'router-view': true,
  'v-app': true,
  'v-main': true,
  'v-container': true,
  'v-row': true,
  'v-col': true,
  'v-card': true,
  'v-card-title': true,
  'v-card-text': true,
  'v-btn': true,
  'v-text-field': true,
  'v-select': true,
  'v-checkbox': true,
  'v-radio-group': true,
  'v-radio': true,
  'v-switch': true,
  'v-slider': true,
  'v-rating': true,
  'v-progress-linear': true,
  'v-progress-circular': true,
  'v-chip': true,
  'v-badge': true,
  'v-avatar': true,
  'v-icon': true,
  'v-img': true,
  'v-divider': true,
  'v-spacer': true,
  'v-toolbar': true,
  'v-app-bar': true,
  'v-navigation-drawer': true,
  'v-list': true,
  'v-list-item': true,
  'v-list-item-title': true,
  'v-list-item-subtitle': true,
  'v-list-item-icon': true,
  'v-list-group': true,
  'v-list-subheader': true,
  'v-menu': true,
  'v-dialog': true,
  'v-sheet': true,
  'v-expansion-panels': true,
  'v-expansion-panel': true,
  'v-expansion-panel-header': true,
  'v-expansion-panel-content': true,
  'v-tabs': true,
  'v-tab': true,
  'v-tab-item': true,
  'v-tabs-items': true,
  'v-window': true,
  'v-window-item': true,
  'v-stepper': true,
  'v-stepper-header': true,
  'v-stepper-step': true,
  'v-stepper-content': true,
  'v-stepper-items': true,
  'v-data-table': true,
  'v-data-iterator': true,
  'v-pagination': true,
  'v-autocomplete': true,
  'v-combobox': true,
  'v-file-input': true,
  'v-textarea': true,
  'v-time-picker': true,
  'v-date-picker': true,
  'v-color-picker': true
};

// Mock Vuetify
config.global.mocks = {
  $vuetify: {
    theme: {
      current: {
        dark: false
      }
    },
    breakpoint: {
      mobile: false,
      tablet: false,
      desktop: true
    }
  }
};
```

## 📊 Cobertura

### 🎯 Metas de Cobertura

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### 📈 Relatórios de Cobertura

```bash
# Gerar relatório de cobertura
npm run test:coverage

# Abrir relatório no navegador
open coverage/index.html
```

### 📊 Estrutura do Relatório

```
coverage/
├── index.html          # Relatório principal
├── lcov.info          # Dados para CI/CD
├── coverage-summary.json
└── src/               # Cobertura por arquivo
    ├── components/
    ├── composables/
    ├── stores/
    └── utils/
```

## 🚀 CI/CD

### 🔄 GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
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
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
```

### 🎯 Pré-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:run"
    }
  },
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "npm run test:run -- --findRelatedTests"
    ]
  }
}
```

### 📊 Monitoramento de Qualidade

- **Codecov**: Relatórios de cobertura
- **SonarQube**: Análise de qualidade
- **GitHub Actions**: Execução automática
- **Pull Request Checks**: Validação obrigatória

## 🎯 Boas Práticas

### 📝 Nomenclatura

- **Arquivos de teste**: `ComponentName.test.ts`
- **Descrições**: Claras e específicas
- **Grupos**: Organizados por funcionalidade

### 🔧 Organização

- **Um teste por comportamento**
- **Setup e teardown** adequados
- **Mocks** para dependências externas
- **Dados de teste** reutilizáveis

### 🎨 Manutenibilidade

- **Testes independentes**
- **Dados de teste** isolados
- **Mocks** consistentes
- **Documentação** clara

### 🚀 Performance

- **Testes rápidos**
- **Paralelização** quando possível
- **Cache** de dependências
- **Otimização** de setup 