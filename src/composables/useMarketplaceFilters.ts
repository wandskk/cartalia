import { ref, computed } from 'vue';
import type { Trade } from '../types';

export interface MarketplaceFilters {
  search: string;
}

export function useMarketplaceFilters() {
  const filters = ref<MarketplaceFilters>({
    search: ''
  });

  const filteredTrades = computed(() => {
    return (trades: Trade[]) => {
      let filtered = [...trades];

      if (filters.value.search) {
        const searchTerm = filters.value.search.toLowerCase();
        filtered = filtered.filter(trade => {
          const userName = trade.user.name.toLowerCase();
          const cardNames = trade.tradeCards.map(tc => tc.card.name.toLowerCase());
          return userName.includes(searchTerm) || 
                 cardNames.some(name => name.includes(searchTerm));
        });
      }

      return filtered;
    };
  });

  const hasActiveFilters = computed(() => {
    return filters.value.search;
  });

  function updateFilters(newFilters: Partial<MarketplaceFilters>) {
    Object.assign(filters.value, newFilters);
  }

  function clearFilters() {
    filters.value = {
      search: ''
    };
  }

  return {
    filters,
    filteredTrades,
    hasActiveFilters,
    updateFilters,
    clearFilters
  };
} 