<template>
  <div class="create-trade-form">
    <div class="form-header">
      <h2>Criar Nova Troca</h2>
      <p>Selecione as cartas que você quer oferecer e as que você quer receber</p>
    </div>

    <div class="form-content">
      <div class="selectors-section">
        <div class="selector-column">
          <CardSelector
            :cards="userCards"
            :selected-cards="offeringCards"
            :loading="loadingUserCards"
            :error="userCardsError"
            title="Suas Cartas (Oferecer)"
            search-placeholder="Buscar suas cartas..."
            empty-message="Você não tem cartas para oferecer. Adicione cartas à sua coleção primeiro."
            @update:selected-cards="updateOfferingCards"
            @retry="fetchUserCards"
          />
        </div>

        <div class="selector-column">
          <CardSelector
            :cards="allCards"
            :selected-cards="receivingCards"
            :loading="loadingAllCards"
            :error="allCardsError"
            title="Todas as Cartas (Receber)"
            search-placeholder="Buscar cartas disponíveis..."
            empty-message="Nenhuma carta disponível no sistema."
            @update:selected-cards="updateReceivingCards"
            @retry="fetchAllCards"
          />
        </div>
      </div>

      <div class="preview-section">
        <TradePreview
          :offering-cards="offeringCards"
          :receiving-cards="receivingCards"
          :loading="creatingTrade"
          @create="handleCreateTrade"
          @reset="resetSelection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCardsStore } from '../../../stores/cards';
import { useTradesStore } from '../../../stores/trades';
import { useNotificationStore } from '../../../stores/notification';
import CardSelector from './CardSelector.vue';
import TradePreview from './TradePreview.vue';
import type { Card } from '../../../types/card';

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

onMounted(() => {
  fetchUserCards();
  fetchAllCards();
});

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
    notification.show('Selecione cartas para oferecer e receber', 'error');
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
    
    resetSelection();
    router.push('/marketplace');
  } catch (err: any) {
    notification.show(
      err.message || 'Erro ao criar troca',
      'error'
    );
  } finally {
    creatingTrade.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.create-trade-form {
  .form-header {
    text-align: center;
    margin-bottom: 32px;

    h2 {
      margin: 0 0 8px 0;
      color: $black;
      font-size: 28px;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: $gray-600;
      font-size: 16px;
      line-height: 1.5;
    }
  }

  .form-content {
    .selectors-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 32px;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .selector-column {
        background: $white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }

    .preview-section {
      background: $white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
</style> 