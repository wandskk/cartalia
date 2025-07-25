import { ref, computed, watch } from 'vue';

interface UseSearchOptions {
  debounceMs?: number;
  initialQuery?: string;
  minLength?: number;
  maxLength?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 500,
    initialQuery = '',
    minLength = 0,
    maxLength = 100
  } = options;

  const searchQuery = ref(initialQuery);
  const debouncedQuery = ref(initialQuery);
  const isSearching = ref(false);
  const searchTimeout = ref<NodeJS.Timeout | null>(null);

  const isValidQuery = computed(() => {
    const query = searchQuery.value.trim();
    return query.length >= minLength && query.length <= maxLength;
  });

  const hasQuery = computed(() => searchQuery.value.trim().length > 0);

  const isEmpty = computed(() => searchQuery.value.trim().length === 0);

  // Debounce search query
  watch(
    () => searchQuery.value,
    (newQuery) => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }

      searchTimeout.value = setTimeout(() => {
        debouncedQuery.value = newQuery;
      }, debounceMs);
    }
  );

  function setQuery(query: string): void {
    searchQuery.value = query;
  }

  function clearQuery(): void {
    searchQuery.value = '';
    debouncedQuery.value = '';
  }

  function updateQuery(query: string): void {
    setQuery(query);
  }

  function startSearch(): void {
    isSearching.value = true;
  }

  function stopSearch(): void {
    isSearching.value = false;
  }

  function resetSearch(): void {
    clearQuery();
    stopSearch();
  }

  // Filter function helper
  function filterByQuery<T>(
    items: T[],
    searchFields: (keyof T)[],
    query: string = debouncedQuery.value
  ): T[] {
    if (!query.trim()) return items;

    const searchTerm = query.toLowerCase().trim();
    
    return items.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm);
        }
        return false;
      });
    });
  }

  // Async search helper
  async function performSearch<T>(
    searchFunction: (query: string) => Promise<T[]>,
    query: string = debouncedQuery.value
  ): Promise<T[]> {
    if (!query.trim()) return [];

    startSearch();
    try {
      return await searchFunction(query);
    } finally {
      stopSearch();
    }
  }

  return {
    // State
    searchQuery,
    debouncedQuery,
    isSearching,
    
    // Computed
    isValidQuery,
    hasQuery,
    isEmpty,
    
    // Methods
    setQuery,
    clearQuery,
    updateQuery,
    startSearch,
    stopSearch,
    resetSearch,
    filterByQuery,
    performSearch
  };
} 