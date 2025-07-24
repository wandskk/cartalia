// Configurações da aplicação
export const APP_CONFIG = {
  NAME: 'Cartalia',
  VERSION: '1.0.0',
  DESCRIPTION: 'Marketplace para troca de cartas',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://cards-marketplace-api-2fjj.onrender.com',
  ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development'
} as const;

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_RPP: 10,
  MAX_RPP: 50
} as const;

// Configurações de cache
export const CACHE = {
  USER_CARDS_TTL: 5 * 60 * 1000, // 5 minutos
  ALL_CARDS_TTL: 10 * 60 * 1000, // 10 minutos
  TRADES_TTL: 2 * 60 * 1000 // 2 minutos
} as const;

// Configurações de notificações
export const NOTIFICATION = {
  SUCCESS_DURATION: 5000,
  ERROR_DURATION: 8000,
  WARNING_DURATION: 6000
} as const;

// Configurações de validação
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_CARDS_SELECTION: 1,
  MIN_TRADE_CARDS: 2
} as const;

// Tipos de cartas
export const CARD_TYPES = {
  OFFERING: 'OFFERING',
  RECEIVING: 'RECEIVING'
} as const;

// Status de loading
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

// Rotas da aplicação
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CARDS: '/cards',
  MARKETPLACE: '/marketplace',

  MY_TRADES: '/my-trades',
  CARD_DETAIL: '/card/:id'
} as const;

// Mensagens de erro
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Acesso negado.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION_ERROR: 'Dados inválidos.',
  UNKNOWN_ERROR: 'Erro inesperado. Tente novamente.'
} as const;

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Cadastro realizado com sucesso!',
  TRADE_CREATED: 'Troca criada com sucesso!',
  TRADE_DELETED: 'Troca removida com sucesso!',
  CARDS_ADDED: 'Cartas adicionadas com sucesso!'
} as const;

// Configurações da sidebar
export const SIDEBAR = {
  EXPANDED_WIDTH: 280,
  COLLAPSED_WIDTH: 60,
  HEADER_HEIGHT: 64,
  TRANSITION_DURATION: 300,
  STORAGE_KEY: 'sidebar-collapsed'
} as const;

// Itens de navegação da sidebar
export const NAVIGATION_ITEMS = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'mdi-view-dashboard',
    requiresAuth: true,
  },
  {
    path: '/cards',
    label: 'Minhas Cartas',
    icon: 'mdi-cards',
    requiresAuth: true,
  },
  {
    path: '/my-trades',
    label: 'Minhas Trocas',
    icon: 'mdi-swap-horizontal',
    requiresAuth: true,
  },
  {
    path: '/marketplace',
    label: 'Marketplace',
    icon: 'mdi-store',
    requiresAuth: false,
  },
] as const;

// Textos da sidebar
export const SIDEBAR_TEXTS = {
  TITLE: 'Navegação',
  EXPAND: 'Expandir',
  COLLAPSE: 'Recolher',
  DEFAULT_USER: 'Usuário',
  DEFAULT_EMAIL: 'email@exemplo.com'
} as const; 
