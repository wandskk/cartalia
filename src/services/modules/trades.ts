import { api } from '../index';
import type { TradeListResponse, CreateTradeForm, CreateTradeResponse } from '../../types';

export const TradeServices = {
  async getAllTrades(page = 1, rpp = 10): Promise<TradeListResponse> {
    const response = await api.get(`/trades?page=${page}&rpp=${rpp}`);
    return response.data;
  },

  async createTrade(tradeData: CreateTradeForm): Promise<CreateTradeResponse> {
    const response = await api.post('/trades', tradeData);
    return response.data;
  },

  async deleteTrade(tradeId: string): Promise<void> {
    await api.delete(`/trades/${tradeId}`);
  }
}; 
