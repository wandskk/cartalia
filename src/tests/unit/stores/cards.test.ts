import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCardsStore } from '../../../stores/cards';

// Mock dos serviços
vi.mock('../../../services/modules/cards', () => ({
  CardServices: {
    getAllCards: vi.fn(),
    getUserCards: vi.fn(),
    getCardById: vi.fn(),
    addCardsToUser: vi.fn()
  }
}));

describe('useCardsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const cardsStore = useCardsStore();
      
      expect(cardsStore.allCards).toEqual([]);
      expect(cardsStore.userCards).toEqual([]);
      expect(cardsStore.selectedCard).toBeNull();
      expect(cardsStore.loading).toBe(false);
      expect(cardsStore.error).toBeNull();
      expect(cardsStore.totalCards).toBe(0);
      expect(cardsStore.hasUserCards).toBe(false);
      expect(cardsStore.totalUserCards).toBe(0);
    });
  });

  describe('computed properties', () => {
    it('should compute hasUserCards correctly', () => {
      const cardsStore = useCardsStore();
      
      expect(cardsStore.hasUserCards).toBe(false);
      
      cardsStore.userCards = [{ id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }];
      
      expect(cardsStore.hasUserCards).toBe(true);
    });

    it('should compute totalUserCards correctly', () => {
      const cardsStore = useCardsStore();
      
      expect(cardsStore.totalUserCards).toBe(0);
      
      cardsStore.userCards = [
        { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() },
        { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      expect(cardsStore.totalUserCards).toBe(2);
    });
  });

  describe('fetchAllCards', () => {
    it('should fetch all cards successfully', async () => {
      const cardsStore = useCardsStore();
      const mockResponse = {
        list: [
          { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
        ],
        page: 1,
        rpp: 12,
        more: false
      };
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.getAllCards).mockResolvedValue(mockResponse);
      
      await cardsStore.fetchAllCards();
      
      expect(cardsStore.allCards).toEqual(mockResponse.list);
      expect(cardsStore.loading).toBe(false);
      expect(cardsStore.error).toBeNull();
      expect(cardsStore.pagination.page).toBe(1);
      expect(cardsStore.pagination.rpp).toBe(12);
      expect(cardsStore.pagination.more).toBe(false);
    });

    it('should handle error when fetching all cards fails', async () => {
      const cardsStore = useCardsStore();
      const mockError = new Error('Failed to fetch cards');
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.getAllCards).mockRejectedValue(mockError);
      
      await cardsStore.fetchAllCards();
      
      expect(cardsStore.error).toBe('Failed to fetch cards');
      expect(cardsStore.loading).toBe(false);
    });

    it('should fetch all cards with search parameter', async () => {
      const cardsStore = useCardsStore();
      const mockResponse = {
        list: [],
        page: 1,
        rpp: 12,
        more: false
      };
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.getAllCards).mockResolvedValue(mockResponse);
      
      await cardsStore.fetchAllCards(1, 12, 'test');
      
      expect(CardServices.getAllCards).toHaveBeenCalledWith(1, 12, 'test');
    });
  });

  describe('fetchUserCards', () => {
    it('should fetch user cards successfully', async () => {
      const cardsStore = useCardsStore();
      const mockUserCards = [
        { id: '1', name: 'User Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.getUserCards).mockResolvedValue(mockUserCards);
      
      await cardsStore.fetchUserCards();
      
      expect(cardsStore.userCards).toEqual(mockUserCards);
      expect(cardsStore.loading).toBe(false);
      expect(cardsStore.error).toBeNull();
      expect(cardsStore.userCardsPagination.total).toBe(1);
    });

    it('should handle error when fetching user cards fails', async () => {
      const cardsStore = useCardsStore();
      const mockError = new Error('Failed to fetch user cards');
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.getUserCards).mockRejectedValue(mockError);
      
      await cardsStore.fetchUserCards();
      
      expect(cardsStore.error).toBe('Failed to fetch user cards');
      expect(cardsStore.loading).toBe(false);
    });
  });

  describe('fetchCardById', () => {
    it('should fetch card by id successfully', async () => {
      const cardsStore = useCardsStore();
      const mockCard = { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.getCardById).mockResolvedValue(mockCard);
      
      await cardsStore.fetchCardById('1');
      
      expect(cardsStore.selectedCard).toEqual(mockCard);
      expect(cardsStore.loading).toBe(false);
      expect(cardsStore.error).toBeNull();
    });

    it('should handle error when fetching card by id fails', async () => {
      const cardsStore = useCardsStore();
      const mockError = new Error('Card not found');
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.getCardById).mockRejectedValue(mockError);
      
      await cardsStore.fetchCardById('999');
      
      expect(cardsStore.error).toBe('Card not found');
      expect(cardsStore.loading).toBe(false);
    });
  });

  describe('addCardsToUser', () => {
    it('should add cards to user successfully', async () => {
      const cardsStore = useCardsStore();
      const mockUserCards = [
        { id: '1', name: 'User Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.addCardsToUser).mockResolvedValue(undefined);
      vi.mocked(CardServices.getUserCards).mockResolvedValue(mockUserCards);
      
      await cardsStore.addCardsToUser(['1', '2']);
      
      expect(CardServices.addCardsToUser).toHaveBeenCalledWith(['1', '2']);
      expect(cardsStore.loading).toBe(false);
      expect(cardsStore.error).toBeNull();
    });

    it('should handle error when adding cards to user fails', async () => {
      const cardsStore = useCardsStore();
      const mockError = new Error('Failed to add cards');
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.addCardsToUser).mockRejectedValue(mockError);
      
      await cardsStore.addCardsToUser(['1']);
      
      expect(cardsStore.error).toBe('Failed to add cards');
      expect(cardsStore.loading).toBe(false);
    });
  });

  describe('fetchTotalCards', () => {
    it('should fetch total cards successfully', async () => {
      const cardsStore = useCardsStore();
      const mockResponse = {
        list: [
          { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() },
          { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
        ],
        page: 1,
        rpp: 1000,
        more: false
      };
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.getAllCards).mockResolvedValue(mockResponse);
      
      await cardsStore.fetchTotalCards();
      
      expect(cardsStore.totalCards).toBe(2);
    });

    it('should handle error when fetching total cards fails', async () => {
      const cardsStore = useCardsStore();
      const mockError = new Error('Failed to fetch total cards');
      
      const { CardServices } = await import('../../../services/modules/cards');
      vi.mocked(CardServices.getAllCards).mockRejectedValue(mockError);
      
      await cardsStore.fetchTotalCards();
      
      expect(cardsStore.totalCards).toBe(0);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const cardsStore = useCardsStore();
      
      cardsStore.error = 'Test error';
      cardsStore.clearError();
      
      expect(cardsStore.error).toBeNull();
    });
  });

  describe('clearSelectedCard', () => {
    it('should clear selected card', () => {
      const cardsStore = useCardsStore();
      
      cardsStore.selectedCard = { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      cardsStore.clearSelectedCard();
      
      expect(cardsStore.selectedCard).toBeNull();
    });
  });
}); 