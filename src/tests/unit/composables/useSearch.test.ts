import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSearch } from '../../../composables/useSearch';
import { mockCards } from '../../mocks/data';

describe('useSearch', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with empty query', () => {
    const search = useSearch();
    
    expect(search.searchQuery.value).toBe('');
    expect(search.isSearching.value).toBe(false);
    expect(search.hasQuery.value).toBe(false);
  });

  it('should update query', () => {
    const search = useSearch();
    
    search.setQuery('test');
    
    expect(search.searchQuery.value).toBe('test');
  });

  it('should clear query', () => {
    const search = useSearch();
    
    search.setQuery('test');
    search.clearQuery();
    
    expect(search.searchQuery.value).toBe('');
  });

  it('should filter cards by query', () => {
    const search = useSearch();
    
    search.setQuery('Blue');
    const results = search.filterByQuery(mockCards, ['name'], 'Blue');
    
    expect(results).toHaveLength(1);
    expect(results[0].name).toContain('Blue');
  });

  it('should return empty results for no match', () => {
    const search = useSearch();
    
    search.setQuery('nonexistent');
    const results = search.filterByQuery(mockCards, ['name'], 'nonexistent');
    
    expect(results).toHaveLength(0);
  });
}); 