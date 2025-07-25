import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CardServices } from '../services/modules/cards';
import type { Card, CardListResponse } from '../types';

export const useCardsStore = defineStore('cards', () => {
  const allCards = ref<Card[]>([]);
  const userCards = ref<Card[]>([]);
  const selectedCard = ref<Card | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    rpp: 12,
    more: false,
    total: 0
  });

  const totalCards = ref(0);

  const userCardsPagination = ref({
    page: 1,
    rpp: 12,
    more: false,
    total: 0
  });

  const hasUserCards = computed(() => userCards.value.length > 0);
  const totalUserCards = computed(() => userCards.value.length);

  async function fetchTotalCards() {
    try {
      const response: CardListResponse = await CardServices.getAllCards(1, 1000);
      totalCards.value = response.list.length;
    } catch (err: any) {
      totalCards.value = 0;
    }
  }

  async function fetchAllCards(page = 1, rpp = 12, search?: string) {
    loading.value = true;
    error.value = null;
    
    try {

      if (rpp >= 1000) {
        const response: CardListResponse = await CardServices.getAllCards(1, 1000);
        allCards.value = response.list;
        

        let currentPage = 2;
        while (response.more) {
          const nextResponse: CardListResponse = await CardServices.getAllCards(currentPage, 1000);
          allCards.value = [...allCards.value, ...nextResponse.list];
          response.more = nextResponse.more;
          currentPage++;
        }
        
        pagination.value = {
          page: 1,
          rpp: allCards.value.length,
          more: false,
          total: allCards.value.length
        };
      } else {
        const response: CardListResponse = await CardServices.getAllCards(page, rpp, search);
        allCards.value = response.list;
        
        const total = response.total || (response.more ? (page * rpp + rpp) : (page * rpp));
        pagination.value = {
          page: response.page,
          rpp: response.rpp,
          more: response.more,
          total: total
        };
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar cartas';
    } finally {
      loading.value = false;
    }
  }

  async function fetchUserCards() {
    loading.value = true;
    error.value = null;
    
    try {
      userCards.value = await CardServices.getUserCards();
      userCardsPagination.value.total = userCards.value.length;
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar suas cartas';
    } finally {
      loading.value = false;
    }
  }

  async function fetchCardById(id: string) {
    loading.value = true;
    error.value = null;
    
    try {
      selectedCard.value = await CardServices.getCardById(id);
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar carta';
    } finally {
      loading.value = false;
    }
  }

  async function addCardsToUser(cardIds: string[]) {
    loading.value = true;
    error.value = null;
    
    try {
      await CardServices.addCardsToUser(cardIds);
      await fetchUserCards();
    } catch (err: any) {
      error.value = err.message || 'Erro ao adicionar cartas';
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  function clearSelectedCard() {
    selectedCard.value = null;
  }

  return {
    allCards,
    userCards,
    selectedCard,
    loading,
    error,
    pagination,
    userCardsPagination,
    totalCards,
    hasUserCards,
    totalUserCards,
    fetchAllCards,
    fetchTotalCards,
    fetchUserCards,
    fetchCardById,
    addCardsToUser,
    clearError,
    clearSelectedCard
  };
}); 
