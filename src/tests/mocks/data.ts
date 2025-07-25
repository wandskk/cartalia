import type { Card, Trade, TradeCardDetail } from '../../types';

export const mockCards: Card[] = [
  {
    id: 'card-1',
    name: 'Blue-Eyes White Dragon',
    description: 'This legendary dragon is a powerful engine of destruction.',
    imageUrl: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'card-2',
    name: 'Dark Magician',
    description: 'The ultimate wizard in terms of attack and defense.',
    imageUrl: 'https://images.ygoprodeck.com/images/cards/46986414.jpg',
    createdAt: '2024-01-16T11:00:00Z'
  },
  {
    id: 'card-3',
    name: 'Red-Eyes Black Dragon',
    description: 'A ferocious dragon with a deadly attack.',
    imageUrl: 'https://images.ygoprodeck.com/images/cards/74677422.jpg',
    createdAt: '2024-01-17T12:00:00Z'
  },
  {
    id: 'card-4',
    name: 'Summoned Skull',
    description: 'A fiend with dark powers for confusing the enemy.',
    imageUrl: 'https://images.ygoprodeck.com/images/cards/70781052.jpg',
    createdAt: '2024-01-18T13:00:00Z'
  }
];

export const mockTradeCards: TradeCardDetail[] = [
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

export const mockTrades: Trade[] = [
  {
    id: 'trade-1',
    userId: 'user-1',
    createdAt: '2024-01-20T10:00:00Z',
    user: {
      name: 'João Silva'
    },
    tradeCards: [mockTradeCards[0], mockTradeCards[1]]
  },
  {
    id: 'trade-2',
    userId: 'user-2',
    createdAt: '2024-01-21T11:00:00Z',
    user: {
      name: 'Maria Santos'
    },
    tradeCards: [mockTradeCards[2], mockTradeCards[3]]
  }
];

export const mockUser = {
  id: 'user-1',
  name: 'João Silva',
  email: 'joao@example.com',
  cards: mockCards.slice(0, 2)
};

export const mockAuthResponse = {
  token: 'mock-jwt-token',
  user: mockUser
};

export const mockLoginForm = {
  email: 'joao@example.com',
  password: '123456'
};

export const mockRegisterForm = {
  name: 'João Silva',
  email: 'joao@example.com',
  password: '123456'
}; 