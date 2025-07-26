# 🃏 Cartalia - Marketplace de Cartas

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-yellow?logo=pinia)](https://pinia.vuejs.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-3.x-1867C0?logo=vuetify)](https://vuetifyjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)

> **Marketplace para troca de cartas colecionáveis** - Desenvolvido como teste técnico para vaga de Front-End Pleno na INMETA.

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [🏗️ Arquitetura](#️-arquitetura)
- [🎨 UX/UI](#-uxui)
- [🧩 Componentização](#-componentização)
- [📝 Tipagem](#-tipagem)
- [✅ Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [🔧 Escolhas Técnicas](#-escolhas-técnicas)
- [📦 Instalação](#-instalação)
- [🧪 Testes](#-testes)
- [🚀 Deploy](#-deploy)
- [📚 Documentação](#-documentação)
- [🤝 Contribuindo](#-contribuindo)

## 🎯 Sobre o Projeto

O **Cartalia** é um marketplace moderno para troca de cartas colecionáveis, desenvolvido como parte do teste técnico para a vaga de **Front-End Pleno** na **INMETA**. 

### 🎯 Objetivo do Projeto
Demonstrar competência técnica em desenvolvimento front-end com foco em:
- **Arquitetura limpa** e separação de responsabilidades
- **UX intuitiva** e agradável
- **Componentização** bem definida e reutilizável
- **Tipagem forte** com TypeScript
- **Qualidade de código** pronta para produção
- **Escolhas técnicas** apropriadas

## 🏗️ Arquitetura

### **Separação de Camadas e Responsabilidades**

```
src/
├── components/          # Camada de Apresentação
│   ├── common/         # Componentes reutilizáveis
│   ├── features/       # Componentes específicos de features
│   └── layout/         # Componentes de layout
├── views/              # Páginas da aplicação
├── stores/             # Camada de Estado (Pinia)
├── services/           # Camada de Serviços (API)
├── composables/        # Lógica reutilizável
├── types/              # Definições de tipos
├── schemas/            # Validação de dados
├── utils/              # Utilitários
└── styles/             # Estilos globais
```

### **Padrões Arquiteturais**

#### **1. Store Pattern (Pinia)**
```typescript
// Exemplo: Auth Store
export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  
  // Actions centralizadas
  async function login(email: string, password: string) {
    const data = await AuthServices.login(email, password);
    setUser(data.user, data.token);
  }
  
  return { user, token, isAuthenticated, login };
});
```

#### **2. Service Layer Pattern**
```typescript
// Exemplo: Cards Service
export const CardServices = {
  async getAllCards(page = 1, rpp = 10): Promise<CardListResponse> {
    const response = await api.get(`/cards?page=${page}&rpp=${rpp}`);
    return response.data;
  },
  
  async addCardsToUser(cardIds: string[]): Promise<void> {
    await api.post('/me/cards', { cardIds });
  }
};
```

#### **3. Composable Pattern**
```typescript
// Exemplo: useAuthForm
export function useAuthForm(type: 'login' | 'register') {
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const onSubmit = async (values: any) => {
    loading.value = true;
    try {
      if (type === 'login') {
        await authStore.login(values.email, values.password);
      } else {
        await authStore.register(values.name, values.email, values.password);
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  
  return { onSubmit, loading, error };
}
```

### **Fluxo de Dados**
```
User Action → Component → Composable → Store → Service → API
     ↑                                                      ↓
     ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

## 🎨 UX/UI

### **Princípios de Design**

#### **1. Interface Intuitiva**
- **Navegação clara** com breadcrumbs e indicadores visuais
- **Feedback imediato** para todas as ações do usuário
- **Estados de loading** bem definidos
- **Mensagens de erro** contextuais e acionáveis

#### **2. Experiência Responsiva**
```scss
// Mobile-first approach
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
```

#### **3. Acessibilidade**
- **Contraste adequado** entre elementos
- **Navegação por teclado** implementada
- **Labels semânticos** para screen readers
- **Focus states** visíveis

### **Fluxos de Usuário**

#### **1. Registro e Login**
```
Página inicial → Login/Registro → Validação → Dashboard
```

#### **2. Gerenciamento de Cartas**
```
Dashboard → Minhas Cartas → Adicionar Cartas → Seleção → Confirmação
```

#### **3. Criação de Trocas**
```
Dashboard → Nova Troca → Selecionar Ofertas → Selecionar Desejos → Revisar → Criar
```

## 🧩 Componentização

### **Estrutura de Componentes**

#### **1. Componentes Comuns (Reutilizáveis)**
```typescript
// BaseButton.vue - Componente base para botões
interface Props {
  variant?: 'primary' | 'secondary' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
}

// BaseModal.vue - Modal reutilizável
interface Props {
  modelValue: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

#### **2. Componentes de Features**
```typescript
// LoginForm.vue - Formulário específico
// RegisterForm.vue - Formulário específico
// CreateTradeModal.vue - Modal complexo com steps
// AddCardModal.vue - Modal com seleção múltipla
```

#### **3. Componentes de Layout**
```typescript
// Header.vue - Cabeçalho com navegação
// Sidebar.vue - Menu lateral
// Container.vue - Container responsivo
```

### **Reutilização de Componentes**

#### **Exemplo: Card Component**
```vue
<!-- Card.vue - Componente reutilizável -->
<template>
  <v-card 
    :variant="variant" 
    :size="size"
    :selectable="selectable"
    :selected="selected"
    @click="handleClick"
  >
    <v-img :src="card.imageUrl" :alt="card.name" />
    <v-card-title>{{ card.name }}</v-card-title>
    <v-card-text v-if="showDescription">
      {{ truncateDescription(card.description) }}
    </v-card-text>
  </v-card>
</template>
```

**Uso em diferentes contextos:**
```vue
<!-- Marketplace -->
<Card :card="trade.card" variant="elevated" />

<!-- Minhas Cartas -->
<Card :card="card" selectable :selected="isSelected" @select="toggleSelection" />

<!-- Modal de Adição -->
<Card :card="card" size="sm" variant="compact" />
```

## 📝 Tipagem

### **Tipos Bem Definidos**

#### **1. Tipos de Entidade**
```typescript
// types/cards.ts
export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

// types/trades.ts
export interface Trade {
  id: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
  };
  tradeCards: TradeCard[];
}

export interface TradeCard {
  id: string;
  cardId: string;
  tradeId: string;
  type: 'OFFERING' | 'RECEIVING';
  card: Card;
}
```

#### **2. Tipos de Formulário**
```typescript
// schemas/login.schema.ts
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type LoginForm = z.infer<typeof loginSchema>;
```

#### **3. Tipos de API**
```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  list: T[];
  page: number;
  rpp: number;
  more: boolean;
  total?: number;
}
```

### **Validação com Zod**
```typescript
// Validação de formulários
const schema = toFormValidator(loginSchema);

// Validação de dados da API
const validateCard = (data: unknown): Card => {
  return cardSchema.parse(data);
};
```

## ✅ Funcionalidades Implementadas

### **Funcionalidades Obrigatórias**

#### **1. Autenticação**
- ✅ **Registro de usuário** - Formulário completo com validação
- ✅ **Login/Logout** - Autenticação com JWT token
- ✅ **Persistência de sessão** - localStorage com fallback
- ✅ **Proteção de rotas** - Guard routes implementado

#### **2. Gerenciamento de Cartas**
- ✅ **Visualização de todas as cartas** - Paginação e busca
- ✅ **Adição de cartas à coleção** - Seleção múltipla
- ✅ **Detalhes de cartas** - Modal com informações completas
- ✅ **Busca e filtros** - Busca por nome e descrição

#### **3. Sistema de Trocas**
- ✅ **Criação de solicitações de troca** - Modal com 3 etapas
- ✅ **Seleção de cartas para oferecer** - Das cartas do usuário
- ✅ **Seleção de cartas para receber** - De todas as cartas disponíveis
- ✅ **Visualização de todas as trocas** - Marketplace público
- ✅ **Gerenciamento de trocas próprias** - Lista e exclusão
- ✅ **Exclusão de trocas** - Com confirmação

#### **4. Marketplace Público**
- ✅ **Acesso para visitantes** - Sem necessidade de login
- ✅ **Visualização de trocas abertas** - Com paginação
- ✅ **Interface para não autenticados** - Botões de login/registro

### **Funcionalidades Extras**

#### **1. Tratamento de Erros**
- ✅ **Modal de erros global** - Centralizado
- ✅ **Páginas de erro customizadas** - 404, 500, etc.
- ✅ **Logs detalhados** - Console e analytics
- ✅ **Retry mechanisms** - Para falhas de API

#### **2. Deploy**
- ✅ **Vercel** - Configurado e funcionando
- ✅ **GitHub Actions** - CI/CD automático
- ✅ **Variáveis de ambiente** - Configuradas
- ✅ **Headers de segurança** - Implementados

#### **3. Cache**
- ✅ **Store de cache** - Pinia store para cache
- ✅ **Cache de cartas** - TTL configurável
- ✅ **Service Worker** - Para PWA

## 🗄️ Estratégias de Cacheamento

### **Cache Implementado**

#### **1. Cache Store (Pinia)**
Sistema de cache centralizado com TTL (Time To Live) configurável e persistência no localStorage.

```typescript
// stores/cache.ts
export const useCacheStore = defineStore('cache', () => {
  const cache = ref<Map<string, CacheItem<any>>>(new Map());
  const config = ref<CacheConfig>({
    ttl: 5 * 60 * 1000, // 5 minutos padrão
    maxSize: 100 // Máximo 100 itens
  });

  // Funções principais
  function set<T>(key: string, data: T, ttl?: number): void
  function get<T>(key: string): T | null
  function has(key: string): boolean
  function remove(key: string): boolean
  function clear(): void
});
```

**Características:**
- **TTL Configurável**: Cada item pode ter seu próprio tempo de vida
- **Limpeza Automática**: Remove itens expirados automaticamente
- **Persistência**: Salva no localStorage para sobreviver a recarregamentos
- **LRU (Least Recently Used)**: Remove itens mais antigos quando o cache está cheio
- **Limpeza de Memória**: Remove 10% dos itens mais antigos quando necessário

#### **2. Cache de Dados da API**
Implementado nos serviços para reduzir requisições desnecessárias.

```typescript
// services/modules/cards.ts
export const CardServices = {
  async getCardById(id: string): Promise<Card> {
    const cacheStore = useCacheStore();
    const cacheKey = cacheStore.CACHE_KEYS.CARD_DETAIL(id);
    
    // Verifica cache primeiro
    const cached = cacheStore.get<Card>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Faz requisição se não estiver em cache
    const response = await api.get(`/cards/${id}`);
    
    // Salva no cache por 5 minutos
    cacheStore.set(cacheKey, response.data, 5 * 60 * 1000);
    
    return response.data;
  },

  async getUserCards(): Promise<Card[]> {
    const cacheStore = useCacheStore();
    const cacheKey = cacheStore.CACHE_KEYS.USER_CARDS;
    
    const cached = cacheStore.get<Card[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const response = await api.get('/me/cards');
    
    // Cache por 1 minuto (dados mais voláteis)
    cacheStore.set(cacheKey, response.data, 60 * 1000);
    
    return response.data;
  }
};
```

**Estratégias de TTL:**
- **Cartas individuais**: 5 minutos (dados estáticos)
- **Cartas do usuário**: 1 minuto (dados que podem mudar)
- **Lista de trocas**: 2 minutos (dados semi-dinâmicos)
- **Perfil do usuário**: 10 minutos (dados relativamente estáticos)

#### **3. Cache de Estado da UI**
Persistência de preferências do usuário no localStorage.

```typescript
// stores/sidebar.ts - Estado do sidebar
const stored = localStorage.getItem(SIDEBAR.STORAGE_KEY);
if (stored) {
  isCollapsedValue = JSON.parse(stored);
}

// stores/auth.ts - Dados de autenticação
const token = ref<string | null>(localStorage.getItem("tokenCartalia"));
const storedUser = localStorage.getItem("userCartalia");
```

#### **4. Service Worker (PWA)**
Cache de recursos estáticos para funcionamento offline.

```javascript
// public/sw.js
const CACHE_NAME = 'cartalia-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/index.css',
  '/assets/index.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

### **Oportunidades de Melhoria**

#### **1. Cache Inteligente por Contexto**
Implementar cache baseado no contexto de uso do usuário.

```typescript
// Oportunidade: Cache contextual
const CACHE_STRATEGIES = {
  MARKETPLACE: {
    ttl: 3 * 60 * 1000, // 3 minutos
    maxItems: 50
  },
  USER_COLLECTION: {
    ttl: 1 * 60 * 1000, // 1 minuto
    maxItems: 20
  },
  SEARCH_RESULTS: {
    ttl: 5 * 60 * 1000, // 5 minutos
    maxItems: 30
  }
};
```

#### **2. Cache de Imagens**
Implementar cache específico para imagens das cartas.

```typescript
// Oportunidade: Cache de imagens
const imageCache = {
  async preloadImages(cards: Card[]) {
    const imagePromises = cards.map(card => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(card.id);
        img.onerror = reject;
        img.src = card.imageUrl;
      });
    });
    
    await Promise.allSettled(imagePromises);
  }
};
```

#### **3. Cache de Busca**
Cachear resultados de busca para consultas repetidas.

```typescript
// Oportunidade: Cache de busca
const searchCache = {
  generateKey(query: string, filters: any): string {
    return `search:${query}:${JSON.stringify(filters)}`;
  },
  
  async getCachedResults(query: string, filters: any) {
    const key = this.generateKey(query, filters);
    return cacheStore.get(key);
  }
};
```

#### **4. Cache de Paginação**
Cachear páginas específicas para navegação mais fluida.

```typescript
// Oportunidade: Cache de paginação
const paginationCache = {
  generateKey(endpoint: string, page: number, rpp: number): string {
    return `page:${endpoint}:${page}:${rpp}`;
  },
  
  async preloadNextPage(endpoint: string, currentPage: number) {
    const nextPageKey = this.generateKey(endpoint, currentPage + 1, 12);
    if (!cacheStore.has(nextPageKey)) {
      // Pré-carrega próxima página
      const nextPageData = await api.get(`${endpoint}?page=${currentPage + 1}&rpp=12`);
      cacheStore.set(nextPageKey, nextPageData, 2 * 60 * 1000);
    }
  }
};
```

#### **5. Cache de Filtros**
Cachear configurações de filtros do usuário.

```typescript
// Oportunidade: Cache de filtros
const filterCache = {
  saveUserFilters(userId: string, filters: any) {
    const key = `filters:${userId}`;
    cacheStore.set(key, filters, 24 * 60 * 60 * 1000); // 24 horas
  },
  
  getUserFilters(userId: string) {
    const key = `filters:${userId}`;
    return cacheStore.get(key);
  }
};
```

#### **6. Cache de Validação**
Cachear resultados de validação para formulários complexos.

```typescript
// Oportunidade: Cache de validação
const validationCache = {
  async validateCardName(name: string): Promise<boolean> {
    const key = `validation:card:${name}`;
    const cached = cacheStore.get(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const isValid = await api.post('/validate/card-name', { name });
    cacheStore.set(key, isValid, 60 * 60 * 1000); // 1 hora
    
    return isValid;
  }
};
```

### **Benefícios das Estratégias de Cache**

#### **1. Performance**
- **Redução de requisições**: Menos chamadas à API
- **Carregamento mais rápido**: Dados disponíveis instantaneamente
- **Melhor UX**: Interface mais responsiva

#### **2. Economia de Recursos**
- **Menor uso de banda**: Dados reutilizados
- **Redução de carga no servidor**: Menos requisições simultâneas
- **Economia de bateria**: Menos processamento no dispositivo

#### **3. Experiência Offline**
- **Funcionalidade básica**: App funciona sem conexão
- **Sincronização**: Dados sincronizados quando online
- **PWA**: Instalação como app nativo

#### **4. Escalabilidade**
- **Cache distribuído**: Cada usuário tem seu cache
- **Configuração flexível**: TTLs diferentes por tipo de dado
- **Limpeza automática**: Gerenciamento de memória

### **Monitoramento de Cache**

```typescript
// Oportunidade: Monitoramento
const cacheMetrics = {
  hitRate: 0,
  missRate: 0,
  totalRequests: 0,
  
  recordHit() {
    this.hitRate++;
    this.totalRequests++;
  },
  
  recordMiss() {
    this.missRate++;
    this.totalRequests++;
  },
  
  getHitRatePercentage() {
    return (this.hitRate / this.totalRequests) * 100;
  }
};
```

## 🔧 Escolhas Técnicas

### **Framework e Bibliotecas**

#### **1. Vue 3 + Composition API**
**Justificativa:** Framework moderno com excelente performance, reatividade granular e TypeScript nativo.

```typescript
// Exemplo de composable reativo
export function useCardSelection() {
  const selectedCards = ref<string[]>([]);
  
  const isSelected = (cardId: string) => selectedCards.value.includes(cardId);
  const toggleCard = (cardId: string) => {
    const index = selectedCards.value.indexOf(cardId);
    if (index > -1) {
      selectedCards.value.splice(index, 1);
    } else {
      selectedCards.value.push(cardId);
    }
  };
  
  return { selectedCards, isSelected, toggleCard };
}
```

#### **2. Pinia para Gerenciamento de Estado**
**Justificativa:** Store oficial do Vue 3, TypeScript nativo, devtools integradas.

```typescript
// Store com TypeScript
export const useCardsStore = defineStore('cards', () => {
  const allCards = ref<Card[]>([]);
  const userCards = ref<Card[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Computed properties reativas
  const hasUserCards = computed(() => userCards.value.length > 0);
  const totalUserCards = computed(() => userCards.value.length);
  
  return { allCards, userCards, loading, error, hasUserCards, totalUserCards };
});
```

#### **3. Vuetify 3 para UI**
**Justificativa:** Componentes Material Design, responsivos, acessíveis e TypeScript nativo.

#### **4. Zod + VeeValidate para Validação**
**Justificativa:** Validação type-safe, schemas reutilizáveis, integração perfeita com TypeScript.

```typescript
// Schema de validação
export const tradeSchema = z.object({
  cards: z.array(z.object({
    cardId: z.string().uuid(),
    type: z.enum(['OFFERING', 'RECEIVING'])
  })).min(2, 'Deve ter pelo menos uma carta para oferecer e uma para receber')
});
```

### **Arquitetura de Build**

#### **1. Vite como Build Tool**
**Justificativa:** Extremamente rápido, HMR instantâneo, configuração simples.

#### **2. TypeScript Strict Mode**
**Justificativa:** Detecção de erros em tempo de compilação, melhor DX.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 📦 Instalação

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn

### **Passos**

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/cartalia.git
   cd cartalia
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

## 🧪 Testes

### **Estrutura de Testes**
```
src/tests/
├── unit/              # Testes unitários
│   ├── stores/        # Testes de stores
│   ├── composables/   # Testes de composables
│   └── utils/         # Testes de utilitários
├── components/        # Testes de componentes
└── setup.ts          # Configuração global
```

### **Executando Testes**
```bash
# Todos os testes
npm run test:run

# Testes com interface visual
npm run test:ui

# Cobertura de testes
npm run test:coverage
```

### **Exemplo de Teste**
```typescript
// stores/auth.test.ts
describe('Auth Store', () => {
  it('should login user successfully', async () => {
    const authStore = useAuthStore();
    await authStore.login('test@example.com', 'password');
    
    expect(authStore.isAuthenticated).toBe(true);
    expect(authStore.user).toBeDefined();
  });
});
```

## 🚀 Deploy

### **Deploy Automático**
O projeto está configurado com GitHub Actions para deploy automático no Vercel:

- **Pull Request**: Deploy de preview
- **Push para main**: Deploy de produção

### **URL de Produção**
```
https://cartalia.vercel.app
```

### **Configuração**
Veja o arquivo [DEPLOY.md](./DEPLOY.md) para instruções detalhadas.

## 📚 Documentação

### **Documentação Técnica**
- [Arquitetura](./docs/ARCHITECTURE.md) - Estrutura e padrões
- [API](./docs/API.md) - Documentação da API
- [Componentes](./docs/COMPONENTS.md) - Guia de componentes
- [Testes](./docs/TESTING.md) - Estratégia de testes

### **Guias de Uso**
- [Manual do Usuário](./docs/USER_GUIDE.md) - Como usar a aplicação
- [FAQ](./docs/FAQ.md) - Perguntas frequentes

## 🤝 Contribuindo

### **Estrutura de Branches**
```
main                    # Branch principal
├── feat/              # Novas funcionalidades
├── fix/               # Correções de bugs
├── refactor/          # Refatorações
├── chore/             # Configurações e dependências
├── test/              # Testes
└── docs/              # Documentação
```

### **Padrão de Commits**
```
feat: adicionar funcionalidade de login
fix: corrigir validação de formulário
refactor: extrair componente de card
style: ajustar espaçamento do header
test: adicionar testes para store de auth
chore: atualizar dependências
docs: adicionar documentação da API
```

## 🎯 Critérios de Avaliação

### **Arquitetura** ✅
- **Separação clara** entre camadas (components, stores, services)
- **Responsabilidades bem definidas** em cada camada
- **Padrões consistentes** em todo o projeto
- **Escalabilidade** considerada na estrutura

### **UX** ✅
- **Interface intuitiva** e fácil de navegar
- **Feedback visual** para todas as ações
- **Responsividade** em todos os dispositivos
- **Acessibilidade** implementada

### **Componentização** ✅
- **Componentes reutilizáveis** bem definidos
- **Props tipadas** com TypeScript
- **Composição** de componentes complexos
- **Separação** entre lógica e apresentação

### **Tipagem** ✅
- **TypeScript strict mode** habilitado
- **Interfaces bem definidas** para todas as entidades
- **Validação type-safe** com Zod
- **IntelliSense** completo em todo o projeto

### **Correção** ✅
- **Todas as funcionalidades** solicitadas implementadas
- **API integration** completa
- **Validações** de formulários funcionando
- **Tratamento de erros** implementado

### **Qualidade do Código** ✅
- **Código limpo** e fácil de entender
- **Padrões consistentes** em todo o projeto
- **Sem code smells** ou anti-patterns
- **Manutenibilidade** alta

### **Escolhas Técnicas** ✅
- **Vue 3 + Composition API** - Framework moderno
- **Pinia** - Gerenciamento de estado oficial
- **TypeScript** - Tipagem estática
- **Vuetify** - UI framework robusto
- **Vite** - Build tool performático

### **Commits** ✅
- **Commits bem divididos** por funcionalidade
- **Mensagens descritivas** seguindo convenções
- **Histórico limpo** demonstrando evolução
- **Branches organizadas** por tipo

---

## 📞 Contato

**Desenvolvido por:** Wanderson Kenedy Soares  
**Email:** [devwk.c@gmail.com](mailto:devwk.c@gmail.com)  
**LinkedIn:** [linkedin.com/in/wanderson-kenedy-soares](https://linkedin.com/in/wanderson-kenedy-soares)  
**GitHub:** [github.com/wandskk](https://github.com/wandskk)

---

**Projeto desenvolvido como teste técnico para vaga de Front-End Pleno na INMETA**  
**Data:** Julho 2024  
**Versão:** 1.0.0
