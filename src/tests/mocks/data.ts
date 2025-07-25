import type { User, Card, Trade, TradeCard } from '../../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    cards: []
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    cards: []
  }
];

// Mock Cards
export const mockCards: Card[] = [
  {
    id: 'card-1',
    name: 'Blue-Eyes White Dragon',
    description: 'This legendary dragon is a powerful engine of destruction.',
    imageUrl: 'https://example.com/blue-eyes.jpg',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'card-2',
    name: 'Dark Magician',
    description: 'The ultimate wizard in terms of attack and defense.',
    imageUrl: 'https://example.com/dark-magician.jpg',
    createdAt: '2024-01-02T00:00:00.000Z'
  },
  {
    id: 'card-3',
    name: 'Red-Eyes Black Dragon',
    description: 'A ferocious dragon with a deadly attack.',
    imageUrl: 'https://example.com/red-eyes.jpg',
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: 'card-4',
    name: 'Summoned Skull',
    description: 'A fiend with dark powers for confusing the enemy.',
    imageUrl: 'https://example.com/summoned-skull.jpg',
    createdAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: 'card-5',
    name: 'Celtic Guardian',
    description: 'An elf who learned to wield a sword.',
    imageUrl: 'https://example.com/celtic-guardian.jpg',
    createdAt: '2024-01-05T00:00:00.000Z'
  }
];

// Mock Trade Cards
export const mockTradeCards: TradeCard[] = [
  {
    id: 'trade-card-1',
    cardId: 'card-1',
    tradeId: 'trade-1',
    type: 'OFFERING',
    card: mockCards[0]
  },
  {
    id: 'trade-card-2',
    cardId: 'card-2',
    tradeId: 'trade-1',
    type: 'RECEIVING',
    card: mockCards[1]
  },
  {
    id: 'trade-card-3',
    cardId: 'card-3',
    tradeId: 'trade-2',
    type: 'OFFERING',
    card: mockCards[2]
  },
  {
    id: 'trade-card-4',
    cardId: 'card-4',
    tradeId: 'trade-2',
    type: 'RECEIVING',
    card: mockCards[3]
  }
];

// Mock Trades
export const mockTrades: Trade[] = [
  {
    id: 'trade-1',
    userId: 'user-1',
    createdAt: '2024-01-01T10:00:00.000Z',
    user: { name: 'John Doe' },
    tradeCards: [mockTradeCards[0], mockTradeCards[1]]
  },
  {
    id: 'trade-2',
    userId: 'user-2',
    createdAt: '2024-01-02T14:30:00.000Z',
    user: { name: 'Jane Smith' },
    tradeCards: [mockTradeCards[2], mockTradeCards[3]]
  },
  {
    id: 'trade-3',
    userId: 'user-1',
    createdAt: '2024-01-03T09:15:00.000Z',
    user: { name: 'John Doe' },
    tradeCards: [
      {
        id: 'trade-card-5',
        cardId: 'card-5',
        tradeId: 'trade-3',
        type: 'OFFERING',
        card: mockCards[4]
      }
    ]
  }
];

// Mock API Responses
export const mockApiResponses = {
  // Auth
  login: {
    token: 'mock-jwt-token-123',
    user: mockUsers[0]
  },
  register: {
    userId: 'user-3'
  },
  userProfile: mockUsers[0],
  
  // Cards
  allCards: {
    list: mockCards,
    rpp: 10,
    page: 1,
    more: false
  },
  userCards: mockCards.slice(0, 3),
  singleCard: mockCards[0],
  
  // Trades
  allTrades: {
    list: mockTrades,
    rpp: 10,
    page: 1,
    more: false
  },
  singleTrade: mockTrades[0],
  createTrade: {
    tradeId: 'trade-4'
  }
};

// Mock Form Data
export const mockFormData = {
  login: {
    email: 'test@example.com',
    password: 'password123'
  },
  register: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123'
  },
  trade: {
    cards: [
      { cardId: 'card-1', type: 'OFFERING' as const },
      { cardId: 'card-2', type: 'RECEIVING' as const }
    ]
  }
};

// Mock Error Responses
export const mockErrors = {
  network: new Error('Network Error'),
  unauthorized: new Error('Unauthorized'),
  notFound: new Error('Not Found'),
  validation: new Error('Validation Error'),
  server: new Error('Internal Server Error'),
  api: {
    status: 400,
    message: 'Bad Request',
    errors: ['Invalid email format']
  }
};

// Mock Pagination Data
export const mockPagination = {
  firstPage: {
    page: 1,
    rpp: 10,
    total: 50,
    more: true
  },
  lastPage: {
    page: 5,
    rpp: 10,
    total: 50,
    more: false
  },
  empty: {
    page: 1,
    rpp: 10,
    total: 0,
    more: false
  }
};

// Mock Search Data
export const mockSearchData = {
  query: 'dragon',
  results: [mockCards[0], mockCards[2]], // Blue-Eyes and Red-Eyes
  emptyResults: [],
  longQuery: 'a'.repeat(100)
};

// Mock Filter Data
export const mockFilterData = {
  status: ['active', 'completed', 'cancelled'],
  dateRange: {
    start: '2024-01-01',
    end: '2024-01-31'
  },
  cardTypes: ['monster', 'spell', 'trap']
};

// Helper functions
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-mock',
    name: 'Mock User',
    email: 'mock@example.com',
    cards: [],
    ...overrides
  };
}

export function createMockCard(overrides: Partial<Card> = {}): Card {
  return {
    id: 'card-mock',
    name: 'Mock Card',
    description: 'Mock description',
    imageUrl: 'https://example.com/mock.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides
  };
}

export function createMockTrade(overrides: Partial<Trade> = {}): Trade {
  return {
    id: 'trade-mock',
    userId: 'user-mock',
    createdAt: '2024-01-01T00:00:00.000Z',
    user: { name: 'Mock User' },
    tradeCards: [],
    ...overrides
  };
} 