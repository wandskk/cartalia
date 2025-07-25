import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useTradeFilters } from '../../../composables/useTradeFilters';
import type { Trade } from '../../../types';

describe('useTradeFilters', () => {
  let trades: ReturnType<typeof ref<Trade[]>>;
  let tradeFilters: ReturnType<typeof useTradeFilters>;

  beforeEach(() => {
    trades = ref<Trade[]>([
      {
        id: '1',
        userId: 'user1',
        user: { name: 'User 1' },
        createdAt: new Date().toISOString(),
        tradeCards: [
          {
            id: '1',
            cardId: 'card1',
            tradeId: '1',
            card: {
              id: 'card1',
              name: 'Card 1',
              description: 'First card',
              imageUrl: 'image1.jpg',
              createdAt: new Date().toISOString()
            },
            type: 'OFFERING'
          }
        ]
      },
      {
        id: '2',
        userId: 'user2',
        user: { name: 'User 2' },
        createdAt: new Date().toISOString(),
        tradeCards: [
          {
            id: '2',
            cardId: 'card2',
            tradeId: '2',
            card: {
              id: 'card2',
              name: 'Test Card',
              description: 'Test description',
              imageUrl: 'image2.jpg',
              createdAt: new Date().toISOString()
            },
            type: 'RECEIVING'
          }
        ]
      }
    ]);
    
    tradeFilters = useTradeFilters(trades as any);
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(tradeFilters.searchTerm.value).toBe('');
      expect(tradeFilters.filteredTrades.value).toEqual(trades.value);
    });
  });

  describe('search functionality', () => {
    it('should filter trades by card name', () => {
      tradeFilters.updateFilters({ searchTerm: 'Test' });
      
      expect(tradeFilters.filteredTrades.value).toHaveLength(1);
      expect(tradeFilters.filteredTrades.value[0].tradeCards[0].card.name).toBe('Test Card');
    });

    it('should filter trades by card description', () => {
      tradeFilters.updateFilters({ searchTerm: 'First' });
      
      expect(tradeFilters.filteredTrades.value).toHaveLength(1);
      expect(tradeFilters.filteredTrades.value[0].tradeCards[0].card.description).toBe('First card');
    });

    it('should be case insensitive', () => {
      tradeFilters.updateFilters({ searchTerm: 'test' });
      
      expect(tradeFilters.filteredTrades.value).toHaveLength(1);
      expect(tradeFilters.filteredTrades.value[0].tradeCards[0].card.name).toBe('Test Card');
    });

    it('should return all trades when search term is empty', () => {
      tradeFilters.updateFilters({ searchTerm: 'Test' });
      tradeFilters.updateFilters({ searchTerm: '' });
      
      expect(tradeFilters.filteredTrades.value).toEqual(trades.value);
    });

    it('should search across multiple trade cards', () => {
      const tradeWithMultipleCards: Trade = {
        id: '3',
        userId: 'user3',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tradeCards: [
          {
            id: '3',
            card: {
              id: 'card3',
              name: 'Card 3',
              description: 'Third card',
              imageUrl: 'image3.jpg',
              createdAt: new Date().toISOString()
            },
            type: 'OFFERING'
          },
          {
            id: '4',
            card: {
              id: 'card4',
              name: 'Another Card',
              description: 'Fourth card',
              imageUrl: 'image4.jpg',
              createdAt: new Date().toISOString()
            },
            type: 'RECEIVING'
          }
        ]
      };
      
      trades.value = [tradeWithMultipleCards];
      
      tradeFilters.updateFilters({ searchTerm: 'Another' });
      
      expect(tradeFilters.filteredTrades.value).toHaveLength(1);
    });
  });

  describe('update filters', () => {
    it('should update search term', () => {
      tradeFilters.updateFilters({ searchTerm: 'New Search' });
      
      expect(tradeFilters.searchTerm.value).toBe('New Search');
    });

    it('should update search term multiple times', () => {
      tradeFilters.updateFilters({ searchTerm: 'First' });
      tradeFilters.updateFilters({ searchTerm: 'Second' });
      
      expect(tradeFilters.searchTerm.value).toBe('Second');
    });
  });

  describe('reset filters', () => {
    it('should reset search term to empty', () => {
      tradeFilters.updateFilters({ searchTerm: 'Test' });
      tradeFilters.resetFilters();
      
      expect(tradeFilters.searchTerm.value).toBe('');
      expect(tradeFilters.filteredTrades.value).toEqual(trades.value);
    });
  });

  describe('reactivity', () => {
    it('should update filtered trades when source trades change', () => {
      const newTrades: Trade[] = [
        {
          id: '3',
          userId: 'user3',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tradeCards: [
            {
              id: '3',
              card: {
                id: 'card3',
                name: 'New Card',
                description: 'New description',
                imageUrl: 'image3.jpg',
                createdAt: new Date().toISOString()
              },
              type: 'OFFERING'
            }
          ]
        }
      ];
      
      trades.value = newTrades;
      
      expect(tradeFilters.filteredTrades.value).toEqual(newTrades);
    });

    it('should maintain filter state when trades change', () => {
      tradeFilters.updateFilters({ searchTerm: 'Card' });
      
      const newTrades: Trade[] = [
        {
          id: '3',
          userId: 'user3',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tradeCards: [
            {
              id: '3',
              card: {
                id: 'card3',
                name: 'Card 3',
                description: 'Third card',
                imageUrl: 'image3.jpg',
                createdAt: new Date().toISOString()
              },
              type: 'OFFERING'
            }
          ]
        },
        {
          id: '4',
          userId: 'user4',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tradeCards: [
            {
              id: '4',
              card: {
                id: 'card4',
                name: 'Other Item',
                description: 'Other description',
                imageUrl: 'image4.jpg',
                createdAt: new Date().toISOString()
              },
              type: 'OFFERING'
            }
          ]
        }
      ];
      
      trades.value = newTrades;
      
      expect(tradeFilters.filteredTrades.value).toHaveLength(1);
      expect(tradeFilters.filteredTrades.value[0].tradeCards[0].card.name).toBe('Card 3');
    });
  });
}); 