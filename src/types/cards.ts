import type { z } from 'zod';
import { addCardsSchema } from '../schemas';


export type AddCardsForm = z.infer<typeof addCardsSchema>;


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
  total?: number;
}


export interface Filter {
  value: string;
  label: string;
}

export interface ViewMode {
  value: 'grid' | 'list';
  icon: string;
  title: string;
}

export interface CardStats {
  totalCards: number;
  recentCards: number;
}

export interface CardFilters {
  searchQuery: string;
  currentFilter: string;
  viewMode: 'grid' | 'list';
}

export interface CardStates {
  isLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
  hasCards: boolean;
}

export interface CardSelection {
  selectedCards: Card[];
  isSelecting: boolean;
} 
