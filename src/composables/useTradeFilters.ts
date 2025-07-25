import { type Ref } from 'vue';
import { useFilters } from './useFilters';
import type { Trade } from '../types';

export function useTradeFilters(trades: Ref<Trade[]>) {
  const {
    searchQuery: searchTerm,
    filteredItems: filteredTrades,
    updateFilters,
    clearFilters: resetFilters
  } = useFilters(trades, {
    searchFunction: (trade: Trade, query: string) => {
      return trade.tradeCards.some((tradeCard: any) => 
        tradeCard.card.name.toLowerCase().includes(query) ||
        tradeCard.card.description.toLowerCase().includes(query)
      );
    }
  });

  return {
    searchTerm,
    filteredTrades,
    updateFilters,
    resetFilters
  };
} 