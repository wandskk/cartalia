import type { Card } from './card';

export interface TradeCard {
  id: string;
  cardId: string;
  tradeId: string;
  type: 'OFFERING' | 'RECEIVING';
  card: Card;
}

export interface Trade {
  id: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
  };
  tradeCards: TradeCard[];
}

export interface TradeListResponse {
  list: Trade[];
  rpp: number;
  page: number;
  more: boolean;
}

export interface CreateTradeRequest {
  cards: {
    cardId: string;
    type: 'OFFERING' | 'RECEIVING';
  }[];
}

export interface CreateTradeResponse {
  tradeId: string;
} 