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
const API_BASE_URL = 'https://cards-marketplace-api-2fjj.onrender.com';
```

### 🌍 Ambientes

| Ambiente | URL | Descrição |
|----------|-----|-----------|
| **Produção** | `https://cards-marketplace-api-2fjj.onrender.com` | API principal |
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
2. **Armazenamento**: Token salvo no localStorage
3. **Requisições**: Token enviado automaticamente via interceptor
4. **Expiração**: Token expira após determinado tempo

### 🔧 Configuração do Axios

```typescript
// services/index.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 📡 Endpoints

### 👤 Autenticação

#### POST `/register`
Registra um novo usuário no sistema.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Códigos de Erro:**
- `400`: Dados inválidos
- `409`: Email já cadastrado

#### POST `/login`
Realiza o login do usuário.

**Request Body:**
```json
{
  "email": "joao@exemplo.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com"
  }
}
```

**Códigos de Erro:**
- `400`: Dados inválidos
- `401`: Credenciais inválidas

#### GET `/me`
Retorna informações do usuário logado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "cards": [
    {
      "id": "card-uuid",
      "name": "Blue-Eyes White Dragon",
      "description": "This legendary dragon...",
      "imageUrl": "https://example.com/card.jpg",
      "createdAt": "2024-02-15T16:40:14.677Z"
    }
  ]
}
```

**Códigos de Erro:**
- `401`: Token inválido ou expirado

### 🃏 Cartas

#### GET `/cards`
Retorna todas as cartas disponíveis no sistema.

**Query Parameters:**
```typescript
{
  rpp?: number;    // Registros por página (padrão: 10)
  page?: number;   // Número da página (padrão: 1)
}
```

**Response (200):**
```json
{
  "list": [
    {
      "id": "card-uuid",
      "name": "Blue-Eyes White Dragon",
      "description": "This legendary dragon...",
      "imageUrl": "https://example.com/card.jpg",
      "createdAt": "2024-02-15T16:40:14.677Z"
    }
  ],
  "rpp": 10,
  "page": 1,
  "more": false
}
```

#### GET `/cards/:id`
Retorna detalhes de uma carta específica.

**Response (200):**
```json
{
  "id": "card-uuid",
  "name": "Blue-Eyes White Dragon",
  "description": "This legendary dragon...",
  "imageUrl": "https://example.com/card.jpg",
  "createdAt": "2024-02-15T16:40:14.677Z"
}
```

**Códigos de Erro:**
- `404`: Carta não encontrada

#### POST `/me/cards`
Adiciona cartas à coleção do usuário.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cardIds": ["card-uuid-1", "card-uuid-2"]
}
```

**Response (200):**
```json
{
  "message": "Cards added successfully"
}
```

**Códigos de Erro:**
- `400`: Dados inválidos
- `401`: Token inválido
- `404`: Carta não encontrada

#### GET `/me/cards`
Retorna todas as cartas do usuário logado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "card-uuid",
    "name": "Blue-Eyes White Dragon",
    "description": "This legendary dragon...",
    "imageUrl": "https://example.com/card.jpg",
    "createdAt": "2024-02-15T16:40:14.677Z"
  }
]
```

### 🔄 Trocas

#### POST `/trades`
Cria uma nova solicitação de troca.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cards": [
    {
      "cardId": "card-uuid-1",
      "type": "OFFERING"
    },
    {
      "cardId": "card-uuid-2",
      "type": "RECEIVING"
    }
  ]
}
```

**Response (200):**
```json
{
  "tradeId": "trade-uuid"
}
```

**Códigos de Erro:**
- `400`: Dados inválidos
- `401`: Token inválido
- `404`: Carta não encontrada
- `403`: Carta não pertence ao usuário

#### GET `/trades`
Retorna todas as solicitações de troca.

**Query Parameters:**
```typescript
{
  rpp?: number;    // Registros por página (padrão: 10)
  page?: number;   // Número da página (padrão: 1)
}
```

**Response (200):**
```json
{
  "list": [
    {
      "id": "trade-uuid",
      "userId": "user-uuid",
      "createdAt": "2024-02-15T17:15:08.807Z",
      "user": {
        "name": "João Silva"
      },
      "tradeCards": [
        {
          "id": "trade-card-uuid",
          "cardId": "card-uuid",
          "tradeId": "trade-uuid",
          "type": "OFFERING",
          "card": {
            "id": "card-uuid",
            "name": "Blue-Eyes White Dragon",
            "description": "This legendary dragon...",
            "imageUrl": "https://example.com/card.jpg",
            "createdAt": "2024-02-15T16:40:14.677Z"
          }
        }
      ]
    }
  ],
  "rpp": 10,
  "page": 1,
  "more": false
}
```

#### DELETE `/trades/:id`
Remove uma solicitação de troca.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Trade deleted successfully"
}
```

