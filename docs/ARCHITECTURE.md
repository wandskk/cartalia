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
├── Styling: SASS
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
├── services/           # Serviços de API e externos
├── utils/              # Utilitários e helpers
├── types/              # Definições de tipos TypeScript
├── styles/             # Estilos globais e variáveis
├── router/             # Configuração de rotas
└── test/               # Configuração de testes
```

### 📂 Detalhamento das Pastas

#### `components/`
```
components/
├── common/             # Componentes base reutilizáveis
│   ├── BaseButton.vue
│   ├── BaseInput.vue
│   ├── ErrorModal.vue
│   └── UserAvatar.vue
├── features/           # Componentes específicos
│   ├── auth/          # Componentes de autenticação
│   ├── cards/         # Componentes de cartas
│   ├── dashboard/     # Componentes do dashboard
│   └── trades/        # Componentes de trocas
└── layout/            # Componentes de layout
    ├── Header.vue
    ├── Footer.vue
    └── Container.vue
```

#### `stores/`
```
stores/
├── auth.ts            # Store de autenticação
├── cards.ts           # Store de cartas
├── trades.ts          # Store de trocas
├── error.ts           # Store de tratamento de erros
└── __tests__/         # Testes dos stores
```

#### `services/`
```
services/
├── index.ts           # Configuração base do Axios
├── modules/           # Módulos de serviços
│   ├── auth.ts        # Serviços de autenticação
│   ├── cards.ts       # Serviços de cartas
│   └── trades.ts      # Serviços de trocas
└── types/             # Tipos dos serviços
```

## 🔧 Padrões de Código

### 📝 Convenções de Nomenclatura

#### Arquivos e Pastas
```typescript

BaseButton.vue
UserProfile.vue


authService.ts
errorHandler.ts


feature-name/
component-name/
```

#### Variáveis e Funções
```typescript

const userName = 'John';
const isLoading = ref(false);

function handleUserLogin() {

}


interface UserData {
  id: string;
  name: string;
}

class AuthService {

}
```

#### Constantes
```typescript

const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
```

### 🎨 Padrões de Componentes

#### Estrutura de Componente Vue
```vue
<template>
  <!-- Template sempre primeiro -->
</template>

<script setup lang="ts">

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';


import BaseButton from '../common/BaseButton.vue';
import { useAuthStore } from '../../stores/auth';


interface Props {
  title: string;
  loading?: boolean;
}


const props = defineProps<Props>();
const emit = defineEmits<{
  submit: [data: any];
}>();


const router = useRouter();
const authStore = useAuthStore();


const formData = ref({});


const isValid = computed(() => {

});


function handleSubmit() {

}


onMounted(() => {

});
</script>

<style scoped lang="scss">

</style>
```

### 🔄 Padrões de Estado

#### Store Pinia
```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useFeatureStore = defineStore('feature', () => {

  const items = ref<Item[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);


  const hasItems = computed(() => items.value.length > 0);
  const itemCount = computed(() => items.value.length);


  async function fetchItems() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.getItems();
      items.value = response.data;
    } catch (err) {
      error.value = handleError(err);
    } finally {
      loading.value = false;
    }
  }

  function addItem(item: Item) {
    items.value.push(item);
  }

  function removeItem(id: string) {
    const index = items.value.findIndex(item => item.id === id);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  }

  return {

    items,
    loading,
    error,
    

    hasItems,
    itemCount,
    

    fetchItems,
    addItem,
    removeItem
  };
});
```

## 🎨 Design Patterns

### 🏭 Factory Pattern
```typescript

export class ErrorFactory {
  static createApiError(message: string, status: number): AppError {
    return {
      type: 'api',
      message,
      status,
      timestamp: new Date()
    };
  }

  static createValidationError(field: string, message: string): AppError {
    return {
      type: 'validation',
      message,
      field,
      timestamp: new Date()
    };
  }
}
```

### 🎯 Observer Pattern
```typescript

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  const listeners = ref<Function[]>([]);

  function subscribe(listener: Function) {
    listeners.value.push(listener);
  }

  function unsubscribe(listener: Function) {
    const index = listeners.value.indexOf(listener);
    if (index > -1) {
      listeners.value.splice(index, 1);
    }
  }

  function notify(notification: Notification) {
    notifications.value.push(notification);
    listeners.value.forEach(listener => listener(notification));
  }

  return { subscribe, unsubscribe, notify, notifications };
});
```

### 🔧 Strategy Pattern
```typescript

interface ValidationStrategy {
  validate(value: any): ValidationResult;
}

class EmailValidationStrategy implements ValidationStrategy {
  validate(value: string): ValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      message: emailRegex.test(value) ? '' : 'Email inválido'
    };
  }
}

class PasswordValidationStrategy implements ValidationStrategy {
  validate(value: string): ValidationResult {
    const minLength = 6;
    return {
      isValid: value.length >= minLength,
      message: value.length >= minLength ? '' : `Mínimo ${minLength} caracteres`
    };
  }
}
```

## 🔄 Fluxo de Dados

### 📊 Fluxo Unidirecional

```
User Action → Component → Store → Service → API
     ↑                                           ↓
     └─────────── State Update ←───────────────┘
```

### 🔄 Fluxo de Autenticação

```
1. User Input → LoginForm
2. Validation → Zod Schema
3. API Call → AuthService
4. Response → AuthStore
5. State Update → Router Guard
6. Navigation → Protected Route
```

### 🔄 Fluxo de Tratamento de Erros

```
1. API Error → Axios Interceptor
2. Error Handler → ErrorStore
3. Error Modal → User Notification
4. Analytics → Error Tracking
5. Logging → Console/External Service
```

## 🛡️ Segurança

### 🔐 Autenticação

- **JWT Tokens**: Armazenados em localStorage
- **Token Refresh**: Implementado automaticamente
- **Route Guards**: Proteção de rotas privadas
- **Token Expiration**: Tratamento de expiração

### 🛡️ Validação

- **Client-side**: Zod schemas para validação
- **Server-side**: Validação na API
- **Input Sanitization**: Limpeza de dados
- **XSS Protection**: Headers de segurança

### 🔒 Headers de Segurança

```typescript

{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block"
}
```

## ⚡ Performance

### 🚀 Otimizações Implementadas

#### Code Splitting
```typescript

const LoginView = () => import('../views/LoginView.vue');
const DashboardView = () => import('../views/DashboardView.vue');
```

#### Bundle Optimization
```typescript

rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['vue', 'vue-router', 'pinia']
    }
  }
}
```

#### Caching Strategy
```javascript

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### 📊 Métricas de Performance

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### 🔧 Ferramentas de Monitoramento

- **Lighthouse**: Auditoria de performance
- **Web Vitals**: Métricas Core Web Vitals
- **Bundle Analyzer**: Análise de bundle
- **Error Tracking**: Monitoramento de erros

---

## 📚 Referências

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) 