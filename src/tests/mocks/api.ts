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
  },
  {
    id: 'card-3',
    name: 'Test Card 3',
    description: 'Test description 3',
    imageUrl: 'https://example.com/card3.jpg',
    createdAt: '2024-01-03T00:00:00.000Z'
  },
  {
    id: 'card-4',
    name: 'Test Card 4',
    description: 'Test description 4',
    imageUrl: 'https://example.com/card4.jpg',
    createdAt: '2024-01-04T00:00:00.000Z'
  },
  {
    id: 'card-5',
    name: 'Test Card 5',
    description: 'Test description 5',
    imageUrl: 'https://example.com/card5.jpg',
    createdAt: '2024-01-05T00:00:00.000Z'
  },
  {
    id: 'card-6',
    name: 'Test Card 6',
    description: 'Test description 6',
    imageUrl: 'https://example.com/card6.jpg',
    createdAt: '2024-01-06T00:00:00.000Z'
  },
  {
    id: 'card-7',
    name: 'Test Card 7',
    description: 'Test description 7',
    imageUrl: 'https://example.com/card7.jpg',
    createdAt: '2024-01-07T00:00:00.000Z'
  },
  {
    id: 'card-8',
    name: 'Test Card 8',
    description: 'Test description 8',
    imageUrl: 'https://example.com/card8.jpg',
    createdAt: '2024-01-08T00:00:00.000Z'
  },
  {
    id: 'card-9',
    name: 'Test Card 9',
    description: 'Test description 9',
    imageUrl: 'https://example.com/card9.jpg',
    createdAt: '2024-01-09T00:00:00.000Z'
  },
  {
    id: 'card-10',
    name: 'Test Card 10',
    description: 'Test description 10',
    imageUrl: 'https://example.com/card10.jpg',
    createdAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: 'card-11',
    name: 'Test Card 11',
    description: 'Test description 11',
    imageUrl: 'https://example.com/card11.jpg',
    createdAt: '2024-01-11T00:00:00.000Z'
  },
  {
    id: 'card-12',
    name: 'Test Card 12',
    description: 'Test description 12',
    imageUrl: 'https://example.com/card12.jpg',
    createdAt: '2024-01-12T00:00:00.000Z'
  },
  {
    id: 'card-13',
    name: 'Test Card 13',
    description: 'Test description 13',
    imageUrl: 'https://example.com/card13.jpg',
    createdAt: '2024-01-13T00:00:00.000Z'
  },
  {
    id: 'card-14',
    name: 'Test Card 14',
    description: 'Test description 14',
    imageUrl: 'https://example.com/card14.jpg',
    createdAt: '2024-01-14T00:00:00.000Z'
  },
  {
    id: 'card-15',
    name: 'Test Card 15',
    description: 'Test description 15',
    imageUrl: 'https://example.com/card15.jpg',
    createdAt: '2024-01-15T00:00:00.000Z'
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
  

  getAllCards: vi.fn().mockImplementation((page = 1, rpp = 12, search?: string) => {
    let filteredCards = mockCards;
    
    if (search) {
      filteredCards = mockCards.filter(card => 
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * rpp;
    const endIndex = startIndex + rpp;
    const pageCards = filteredCards.slice(startIndex, endIndex);
    const more = endIndex < filteredCards.length;
    
    return Promise.resolve({
      list: pageCards,
      rpp: rpp,
      page: page,
      more: more,
      total: filteredCards.length
    });
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
  mockApi.getAllCards.mockImplementation((page = 1, rpp = 12, search?: string) => {
    let filteredCards = mockCards;
    
    if (search) {
      filteredCards = mockCards.filter(card => 
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const startIndex = (page - 1) * rpp;
    const endIndex = startIndex + rpp;
    const pageCards = filteredCards.slice(startIndex, endIndex);
    const more = endIndex < filteredCards.length;
    
    return Promise.resolve({
      list: pageCards,
      rpp: rpp,
      page: page,
      more: more,
      total: filteredCards.length
    });
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