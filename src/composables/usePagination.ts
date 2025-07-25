import { ref, computed } from 'vue';

interface UsePaginationOptions {
  initialPage?: number;
  initialItemsPerPage?: number;
  totalItems?: number;
  maxItemsPerPage?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const {
    initialPage = 1,
    initialItemsPerPage = 12,
    totalItems = 0,
    maxItemsPerPage = 100
  } = options;

  const currentPage = ref(initialPage);
  const itemsPerPage = ref(initialItemsPerPage);
  const totalItemsCount = ref(totalItems);

  const totalPages = computed(() => {
    return Math.ceil(totalItemsCount.value / itemsPerPage.value);
  });

  const hasNext = computed(() => {
    return currentPage.value < totalPages.value;
  });

  const hasPrev = computed(() => {
    return currentPage.value > 1;
  });

  const startIndex = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value;
  });

  const endIndex = computed(() => {
    return Math.min(startIndex.value + itemsPerPage.value, totalItemsCount.value);
  });

  const pageInfo = computed(() => {
    return {
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      totalItems: totalItemsCount.value,
      itemsPerPage: itemsPerPage.value,
      startIndex: startIndex.value,
      endIndex: endIndex.value,
      hasNext: hasNext.value,
      hasPrev: hasPrev.value
    };
  });

  function setPage(page: number): void {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function nextPage(): void {
    if (hasNext.value) {
      currentPage.value++;
    }
  }

  function prevPage(): void {
    if (hasPrev.value) {
      currentPage.value--;
    }
  }

  function firstPage(): void {
    currentPage.value = 1;
  }

  function lastPage(): void {
    currentPage.value = totalPages.value;
  }

  function setItemsPerPage(items: number): void {
    if (items > 0 && items <= maxItemsPerPage) {
      itemsPerPage.value = items;
      // Reset to first page when changing items per page
      currentPage.value = 1;
    }
  }

  function setTotalItems(total: number): void {
    totalItemsCount.value = total;
    // Adjust current page if it's now out of bounds
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value;
    }
  }

  function reset(): void {
    currentPage.value = initialPage;
    itemsPerPage.value = initialItemsPerPage;
    totalItemsCount.value = totalItems;
  }

  function goToPage(page: number): void {
    setPage(page);
  }

  // Helper function to get paginated items from an array
  function paginateItems<T>(items: T[]): T[] {
    return items.slice(startIndex.value, endIndex.value);
  }

  // Helper function to get page numbers for pagination component
  function getPageNumbers(maxVisible: number = 5): number[] {
    const pages: number[] = [];
    const total = totalPages.value;
    const current = currentPage.value;

    if (total <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range to show
      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = Math.min(total, start + maxVisible - 1);

      // Adjust start if end is at the limit
      if (end === total) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  return {
    // State
    currentPage,
    itemsPerPage,
    totalItemsCount,
    
    // Computed
    totalPages,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,
    pageInfo,
    
    // Methods
    setPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    setItemsPerPage,
    setTotalItems,
    reset,
    goToPage,
    paginateItems,
    getPageNumbers
  };
} 