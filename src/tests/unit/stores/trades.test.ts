import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTradesStore } from '../../../stores/trades';


vi.mock('../../../services/modules/trades', () => ({
  TradeServices: {
    getAllTrades: vi.fn(),
    createTrade: vi.fn(),
    deleteTrade: vi.fn()
  }
}));


vi.mock('../../../stores/auth', () => ({
  useAuthStore: () => ({
    user: { id: 'user1', name: 'Test User' }
  })
}));

vi.mock('../../../stores/loading', () => ({
  useLoadingStore: () => ({
    startLoading: vi.fn(),
    stopLoading: vi.fn()
  })
}));

describe('useTradesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const tradesStore = useTradesStore();
      
      expect(tradesStore.allTrades).toEqual([]);
      expect(tradesStore.loading).toBe(false);
      expect(tradesStore.error).toBeNull();
      expect(tradesStore.totalTrades).toBe(0);
      expect(tradesStore.totalUserTrades).toBe(0);
      expect(tradesStore.userTrades).toEqual([]);
    });
  });

  describe('computed properties', () => {
    it('should compute totalTrades correctly', () => {
      const tradesStore = useTradesStore();
      
      expect(tradesStore.totalTrades).toBe(0);
      
      tradesStore.allTrades = [
        { id: '1', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] },
        { id: '2', userId: 'user2', user: { name: 'User 2' }, createdAt: new Date().toISOString(), tradeCards: [] }
      ];
      
      expect(tradesStore.totalTrades).toBe(2);
    });

    it('should compute userTrades correctly', () => {
      const tradesStore = useTradesStore();
      
      tradesStore.allTrades = [
        { id: '1', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] },
        { id: '2', userId: 'user2', user: { name: 'User 2' }, createdAt: new Date().toISOString(), tradeCards: [] },
        { id: '3', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] }
      ];
      
      expect(tradesStore.userTrades).toHaveLength(2);
      expect(tradesStore.userTrades.every(trade => trade.userId === 'user1')).toBe(true);
    });

    it('should compute totalUserTrades correctly', () => {
      const tradesStore = useTradesStore();
      
      expect(tradesStore.totalUserTrades).toBe(0);
      
      tradesStore.allTrades = [
        { id: '1', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] },
        { id: '2', userId: 'user2', user: { name: 'User 2' }, createdAt: new Date().toISOString(), tradeCards: [] },
        { id: '3', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] }
      ];
      
      expect(tradesStore.totalUserTrades).toBe(2);
    });
  });

  describe('fetchAllTrades', () => {
    it('should fetch all trades successfully', async () => {
      const tradesStore = useTradesStore();
      const mockResponse = {
        list: [
          { id: '1', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] }
        ],
        page: 1,
        rpp: 10,
        more: false
      };
      
      const { TradeServices } = await import('../../../services/modules/trades');
      vi.mocked(TradeServices.getAllTrades).mockResolvedValue(mockResponse);
      
      await tradesStore.fetchAllTrades();
      
      expect(tradesStore.allTrades).toEqual(mockResponse.list);
      expect(tradesStore.loading).toBe(false);
      expect(tradesStore.error).toBeNull();
      expect(tradesStore.pagination.page).toBe(1);
      expect(tradesStore.pagination.rpp).toBe(10);
      expect(tradesStore.pagination.more).toBe(false);
    });

    it('should handle error when fetching all trades fails', async () => {
      const tradesStore = useTradesStore();
      const mockError = new Error('Failed to fetch trades');
      
      const { TradeServices } = await import('../../../services/modules/trades');
      vi.mocked(TradeServices.getAllTrades).mockRejectedValue(mockError);
      
      await tradesStore.fetchAllTrades();
      
      expect(tradesStore.error).toBe('Failed to fetch trades');
      expect(tradesStore.loading).toBe(false);
    });

    it('should accumulate trades when not resetting', async () => {
      const tradesStore = useTradesStore();
      const mockResponse1 = {
        list: [
          { id: '1', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] }
        ],
        page: 1,
        rpp: 10,
        more: true
      };
      const mockResponse2 = {
        list: [
          { id: '2', userId: 'user2', user: { name: 'User 2' }, createdAt: new Date().toISOString(), tradeCards: [] }
        ],
        page: 2,
        rpp: 10,
        more: false
      };
      
      const { TradeServices } = await import('../../../services/modules/trades');
      vi.mocked(TradeServices.getAllTrades)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);
      
      await tradesStore.fetchAllTrades(1, 10, false);
      await tradesStore.fetchAllTrades(2, 10, false);
      
      expect(tradesStore.allTrades).toHaveLength(2);
      expect(tradesStore.allTrades[0].id).toBe('1');
      expect(tradesStore.allTrades[1].id).toBe('2');
    });

    it('should reset trades when reset is true', async () => {
      const tradesStore = useTradesStore();
      const mockResponse1 = {
        list: [
          { id: '1', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] }
        ],
        page: 1,
        rpp: 10,
        more: false
      };
      const mockResponse2 = {
        list: [
          { id: '2', userId: 'user2', user: { name: 'User 2' }, createdAt: new Date().toISOString(), tradeCards: [] }
        ],
        page: 1,
        rpp: 10,
        more: false
      };
      
      const { TradeServices } = await import('../../../services/modules/trades');
      vi.mocked(TradeServices.getAllTrades)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);
      
      await tradesStore.fetchAllTrades(1, 10, false);
      await tradesStore.fetchAllTrades(1, 10, true);
      
      expect(tradesStore.allTrades).toHaveLength(1);
      expect(tradesStore.allTrades[0].id).toBe('2');
    });
  });

  describe('fetchUserTrades', () => {
    it('should call fetchAllTrades', async () => {
      const tradesStore = useTradesStore();
      const mockResponse = {
        list: [],
        page: 1,
        rpp: 10,
        more: false
      };
      
      const { TradeServices } = await import('../../../services/modules/trades');
      vi.mocked(TradeServices.getAllTrades).mockResolvedValue(mockResponse);
      
      await tradesStore.fetchUserTrades(2, 15, true);
      
      expect(TradeServices.getAllTrades).toHaveBeenCalledWith(2, 15);
    });
  });

  describe('createTrade', () => {
    it('should create trade successfully', async () => {
      const tradesStore = useTradesStore();
      const mockTradeData = {
        cards: [
          { cardId: '1', type: 'OFFERING' as const },
          { cardId: '2', type: 'OFFERING' as const },
          { cardId: '3', type: 'RECEIVING' as const },
          { cardId: '4', type: 'RECEIVING' as const }
        ]
      };
      const mockResponse = {
        list: [
          { id: '1', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] }
        ],
        page: 1,
        rpp: 10,
        more: false
      };
      
      const { TradeServices } = await import('../../../services/modules/trades');
      vi.mocked(TradeServices.createTrade).mockResolvedValue({ tradeId: 'new-trade-1' });
      vi.mocked(TradeServices.getAllTrades).mockResolvedValue(mockResponse);
      
      await tradesStore.createTrade(mockTradeData);
      
      expect(TradeServices.createTrade).toHaveBeenCalledWith(mockTradeData);
      expect(tradesStore.loading).toBe(false);
      expect(tradesStore.error).toBeNull();
    });

    it('should handle error when creating trade fails', async () => {
      const tradesStore = useTradesStore();
      const mockTradeData = {
        cards: [
          { cardId: '1', type: 'OFFERING' as const },
          { cardId: '2', type: 'RECEIVING' as const }
        ]
      };
      const mockError = new Error('Failed to create trade');
      
      const { TradeServices } = await import('../../../services/modules/trades');
      vi.mocked(TradeServices.createTrade).mockRejectedValue(mockError);
      
      await expect(tradesStore.createTrade(mockTradeData)).rejects.toThrow('Failed to create trade');
      
      expect(tradesStore.error).toBe('Failed to create trade');
      expect(tradesStore.loading).toBe(false);
    });
  });

  describe('deleteTrade', () => {
    it('should delete trade successfully', async () => {
      const tradesStore = useTradesStore();
      const mockResponse = {
        list: [],
        page: 1,
        rpp: 10,
        more: false
      };
      
      const { TradeServices } = await import('../../../services/modules/trades');
      vi.mocked(TradeServices.deleteTrade).mockResolvedValue(undefined);
      vi.mocked(TradeServices.getAllTrades).mockResolvedValue(mockResponse);
      
      await tradesStore.deleteTrade('trade1');
      
      expect(TradeServices.deleteTrade).toHaveBeenCalledWith('trade1');
      expect(tradesStore.loading).toBe(false);
      expect(tradesStore.error).toBeNull();
    });

    it('should handle error when deleting trade fails', async () => {
      const tradesStore = useTradesStore();
      const mockError = new Error('Failed to delete trade');
      
      const { TradeServices } = await import('../../../services/modules/trades');
      vi.mocked(TradeServices.deleteTrade).mockRejectedValue(mockError);
      
      await tradesStore.deleteTrade('trade1');
      
      expect(tradesStore.error).toBe('Failed to delete trade');
      expect(tradesStore.loading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const tradesStore = useTradesStore();
      
      tradesStore.error = 'Test error';
      tradesStore.clearError();
      
      expect(tradesStore.error).toBeNull();
    });
  });

  describe('clearTrades', () => {
    it('should clear all trades and reset pagination', () => {
      const tradesStore = useTradesStore();
      
      tradesStore.allTrades = [
        { id: '1', userId: 'user1', user: { name: 'User 1' }, createdAt: new Date().toISOString(), tradeCards: [] }
      ];
      tradesStore.pagination = {
        page: 5,
        rpp: 20,
        total: 100,
        more: true
      };
      
      tradesStore.clearTrades();
      
      expect(tradesStore.allTrades).toEqual([]);
      expect(tradesStore.pagination).toEqual({
        page: 1,
        rpp: 10,
        total: 0,
        more: false
      });
    });
  });
}); 