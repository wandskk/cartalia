import { describe, it, expect } from 'vitest';
import { useDashboard } from '../../../composables/useDashboard';

describe('useDashboard', () => {
  describe('composable structure', () => {
    it('should return expected properties', () => {
      const dashboard = useDashboard();
      
      expect(dashboard).toBeDefined();
      expect(typeof dashboard.loading).toBe('object');
      expect(typeof dashboard.error).toBe('object');
      expect(typeof dashboard.userCards).toBe('object');
      expect(typeof dashboard.userTradesList).toBe('object');
      expect(typeof dashboard.totalCards).toBe('object');
      expect(typeof dashboard.totalTrades).toBe('object');
      expect(typeof dashboard.activeTrades).toBe('object');
      expect(typeof dashboard.userTrades).toBe('object');
      expect(typeof dashboard.marketplaceTrades).toBe('object');
      expect(typeof dashboard.uniqueCards).toBe('object');
      expect(typeof dashboard.fetchData).toBe('function');
    });
  });

  describe('computed properties', () => {
    it('should have reactive computed properties', () => {
      const dashboard = useDashboard();
      
      expect(dashboard.loading.value).toBeDefined();
      expect(dashboard.error.value).toBeDefined();
      expect(dashboard.userCards.value).toBeDefined();
      expect(dashboard.userTradesList.value).toBeDefined();
      expect(dashboard.totalCards.value).toBeDefined();
      expect(dashboard.totalTrades.value).toBeDefined();
      expect(dashboard.activeTrades.value).toBeDefined();
      expect(dashboard.userTrades.value).toBeDefined();
      expect(dashboard.marketplaceTrades.value).toBeDefined();
      expect(dashboard.uniqueCards.value).toBeDefined();
    });
  });

  describe('fetchData function', () => {
    it('should be an async function', () => {
      const dashboard = useDashboard();
      
      expect(typeof dashboard.fetchData).toBe('function');
      expect(dashboard.fetchData.constructor.name).toBe('AsyncFunction');
    });
  });
}); 