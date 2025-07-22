import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { CardServices } from '../services/modules/cards';
import type { Card, CardListResponse } from '../types/card';

export const useCardsStore = defineStore('cards', () => {
  const allCards = ref<Card[]>([]);
  const userCards = ref<Card[]>([]);
  const selectedCard = ref<Card | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    rpp: 10,
    more: false
  });

  const hasUserCards = computed(() => userCards.value.length > 0);
  const totalUserCards = computed(() => userCards.value.length);

  async function fetchAllCards(page = 1, rpp = 10) {
    loading.value = true;
    error.value = null;
    
    try {
      const response: CardListResponse = await CardServices.getAllCards(page, rpp);
      allCards.value = response.list;
      pagination.value = {
        page: response.page,
        rpp: response.rpp,
        more: response.more
      };
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
    hasUserCards,
    totalUserCards,
    fetchAllCards,
    fetchUserCards,
    fetchCardById,
    addCardsToUser,
    clearError,
    clearSelectedCard
  };
}); 