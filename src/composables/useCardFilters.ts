import { ref, computed, type Ref } from 'vue';
import type { Card } from '../types';

export function useCardFilters(cards: Ref<Card[]>) {
  const searchQuery = ref('');
  const currentFilter = ref('all');
  const viewMode = ref<'grid' | 'list'>('grid');

  const recentCards = computed(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return cards.value.filter(
      (card) => new Date(card.createdAt) > thirtyDaysAgo
    ).length;
  });

  const filteredCards = computed(() => {
    let filtered = cards.value;

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(query) ||
          card.description.toLowerCase().includes(query)
      );
    }

    if (currentFilter.value === 'recent') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(
        (card) => new Date(card.createdAt) > thirtyDaysAgo
      );
    }

    return filtered;
  });

  function setFilter(filter: string) {
    currentFilter.value = filter;
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function setViewMode(mode: 'grid' | 'list') {
    viewMode.value = mode;
  }

  function clearFilters() {
    searchQuery.value = '';
    currentFilter.value = 'all';
  }

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