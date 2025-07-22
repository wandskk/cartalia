import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCardsStore } from '../stores/cards';
import { useTradesStore } from '../stores/trades';
import { useNotificationStore } from '../stores/notification';
import type { Card } from '../types';

export function useTradeCreation() {
  const router = useRouter();
  const cardsStore = useCardsStore();
  const tradesStore = useTradesStore();
  const notification = useNotificationStore();

  const offeringCards = ref<Card[]>([]);
  const receivingCards = ref<Card[]>([]);
  const creatingTrade = ref(false);

  const userCards = computed(() => cardsStore.userCards);
  const allCards = computed(() => cardsStore.allCards);
  const loadingUserCards = computed(() => cardsStore.loading);
  const loadingAllCards = computed(() => cardsStore.loading);
  const userCardsError = computed(() => cardsStore.error);
  const allCardsError = computed(() => cardsStore.error);

  async function fetchUserCards() {
    await cardsStore.fetchUserCards();
  }

  async function fetchAllCards() {
    await cardsStore.fetchAllCards();
  }

  function updateOfferingCards(cards: Card[]) {
    offeringCards.value = cards;
  }

  function updateReceivingCards(cards: Card[]) {
    receivingCards.value = cards;
  }

  function resetSelection() {
    offeringCards.value = [];
    receivingCards.value = [];
  }

  async function handleCreateTrade() {
    if (offeringCards.value.length === 0 || receivingCards.value.length === 0) {
      notification.show('Selecione pelo menos uma carta para oferecer e uma para receber', 'error');
      return;
    }

    creatingTrade.value = true;
    try {
      const tradeData = {
        cards: [
          ...offeringCards.value.map(card => ({
            cardId: card.id,
            type: 'OFFERING' as const
          })),
          ...receivingCards.value.map(card => ({
            cardId: card.id,
            type: 'RECEIVING' as const
          }))
        ]
      };

      await tradesStore.createTrade(tradeData);
      notification.show('Troca criada com sucesso!', 'success');
      router.push('/my-trades');
    } catch (error: any) {
      notification.show(error.message || 'Erro ao criar troca', 'error');
    } finally {
      creatingTrade.value = false;
    }
  }

  return {
    offeringCards,
    receivingCards,
    creatingTrade,
    userCards,
    allCards,
    loadingUserCards,
    loadingAllCards,
    userCardsError,
    allCardsError,
    fetchUserCards,
    fetchAllCards,
    updateOfferingCards,
    updateReceivingCards,
    resetSelection,
    handleCreateTrade
  };
} 
