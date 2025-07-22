import { api } from '../index';
import type { Card, CardListResponse, AddCardsRequest } from '../../types/card';

export const CardServices = {
  async getAllCards(page = 1, rpp = 10): Promise<CardListResponse> {
    const response = await api.get(`/cards?page=${page}&rpp=${rpp}`);
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
    const payload: AddCardsRequest = { cardIds };
    await api.post('/me/cards', payload);
  }
}; 