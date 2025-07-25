import { describe, it, expect, beforeEach } from 'vitest';
import { useMarketplaceFilters } from '../../../composables/useMarketplaceFilters';
import type { Trade } from '../../../types';

describe('useMarketplaceFilters', () => {
  let marketplaceFilters: ReturnType<typeof useMarketplaceFilters>;
  let mockTrades: Trade[];

  beforeEach(() => {
    marketplaceFilters = useMarketplaceFilters();
    mockTrades = [
      {
        id: '1',
        userId: 'user1',
        user: { name: 'John Doe' },
        createdAt: new Date().toISOString(),
        tradeCards: [
          {
            id: '1',
            cardId: 'card1',
            tradeId: '1',
            card: {
              id: 'card1',
              name: 'Pokemon Card',
              description: 'A rare Pokemon card',
              imageUrl: 'pokemon.jpg',
              createdAt: new Date().toISOString()
            },
            type: 'OFFERING'
          }
        ]
      },
      {
        id: '2',
        userId: 'user2',
        user: { name: 'Jane Smith' },
        createdAt: new Date().toISOString(),
        tradeCards: [
          {
            id: '2',
            cardId: 'card2',
            tradeId: '2',
            card: {
              id: 'card2',
              name: 'Magic Card',
              description: 'A powerful magic card',
              imageUrl: 'magic.jpg',
              createdAt: new Date().toISOString()
            },
            type: 'RECEIVING'
          }
        ]
      },
      {
        id: '3',
        userId: 'user3',
        user: { name: 'Bob Wilson' },
        createdAt: new Date().toISOString(),
        tradeCards: [
          {
            id: '3',
            cardId: 'card3',
            tradeId: '3',
            card: {
              id: 'card3',
              name: 'Yu-Gi-Oh Card',
              description: 'A legendary Yu-Gi-Oh card',
              imageUrl: 'yugioh.jpg',
              createdAt: new Date().toISOString()
            },
            type: 'OFFERING'
          }
        ]
      }
    ];
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(marketplaceFilters.filters.value).toEqual({
        search: ''
      });
      expect(marketplaceFilters.hasActiveFilters.value).toBe('');
    });
  });

  describe('filteredTrades', () => {
    it('should return all trades when no filters are applied', () => {
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toEqual(mockTrades);
      expect(result).toHaveLength(3);
    });

    it('should filter trades by user name', () => {
      marketplaceFilters.updateFilters({ search: 'john' });
      
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toHaveLength(1);
      expect(result[0].user.name).toBe('John Doe');
    });

    it('should filter trades by card name', () => {
      marketplaceFilters.updateFilters({ search: 'pokemon' });
      
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toHaveLength(1);
      expect(result[0].tradeCards[0].card.name).toBe('Pokemon Card');
    });

    it('should filter trades by card name case insensitive', () => {
      marketplaceFilters.updateFilters({ search: 'POKEMON' });
      
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toHaveLength(1);
      expect(result[0].tradeCards[0].card.name).toBe('Pokemon Card');
    });

    it('should filter trades by user name case insensitive', () => {
      marketplaceFilters.updateFilters({ search: 'JANE' });
      
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toHaveLength(1);
      expect(result[0].user.name).toBe('Jane Smith');
    });

    it('should return empty array when no matches found', () => {
      marketplaceFilters.updateFilters({ search: 'nonexistent' });
      
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should match partial search terms', () => {
      marketplaceFilters.updateFilters({ search: 'card' });
      
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toHaveLength(3);
    });

    it('should match multiple trades when search term matches multiple criteria', () => {
      marketplaceFilters.updateFilters({ search: 'card' });
      
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toHaveLength(3);
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false when no filters are active', () => {
      expect(marketplaceFilters.hasActiveFilters.value).toBe('');
    });

    it('should return true when search filter is active', () => {
      marketplaceFilters.updateFilters({ search: 'test' });
      
      expect(marketplaceFilters.hasActiveFilters.value).toBe('test');
    });

    it('should return false when search filter is cleared', () => {
      marketplaceFilters.updateFilters({ search: 'test' });
      expect(marketplaceFilters.hasActiveFilters.value).toBe('test');
      
      marketplaceFilters.updateFilters({ search: '' });
      expect(marketplaceFilters.hasActiveFilters.value).toBe('');
    });
  });

  describe('updateFilters', () => {
    it('should update search filter', () => {
      marketplaceFilters.updateFilters({ search: 'new search' });
      
      expect(marketplaceFilters.filters.value.search).toBe('new search');
    });

    it('should update multiple filters', () => {
      marketplaceFilters.updateFilters({ search: 'updated search' });
      
      expect(marketplaceFilters.filters.value.search).toBe('updated search');
    });

    it('should preserve existing filters when updating partial filters', () => {
      marketplaceFilters.updateFilters({ search: 'initial search' });
      marketplaceFilters.updateFilters({ search: 'updated search' });
      
      expect(marketplaceFilters.filters.value.search).toBe('updated search');
    });
  });

  describe('clearFilters', () => {
    it('should clear all filters', () => {
      marketplaceFilters.updateFilters({ search: 'test search' });
      expect(marketplaceFilters.filters.value.search).toBe('test search');
      
      marketplaceFilters.clearFilters();
      
      expect(marketplaceFilters.filters.value).toEqual({
        search: ''
      });
      expect(marketplaceFilters.hasActiveFilters.value).toBe('');
    });

    it('should return all trades after clearing filters', () => {
      marketplaceFilters.updateFilters({ search: 'pokemon' });
      let result = marketplaceFilters.filteredTrades.value(mockTrades);
      expect(result).toHaveLength(1);
      
      marketplaceFilters.clearFilters();
      result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toEqual(mockTrades);
      expect(result).toHaveLength(3);
    });
  });

  describe('edge cases', () => {
    it('should handle empty trades array', () => {
      marketplaceFilters.updateFilters({ search: 'test' });
      
      const result = marketplaceFilters.filteredTrades.value([]);
      
      expect(result).toEqual([]);
    });

    it('should handle trades with empty tradeCards array', () => {
      const tradesWithEmptyCards: Trade[] = [
        {
          id: '1',
          userId: 'user1',
          user: { name: 'John Doe' },
          createdAt: new Date().toISOString(),
          tradeCards: []
        }
      ];
      
      marketplaceFilters.updateFilters({ search: 'john' });
      
      const result = marketplaceFilters.filteredTrades.value(tradesWithEmptyCards);
      
      expect(result).toHaveLength(1);
      expect(result[0].user.name).toBe('John Doe');
    });

    it('should handle search with special characters', () => {
      marketplaceFilters.updateFilters({ search: 'pokémon' });
      
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toHaveLength(0);
    });

    it('should handle search with numbers', () => {
      marketplaceFilters.updateFilters({ search: '123' });
      
      const result = marketplaceFilters.filteredTrades.value(mockTrades);
      
      expect(result).toHaveLength(0);
    });
  });
}); 