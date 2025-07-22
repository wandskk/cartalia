import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TradeServices } from '../services/modules/trades';
import type { Trade, TradeListResponse, CreateTradeForm } from '../types';

export const useTradesStore = defineStore('trades', () => {
  const allTrades = ref<Trade[]>([]);
  const userTrades = ref<Trade[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    rpp: 10,
    more: false
  });

  const totalTrades = computed(() => allTrades.value.length);
  const totalUserTrades = computed(() => userTrades.value.length);

  async function fetchAllTrades(page = 1, rpp = 10) {
    loading.value = true;
    error.value = null;
    
    try {
      const response: TradeListResponse = await TradeServices.getAllTrades(page, rpp);
      allTrades.value = response.list;
      pagination.value = {
        page: response.page,
        rpp: response.rpp,
        more: response.more
      };
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar trocas';
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserTrades(page = 1, rpp = 10) {
    loading.value = true;
    error.value = null;
    
    try {
      const response: TradeListResponse = await TradeServices.getUserTrades(page, rpp);
      userTrades.value = response.list;
      pagination.value = {
        page: response.page,
        rpp: response.rpp,
        more: response.more
      };
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar suas trocas';
    } finally {
      loading.value = false;
    }
  }

  async function createTrade(tradeData: CreateTradeForm) {
    loading.value = true;
    error.value = null;
    
    try {
      await TradeServices.createTrade(tradeData);
      await fetchUserTrades();
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar troca';
    } finally {
      loading.value = false;
    }
  }

  async function deleteTrade(tradeId: string) {
    loading.value = true;
    error.value = null;
    
    try {
      await TradeServices.deleteTrade(tradeId);
      await fetchUserTrades();
    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar troca';
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    allTrades,
    userTrades,
    loading,
    error,
    pagination,
    totalTrades,
    totalUserTrades,
    fetchAllTrades,
    fetchUserTrades,
    createTrade,
    deleteTrade,
    clearError
  };
}); 
