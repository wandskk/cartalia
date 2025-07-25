import { ref, computed, type Ref } from "vue";

export interface FilterOptions<T> {
  searchFields?: (keyof T)[];
  searchFunction?: (item: T, query: string) => boolean;
  additionalFilters?: Record<string, (item: T) => boolean>;
}

export function useFilters<T>(items: Ref<T[]>, options: FilterOptions<T> = {}) {
  const searchQuery = ref("");
  const currentFilter = ref("all");
  const viewMode = ref<"grid" | "list">("grid");

  const filteredItems = computed(() => {
    let filtered = [...items.value];

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();

      if (options.searchFunction) {
        filtered = filtered.filter((item) =>
          options.searchFunction!(item, query)
        );
      } else if (options.searchFields) {
        filtered = filtered.filter((item) => {
          return options.searchFields!.some((field) => {
            const value = item[field];
            if (typeof value === "string") {
              return value.toLowerCase().includes(query);
            }
            return false;
          });
        });
      }
    }

    if (currentFilter.value !== "all" && options.additionalFilters) {
      const filterFunction = options.additionalFilters[currentFilter.value];
      if (filterFunction) {
        filtered = filtered.filter(filterFunction);
      }
    }

    return filtered;
  });

  function setFilter(filter: string) {
    currentFilter.value = filter;
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function setViewMode(mode: "grid" | "list") {
    viewMode.value = mode;
  }

  function clearFilters() {
    searchQuery.value = "";
    currentFilter.value = "all";
  }

  function updateFilters(filters: { searchTerm?: string; filter?: string }) {
    if (filters.searchTerm !== undefined) {
      searchQuery.value = filters.searchTerm;
    }
    if (filters.filter !== undefined) {
      currentFilter.value = filters.filter;
    }
  }

  return {
    searchQuery,
    currentFilter,
    viewMode,
    filteredItems,
    setFilter,
    setSearchQuery,
    setViewMode,
    clearFilters,
    updateFilters,
  };
}