**Códigos de Erro:**
- `401`: Token inválido
- `403`: Troca não pertence ao usuário
- `404`: Troca não encontrada

## 📊 Tipos de Dados

### 👤 User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  cards?: Card[];
}
```

### 🃏 Card
```typescript
interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}
```

### 🔄 Trade
```typescript
interface Trade {
  id: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
  };
  tradeCards: TradeCard[];
}

interface TradeCard {
  id: string;
  cardId: string;
  tradeId: string;
  type: 'OFFERING' | 'RECEIVING';
  card: Card;
}
```

### 📄 Pagination
```typescript
interface PaginatedResponse<T> {
  list: T[];
  rpp: number;
  page: number;
  more: boolean;
}
```

## ⚠️ Tratamento de Erros

### 📊 Códigos de Status HTTP

| Código | Descrição | Ação Recomendada |
|--------|-----------|------------------|
| `200` | Sucesso | Processar resposta normalmente |
| `201` | Criado | Recurso criado com sucesso |
| `400` | Bad Request | Verificar dados enviados |
| `401` | Unauthorized | Token inválido ou expirado |
| `403` | Forbidden | Sem permissão para acessar |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Conflito (ex: email já existe) |
| `422` | Unprocessable Entity | Dados inválidos |
| `500` | Internal Server Error | Erro interno do servidor |

### 🔧 Estrutura de Erro

```typescript
interface ApiError {
  message: string;
  details?: string;
  status?: number;
  code?: string;
}
```

### 📝 Exemplo de Resposta de Erro

```json
{
  "message": "Invalid credentials",
  "details": "Email or password is incorrect",
  "status": 401,
  "code": "AUTH_INVALID_CREDENTIALS"
}
```

### 🛠️ Tratamento no Frontend

```typescript
// services/index.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('token');
      router.push('/login');
    }
    
    // Tratar outros erros
    const errorMessage = error.response?.data?.message || 'Erro desconhecido';
    handleApiError(error, 'API');
    
    return Promise.reject(error);
  }
);
```

## 🔧 Configuração

### 📝 Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://cards-marketplace-api-2fjj.onrender.com
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3
```

### ⚙️ Configuração do Axios

```typescript
// services/index.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptors
api.interceptors.request.use(
  (config) => {
    // Adicionar token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento global de erros
    handleApiError(error);
    return Promise.reject(error);
  }
);
```

## 📝 Exemplos de Uso

### 🔐 Login de Usuário

```typescript
// services/modules/auth.ts
export const AuthServices = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/login', credentials);
    return response.data;
  }
};

// Uso no componente
const handleLogin = async () => {
  try {
    const response = await AuthServices.login({
      email: form.email,
      password: form.password
    });
    
    // Salvar token
    localStorage.setItem('token', response.token);
    
    // Atualizar store
    authStore.setUser(response.user);
    
    // Redirecionar
    router.push('/dashboard');
  } catch (error) {
    // Erro tratado automaticamente pelo interceptor
  }
};
```

### 🃏 Buscar Cartas

```typescript
// services/modules/cards.ts
export const CardServices = {
  async getCards(params?: PaginationParams): Promise<PaginatedResponse<Card>> {
    const response = await api.get('/cards', { params });
    return response.data;
  }
};

// Uso no componente
const fetchCards = async () => {
  try {
    const response = await CardServices.getCards({
      page: currentPage.value,
      rpp: 10
    });
    
    cards.value = response.list;
    hasMore.value = response.more;
  } catch (error) {
    // Erro tratado automaticamente
  }
};
```

### 🔄 Criar Troca

```typescript
// services/modules/trades.ts
export const TradeServices = {
  async createTrade(tradeData: CreateTradeRequest): Promise<CreateTradeResponse> {
    const response = await api.post('/trades', tradeData);
    return response.data;
  }
};

// Uso no componente
const createTrade = async () => {
  try {
    const response = await TradeServices.createTrade({
      cards: [
        { cardId: selectedOffering.value, type: 'OFFERING' },
        { cardId: selectedReceiving.value, type: 'RECEIVING' }
      ]
    });
    
    // Sucesso
    notification.show('Troca criada com sucesso!', 'success');
    router.push('/my-trades');
  } catch (error) {
    // Erro tratado automaticamente
  }
};
```

---

## 📚 Referências

- [Axios Documentation](https://axios-http.com/)
- [JWT.io](https://jwt.io/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Design](https://restfulapi.net/) 