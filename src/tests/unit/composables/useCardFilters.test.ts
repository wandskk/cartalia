import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';
import { useCardFilters } from '../../../composables/useCardFilters';
import type { Card } from '../../../types';

describe('useCardFilters', () => {
  let cards: ReturnType<typeof ref<Card[]>>;
  let cardFilters: ReturnType<typeof useCardFilters>;

  beforeEach(() => {
    cards = ref<Card[]>([
      {
        id: '1',
        name: 'Card 1',
        description: 'First card description',
        imageUrl: 'image1.jpg',
        createdAt: new Date().toISOString() // hoje
      },
      {
        id: '2',
        name: 'Card 2',
        description: 'Second card description',
        imageUrl: 'image2.jpg',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() // 25 dias atrás
      },
      {
        id: '3',
        name: 'Test Card',
        description: 'Test card description',
        imageUrl: 'image3.jpg',
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() // 40 dias atrás
      }
    ]);
    
    cardFilters = useCardFilters(cards as any);
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(cardFilters.searchQuery.value).toBe('');
      expect(cardFilters.currentFilter.value).toBe('all');
      expect(cardFilters.viewMode.value).toBe('grid');
      expect(cardFilters.filteredCards.value).toEqual(cards.value);
    });
  });

  describe('search functionality', () => {
    it('should filter cards by name', () => {
      cardFilters.setSearchQuery('Test');
      
      expect(cardFilters.filteredCards.value).toHaveLength(1);
      expect(cardFilters.filteredCards.value[0].name).toBe('Test Card');
    });

    it('should filter cards by description', () => {
      cardFilters.setSearchQuery('Second');
      
      expect(cardFilters.filteredCards.value).toHaveLength(1);
      expect(cardFilters.filteredCards.value[0].name).toBe('Card 2');
    });

    it('should be case insensitive', () => {
      cardFilters.setSearchQuery('card');
      
      expect(cardFilters.filteredCards.value).toHaveLength(3);
    });

    it('should return all cards when search query is empty', () => {
      cardFilters.setSearchQuery('Test');
      cardFilters.setSearchQuery('');
      
      expect(cardFilters.filteredCards.value).toEqual(cards.value);
    });
  });

  describe('recent filter', () => {
    it('should filter recent cards (last 30 days)', () => {
      cardFilters.setFilter('recent');
      
      expect(cardFilters.filteredCards.value).toHaveLength(2); // Card 1 and Test Card
      expect(cardFilters.filteredCards.value.every(card => 
        new Date(card.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      )).toBe(true);
    });
  });

  describe('view mode', () => {
    it('should set view mode to grid', () => {
      cardFilters.setViewMode('grid');
      expect(cardFilters.viewMode.value).toBe('grid');
    });

    it('should set view mode to list', () => {
      cardFilters.setViewMode('list');
      expect(cardFilters.viewMode.value).toBe('list');
    });
  });

  describe('clear filters', () => {
    it('should clear search query and reset filter', () => {
      cardFilters.setSearchQuery('Test');
      cardFilters.setFilter('recent');
      cardFilters.clearFilters();
      
      expect(cardFilters.searchQuery.value).toBe('');
      expect(cardFilters.currentFilter.value).toBe('all');
      expect(cardFilters.filteredCards.value).toEqual(cards.value);
    });
  });

  describe('recentCards computed', () => {
    it('should return cards from last 30 days', () => {
      const recentCards = cardFilters.recentCards.value;
      expect(Array.isArray(recentCards)).toBe(true);
      expect(recentCards).toHaveLength(2); // Card 1 e Card 2
      expect(recentCards.every((card: any) => 
        new Date(card.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      )).toBe(true);
    });
  });

  describe('reactivity', () => {
    it('should update filtered cards when source cards change', () => {
      const newCards: Card[] = [
        {
          id: '4',
          name: 'New Card',
          description: 'New card description',
          imageUrl: 'image4.jpg',
          createdAt: new Date().toISOString()
        }
      ];
      
      cards.value = newCards;
      
      expect(cardFilters.filteredCards.value).toEqual(newCards);
    });

    it('should maintain filter state when cards change', () => {
      cardFilters.setSearchQuery('Card');
      
      const newCards: Card[] = [
        {
          id: '4',
          name: 'Card 4',
          description: 'Fourth card description',
          imageUrl: 'image4.jpg',
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Other Item',
          description: 'Other description',
          imageUrl: 'image5.jpg',
          createdAt: new Date().toISOString()
        }
      ];
      
      cards.value = newCards;
      
      expect(cardFilters.filteredCards.value).toHaveLength(1);
      expect(cardFilters.filteredCards.value[0].name).toBe('Card 4');
    });
  });
}); 