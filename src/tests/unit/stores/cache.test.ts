import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCacheStore } from '../../../stores/cache';

describe('Cache Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with empty cache', () => {
    const cacheStore = useCacheStore();
    expect(cacheStore.cache.size).toBe(0);
  });

  it('should set and get cache item', () => {
    const cacheStore = useCacheStore();
    const data = { id: 1, name: 'Test' };
    
    cacheStore.set('test-key', data, 60000);
    const result = cacheStore.get('test-key');
    
    expect(result).toEqual(data);
    expect(cacheStore.cache.size).toBe(1);
  });

  it('should return null for non-existent key', () => {
    const cacheStore = useCacheStore();
    const result = cacheStore.get('non-existent');
    
    expect(result).toBeNull();
  });

  it('should return null for expired cache item', async () => {
    const cacheStore = useCacheStore();
    const data = { id: 1, name: 'Test' };
    
    cacheStore.set('test-key', data, 1); // 1ms TTL
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const result = cacheStore.get('test-key');
    expect(result).toBeNull();
  });

  it('should remove cache item', () => {
    const cacheStore = useCacheStore();
    const data = { id: 1, name: 'Test' };
    
    cacheStore.set('test-key', data);
    expect(cacheStore.cache.size).toBe(1);
    
    cacheStore.remove('test-key');
    expect(cacheStore.cache.size).toBe(0);
    expect(cacheStore.get('test-key')).toBeNull();
  });

  it('should clear all cache', () => {
    const cacheStore = useCacheStore();
    
    cacheStore.set('key1', { data: 1 });
    cacheStore.set('key2', { data: 2 });
    expect(cacheStore.cache.size).toBe(2);
    
    cacheStore.clear();
    expect(cacheStore.cache.size).toBe(0);
  });

  it('should check if key exists', () => {
    const cacheStore = useCacheStore();
    
    expect(cacheStore.has('test-key')).toBe(false);
    
    cacheStore.set('test-key', { data: 1 });
    expect(cacheStore.has('test-key')).toBe(true);
  });

  it('should check if key is expired', async () => {
    const cacheStore = useCacheStore();
    
    cacheStore.set('test-key', { data: 1 }, 1); // 1ms TTL
    expect(cacheStore.has('test-key')).toBe(true);
    
    // Wait for expiration
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(cacheStore.has('test-key')).toBe(false);
  });

  it('should get cache size', () => {
    const cacheStore = useCacheStore();
    
    expect(cacheStore.size).toBe(0);
    
    cacheStore.set('key1', { data: 1 });
    cacheStore.set('key2', { data: 2 });
    
    expect(cacheStore.size).toBe(2);
  });

  it('should check if cache is full', () => {
    const cacheStore = useCacheStore();
    
    expect(cacheStore.isFull).toBe(false);
    
    // Fill cache to max size (100 by default)
    for (let i = 0; i < 100; i++) {
      cacheStore.set(`key${i}`, { data: i });
    }
    
    expect(cacheStore.isFull).toBe(true);
  });

  it('should cleanup expired items', () => {
    const cacheStore = useCacheStore();
    
    cacheStore.set('expired-key', { data: 1 }, 1); // 1ms TTL
    cacheStore.set('valid-key', { data: 2 }, 60000); // 1 minute TTL
    
    // Wait for expiration
    setTimeout(() => {
      cacheStore.cleanupExpired();
      
      expect(cacheStore.has('expired-key')).toBe(false);
      expect(cacheStore.has('valid-key')).toBe(true);
    }, 10);
  });

  it('should initialize cache from localStorage', () => {
    const mockData = {
      'test-key': {
        data: { id: 1, name: 'Test' },
        timestamp: Date.now(),
        ttl: 60000
      }
    };
    
    // Set up localStorage data
    localStorage.setItem('cartalia-cache', JSON.stringify(mockData));
    
    // Create a new cache store instance and initialize manually
    const newCacheStore = useCacheStore();
    newCacheStore.initializeCache();
    
    const result = newCacheStore.get('test-key');
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('should handle invalid localStorage data gracefully', () => {
    const cacheStore = useCacheStore();
    
    localStorage.setItem('cartalia-cache', 'invalid-json');
    
    expect(() => cacheStore.initializeCache()).not.toThrow();
    expect(cacheStore.cache.size).toBe(0);
  });

  it('should have correct cache keys constants', () => {
    const cacheStore = useCacheStore();
    
    expect(cacheStore.CACHE_KEYS.CARDS).toBe('cards');
    expect(cacheStore.CACHE_KEYS.USER_CARDS).toBe('user-cards');
    expect(cacheStore.CACHE_KEYS.TRADES).toBe('trades');
    expect(cacheStore.CACHE_KEYS.USER_PROFILE).toBe('user-profile');
    expect(cacheStore.CACHE_KEYS.CARD_DETAIL('123')).toBe('card-123');
    expect(cacheStore.CACHE_KEYS.TRADE_DETAIL('456')).toBe('trade-456');
  });
}); 