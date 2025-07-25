import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheConfig {
  ttl?: number; // Default TTL in milliseconds (5 minutes)
  maxSize?: number; // Maximum number of items in cache
}

export const useCacheStore = defineStore('cache', () => {
  const cache = ref<Map<string, CacheItem<any>>>(new Map());
  const config = ref<CacheConfig>({
    ttl: 5 * 60 * 1000, // 5 minutes default
    maxSize: 100 // Maximum 100 items
  });

  // Computed properties
  const size = computed(() => cache.value.size);
  const isFull = computed(() => size.value >= (config.value.maxSize || 100));

  // Initialize cache from localStorage
  function initializeCache() {
    try {
      const stored = localStorage.getItem('cartalia-cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        cache.value = new Map(Object.entries(parsed));
        cleanupExpired();
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  // Save cache to localStorage
  function persistCache() {
    try {
      const cacheObject = Object.fromEntries(cache.value);
      localStorage.setItem('cartalia-cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  // Set cache item
  function set<T>(key: string, data: T, ttl?: number): void {
    const itemTtl = ttl || config.value.ttl || 5 * 60 * 1000;
    
    // Remove oldest items if cache is full
    if (isFull.value) {
      removeOldest();
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: itemTtl
    };

    cache.value.set(key, item);
    persistCache();
  }

  // Get cache item
  function get<T>(key: string): T | null {
    const item = cache.value.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item is expired
    if (Date.now() - item.timestamp > item.ttl) {
      cache.value.delete(key);
      persistCache();
      return null;
    }

    return item.data as T;
  }

  // Check if key exists and is not expired
  function has(key: string): boolean {
    return get(key) !== null;
  }

  // Remove specific item
  function remove(key: string): boolean {
    const deleted = cache.value.delete(key);
    if (deleted) {
      persistCache();
    }
    return deleted;
  }

  // Clear all cache
  function clear(): void {
    cache.value.clear();
    persistCache();
  }

  // Remove expired items
  function cleanupExpired(): void {
    const now = Date.now();
    for (const [key, item] of cache.value.entries()) {
      if (now - item.timestamp > item.ttl) {
        cache.value.delete(key);
      }
    }
    persistCache();
  }

  // Remove oldest items (used when cache is full)
  function removeOldest(): void {
    const entries = Array.from(cache.value.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove 10% of oldest items
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      cache.value.delete(entries[i][0]);
    }
  }

  // Cache keys for different data types
  const CACHE_KEYS = {
    CARDS: 'cards',
    USER_CARDS: 'user-cards',
    TRADES: 'trades',
    USER_PROFILE: 'user-profile',
    CARD_DETAIL: (id: string) => `card-${id}`,
    TRADE_DETAIL: (id: string) => `trade-${id}`,
  } as const;

  return {
    // State
    cache,
    config,
    
    // Computed
    size,
    isFull,
    
    // Methods
    initializeCache,
    set,
    get,
    has,
    remove,
    clear,
    cleanupExpired,
    
    // Constants
    CACHE_KEYS
  };
}); 