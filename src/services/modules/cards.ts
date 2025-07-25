import { api } from '../index';
import { useCacheStore } from '../../stores/cache';
import type { Card, CardListResponse, AddCardsForm } from '../../types';

export const CardServices = {
  async getAllCards(page = 1, rpp = 10, search?: string): Promise<CardListResponse> {
    const cacheStore = useCacheStore();
    const cacheKey = `cards-${page}-${rpp}-${search || 'all'}`;
    
    // Try to get from cache first
    const cached = cacheStore.get<CardListResponse>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Fetch from API
    let url = `/cards?page=${page}&rpp=${rpp}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await api.get(url);
    
    // Cache the result for 2 minutes
    cacheStore.set(cacheKey, response.data, 2 * 60 * 1000);
    
    return response.data;
  },

  async getCardById(id: string): Promise<Card> {
    const cacheStore = useCacheStore();
    const cacheKey = cacheStore.CACHE_KEYS.CARD_DETAIL(id);
    
    // Try to get from cache first
    const cached = cacheStore.get<Card>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Fetch from API
    const response = await api.get(`/cards/${id}`);
    
    // Cache the result for 5 minutes
    cacheStore.set(cacheKey, response.data, 5 * 60 * 1000);
    
    return response.data;
  },

  async getUserCards(): Promise<Card[]> {
    const cacheStore = useCacheStore();
    const cacheKey = cacheStore.CACHE_KEYS.USER_CARDS;
    
    // Try to get from cache first
    const cached = cacheStore.get<Card[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Fetch from API
    const response = await api.get('/me/cards');
    
    // Cache the result for 1 minute (user cards change frequently)
    cacheStore.set(cacheKey, response.data, 60 * 1000);
    
    return response.data;
  },

  async addCardsToUser(cardIds: string[]): Promise<void> {
    const payload: AddCardsForm = { cardIds };
    await api.post('/me/cards', payload);
    
    // Invalidate user cards cache
    const cacheStore = useCacheStore();
    cacheStore.remove(cacheStore.CACHE_KEYS.USER_CARDS);
  }
}; 
