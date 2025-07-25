import { api } from '../index';
import { useCacheStore } from '../../stores/cache';
import type { Card, CardListResponse, AddCardsForm } from '../../types';

export const CardServices = {
  async getAllCards(page = 1, rpp = 10, search?: string): Promise<CardListResponse> {
    let url = `/cards?page=${page}&rpp=${rpp}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await api.get(url);
    
    return response.data;
  },

  async getCardById(id: string): Promise<Card> {
    const cacheStore = useCacheStore();
    const cacheKey = cacheStore.CACHE_KEYS.CARD_DETAIL(id);
    
    const cached = cacheStore.get<Card>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const response = await api.get(`/cards/${id}`);
    
    cacheStore.set(cacheKey, response.data, 5 * 60 * 1000);
    
    return response.data;
  },

  async getUserCards(): Promise<Card[]> {
    const cacheStore = useCacheStore();
    const cacheKey = cacheStore.CACHE_KEYS.USER_CARDS;
    
    const cached = cacheStore.get<Card[]>(cacheKey);
    if (cached) {
      return cached;
    }
    
    const response = await api.get('/me/cards');
    
    cacheStore.set(cacheKey, response.data, 60 * 1000);
    
    return response.data;
  },

  async addCardsToUser(cardIds: string[]): Promise<void> {
    const payload: AddCardsForm = { cardIds };
    await api.post('/me/cards', payload);
    
    const cacheStore = useCacheStore();
    cacheStore.remove(cacheStore.CACHE_KEYS.USER_CARDS);
  }
}; 
