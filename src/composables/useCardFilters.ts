import { computed, type Ref } from 'vue';
import { useFilters } from './useFilters';
import type { Card } from '../types';

export function useCardFilters(cards: Ref<Card[]>) {
  const {
    searchQuery,
    currentFilter,
    viewMode,
    filteredItems: filteredCards,
    setFilter,
    setSearchQuery,
    setViewMode,
    clearFilters
  } = useFilters(cards, {
    searchFields: ['name', 'description'],
    additionalFilters: {
      recent: (card: Card) => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(card.createdAt) > thirtyDaysAgo;
      }
    }
  });

  const recentCards = computed(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return cards.value.filter(
      (card) => new Date(card.createdAt) > thirtyDaysAgo
    );
  });

  return {
    searchQuery,
    currentFilter,
    viewMode,
    recentCards,
    filteredCards,
    setFilter,
    setSearchQuery,
    setViewMode,
    clearFilters
  };
} 