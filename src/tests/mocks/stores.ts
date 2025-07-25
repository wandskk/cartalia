import { vi } from 'vitest';
import type { User, Card, Trade } from '../../types';


export const mockAuthStore = {
  user: null as User | null,
  token: null as string | null,
  isAuthenticated: false,
  loading: false,
  error: null as string | null,
  

  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  fetchUserProfile: vi.fn(),
  clearError: vi.fn(),
  

  $state: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }
};

export const mockCardsStore = {
  allCards: [] as Card[],
  userCards: [] as Card[],
  loading: false,
  error: null as string | null,
  pagination: {
    page: 1,
    rpp: 12,
    total: 0,
    more: false
  },
  

  fetchAllCards: vi.fn(),
  fetchUserCards: vi.fn(),
  fetchCardById: vi.fn(),
  addCardsToUser: vi.fn(),
  clearError: vi.fn(),
  

  $state: {
    allCards: [],
    userCards: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      rpp: 12,
      total: 0,
      more: false
    }
  }
};

export const mockTradesStore = {
  trades: [] as Trade[],
  loading: false,
  error: null as string | null,
  pagination: {
    page: 1,
    rpp: 12,
    total: 0,
    more: false
  },
  

  fetchTrades: vi.fn(),
  fetchTradeById: vi.fn(),
  createTrade: vi.fn(),
  deleteTrade: vi.fn(),
  clearError: vi.fn(),
  

  $state: {
    trades: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      rpp: 12,
      total: 0,
      more: false
    }
  }
};

export const mockLoadingStore = {
  isLoading: false,
  loadingStates: {} as Record<string, boolean>,
  

  startLoading: vi.fn(),
  stopLoading: vi.fn(),
  setLoadingState: vi.fn(),
  clearLoadingState: vi.fn(),
  clearAllLoadingStates: vi.fn(),
  

  $state: {
    isLoading: false,
    loadingStates: {}
  }
};

export const mockNotificationStore = {
  notifications: [] as any[],
  

  show: vi.fn(),
  hide: vi.fn(),
  clear: vi.fn(),
  

  $state: {
    notifications: []
  }
};

export const mockErrorStore = {
  errors: [] as any[],
  

  addError: vi.fn(),
  removeError: vi.fn(),
  clearErrors: vi.fn(),
  

  $state: {
    errors: []
  }
};

export const mockSidebarStore = {
  isOpen: false,
  

  open: vi.fn(),
  close: vi.fn(),
  toggle: vi.fn(),
  

  $state: {
    isOpen: false
  }
};

export const mockCacheStore = {
  cache: {} as Record<string, any>,
  

  set: vi.fn(),
  get: vi.fn(),
  has: vi.fn(),
  delete: vi.fn(),
  clear: vi.fn(),
  invalidate: vi.fn(),
  

  $state: {
    cache: {}
  }
};


export function resetStoreMocks() {
  const stores = [
    mockAuthStore,
    mockCardsStore,
    mockTradesStore,
    mockLoadingStore,
    mockNotificationStore,
    mockErrorStore,
    mockSidebarStore,
    mockCacheStore
  ];
  
  stores.forEach(store => {
    Object.values(store).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as any).mockClear();
      }
    });
  });
}


export function setupStoreWithData(storeName: string, data: any) {
  switch (storeName) {
    case 'auth':
      mockAuthStore.user = data.user;
      mockAuthStore.token = data.token;
      mockAuthStore.isAuthenticated = !!data.user;
      break;
    case 'cards':
      mockCardsStore.allCards = data.allCards || [];
      mockCardsStore.userCards = data.userCards || [];
      break;
    case 'trades':
      mockTradesStore.trades = data.trades || [];
      break;
    case 'loading':
      mockLoadingStore.isLoading = data.isLoading || false;
      mockLoadingStore.loadingStates = data.loadingStates || {};
      break;
    case 'notification':
      mockNotificationStore.notifications = data.notifications || [];
      break;
    case 'error':
      mockErrorStore.errors = data.errors || [];
      break;
    case 'sidebar':
      mockSidebarStore.isOpen = data.isOpen || false;
      break;
    case 'cache':
      mockCacheStore.cache = data.cache || {};
      break;
  }
}


export function createMockPinia() {
  return {
    install: vi.fn(),
    useAuthStore: () => mockAuthStore,
    useCardsStore: () => mockCardsStore,
    useTradesStore: () => mockTradesStore,
    useLoadingStore: () => mockLoadingStore,
    useNotificationStore: () => mockNotificationStore,
    useErrorStore: () => mockErrorStore,
    useSidebarStore: () => mockSidebarStore,
    useCacheStore: () => mockCacheStore
  };
} 