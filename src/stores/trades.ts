import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TradeServices } from '../services/modules/trades';
import { useAuthStore } from './auth';
import type { Trade, TradeListResponse } from '../types/trade';

export const useTradesStore = defineStore('trades', () => {
  const allTrades = ref<Trade[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    rpp: 10,
    more: false
  });

  const totalTrades = computed(() => allTrades.value.length);
  const hasTrades = computed(() => allTrades.value.length > 0);

  const userTrades = computed(() => {
    const authStore = useAuthStore();
    if (!authStore.user?.id) return [];
    return allTrades.value.filter(trade => trade.userId === authStore.user!.id);
  });

  const totalUserTrades = computed(() => userTrades.value.length);

  async function fetchAllTrades(page = 1, rpp = 10) {
    loading.value = true;
    error.value = null;
    
    try {
      const response: TradeListResponse = await TradeServices.getAllTrades(page, rpp);
      
      if (page === 1) {
        allTrades.value = response.list;
      } else {
        allTrades.value = [...allTrades.value, ...response.list];
      }
      
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

  async function createTrade(tradeData: any) {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await TradeServices.createTrade(tradeData);
      await fetchAllTrades(1, pagination.value.rpp);
      return response;
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar troca';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTrade(tradeId: string) {
    loading.value = true;
    error.value = null;
    
    try {
      await TradeServices.deleteTrade(tradeId);
      allTrades.value = allTrades.value.filter(trade => trade.id !== tradeId);
    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar troca';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function clearTrades() {
    allTrades.value = [];
    pagination.value = {
      page: 1,
      rpp: 10,
      more: false
    };
  }

  return {
    allTrades,
    loading,
    error,
    pagination,
    totalTrades,
    hasTrades,
    userTrades,
    totalUserTrades,
    fetchAllTrades,
    createTrade,
    deleteTrade,
    clearError,
    clearTrades
  };
}); 