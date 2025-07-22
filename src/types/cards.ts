import type { z } from 'zod';
import { addCardsSchema } from '../schemas';

// Tipos de formulários (inferidos dos schemas)
export type AddCardsForm = z.infer<typeof addCardsSchema>;

// Tipos de API (respostas do servidor)
export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export interface CardListResponse {
  list: Card[];
  rpp: number;
  page: number;
  more: boolean;
}

// Tipos de estado
export interface CardFilters {
  search?: string;
  page: number;
  rpp: number;
}

export interface CardSelection {
  selectedCards: Card[];
  isSelecting: boolean;
} 
