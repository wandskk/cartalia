import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSearch } from '../../../composables/useSearch';
import { createMockCard } from '../../mocks/data';

describe('useSearch', () => {
  let search: ReturnType<typeof useSearch>;
  const mockCards = [
    createMockCard({ id: 'card-1', name: 'Blue Dragon', description: 'A powerful dragon' }),
    createMockCard({ id: 'card-2', name: 'Dark Magician', description: 'A magical wizard' }),
    createMockCard({ id: 'card-3', name: 'Red Dragon', description: 'A fierce dragon' })
  ];

  beforeEach(() => {
    search = useSearch();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(search.searchQuery.value).toBe('');
      expect(search.debouncedQuery.value).toBe('');
      expect(search.isSearching.value).toBe(false);
      expect(search.isValidQuery.value).toBe(true);
      expect(search.hasQuery.value).toBe(false);
      expect(search.isEmpty.value).toBe(true);
    });

    it('should initialize with custom options', () => {
      const customSearch = useSearch({
        debounceMs: 1000,
        initialQuery: 'test',
        minLength: 2,
        maxLength: 50
      });

      expect(customSearch.searchQuery.value).toBe('test');
      expect(customSearch.debouncedQuery.value).toBe('test');
      expect(customSearch.hasQuery.value).toBe(true);
      expect(customSearch.isEmpty.value).toBe(false);
    });
  });

  describe('query management', () => {
    it('should set query', () => {
      search.setQuery('dragon');
      
      expect(search.searchQuery.value).toBe('dragon');
      expect(search.hasQuery.value).toBe(true);
      expect(search.isEmpty.value).toBe(false);
    });

    it('should clear query', () => {
      search.setQuery('dragon');
      search.clearQuery();
      
      expect(search.searchQuery.value).toBe('');
      expect(search.hasQuery.value).toBe(false);
      expect(search.isEmpty.value).toBe(true);
    });

    it('should update query', () => {
      search.updateQuery('magic');
      
      expect(search.searchQuery.value).toBe('magic');
    });

    it('should validate query length', () => {
      const shortSearch = useSearch({ minLength: 3, maxLength: 10 });
      
      // Too short
      shortSearch.setQuery('ab');
      expect(shortSearch.isValidQuery.value).toBe(false);
      
      // Valid length
      shortSearch.setQuery('abc');
      expect(shortSearch.isValidQuery.value).toBe(true);
      
      // Too long
      shortSearch.setQuery('abcdefghijk');
      expect(shortSearch.isValidQuery.value).toBe(false);
    });
  });

  describe('search state management', () => {
    it('should start and stop search', () => {
      expect(search.isSearching.value).toBe(false);
      
      search.startSearch();
      expect(search.isSearching.value).toBe(true);
      
      search.stopSearch();
      expect(search.isSearching.value).toBe(false);
    });

    it('should reset search', () => {
      search.setQuery('test');
      search.startSearch();
      
      search.resetSearch();
      
      expect(search.searchQuery.value).toBe('');
      expect(search.debouncedQuery.value).toBe('');
      expect(search.isSearching.value).toBe(false);
      expect(search.hasQuery.value).toBe(false);
      expect(search.isEmpty.value).toBe(true);
    });
  });

  describe('debouncing', () => {
    it('should debounce query changes', async () => {
      vi.useFakeTimers();

      search.setQuery('dragon');
      expect(search.debouncedQuery.value).toBe('');

      vi.advanceTimersByTime(500);
      await vi.runAllTimersAsync();

      expect(search.debouncedQuery.value).toBe('dragon');

      vi.useRealTimers();
    });

    it('should use custom debounce time', async () => {
      const customSearch = useSearch({ debounceMs: 500 });
      vi.useFakeTimers();

      customSearch.setQuery('magic');
      expect(customSearch.debouncedQuery.value).toBe('');

      vi.advanceTimersByTime(500);
      await vi.runAllTimersAsync();
      expect(customSearch.debouncedQuery.value).toBe('magic');

      vi.useRealTimers();
    });
  });

  describe('filterByQuery', () => {
    it('should filter items by query', () => {
      search.setQuery('dragon');
      
      const filtered = search.filterByQuery(mockCards, ['name', 'description'], 'dragon');
      
      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe('Blue Dragon');
      expect(filtered[1].name).toBe('Red Dragon');
    });

    it('should filter case-insensitive', () => {
      search.setQuery('DRAGON');
      
      const filtered = search.filterByQuery(mockCards, ['name'], 'DRAGON');
      
      expect(filtered).toHaveLength(2);
    });

    it('should filter by multiple fields', () => {
      search.setQuery('magical');
      
      const filtered = search.filterByQuery(mockCards, ['name', 'description'], 'magical');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Dark Magician');
    });

    it('should return empty array for no matches', () => {
      search.setQuery('nonexistent');
      
      const filtered = search.filterByQuery(mockCards, ['name'], 'nonexistent');
      
      expect(filtered).toHaveLength(0);
    });

    it('should return all items for empty query', () => {
      search.setQuery('');
      
      const filtered = search.filterByQuery(mockCards, ['name'], '');
      
      expect(filtered).toHaveLength(3);
    });

    it('should handle partial matches', () => {
      search.setQuery('drag');
      
      const filtered = search.filterByQuery(mockCards, ['name'], 'drag');
      
      expect(filtered).toHaveLength(2);
    });
  });

  describe('performSearch', () => {
    it('should perform async search', async () => {
      const mockSearchFunction = vi.fn().mockResolvedValue([mockCards[0]]);
      
      search.setQuery('dragon');
      const result = await search.performSearch(mockSearchFunction, 'dragon');
      
      expect(mockSearchFunction).toHaveBeenCalledWith('dragon');
      expect(result).toEqual([mockCards[0]]);
    });

    it('should handle search errors', async () => {
      const mockSearchFunction = vi.fn().mockRejectedValue(new Error('Search failed'));
      
      search.setQuery('dragon');
      
      await expect(search.performSearch(mockSearchFunction, 'dragon')).rejects.toThrow('Search failed');
    });

    it('should use custom query parameter', async () => {
      const mockSearchFunction = vi.fn().mockResolvedValue([]);
      
      await search.performSearch(mockSearchFunction, 'custom-query');
      
      expect(mockSearchFunction).toHaveBeenCalledWith('custom-query');
    });
  });

  describe('computed properties', () => {
    it('should update hasQuery correctly', () => {
      expect(search.hasQuery.value).toBe(false);
      
      search.setQuery('test');
      expect(search.hasQuery.value).toBe(true);
      
      search.setQuery('   '); // Only whitespace
      expect(search.hasQuery.value).toBe(false);
    });

    it('should update isEmpty correctly', () => {
      expect(search.isEmpty.value).toBe(true);
      
      search.setQuery('test');
      expect(search.isEmpty.value).toBe(false);
      
      search.clearQuery();
      expect(search.isEmpty.value).toBe(true);
    });

    it('should update isValidQuery correctly', () => {
      const customSearch = useSearch({ minLength: 2, maxLength: 10 });

      expect(customSearch.isValidQuery.value).toBe(false); // Empty is not valid when minLength is 2

      customSearch.setQuery('a'); // Too short
      expect(customSearch.isValidQuery.value).toBe(false);

      customSearch.setQuery('ab'); // Valid length
      expect(customSearch.isValidQuery.value).toBe(true);

      customSearch.setQuery('abcdefghijk'); // Too long
      expect(customSearch.isValidQuery.value).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined query', () => {
      expect(() => search.setQuery(undefined as any)).not.toThrow();
      expect(search.searchQuery.value).toBe('');
    });

    it('should handle null query', () => {
      expect(() => search.setQuery(null as any)).not.toThrow();
      expect(search.searchQuery.value).toBe('');
    });

    it('should handle empty array in filterByQuery', () => {
      search.setQuery('test');
      
      const filtered = search.filterByQuery([], ['name'], 'test');
      
      expect(filtered).toEqual([]);
    });

    it('should handle items without specified fields', () => {
      const items = [
        { id: '1', title: 'Test' },
        { id: '2', name: 'Test' }
      ];
      
      search.setQuery('test');
      
      const filtered = search.filterByQuery(items, ['name'], 'test');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('2');
    });
  });
}); 