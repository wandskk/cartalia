<template>
  <div class="card-list">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando cartas...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <BaseButton @click="retry" color="primary">Tentar novamente</BaseButton>
    </div>

    <div v-else-if="cards.length === 0" class="empty-state">
      <p>Nenhuma carta encontrada.</p>
    </div>

    <div v-else class="cards-grid">
      <CardItem
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :selectable="selectable"
        :selected="isCardSelected(card)"
        :clickable="clickable"
        @click="handleCardClick"
        @select="handleCardSelect"
      />
    </div>

    <div v-if="showPagination && pagination.more" class="pagination">
      <BaseButton 
        @click="loadMore" 
        :loading="loading"
        color="secondary"
      >
        Carregar mais
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CardItem from './CardItem.vue';
import BaseButton from '../../common/BaseButton.vue';
import type { Card } from '../../../types/card';

interface Props {
  cards: Card[];
  loading?: boolean;
  error?: string | null;
  selectable?: boolean;
  clickable?: boolean;
  selectedCards?: Card[];
  showPagination?: boolean;
  pagination?: {
    page: number;
    rpp: number;
    more: boolean;
  };
}

interface Emits {
  (e: 'card-click', card: Card): void;
  (e: 'card-select', card: Card, selected: boolean): void;
  (e: 'retry'): void;
  (e: 'load-more'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  selectable: false,
  clickable: true,
  selectedCards: () => [],
  showPagination: false,
  pagination: () => ({
    page: 1,
    rpp: 10,
    more: false
  })
});

const emit = defineEmits<Emits>();

function isCardSelected(card: Card): boolean {
  return props.selectedCards.some(selectedCard => selectedCard.id === card.id);
}

function handleCardClick(card: Card) {
  emit('card-click', card);
}

function handleCardSelect(card: Card, selected: boolean) {
  emit('card-select', card, selected);
}

function retry() {
  emit('retry');
}

function loadMore() {
  emit('load-more');
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.card-list {
  width: 100%;

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: $gray-600;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid $gray-200;
      border-top: 4px solid $primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;

    .error-message {
      color: $error;
      margin-bottom: 16px;
      font-size: 16px;
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: $gray-500;
    font-size: 16px;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }
}
</style> 