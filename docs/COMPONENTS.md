# 🧩 Guia de Componentes

Este documento descreve todos os componentes Vue utilizados no projeto Cartalia, incluindo suas props, eventos e exemplos de uso.

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [📁 Estrutura de Componentes](#-estrutura-de-componentes)
- [🔧 Componentes Base](#-componentes-base)
- [🎨 Componentes de Features](#-componentes-de-features)
- [🏗️ Componentes de Layout](#️-componentes-de-layout)
- [📝 Convenções](#-convenções)
- [🧪 Testes](#-testes)

## 🎯 Visão Geral

O projeto Cartalia utiliza uma arquitetura baseada em componentes Vue 3 com Composition API. Os componentes são organizados em três categorias principais:

- **Base**: Componentes reutilizáveis e genéricos
- **Features**: Componentes específicos de funcionalidades
- **Layout**: Componentes de estrutura da aplicação

### 🎨 Stack de Componentes

```
Vue 3 (Composition API)
├── TypeScript
├── Vuetify 3
├── SASS/SCSS
├── Props Validation (Zod)
├── Event Emitting
└── Scoped Styles
```

## 📁 Estrutura de Componentes

```
src/components/
├── common/              # Componentes base reutilizáveis
│   ├── BaseModal.vue
│   ├── Card.vue
│   ├── CardPreview.vue
│   ├── Container.vue
│   ├── ErrorBoundary.vue
│   ├── ErrorModal.vue
│   ├── Loading.vue
│   ├── LoadingOverlay.vue
│   ├── LoadingSpinner.vue
│   ├── Logo.vue
│   ├── NavMenu.vue
│   ├── Notification.vue
│   ├── PageHeader.vue
│   ├── Pagination.vue
│   ├── SearchInput.vue
│   ├── SearchWithPagination.vue
│   ├── SimplePagination.vue
│   ├── StatCard.vue
│   ├── StatsGrid.vue
│   └── ViewToggle.vue
├── features/            # Componentes específicos
│   ├── auth/           # Autenticação
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   ├── cards/          # Gerenciamento de cartas
│   │   ├── AddCardModal.vue
│   │   ├── CardDetailModal.vue
│   │   ├── CardList.vue
│   │   ├── CardsEmptyState.vue
│   │   ├── CardsErrorState.vue
│   │   ├── CardsFilters.vue
│   │   ├── CardsHeader.vue
│   │   ├── CardsNoResults.vue
│   │   └── CardStats.vue
│   ├── dashboard/      # Dashboard
│   │   ├── DashboardHeader.vue
│   │   ├── DashboardStats.vue
│   │   ├── QuickActions.vue
│   │   └── RecentActivity.vue
│   └── trades/         # Sistema de trocas
│       ├── CreateTradeModal.vue
│       ├── DeleteConfirmationModal.vue
│       ├── MyTradeList.vue
│       ├── TradeFilters.vue
│       ├── TradeItem.vue
│       ├── TradeList.vue
│       ├── TradePreviewStep.vue
│       ├── TradeStats.vue
│       └── TradeStepCardSelection.vue
└── layout/             # Componentes de layout
    ├── Header.vue
    ├── MainLayout.vue
    └── Sidebar.vue
```

## 🔧 Componentes Base

### BaseModal

Componente base para todos os modais da aplicação.

#### 📝 Props

```typescript
interface Props {
  modelValue: boolean;
  title?: string;
  width?: string | number;
  persistent?: boolean;
  closeOnOverlay?: boolean;
  loading?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'update:modelValue': [value: boolean];
  close: [];
  confirm: [];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <BaseModal
    v-model="showModal"
    title="Confirmação"
    width="500"
    :persistent="true"
    @confirm="handleConfirm"
  >
    <p>Tem certeza que deseja continuar?</p>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';

const showModal = ref(false);

const handleConfirm = () => {
  // Lógica de confirmação
  showModal.value = false;
};
</script>
```

### Card

Componente para exibição de cartas com informações básicas.

#### 📝 Props

```typescript
interface Props {
  card: Card;
  selectable?: boolean;
  selected?: boolean;
  showDetails?: boolean;
  loading?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  select: [card: Card];
  click: [card: Card];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <Card
    :card="card"
    :selectable="true"
    :selected="isSelected"
    @select="handleCardSelect"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from '@/components/common/Card.vue';
import type { Card as CardType } from '@/types';

const card = ref<CardType>({
  id: '1',
  name: 'Blue-Eyes White Dragon',
  description: 'This legendary dragon...',
  image: '/images/card.jpg',
  rarity: 'legendary',
  type: 'monster',
  attack: 3000,
  defense: 2500
});

const isSelected = ref(false);

const handleCardSelect = (selectedCard: CardType) => {
  isSelected.value = !isSelected.value;
};
</script>
```

### LoadingOverlay

Componente para exibir loading sobre outros elementos.

#### 📝 Props

```typescript
interface Props {
  loading: boolean;
  message?: string;
  overlay?: boolean;
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <div class="relative">
    <LoadingOverlay
      :loading="isLoading"
      message="Carregando cartas..."
    />
    <CardList :cards="cards" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoadingOverlay from '@/components/common/LoadingOverlay.vue';

const isLoading = ref(false);
const cards = ref([]);
</script>
```

### Pagination

Componente de paginação reutilizável.

#### 📝 Props

```typescript
interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  showInfo?: boolean;
  showFirstLast?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'update:currentPage': [page: number];
  'change': [page: number];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <Pagination
    v-model:current-page="currentPage"
    :total-pages="totalPages"
    :total-items="totalItems"
    :items-per-page="itemsPerPage"
    @change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Pagination from '@/components/common/Pagination.vue';

const currentPage = ref(1);
const totalPages = ref(10);
const totalItems = ref(100);
const itemsPerPage = ref(10);

const handlePageChange = (page: number) => {
  // Carregar dados da nova página
  loadCards(page);
};
</script>
```

### SearchInput

Componente de busca com debounce.

#### 📝 Props

```typescript
interface Props {
  modelValue: string;
  placeholder?: string;
  debounce?: number;
  clearable?: boolean;
  loading?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'update:modelValue': [value: string];
  search: [query: string];
  clear: [];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <SearchInput
    v-model="searchQuery"
    placeholder="Buscar cartas..."
    :debounce="300"
    :loading="isSearching"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SearchInput from '@/components/common/SearchInput.vue';

const searchQuery = ref('');
const isSearching = ref(false);

const handleSearch = (query: string) => {
  isSearching.value = true;
  // Lógica de busca
  searchCards(query).finally(() => {
    isSearching.value = false;
  });
};
</script>
```

## 🎨 Componentes de Features

### 🔐 Autenticação

#### LoginForm

Formulário de login com validação.

#### 📝 Props

```typescript
interface Props {
  loading?: boolean;
  error?: string;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  submit: [credentials: LoginCredentials];
  register: [];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <LoginForm
    :loading="isLoading"
    :error="error"
    @submit="handleLogin"
    @register="goToRegister"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '@/components/features/auth/LoginForm.vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const error = ref('');

const handleLogin = async (credentials: LoginCredentials) => {
  isLoading.value = true;
  error.value = '';
  
  try {
    await authStore.login(credentials);
    router.push('/dashboard');
  } catch (err) {
    error.value = 'Credenciais inválidas';
  } finally {
    isLoading.value = false;
  }
};

const goToRegister = () => {
  router.push('/register');
};
</script>
```

### 🃏 Gerenciamento de Cartas

#### CardList

Lista de cartas com paginação e filtros.

#### 📝 Props

```typescript
interface Props {
  cards: Card[];
  loading?: boolean;
  error?: string;
  selectable?: boolean;
  selectedCards?: Card[];
  showFilters?: boolean;
  showPagination?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'card-select': [card: Card];
  'cards-select': [cards: Card[]];
  'page-change': [page: number];
  'filter-change': [filters: CardFilters];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <CardList
    :cards="cards"
    :loading="loading"
    :error="error"
    :selectable="true"
    :selected-cards="selectedCards"
    :show-filters="true"
    :show-pagination="true"
    @card-select="handleCardSelect"
    @page-change="handlePageChange"
    @filter-change="handleFilterChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CardList from '@/components/features/cards/CardList.vue';
import { useCardsStore } from '@/stores/cards';

const cardsStore = useCardsStore();

const cards = ref([]);
const loading = ref(false);
const error = ref('');
const selectedCards = ref([]);

const handleCardSelect = (card: Card) => {
  const index = selectedCards.value.findIndex(c => c.id === card.id);
  if (index > -1) {
    selectedCards.value.splice(index, 1);
  } else {
    selectedCards.value.push(card);
  }
};

const handlePageChange = (page: number) => {
  loadCards(page);
};

const handleFilterChange = (filters: CardFilters) => {
  loadCards(1, filters);
};

const loadCards = async (page = 1, filters = {}) => {
  loading.value = true;
  try {
    const response = await cardsStore.fetchCards({ page, ...filters });
    cards.value = response.data;
  } catch (err) {
    error.value = 'Erro ao carregar cartas';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadCards();
});
</script>
```

#### AddCardModal

Modal para adicionar cartas à coleção.

#### 📝 Props

```typescript
interface Props {
  modelValue: boolean;
  availableCards: Card[];
  loading?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'update:modelValue': [value: boolean];
  'card-add': [cardId: string];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <AddCardModal
    v-model="showAddModal"
    :available-cards="availableCards"
    :loading="isAdding"
    @card-add="handleAddCard"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AddCardModal from '@/components/features/cards/AddCardModal.vue';

const showAddModal = ref(false);
const availableCards = ref([]);
const isAdding = ref(false);

const handleAddCard = async (cardId: string) => {
  isAdding.value = true;
  try {
    await cardsStore.addCard(cardId);
    showAddModal.value = false;
    // Recarregar lista de cartas
  } catch (error) {
    console.error('Erro ao adicionar carta:', error);
  } finally {
    isAdding.value = false;
  }
};
</script>
```

### 🔄 Sistema de Trocas

#### TradeList

Lista de trocas disponíveis.

#### 📝 Props

```typescript
interface Props {
  trades: Trade[];
  loading?: boolean;
  error?: string;
  showFilters?: boolean;
  showPagination?: boolean;
  userTrades?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'trade-select': [trade: Trade];
  'trade-accept': [tradeId: string];
  'trade-reject': [tradeId: string];
  'trade-delete': [tradeId: string];
  'page-change': [page: number];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <TradeList
    :trades="trades"
    :loading="loading"
    :error="error"
    :show-filters="true"
    :user-trades="false"
    @trade-accept="handleAcceptTrade"
    @trade-reject="handleRejectTrade"
    @page-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TradeList from '@/components/features/trades/TradeList.vue';
import { useTradesStore } from '@/stores/trades';

const tradesStore = useTradesStore();

const trades = ref([]);
const loading = ref(false);
const error = ref('');

const handleAcceptTrade = async (tradeId: string) => {
  try {
    await tradesStore.acceptTrade(tradeId);
    // Recarregar lista
    loadTrades();
  } catch (error) {
    console.error('Erro ao aceitar troca:', error);
  }
};

const handleRejectTrade = async (tradeId: string) => {
  try {
    await tradesStore.rejectTrade(tradeId);
    // Recarregar lista
    loadTrades();
  } catch (error) {
    console.error('Erro ao rejeitar troca:', error);
  }
};

const loadTrades = async () => {
  loading.value = true;
  try {
    const response = await tradesStore.fetchTrades();
    trades.value = response.data;
  } catch (err) {
    error.value = 'Erro ao carregar trocas';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTrades();
});
</script>
```

#### CreateTradeModal

Modal para criar novas trocas.

#### 📝 Props

```typescript
interface Props {
  modelValue: boolean;
  userCards: Card[];
  availableCards: Card[];
  loading?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'update:modelValue': [value: boolean];
  'trade-create': [tradeData: CreateTradeData];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <CreateTradeModal
    v-model="showCreateModal"
    :user-cards="userCards"
    :available-cards="availableCards"
    :loading="isCreating"
    @trade-create="handleCreateTrade"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateTradeModal from '@/components/features/trades/CreateTradeModal.vue';

const showCreateModal = ref(false);
const userCards = ref([]);
const availableCards = ref([]);
const isCreating = ref(false);

const handleCreateTrade = async (tradeData: CreateTradeData) => {
  isCreating.value = true;
  try {
    await tradesStore.createTrade(tradeData);
    showCreateModal.value = false;
    // Recarregar lista de trocas
  } catch (error) {
    console.error('Erro ao criar troca:', error);
  } finally {
    isCreating.value = false;
  }
};
</script>
```

### 📊 Dashboard

#### DashboardStats

Estatísticas do dashboard.

#### 📝 Props

```typescript
interface Props {
  stats: DashboardStats;
  loading?: boolean;
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <DashboardStats
    :stats="stats"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardStats from '@/components/features/dashboard/DashboardStats.vue';
import { useDashboard } from '@/composables/useDashboard';

const { stats, loading, loadStats } = useDashboard();

onMounted(() => {
  loadStats();
});
</script>
```

## 🏗️ Componentes de Layout

### Header

Cabeçalho principal da aplicação.

#### 📝 Props

```typescript
interface Props {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'menu-toggle': [];
  'back': [];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <Header
    title="Cartalia"
    :show-menu="true"
    @menu-toggle="toggleSidebar"
  />
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import { useSidebarStore } from '@/stores/sidebar';

const sidebarStore = useSidebarStore();

const toggleSidebar = () => {
  sidebarStore.toggle();
};
</script>
```

### MainLayout

Layout principal da aplicação.

#### 📝 Props

```typescript
interface Props {
  showSidebar?: boolean;
  sidebarCollapsed?: boolean;
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'sidebar-toggle': [collapsed: boolean];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <MainLayout
    :show-sidebar="true"
    :sidebar-collapsed="sidebarCollapsed"
    @sidebar-toggle="handleSidebarToggle"
  >
    <router-view />
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';

const sidebarCollapsed = ref(false);

const handleSidebarToggle = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed;
};
</script>
```

### Sidebar

Barra lateral da aplicação.

#### 📝 Props

```typescript
interface Props {
  modelValue: boolean;
  collapsed?: boolean;
  items: MenuItem[];
}
```

#### 🎯 Eventos

```typescript
interface Emits {
  'update:modelValue': [value: boolean];
  'item-click': [item: MenuItem];
}
```

#### 📝 Exemplo de Uso

```vue
<template>
  <Sidebar
    v-model="showSidebar"
    :collapsed="collapsed"
    :items="menuItems"
    @item-click="handleMenuItemClick"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/layout/Sidebar.vue';

const router = useRouter();
const showSidebar = ref(true);
const collapsed = ref(false);

const menuItems = ref([
  { id: 'dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard', route: '/dashboard' },
  { id: 'cards', label: 'Cartas', icon: 'mdi-cards', route: '/cards' },
  { id: 'trades', label: 'Trocas', icon: 'mdi-swap-horizontal', route: '/trades' }
]);

const handleMenuItemClick = (item: MenuItem) => {
  router.push(item.route);
};
</script>
```

## 📝 Convenções

### 🎯 Nomenclatura

- **Componentes**: PascalCase (ex: `CardList.vue`)
- **Props**: camelCase (ex: `cardList`)
- **Eventos**: kebab-case (ex: `card-select`)
- **Slots**: kebab-case (ex: `card-content`)

### 📁 Organização

- **Um componente por arquivo**
- **Nome do arquivo igual ao nome do componente**
- **Agrupamento por funcionalidade**
- **Componentes base em `common/`**

### 🎨 Estilos

- **Scoped styles** por padrão
- **SASS/SCSS** para estilos
- **Variáveis CSS** para temas
- **Responsive design** obrigatório

### 🔧 Props e Eventos

- **Props obrigatórias** primeiro
- **Props opcionais** com valores padrão
- **Eventos** sempre tipados
- **Validação** com Zod quando necessário

## 🧪 Testes

### 📝 Estrutura de Testes

```
src/tests/
├── components/
│   ├── common/
│   │   ├── Card.test.ts
│   │   ├── LoadingOverlay.test.ts
│   │   └── Pagination.test.ts
│   └── features/
│       ├── auth/
│       ├── cards/
│       └── trades/
└── setup.ts
```

### 🎯 Exemplo de Teste

```typescript
// tests/components/common/Card.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Card from '@/components/common/Card.vue';

describe('Card', () => {
  const mockCard = {
    id: '1',
    name: 'Test Card',
    description: 'Test description',
    image: '/test.jpg',
    rarity: 'common',
    type: 'monster'
  };

  it('renders card information correctly', () => {
    const wrapper = mount(Card, {
      props: { card: mockCard }
    });

    expect(wrapper.text()).toContain('Test Card');
    expect(wrapper.text()).toContain('Test description');
  });

  it('emits select event when clicked', async () => {
    const wrapper = mount(Card, {
      props: { card: mockCard, selectable: true }
    });

    await wrapper.trigger('click');
    
    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual([mockCard]);
  });
});
```

### 🔧 Configuração de Testes

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts']
  }
});
```

### 📊 Cobertura de Testes

- **Componentes base**: 100% de cobertura
- **Componentes de features**: 80% de cobertura
- **Eventos e props**: Testados
- **Integração**: Testes de fluxo completo 