import { vi } from 'vitest';
import type { User, Card, Trade, LoginResponse, RegisterResponse } from '../../types';


export const mockUser: User = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  cards: []
};

export const mockCards: Card[] = [
  {
    id: 'card-1',
    name: 'Test Card 1',
    description: 'Test description 1',
    imageUrl: 'https://example.com/card1.jpg',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'card-2',
    name: 'Test Card 2',
    description: 'Test description 2',
    imageUrl: 'https://example.com/card2.jpg',
    createdAt: '2024-01-02T00:00:00.000Z'
  }
];

export const mockTrades: Trade[] = [
  {
    id: 'trade-1',
    userId: 'user-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    user: { name: 'Test User' },
    tradeCards: [
      {
        id: 'trade-card-1',
        cardId: 'card-1',
        tradeId: 'trade-1',
        type: 'OFFERING',
        card: mockCards[0]
      }
    ]
  }
];

export const mockLoginResponse: LoginResponse = {
  token: 'mock-jwt-token',
  user: mockUser
};

export const mockRegisterResponse: RegisterResponse = {
  userId: 'user-1'
};


export const mockApi = {

  login: vi.fn().mockResolvedValue(mockLoginResponse),
  register: vi.fn().mockResolvedValue(mockRegisterResponse),
  getUserProfile: vi.fn().mockResolvedValue(mockUser),
  

  getAllCards: vi.fn().mockResolvedValue({
    list: mockCards,
    rpp: 10,
    page: 1,
    more: false
  }),
  getCardById: vi.fn().mockResolvedValue(mockCards[0]),
  getUserCards: vi.fn().mockResolvedValue(mockCards),
  addCardsToUser: vi.fn().mockResolvedValue({ success: true }),
  

  getAllTrades: vi.fn().mockResolvedValue({
    list: mockTrades,
    rpp: 10,
    page: 1,
    more: false
  }),
  getTradeById: vi.fn().mockResolvedValue(mockTrades[0]),
  createTrade: vi.fn().mockResolvedValue({ tradeId: 'trade-1' }),
  deleteTrade: vi.fn().mockResolvedValue({ success: true })
};


export const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
};


export const mockFetch = vi.fn();


global.fetch = mockFetch;


export function setupApiMocks() {

  Object.values(mockApi).forEach(mock => mock.mockClear());
  mockAxios.get.mockClear();
  mockAxios.post.mockClear();
  mockAxios.put.mockClear();
  mockAxios.delete.mockClear();
  mockFetch.mockClear();
  

  mockApi.login.mockResolvedValue(mockLoginResponse);
  mockApi.register.mockResolvedValue(mockRegisterResponse);
  mockApi.getUserProfile.mockResolvedValue(mockUser);
  mockApi.getAllCards.mockResolvedValue({
    list: mockCards,
    rpp: 10,
    page: 1,
    more: false
  });
  mockApi.getCardById.mockResolvedValue(mockCards[0]);
  mockApi.getUserCards.mockResolvedValue(mockCards);
  mockApi.addCardsToUser.mockResolvedValue({ success: true });
  mockApi.getAllTrades.mockResolvedValue({
    list: mockTrades,
    rpp: 10,
    page: 1,
    more: false
  });
  mockApi.getTradeById.mockResolvedValue(mockTrades[0]);
  mockApi.createTrade.mockResolvedValue({ tradeId: 'trade-1' });
  mockApi.deleteTrade.mockResolvedValue({ success: true });
}


export function setupApiError(error: any = new Error('API Error')) {
  Object.values(mockApi).forEach(mock => mock.mockRejectedValue(error));
  mockAxios.get.mockRejectedValue(error);
  mockAxios.post.mockRejectedValue(error);
  mockAxios.put.mockRejectedValue(error);
  mockAxios.delete.mockRejectedValue(error);
  mockFetch.mockRejectedValue(error);
}


export function setupApiDelay(delay: number = 1000) {
  Object.values(mockApi).forEach(mock => {
    mock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, delay)));
  });
} 