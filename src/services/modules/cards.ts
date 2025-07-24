import { api } from '../index';
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
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  async getUserCards(): Promise<Card[]> {
    const response = await api.get('/me/cards');
    return response.data;
  },

  async addCardsToUser(cardIds: string[]): Promise<void> {
    const payload: AddCardsForm = { cardIds };
    await api.post('/me/cards', payload);
  }
}; 
