# 🔌 Documentação da API

Este documento descreve a integração com a API do Cartalia e como utilizá-la na aplicação.

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [🔗 Base URL](#-base-url)
- [🔐 Autenticação](#-autenticação)
- [📡 Endpoints](#-endpoints)
- [📊 Tipos de Dados](#-tipos-de-dados)
- [⚠️ Tratamento de Erros](#️-tratamento-de-erros)
- [🔧 Configuração](#-configuração)
- [📝 Exemplos de Uso](#-exemplos-de-uso)

## 🎯 Visão Geral

A API do Cartalia é uma **REST API** que fornece todos os dados necessários para o funcionamento do marketplace de cartas. A aplicação frontend se comunica com a API através de requisições HTTP.

### 🏗️ Arquitetura da API

```
Frontend (Vue 3) ←→ Axios ←→ REST API ←→ Database
```

### 📊 Características

- **RESTful**: Segue os princípios REST
- **JSON**: Todas as respostas em formato JSON
- **JWT**: Autenticação via JWT tokens
- **CORS**: Configurado para aceitar requisições do frontend
- **Rate Limiting**: Proteção contra spam

## 🔗 Base URL

```typescript
const API_BASE_URL = "https://cards-marketplace-api-2fjj.onrender.com";
```

### 🌍 Ambientes

| Ambiente            | URL                                               | Descrição                       |
| ------------------- | ------------------------------------------------- | ------------------------------- |
| **Produção**        | `https://cards-marketplace-api-2fjj.onrender.com` | API principal                   |
| **Desenvolvimento** | `https://cards-marketplace-api-2fjj.onrender.com` | Mesma API (sem ambiente de dev) |

### ⚠️ Importante

> A API hiberna após inatividade, por isso, às vezes ela pode demorar alguns minutos para reiniciar depois de um período em inatividade.

## 🔐 Autenticação

### JWT Token

A API utiliza **JWT (JSON Web Tokens)** para autenticação. O token deve ser enviado no header `Authorization` de todas as requisições autenticadas.

#### 📝 Formato do Header

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

#### 🔄 Fluxo de Autenticação

1. **Login/Registro**: Retorna um JWT token
2. **Armazenamento**: Token salvo no localStorage como `tokenCartalia`
3. **Requisições**: Token enviado automaticamente via interceptor
4. **Expiração**: Token expira após determinado tempo

### 🔧 Configuração do Axios

```typescript
import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

export const api = axios.create({
  baseURL: "https://cards-marketplace-api-2fjj.onrender.com",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tokenCartalia');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error, 'API Interceptor');
    return Promise.reject(error);
  }
);
```

## 📡 Endpoints

### 👤 Autenticação

#### POST `/register`

Registra um novo usuário no sistema.

**Request Body:**
```typescript
{
  name: string;
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}
```

**Exemplo de uso:**
```typescript
import { authApi } from '@/services/modules/auth';

const registerUser = async (userData: RegisterData) => {
  try {
    const response = await authApi.register(userData);
    localStorage.setItem('tokenCartalia', response.data.token);
    return response.data.user;
  } catch (error) {
    throw new Error('Erro no registro');
  }
};
```

#### POST `/login`

Autentica um usuário existente.

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}
```

### 🃏 Cartas

#### GET `/cards`

Lista todas as cartas disponíveis com paginação e filtros.

**Query Parameters:**
```typescript
{
  page?: number;        // Página atual (padrão: 1)
  limit?: number;       // Itens por página (padrão: 20)
  name?: string;        // Filtro por nome
  rarity?: string;      // Filtro por raridade
  type?: string;        // Filtro por tipo
  minAttack?: number;   // Ataque mínimo
  maxAttack?: number;   // Ataque máximo
  minDefense?: number;  // Defesa mínima
  maxDefense?: number;  // Defesa máxima
}
```

**Response:**
```typescript
{
  data: Card[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

**Exemplo de uso:**
```typescript
import { cardsApi } from '@/services/modules/cards';

const fetchCards = async (filters?: CardFilters) => {
  try {
    const response = await cardsApi.getCards(filters);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao carregar cartas');
  }
};
```

#### GET `/cards/:id`

Obtém detalhes de uma carta específica.

**Response:**
```typescript
{
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: CardRarity;
  type: CardType;
  attack?: number;
  defense?: number;
  createdAt: string;
  updatedAt: string;
}
```

#### POST `/cards`

Adiciona uma nova carta à coleção do usuário.

**Request Body:**
```typescript
{
  cardId: string;
}
```

**Response:**
```typescript
{
  message: string;
  card: Card;
}
```

### 🔄 Trocas

#### GET `/trades`

Lista todas as trocas disponíveis.

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  status?: TradeStatus;
  userId?: string;
}
```

**Response:**
```typescript
{
  data: Trade[];
  total: number;
  page: number;
  limit: number;
}
```

#### POST `/trades`

Cria uma nova solicitação de troca.

**Request Body:**
```typescript
{
  offeredCards: string[];    // IDs das cartas oferecidas
  requestedCards: string[];  // IDs das cartas solicitadas
  description?: string;      // Descrição opcional
}
```

**Response:**
```typescript
{
  message: string;
  trade: Trade;
}
```

#### DELETE `/trades/:id`

Remove uma troca específica.

**Response:**
```typescript
{
  message: string;
}
```

#### PUT `/trades/:id/accept`

Aceita uma troca.

**Response:**
```typescript
{
  message: string;
  trade: Trade;
}
```

#### PUT `/trades/:id/reject`

Rejeita uma troca.

**Response:**
```typescript
{
  message: string;
  trade: Trade;
}
```

## 📊 Tipos de Dados

### 🃏 Card

```typescript
interface Card {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: CardRarity;
  type: CardType;
  attack?: number;
  defense?: number;
  createdAt: string;
  updatedAt: string;
}

type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
type CardType = 'monster' | 'spell' | 'trap';
```

### 🔄 Trade

```typescript
interface Trade {
  id: string;
  userId: string;
  offeredCards: Card[];
  requestedCards: Card[];
  description?: string;
  status: TradeStatus;
  createdAt: string;
  updatedAt: string;
}

type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
```

### 👤 User

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
```

### 🔍 Filters

```typescript
interface CardFilters {
  name?: string;
  rarity?: CardRarity;
  type?: CardType;
  minAttack?: number;
  maxAttack?: number;
  minDefense?: number;
  maxDefense?: number;
  page?: number;
  limit?: number;
}

interface TradeFilters {
  status?: TradeStatus;
  userId?: string;
  page?: number;
  limit?: number;
}
```

## ⚠️ Tratamento de Erros

### 📝 Estrutura de Erro

```typescript
interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
```

### 🔧 Interceptor de Erros

```typescript
import { handleApiError } from '@/utils/errorHandler';

api.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error, 'API Interceptor');
    return Promise.reject(error);
  }
);
```

### 🎯 Códigos de Status

| Status | Descrição | Ação Recomendada |
|--------|-----------|------------------|
| `200` | Sucesso | Processar resposta normalmente |
| `201` | Criado | Recarregar dados ou navegar |
| `400` | Bad Request | Validar dados de entrada |
| `401` | Não Autorizado | Redirecionar para login |
| `403` | Proibido | Mostrar erro de permissão |
| `404` | Não Encontrado | Mostrar página 404 |
| `422` | Dados Inválidos | Mostrar erros de validação |
| `500` | Erro Interno | Mostrar erro genérico |

### 🛡️ Tratamento Global

```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any, context: string) => {
  const errorStore = useErrorStore();
  
  if (error.response?.status === 401) {
    // Token expirado ou inválido
    const authStore = useAuthStore();
    authStore.logout();
    router.push('/login');
  } else if (error.response?.status === 422) {
    // Erros de validação
    const validationErrors = error.response.data.errors;
    errorStore.setValidationErrors(validationErrors);
  } else {
    // Erro genérico
    const message = error.response?.data?.message || 'Erro inesperado';
    errorStore.setError(message);
  }
  
  // Log para analytics
  console.error(`[${context}] API Error:`, error);
};
```

## 🔧 Configuração

### 📦 Instalação

```bash
npm install axios
```

### ⚙️ Configuração do Vite

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    'process.env.VITE_API_BASE_URL': JSON.stringify(
      'https://cards-marketplace-api-2fjj.onrender.com'
    )
  }
});
```

### 🌍 Variáveis de Ambiente

```env
# .env
VITE_API_BASE_URL=https://cards-marketplace-api-2fjj.onrender.com
VITE_APP_NAME=Cartalia
VITE_APP_VERSION=1.0.0
```

### 🔧 Configuração dos Serviços

```typescript
// services/modules/cards.ts
import { api } from '../index';
import type { Card, CardFilters, CardApiResponse } from '@/types';

export const cardsApi = {
  getCards: (filters?: CardFilters) => 
    api.get<CardApiResponse>('/cards', { params: filters }),
    
  getCard: (id: string) => 
    api.get<Card>(`/cards/${id}`),
    
  addCard: (cardId: string) => 
    api.post<{ message: string; card: Card }>('/cards', { cardId })
};
```

## 📝 Exemplos de Uso

### 🃏 Gerenciamento de Cartas

```typescript
// Composables/useCards.ts
import { ref, computed } from 'vue';
import { useCardsStore } from '@/stores/cards';
import { useCardFilters } from '@/composables/useCardFilters';

export function useCards() {
  const cardsStore = useCardsStore();
  const { filters, applyFilters, clearFilters } = useCardFilters();
  
  const loading = computed(() => cardsStore.loading);
  const cards = computed(() => cardsStore.cards);
  const error = computed(() => cardsStore.error);
  
  const loadCards = async () => {
    try {
      await cardsStore.fetchCards(filters.value);
    } catch (error) {
      console.error('Erro ao carregar cartas:', error);
    }
  };
  
  const addCard = async (cardId: string) => {
    try {
      await cardsStore.addCard(cardId);
      await loadCards(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao adicionar carta:', error);
    }
  };
  
  return {
    cards,
    loading,
    error,
    filters,
    loadCards,
    addCard,
    applyFilters,
    clearFilters
  };
}
```

### 🔄 Gerenciamento de Trocas

```typescript
// Composables/useTrades.ts
import { ref, computed } from 'vue';
import { useTradesStore } from '@/stores/trades';

export function useTrades() {
  const tradesStore = useTradesStore();
  
  const loading = computed(() => tradesStore.loading);
  const trades = computed(() => tradesStore.trades);
  const error = computed(() => tradesStore.error);
  
  const createTrade = async (tradeData: CreateTradeData) => {
    try {
      await tradesStore.createTrade(tradeData);
    } catch (error) {
      console.error('Erro ao criar troca:', error);
    }
  };
  
  const acceptTrade = async (tradeId: string) => {
    try {
      await tradesStore.acceptTrade(tradeId);
    } catch (error) {
      console.error('Erro ao aceitar troca:', error);
    }
  };
  
  const rejectTrade = async (tradeId: string) => {
    try {
      await tradesStore.rejectTrade(tradeId);
    } catch (error) {
      console.error('Erro ao rejeitar troca:', error);
    }
  };
  
  return {
    trades,
    loading,
    error,
    createTrade,
    acceptTrade,
    rejectTrade
  };
}
```

### 🔐 Autenticação

```typescript
// Composables/useAuth.ts
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();
  
  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const loading = computed(() => authStore.loading);
  
  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  };
  
  const register = async (userData: RegisterData) => {
    try {
      await authStore.register(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro no registro:', error);
    }
  };
  
  const logout = () => {
    authStore.logout();
    router.push('/login');
  };
  
  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };
}
```

### 🔍 Filtros e Busca

```typescript
// Composables/useSearch.ts
import { ref, computed, watch } from 'vue';
import { useDebounce } from '@/composables/useDebounce';

export function useSearch<T>(
  searchFunction: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const query = ref('');
  const results = ref<T[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const debouncedQuery = useDebounce(query, delay);
  
  const search = async () => {
    if (!debouncedQuery.value.trim()) {
      results.value = [];
      return;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      results.value = await searchFunction(debouncedQuery.value);
    } catch (err) {
      error.value = 'Erro na busca';
      results.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  watch(debouncedQuery, search);
  
  const clearSearch = () => {
    query.value = '';
    results.value = [];
    error.value = null;
  };
  
  return {
    query,
    results,
    loading,
    error,
    search,
    clearSearch
  };
}
```

## 🚀 Boas Práticas

### 📝 Tratamento de Erros

1. **Sempre use try-catch** em operações assíncronas
2. **Centralize o tratamento** de erros via interceptors
3. **Forneça feedback** visual para o usuário
4. **Log erros** para debugging

### 🔄 Cache e Performance

1. **Use stores** para cache de dados
2. **Implemente paginação** para listas grandes
3. **Debounce** operações de busca
4. **Lazy load** dados quando necessário

### 🛡️ Segurança

1. **Valide dados** antes de enviar
2. **Sanitize inputs** do usuário
3. **Use HTTPS** sempre
4. **Mantenha tokens** seguros

### 📊 Monitoramento

1. **Track erros** para analytics
2. **Monitor performance** da API
3. **Log métricas** importantes
4. **Alertas** para falhas críticas
