
export const API_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://cards-marketplace-api-2fjj.onrender.com',
  ENVIRONMENT: import.meta.env.VITE_APP_ENVIRONMENT || 'development'
} as const;

export const APP_CONFIG = {
  NAME: 'Cartalia',
  VERSION: '1.0.0',
  DESCRIPTION: 'Marketplace para troca de cartas'
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [12, 24, 48, 96]
} as const;

export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000,
  MAX_SIZE: 100,
  CLEANUP_INTERVAL: 30 * 60 * 1000
} as const;


export const NOTIFICATION = {
  SUCCESS_DURATION: 5000,
  ERROR_DURATION: 8000,
  WARNING_DURATION: 6000
} as const;


export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_CARDS_SELECTION: 1,
  MIN_TRADE_CARDS: 2
} as const;


export const CARD_TYPES = {
  OFFERING: 'OFFERING',
  RECEIVING: 'RECEIVING'
} as const;


export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;


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


export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  FORBIDDEN: 'Acesso negado.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION_ERROR: 'Dados inválidos.',
  UNKNOWN_ERROR: 'Erro inesperado. Tente novamente.'
} as const;


export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  REGISTER: 'Cadastro realizado com sucesso!',
  TRADE_CREATED: 'Troca criada com sucesso!',
  TRADE_DELETED: 'Troca removida com sucesso!',
  CARDS_ADDED: 'Cartas adicionadas com sucesso!'
} as const;


export const SIDEBAR = {
  EXPANDED_WIDTH: 280,
  COLLAPSED_WIDTH: 60,
  HEADER_HEIGHT: 64,
  TRANSITION_DURATION: 300,
  STORAGE_KEY: 'sidebar-collapsed'
} as const;


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


export const SIDEBAR_TEXTS = {
  TITLE: 'Navegação',
  EXPAND: 'Expandir',
  COLLAPSE: 'Recolher',
  DEFAULT_USER: 'Usuário',
  DEFAULT_EMAIL: 'email@exemplo.com'
} as const; 
