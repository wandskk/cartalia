import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  ttl?: number;
  maxSize?: number;
}

export const useCacheStore = defineStore('cache', () => {
  const cache = ref<Map<string, CacheItem<any>>>(new Map());
  const config = ref<CacheConfig>({
    ttl: 5 * 60 * 1000,
    maxSize: 100
  });

  const size = computed(() => cache.value.size);
  const isFull = computed(() => size.value >= (config.value.maxSize || 100));

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

  function persistCache() {
    try {
      const cacheObject = Object.fromEntries(cache.value);
      localStorage.setItem('cartalia-cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  function set<T>(key: string, data: T, ttl?: number): void {
    const itemTtl = ttl || config.value.ttl || 5 * 60 * 1000;
    
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

  function get<T>(key: string): T | null {
    const item = cache.value.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      cache.value.delete(key);
      persistCache();
      return null;
    }

    return item.data as T;
  }

  function has(key: string): boolean {
    return get(key) !== null;
  }

  function remove(key: string): boolean {
    const deleted = cache.value.delete(key);
    if (deleted) {
      persistCache();
    }
    return deleted;
  }

  function clear(): void {
    cache.value.clear();
    persistCache();
  }

  function cleanupExpired(): void {
    const now = Date.now();
    for (const [key, item] of cache.value.entries()) {
      if (now - item.timestamp > item.ttl) {
        cache.value.delete(key);
      }
    }
    persistCache();
  }

  function removeOldest(): void {
    const entries = Array.from(cache.value.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      cache.value.delete(entries[i][0]);
    }
  }

  const CACHE_KEYS = {
    CARDS: 'cards',
    USER_CARDS: 'user-cards',
    TRADES: 'trades',
    USER_PROFILE: 'user-profile',
    CARD_DETAIL: (id: string) => `card-${id}`,
    TRADE_DETAIL: (id: string) => `trade-${id}`,
  } as const;

  return {
    cache,
    config,
    size,
    isFull,
    initializeCache,
    set,
    get,
    has,
    remove,
    clear,
    cleanupExpired,
    CACHE_KEYS
  };
}); 