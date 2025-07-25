import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TradeServices } from '../services/modules/trades';
import { useAuthStore } from './auth';
import { useLoadingStore } from './loading';
import type { Trade, TradeListResponse, CreateTradeForm } from '../types';

export const useTradesStore = defineStore('trades', () => {
  const allTrades = ref<Trade[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    rpp: 10,
    total: 0,
    more: false
  });

  const authStore = useAuthStore();
  const loadingStore = useLoadingStore();

  const totalTrades = computed(() => allTrades.value.length);
  
  const userTrades = computed(() => {
    if (!authStore.user) return [];
    return allTrades.value.filter(trade => trade.userId === authStore.user?.id);
  });

  const totalUserTrades = computed(() => userTrades.value.length);

  async function fetchAllTrades(page = 1, rpp = 10) {
    loading.value = true;
    loadingStore.startLoading();
    error.value = null;
    
    try {
      const response: TradeListResponse = await TradeServices.getAllTrades(page, rpp);
      allTrades.value = response.list;
      pagination.value = {
        page: response.page,
        rpp: response.rpp,
        total: response.list.length,
        more: response.more
      };
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar trocas';
    } finally {
      loading.value = false;
      loadingStore.stopLoading();
    }
  }

  async function fetchUserTrades(page = 1, rpp = 10) {
    await fetchAllTrades(page, rpp);
  }

  async function createTrade(tradeData: CreateTradeForm) {
    loading.value = true;
    loadingStore.startLoading();
    error.value = null;
    
    try {
      await TradeServices.createTrade(tradeData);
      await fetchAllTrades();
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar troca';
      throw err;
    } finally {
      loading.value = false;
      loadingStore.stopLoading();
    }
  }

  async function deleteTrade(tradeId: string) {
    loading.value = true;
    loadingStore.startLoading();
    error.value = null;
    
    try {
      await TradeServices.deleteTrade(tradeId);
      await fetchAllTrades();
    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar troca';
    } finally {
      loading.value = false;
      loadingStore.stopLoading();
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
