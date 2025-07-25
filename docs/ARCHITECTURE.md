# 🏗️ Arquitetura do Projeto

Este documento descreve a arquitetura e os padrões utilizados no projeto Cartalia.

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🏛️ Arquitetura Geral](#️-arquitetura-geral)
- [📁 Estrutura de Pastas](#-estrutura-de-pastas)
- [🔧 Padrões de Código](#-padrões-de-código)
- [🎨 Design Patterns](#-design-patterns)
- [🔄 Fluxo de Dados](#-fluxo-de-dados)
- [🛡️ Segurança](#-segurança)
- [⚡ Performance](#-performance)

## 🎯 Visão Geral

O Cartalia é uma **Single Page Application (SPA)** desenvolvida com Vue 3 e TypeScript, seguindo os princípios de **Clean Architecture** e **Component-Based Architecture**.

### 🎨 Stack Tecnológica

```
Frontend (Vue 3 + TypeScript)
├── Framework: Vue 3 (Composition API)
├── Linguagem: TypeScript
├── Build Tool: Vite
├── State Management: Pinia
├── Router: Vue Router
├── UI Framework: Vuetify 3
├── Styling: SASS/SCSS
├── Validation: Zod + VeeValidate
└── Testing: Vitest + Vue Test Utils
```

## 🏛️ Arquitetura Geral

### 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Views (Pages)  │  Components  │  Router  │  Error Handling │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Stores (Pinia) │  Composables │  Utils   │  Validation    │
├─────────────────────────────────────────────────────────────┤
│                    Data Access Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Services (API) │  Types       │  Constants│  Interceptors  │
├─────────────────────────────────────────────────────────────┤
│                    External Layer                           │
├─────────────────────────────────────────────────────────────┤
│  REST API       │  LocalStorage│  Analytics│  PWA Cache     │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 Princípios Arquiteturais

1. **Separation of Concerns**: Cada camada tem responsabilidades específicas
2. **Dependency Inversion**: Dependências apontam para abstrações
3. **Single Responsibility**: Cada módulo tem uma única responsabilidade
4. **Open/Closed Principle**: Aberto para extensão, fechado para modificação
5. **DRY (Don't Repeat Yourself)**: Evita duplicação de código

## 📁 Estrutura de Pastas

### 📂 Organização Principal

```
src/
├── components/          # Componentes Vue reutilizáveis
│   ├── common/         # Componentes base (Button, Input, etc.)
│   ├── features/       # Componentes específicos de features
│   └── layout/         # Componentes de layout (Header, Footer)
├── views/              # Páginas da aplicação
├── stores/             # Stores Pinia (gerenciamento de estado)
├── composables/        # Composables Vue (lógica reutilizável)
├── services/           # Serviços de API e externos
├── utils/              # Utilitários e helpers
├── types/              # Definições de tipos TypeScript
├── schemas/            # Schemas de validação Zod
├── styles/             # Estilos globais e variáveis
├── router/             # Configuração de rotas
└── tests/              # Configuração e testes
```

### 📂 Detalhamento das Pastas

#### `components/`
```
components/
├── common/             # Componentes base reutilizáveis
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
├── features/           # Componentes específicos
│   ├── auth/          # Componentes de autenticação
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   ├── cards/         # Componentes de cartas
│   │   ├── AddCardModal.vue
│   │   ├── CardDetailModal.vue
│   │   ├── CardList.vue
│   │   ├── CardsEmptyState.vue
│   │   ├── CardsErrorState.vue
│   │   ├── CardsFilters.vue
│   │   ├── CardsHeader.vue
│   │   ├── CardsNoResults.vue
│   │   └── CardStats.vue
│   ├── dashboard/     # Componentes do dashboard
│   │   ├── DashboardHeader.vue
│   │   ├── DashboardStats.vue
│   │   ├── QuickActions.vue
│   │   └── RecentActivity.vue
│   └── trades/        # Componentes de trocas
│       ├── CreateTradeModal.vue
│       ├── DeleteConfirmationModal.vue
│       ├── MyTradeList.vue
│       ├── TradeFilters.vue
│       ├── TradeItem.vue
│       ├── TradeList.vue
│       ├── TradePreviewStep.vue
│       ├── TradeStats.vue
│       └── TradeStepCardSelection.vue
└── layout/            # Componentes de layout
    ├── Header.vue
    ├── MainLayout.vue
    └── Sidebar.vue
```

#### `stores/`
```
stores/
├── auth.ts            # Store de autenticação
├── cards.ts           # Store de cartas
├── trades.ts          # Store de trocas
├── cache.ts           # Store de cache
├── loading.ts         # Store de loading
├── notification.ts    # Store de notificações
├── error.ts           # Store de erros
├── sidebar.ts         # Store da sidebar
└── index.ts           # Exportações
```

#### `composables/`
```
composables/
├── useApi.ts          # Composable para API
├── useAsyncState.ts   # Composable para estado assíncrono
├── useAuthForm.ts     # Composable para formulários de auth
├── useCardFilters.ts  # Composable para filtros de cartas
├── useCardSelection.ts # Composable para seleção de cartas
├── useCardStates.ts   # Composable para estados de cartas
├── useDashboard.ts    # Composable para dashboard
├── useFilters.ts      # Composable para filtros genéricos
├── useLoadingState.ts # Composable para loading
├── useMarketplaceFilters.ts # Composable para filtros do marketplace
├── useModal.ts        # Composable para modais
├── usePagination.ts   # Composable para paginação
├── useSearch.ts       # Composable para busca
├── useSidebar.ts      # Composable para sidebar
├── useSteps.ts        # Composable para steps
├── useTradeCreation.ts # Composable para criação de trades
├── useTradeFilters.ts # Composable para filtros de trades
└── index.ts           # Exportações
```

#### `services/`
```
services/
├── modules/
│   ├── auth.ts        # Serviços de autenticação
│   ├── cards.ts       # Serviços de cartas
│   └── trades.ts      # Serviços de trocas
└── index.ts           # Configuração do axios
```

#### `types/`
```
types/
├── api.ts             # Tipos da API
├── auth.ts            # Tipos de autenticação
├── cards.ts           # Tipos de cartas
├── common.ts          # Tipos comuns
├── components.ts      # Tipos de componentes
├── modals.ts          # Tipos de modais
├── store.ts           # Tipos de stores
├── trades.ts          # Tipos de trades
└── index.ts           # Exportações
```

#### `schemas/`
```
schemas/
├── cards.schema.ts    # Schemas de validação de cartas
├── common.schema.ts   # Schemas comuns
├── login.schema.ts    # Schemas de login
├── modals.schema.ts   # Schemas de modais
├── register.schema.ts # Schemas de registro
├── trades.schema.ts   # Schemas de trades
└── index.ts           # Exportações
```

## 🔧 Padrões de Código

### 🎨 Vue 3 Composition API

O projeto utiliza exclusivamente a **Composition API** do Vue 3, que oferece melhor reutilização de lógica e tipagem TypeScript.

#### 📝 Exemplo de Componente

```vue
<template>
  <div class="card-list">
    <CardItem 
      v-for="card in cards" 
      :key="card.id" 
      :card="card"
      @select="handleCardSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCardsStore } from '@/stores/cards'
import { useCardFilters } from '@/composables/useCardFilters'
import CardItem from './CardItem.vue'

// Props e emits
interface Props {
  initialFilters?: CardFilters
}

const props = withDefaults(defineProps<Props>(), {
  initialFilters: () => ({})
})

const emit = defineEmits<{
  cardSelect: [card: Card]
}>()

// Composables
const cardsStore = useCardsStore()
const { filters, applyFilters } = useCardFilters(props.initialFilters)

// Estado local
const cards = ref<Card[]>([])
const loading = ref(false)

// Métodos
const handleCardSelect = (card: Card) => {
  emit('cardSelect', card)
}

const loadCards = async () => {
  loading.value = true
  try {
    cards.value = await cardsStore.fetchCards(filters.value)
  } catch (error) {
    console.error('Erro ao carregar cartas:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadCards()
})
</script>
```

### 🏪 Pinia Stores

Gerenciamento de estado centralizado com Pinia, seguindo o padrão de **Setup Stores**.

#### 📝 Exemplo de Store

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Card, CardFilters } from '@/types'
import { cardsApi } from '@/services/modules/cards'

export const useCardsStore = defineStore('cards', () => {
  // State
  const cards = ref<Card[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const totalCards = computed(() => cards.value.length)
  const cardsByRarity = computed(() => {
    return cards.value.reduce((acc, card) => {
      acc[card.rarity] = (acc[card.rarity] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  })

  // Actions
  const fetchCards = async (filters?: CardFilters) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await cardsApi.getCards(filters)
      cards.value = response.data
    } catch (err) {
      error.value = 'Erro ao carregar cartas'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addCard = async (card: Omit<Card, 'id'>) => {
    try {
      const response = await cardsApi.createCard(card)
      cards.value.push(response.data)
    } catch (err) {
      error.value = 'Erro ao adicionar carta'
      throw err
    }
  }

  return {
    // State
    cards,
    loading,
    error,
    
    // Getters
    totalCards,
    cardsByRarity,
    
    // Actions
    fetchCards,
    addCard
  }
})
```

### 🔄 Composables

Lógica reutilizável encapsulada em composables Vue.

#### 📝 Exemplo de Composable

```typescript
import { ref, computed } from 'vue'
import type { Card, CardFilters } from '@/types'

export function useCardFilters(initialFilters: CardFilters = {}) {
  const filters = ref<CardFilters>({
    name: '',
    rarity: '',
    type: '',
    ...initialFilters
  })

  const hasActiveFilters = computed(() => {
    return Object.values(filters.value).some(value => 
      value !== '' && value !== null && value !== undefined
    )
  })

  const clearFilters = () => {
    filters.value = {
      name: '',
      rarity: '',
      type: ''
    }
  }

  const applyFilters = (newFilters: Partial<CardFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  return {
    filters,
    hasActiveFilters,
    clearFilters,
    applyFilters
  }
}
```

### 🎯 TypeScript

Tipagem estática completa com TypeScript para maior confiabilidade e melhor DX.

#### 📝 Exemplo de Tipos

```typescript
// types/cards.ts
export interface Card {
  id: string
  name: string
  description: string
  image: string
  rarity: CardRarity
  type: CardType
  attack?: number
  defense?: number
  createdAt: string
  updatedAt: string
}

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type CardType = 'monster' | 'spell' | 'trap'

export interface CardFilters {
  name?: string
  rarity?: CardRarity
  type?: CardType
  minAttack?: number
  maxAttack?: number
  minDefense?: number
  maxDefense?: number
}

export interface CardApiResponse {
  data: Card[]
  total: number
  page: number
  limit: number
}
```

## 🎨 Design Patterns

### 🏗️ Component-Based Architecture

- **Atomic Design**: Componentes organizados por complexidade
- **Composition over Inheritance**: Reutilização via composição
- **Single Responsibility**: Cada componente tem uma responsabilidade

### 🔄 State Management Patterns

- **Centralized State**: Estado global no Pinia
- **Local State**: Estado local nos componentes
- **Derived State**: Estado calculado via computed properties

### 🎯 Error Handling Patterns

- **Global Error Boundary**: Captura de erros global
- **Try-Catch Blocks**: Tratamento local de erros
- **Error Stores**: Centralização de erros

### 🔧 API Patterns

- **Service Layer**: Abstração da API
- **Interceptors**: Interceptação de requisições/respostas
- **Error Handling**: Tratamento centralizado de erros

## 🔄 Fluxo de Dados

### 📊 Fluxo Unidirecional

```
User Action → Component → Store → Service → API
     ↑                                           ↓
     ← Component ← Store ← Service ← API Response
```

### 🎯 Exemplo de Fluxo

1. **User Action**: Usuário clica em "Adicionar Carta"
2. **Component**: `AddCardModal` emite evento
3. **Store**: `useCardsStore.addCard()` é chamado
4. **Service**: `cardsApi.createCard()` faz requisição
5. **API**: Processa e retorna resposta
6. **Store**: Atualiza estado com nova carta
7. **Component**: Reage às mudanças do store

## 🛡️ Segurança

### 🔐 Autenticação

- **JWT Tokens**: Autenticação via tokens
- **Token Storage**: Armazenamento seguro no localStorage
- **Token Refresh**: Renovação automática de tokens
- **Route Guards**: Proteção de rotas

### 🛡️ Validação

- **Client-Side**: Validação com Zod + VeeValidate
- **Server-Side**: Validação na API
- **Input Sanitization**: Sanitização de inputs

### 🔒 CORS

- **Configuração**: CORS configurado na API
- **Origins**: Apenas origens permitidas
- **Methods**: Métodos HTTP permitidos

## ⚡ Performance

### 🚀 Otimizações

- **Lazy Loading**: Carregamento sob demanda
- **Code Splitting**: Divisão do bundle
- **Tree Shaking**: Eliminação de código não utilizado
- **Caching**: Cache de recursos estáticos

### 📦 Bundle Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia', 'vuetify']
        }
      }
    }
  }
})
```

### 🎯 Performance Monitoring

- **Lighthouse**: Análise de performance
- **Bundle Analyzer**: Análise do bundle
- **Error Tracking**: Rastreamento de erros

### 📱 PWA Features

- **Service Worker**: Cache e offline
- **Manifest**: Configuração do app
- **Install Prompt**: Instalação como app 