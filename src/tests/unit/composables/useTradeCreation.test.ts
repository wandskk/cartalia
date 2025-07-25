import { describe, it, expect, beforeEach, vi } from 'vitest';


const mockRouter = {
  push: vi.fn()
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}));


const mockCardsStore = {
  userCards: [],
  allCards: [],
  loading: false,
  error: null,
  fetchUserCards: vi.fn(),
  fetchAllCards: vi.fn()
};

const mockTradesStore = {
  createTrade: vi.fn()
};

const mockNotificationStore = {
  show: vi.fn()
};

vi.mock('../../../stores/cards', () => ({
  useCardsStore: () => mockCardsStore
}));

vi.mock('../../../stores/trades', () => ({
  useTradesStore: () => mockTradesStore
}));

vi.mock('../../../stores/notification', () => ({
  useNotificationStore: () => mockNotificationStore
}));

import { useTradeCreation } from '../../../composables/useTradeCreation';

describe('useTradeCreation', () => {
  let tradeCreation: ReturnType<typeof useTradeCreation>;

  beforeEach(() => {
    tradeCreation = useTradeCreation();
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(tradeCreation.offeringCards.value).toEqual([]);
      expect(tradeCreation.receivingCards.value).toEqual([]);
      expect(tradeCreation.creatingTrade.value).toBe(false);
    });
  });

  describe('computed properties', () => {
    it('should expose userCards from cards store', async () => {
      const { useCardsStore } = await import('../../../stores/cards');
      const mockCardsStore = useCardsStore();
      
      mockCardsStore.userCards = [
        { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      expect(tradeCreation.userCards.value).toEqual(mockCardsStore.userCards);
    });

    it('should expose allCards from cards store', async () => {
      const { useCardsStore } = await import('../../../stores/cards');
      const mockCardsStore = useCardsStore();
      
      mockCardsStore.allCards = [
        { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      expect(tradeCreation.allCards.value).toEqual(mockCardsStore.allCards);
    });

    it('should expose loading states from cards store', async () => {
      const { useCardsStore } = await import('../../../stores/cards');
      const mockCardsStore = useCardsStore();
      
      mockCardsStore.loading = true;
      
      expect(tradeCreation.loadingUserCards.value).toBe(true);
      expect(tradeCreation.loadingAllCards.value).toBe(true);
    });

    it('should expose error states from cards store', async () => {
      const { useCardsStore } = await import('../../../stores/cards');
      const mockCardsStore = useCardsStore();
      
      mockCardsStore.error = 'Test error';
      
      expect(tradeCreation.userCardsError.value).toBe('Test error');
      expect(tradeCreation.allCardsError.value).toBe('Test error');
    });
  });

  describe('fetchUserCards', () => {
    it('should call cards store fetchUserCards', async () => {
      const { useCardsStore } = await import('../../../stores/cards');
      const mockCardsStore = useCardsStore();
      
      vi.mocked(mockCardsStore.fetchUserCards).mockResolvedValue(undefined);
      
      await tradeCreation.fetchUserCards();
      
      expect(mockCardsStore.fetchUserCards).toHaveBeenCalledOnce();
    });
  });

  describe('fetchAllCards', () => {
    it('should call cards store fetchAllCards', async () => {
      const { useCardsStore } = await import('../../../stores/cards');
      const mockCardsStore = useCardsStore();
      
      vi.mocked(mockCardsStore.fetchAllCards).mockResolvedValue(undefined);
      
      await tradeCreation.fetchAllCards();
      
      expect(mockCardsStore.fetchAllCards).toHaveBeenCalledOnce();
    });
  });

  describe('updateOfferingCards', () => {
    it('should update offering cards', () => {
      const cards = [
        { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      tradeCreation.updateOfferingCards(cards);
      
      expect(tradeCreation.offeringCards.value).toEqual(cards);
    });
  });

  describe('updateReceivingCards', () => {
    it('should update receiving cards', () => {
      const cards = [
        { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      tradeCreation.updateReceivingCards(cards);
      
      expect(tradeCreation.receivingCards.value).toEqual(cards);
    });
  });

  describe('resetSelection', () => {
    it('should reset both offering and receiving cards', () => {
      tradeCreation.offeringCards.value = [
        { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      tradeCreation.receivingCards.value = [
        { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      tradeCreation.resetSelection();
      
      expect(tradeCreation.offeringCards.value).toEqual([]);
      expect(tradeCreation.receivingCards.value).toEqual([]);
    });
  });

  describe('handleCreateTrade', () => {
    it('should create trade successfully', async () => {
      const { useTradesStore } = await import('../../../stores/trades');
      const { useRouter } = await import('vue-router');
      
      const mockTradesStore = useTradesStore();
      const mockRouter = useRouter();
      
      vi.mocked(mockTradesStore.createTrade).mockResolvedValue(undefined);
      
      const offeringCard = { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      const receivingCard = { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      
      tradeCreation.offeringCards.value = [offeringCard];
      tradeCreation.receivingCards.value = [receivingCard];
      
      await tradeCreation.handleCreateTrade();
      
      expect(mockTradesStore.createTrade).toHaveBeenCalledWith({
        cards: [
          { cardId: '1', type: 'OFFERING' },
          { cardId: '2', type: 'RECEIVING' }
        ]
      });
      expect(mockNotificationStore.show).toHaveBeenCalledWith('Troca criada com sucesso!', 'success');
      expect(mockRouter.push).toHaveBeenCalledWith('/my-trades');
      expect(tradeCreation.creatingTrade.value).toBe(false);
    });

    it('should show error when no offering cards selected', async () => {
      const { useNotificationStore } = await import('../../../stores/notification');
      const mockNotification = useNotificationStore();
      
      tradeCreation.offeringCards.value = [];
      tradeCreation.receivingCards.value = [
        { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      await tradeCreation.handleCreateTrade();
      
      expect(mockNotification.show).toHaveBeenCalledWith(
        'Selecione pelo menos uma carta para oferecer e uma para receber',
        'error'
      );
      expect(tradeCreation.creatingTrade.value).toBe(false);
    });

    it('should show error when no receiving cards selected', async () => {
      const { useNotificationStore } = await import('../../../stores/notification');
      const mockNotification = useNotificationStore();
      
      tradeCreation.offeringCards.value = [
        { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      tradeCreation.receivingCards.value = [];
      
      await tradeCreation.handleCreateTrade();
      
      expect(mockNotification.show).toHaveBeenCalledWith(
        'Selecione pelo menos uma carta para oferecer e uma para receber',
        'error'
      );
      expect(tradeCreation.creatingTrade.value).toBe(false);
    });

    it('should handle trade creation error', async () => {
      const { useTradesStore } = await import('../../../stores/trades');
      const { useNotificationStore } = await import('../../../stores/notification');
      
      const mockTradesStore = useTradesStore();
      const mockNotification = useNotificationStore();
      
      const mockError = new Error('Failed to create trade');
      vi.mocked(mockTradesStore.createTrade).mockRejectedValue(mockError);
      
      const offeringCard = { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      const receivingCard = { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      
      tradeCreation.offeringCards.value = [offeringCard];
      tradeCreation.receivingCards.value = [receivingCard];
      
      await tradeCreation.handleCreateTrade();
      
      expect(mockNotification.show).toHaveBeenCalledWith('Failed to create trade', 'error');
      expect(tradeCreation.creatingTrade.value).toBe(false);
    });

    it('should handle trade creation error without message', async () => {
      const { useTradesStore } = await import('../../../stores/trades');
      const { useNotificationStore } = await import('../../../stores/notification');
      
      const mockTradesStore = useTradesStore();
      const mockNotification = useNotificationStore();
      
      const mockError = new Error();
      vi.mocked(mockTradesStore.createTrade).mockRejectedValue(mockError);
      
      const offeringCard = { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      const receivingCard = { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      
      tradeCreation.offeringCards.value = [offeringCard];
      tradeCreation.receivingCards.value = [receivingCard];
      
      await tradeCreation.handleCreateTrade();
      
      expect(mockNotification.show).toHaveBeenCalledWith('Erro ao criar troca', 'error');
      expect(tradeCreation.creatingTrade.value).toBe(false);
    });

    it('should set creatingTrade state during trade creation', async () => {
      const { useTradesStore } = await import('../../../stores/trades');
      
      const mockTradesStore = useTradesStore();
      vi.mocked(mockTradesStore.createTrade).mockImplementation(() => {
        expect(tradeCreation.creatingTrade.value).toBe(true);
        return Promise.resolve(undefined);
      });
      
      const offeringCard = { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      const receivingCard = { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() };
      
      tradeCreation.offeringCards.value = [offeringCard];
      tradeCreation.receivingCards.value = [receivingCard];
      
      await tradeCreation.handleCreateTrade();
      
      expect(tradeCreation.creatingTrade.value).toBe(false);
    });

    it('should handle multiple offering and receiving cards', async () => {
      const { useTradesStore } = await import('../../../stores/trades');
      const mockTradesStore = useTradesStore();
      
      vi.mocked(mockTradesStore.createTrade).mockResolvedValue(undefined);
      
      const offeringCards = [
        { id: '1', name: 'Card 1', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() },
        { id: '2', name: 'Card 2', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      const receivingCards = [
        { id: '3', name: 'Card 3', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() },
        { id: '4', name: 'Card 4', description: 'Test', imageUrl: 'test.jpg', createdAt: new Date().toISOString() }
      ];
      
      tradeCreation.offeringCards.value = offeringCards;
      tradeCreation.receivingCards.value = receivingCards;
      
      await tradeCreation.handleCreateTrade();
      
      expect(mockTradesStore.createTrade).toHaveBeenCalledWith({
        cards: [
          { cardId: '1', type: 'OFFERING' },
          { cardId: '2', type: 'OFFERING' },
          { cardId: '3', type: 'RECEIVING' },
          { cardId: '4', type: 'RECEIVING' }
        ]
      });
    });
  });
}); 