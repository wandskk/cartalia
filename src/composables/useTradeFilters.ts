import { computed, ref, type Ref } from 'vue';
import type { Trade } from '../types';

export function useTradeFilters(trades: Ref<Trade[]>) {
  const searchTerm = ref('');

  const filteredTrades = computed(() => {
    let filtered = [...trades.value];

    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase();
      filtered = filtered.filter(trade => {
        return trade.tradeCards.some((tradeCard: any) => 
          tradeCard.card.name.toLowerCase().includes(term) ||
          tradeCard.card.description.toLowerCase().includes(term)
        );
      });
    }

    return filtered;
  });

  function updateFilters(filters: { searchTerm: string }) {
    searchTerm.value = filters.searchTerm;
  }

  function resetFilters() {
    searchTerm.value = '';
  }

  return {
    searchTerm,
    filteredTrades,
    updateFilters,
    resetFilters
  };
} 