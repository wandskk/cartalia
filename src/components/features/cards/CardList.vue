<template>
  <div class="card-list">
    <div v-if="loading" class="loading-state">
      <LoadingSpinner text="Carregando cartas..." />
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <BaseButton @click="retry" color="primary">Tentar novamente</BaseButton>
    </div>

    <div v-else-if="cards.length === 0" class="empty-state">
      <p>Nenhuma carta encontrada.</p>
    </div>

    <div v-else class="cards-container" :class="viewModeClass">
      <Card
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :selectable="selectable"
        :selected="isCardSelected(card)"
        :clickable="clickable"
        :size="viewMode === 'list' ? 'sm' : 'md'"
        :variant="viewMode === 'list' ? 'compact' : 'default'"
        :show-description="viewMode === 'list'"
        :max-description-length="viewMode === 'list' ? 150 : 100"
        @click="handleCardClick"
        @select="handleCardSelect"
      >
        <template v-if="viewMode === 'list'" #actions>
          <BaseButton size="sm" @click.stop="handleCardClick(card)">
            Ver detalhes
          </BaseButton>
        </template>
      </Card>
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
import Card from '../../common/Card.vue';
import BaseButton from '../../common/BaseButton.vue';
import LoadingSpinner from '../../common/LoadingSpinner.vue';
import type { Card as CardType } from '../../../types';

interface Props {
  cards: CardType[];
  loading?: boolean;
  error?: string | null;
  selectable?: boolean;
  clickable?: boolean;
  selectedCards?: CardType[];
  showPagination?: boolean;
  pagination?: {
    page: number;
    rpp: number;
    more: boolean;
  };
  viewMode?: 'grid' | 'list';
}

interface Emits {
  (e: 'card-click', card: CardType): void;
  (e: 'card-select', card: CardType, selected: boolean): void;
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
  }),
  viewMode: 'grid'
});

const emit = defineEmits<Emits>();

const viewModeClass = computed(() => `cards-${props.viewMode}`);

function isCardSelected(card: CardType): boolean {
  return props.selectedCards.some(selectedCard => selectedCard.id === card.id);
}

function handleCardClick(card: CardType) {
  emit('card-click', card);
}

function handleCardSelect(card: CardType, selected: boolean) {
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

  .cards-container {
    &.cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 32px;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 20px;
      }

      @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
      }

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    &.cards-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;

      @media (max-width: 768px) {
        gap: 12px;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }
}
</style> 
