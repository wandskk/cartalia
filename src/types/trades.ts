import type { z } from 'zod';
import { createTradeSchema } from '../schemas';
import type { Card } from './cards';

// Tipos de formulários (inferidos dos schemas)
export type CreateTradeForm = z.infer<typeof createTradeSchema>;

// Tipos de cartas de troca
export type TradeCardType = 'OFFERING' | 'RECEIVING';

// Tipos de API (respostas do servidor)
export interface TradeCard {
  id: string;
  cardId: string;
  tradeId: string;
  type: TradeCardType;
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

export interface CreateTradeResponse {
  tradeId: string;
}

// Tipos de estado
export interface TradeFilters {
  search?: string;
  page: number;
  rpp: number;
  type?: 'all' | 'user' | 'marketplace';
}

export interface TradeSelection {
  offeringCards: Card[];
  receivingCards: Card[];
}

// Tipos de componentes
export interface TradeCardProps {
  trade: Trade;
  showActions?: boolean;
  compact?: boolean;
}

export interface TradeListProps {
  trades: Trade[];
  loading?: boolean;
  emptyMessage?: string;
} 
