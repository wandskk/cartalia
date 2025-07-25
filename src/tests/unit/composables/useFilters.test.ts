import { describe, it, expect, beforeEach } from 'vitest';
import { ref, type Ref } from 'vue';
import { useFilters } from '../../../composables/useFilters';

interface TestItem {
  id: number;
  name: string;
  description: string;
  category: string;
}

describe('useFilters', () => {
  let items: ReturnType<typeof ref<TestItem[]>>;
  let filters: ReturnType<typeof useFilters<TestItem>>;

  beforeEach(() => {
    items = ref<TestItem[]>([
      { id: 1, name: 'Item 1', description: 'First item', category: 'A' },
      { id: 2, name: 'Item 2', description: 'Second', category: 'B' },
      { id: 3, name: 'Test', description: 'Third', category: 'A' },
      { id: 4, name: 'Another', description: 'Fourth', category: 'C' }
    ]);
    
    filters = useFilters(items as Ref<TestItem[]>);
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(filters.searchQuery.value).toBe('');
      expect(filters.currentFilter.value).toBe('all');
      expect(filters.viewMode.value).toBe('grid');
      expect(filters.filteredItems.value).toEqual(items.value);
    });
  });

  describe('search functionality', () => {
    it('should filter by search fields when provided', () => {
      const filtersWithFields = useFilters(items as Ref<TestItem[]>, {
        searchFields: ['name', 'description']
      });

      filtersWithFields.setSearchQuery('Test');
      
      expect(filtersWithFields.filteredItems.value).toHaveLength(1);
      expect(filtersWithFields.filteredItems.value[0].name).toBe('Test');
    });

    it('should filter by custom search function', () => {
      const filtersWithFunction = useFilters(items as Ref<TestItem[]>, {
        searchFunction: (item, query) => item.category.toLowerCase() === query
      });

      filtersWithFunction.setSearchQuery('a');
      
      expect(filtersWithFunction.filteredItems.value).toHaveLength(2);
      expect(filtersWithFunction.filteredItems.value.every(item => item.category === 'A')).toBe(true);
    });

    it('should return all items when search query is empty', () => {
      filters.setSearchQuery('Test');
      filters.setSearchQuery('');
      
      expect(filters.filteredItems.value).toEqual(items.value);
    });

    it('should be case insensitive', () => {
      const filtersWithFields = useFilters(items as Ref<TestItem[]>, {
        searchFields: ['name']
      });

      filtersWithFields.setSearchQuery('item');
      
      expect(filtersWithFields.filteredItems.value).toHaveLength(2); // Só "Item 1" e "Item 2"
    });
  });

  describe('filter functionality', () => {
    it('should apply additional filters', () => {
      const filtersWithAdditional = useFilters(items as Ref<TestItem[]>, {
        additionalFilters: {
          'category-a': (item) => item.category === 'A',
          'category-b': (item) => item.category === 'B'
        }
      });

      filtersWithAdditional.setFilter('category-a');
      
      expect(filtersWithAdditional.filteredItems.value).toHaveLength(2);
      expect(filtersWithAdditional.filteredItems.value.every(item => item.category === 'A')).toBe(true);
    });

    it('should return all items when filter is "all"', () => {
      const filtersWithAdditional = useFilters(items as Ref<TestItem[]>, {
        additionalFilters: {
          'category-a': (item) => item.category === 'A'
        }
      });

      filtersWithAdditional.setFilter('category-a');
      filtersWithAdditional.setFilter('all');
      
      expect(filtersWithAdditional.filteredItems.value).toEqual(items.value);
    });

    it('should not apply filter when filter function does not exist', () => {
      const filtersWithAdditional = useFilters(items as Ref<TestItem[]>, {
        additionalFilters: {
          'category-a': (item) => item.category === 'A'
        }
      });

      filtersWithAdditional.setFilter('non-existent');
      
      expect(filtersWithAdditional.filteredItems.value).toEqual(items.value);
    });
  });

  describe('combined search and filter', () => {
    it('should apply both search and filter', () => {
      const filtersWithBoth = useFilters(items as Ref<TestItem[]>, {
        searchFields: ['name'],
        additionalFilters: {
          'category-a': (item) => item.category === 'A'
        }
      });

      filtersWithBoth.setSearchQuery('Test');
      filtersWithBoth.setFilter('category-a');
      
      expect(filtersWithBoth.filteredItems.value).toHaveLength(1);
      expect(filtersWithBoth.filteredItems.value[0].name).toBe('Test');
    });
  });

  describe('view mode', () => {
    it('should set view mode to grid', () => {
      filters.setViewMode('grid');
      expect(filters.viewMode.value).toBe('grid');
    });

    it('should set view mode to list', () => {
      filters.setViewMode('list');
      expect(filters.viewMode.value).toBe('list');
    });
  });

  describe('clear filters', () => {
    it('should clear search query and reset filter', () => {
      const filtersWithFields = useFilters(items as Ref<TestItem[]>, {
        searchFields: ['name'],
        additionalFilters: {
          'category-a': (item) => item.category === 'A'
        }
      });

      filtersWithFields.setSearchQuery('Test');
      filtersWithFields.setFilter('category-a');
      filtersWithFields.clearFilters();
      
      expect(filtersWithFields.searchQuery.value).toBe('');
      expect(filtersWithFields.currentFilter.value).toBe('all');
      expect(filtersWithFields.filteredItems.value).toEqual(items.value);
    });
  });

  describe('update filters', () => {
    it('should update search term', () => {
      filters.updateFilters({ searchTerm: 'Test' });
      
      expect(filters.searchQuery.value).toBe('Test');
    });

    it('should update filter', () => {
      const filtersWithAdditional = useFilters(items as Ref<TestItem[]>, {
        additionalFilters: {
          'category-a': (item) => item.category === 'A'
        }
      });

      filtersWithAdditional.updateFilters({ filter: 'category-a' });
      
      expect(filtersWithAdditional.currentFilter.value).toBe('category-a');
    });

    it('should update both search term and filter', () => {
      const filtersWithBoth = useFilters(items as Ref<TestItem[]>, {
        searchFields: ['name'],
        additionalFilters: {
          'category-a': (item) => item.category === 'A'
        }
      });

      filtersWithBoth.updateFilters({ 
        searchTerm: 'Test',
        filter: 'category-a'
      });
      
      expect(filtersWithBoth.searchQuery.value).toBe('Test');
      expect(filtersWithBoth.currentFilter.value).toBe('category-a');
    });
  });

  describe('reactivity', () => {
    it('should update filtered items when source items change', () => {
      const newItems = [
        { id: 5, name: 'New Item', description: 'New description', category: 'D' }
      ];
      
      items.value = newItems;
      
      expect(filters.filteredItems.value).toEqual(newItems);
    });

    it('should maintain filter state when items change', () => {
      const filtersWithFields = useFilters(items as Ref<TestItem[]>, {
        searchFields: ['name']
      });

      filtersWithFields.setSearchQuery('Item');
      
      const newItems = [
        { id: 5, name: 'Item 5', description: 'New description', category: 'D' },
        { id: 6, name: 'Other', description: 'Another description', category: 'E' }
      ];
      
      items.value = newItems;
      
      expect(filtersWithFields.filteredItems.value).toHaveLength(1); // Só "Item 5"
    });
  });
}); 