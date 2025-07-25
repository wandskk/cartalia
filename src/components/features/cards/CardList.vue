<template>
  <div class="card-list">
    <div v-if="loading" class="d-flex flex-column align-center justify-center py-10 text-grey">
      <LoadingSpinner text="Carregando cartas..." />
    </div>

    <div v-else-if="error" class="d-flex flex-column align-center justify-center py-10 text-center">
      <div class="mb-4 text-error">{{ error }}</div>
      <v-btn @click="retry" color="primary" variant="elevated">Tentar novamente</v-btn>
    </div>

    <div v-else-if="cards.length === 0" class="d-flex align-center justify-center py-10 text-grey">
      <span>Nenhuma carta encontrada.</span>
    </div>

    <v-row v-else :class="viewMode === 'list' ? 'flex-column' : ''" class="mb-6" dense>
      <v-col
        v-for="card in cards"
        :key="card.id"
        :cols="viewMode === 'list' ? 12 : 12"
        :sm="viewMode === 'list' ? 12 : 6"
        :md="viewMode === 'list' ? 12 : 4"
        :lg="viewMode === 'list' ? 12 : 3"
        class="mb-2"
      >
        <Card
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
            <v-btn size="small" @click.stop="handleCardClick(card)">
              Ver detalhes
            </v-btn>
          </template>
        </Card>
      </v-col>
    </v-row>

    <div v-if="showPagination && pagination.more" class="d-flex justify-center mt-6">
      <v-btn 
        @click="loadMore" 
        :loading="loading"
        color="secondary"
        variant="elevated"
      >
        Carregar mais
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from '../../common/Card.vue';
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
.card-list {
  width: 100%;
}
</style> 
