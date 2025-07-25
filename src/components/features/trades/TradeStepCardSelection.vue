<template>
  <div class="step-content flex-grow-1 d-flex flex-column overflow-hidden pa-6">
    <div class="step-header text-center mb-6">
      <h3 class="text-h5 mb-2">
        <v-icon color="primary" class="mr-2">{{ icon }}</v-icon>
        {{ title }}
      </h3>
      <p class="text-body-2 text-grey">
        {{ description }}
      </p>
    </div>

    <SearchWithPagination
      :search-query="search.searchQuery.value"
      :placeholder="searchPlaceholder"
      :disabled="loading"
      :show-pagination="showPagination"
      :total-items="totalFilteredItems"
      :items-per-page="itemsPerPage"
      :current-page="currentPage"
      :loading="loading"
      @update:search-query="search.setQuery"
      @page-change="handlePageChange"
    />

    <LoadingOverlay :loading="loading" :message="loadingMessage" :size="32" />

    <div v-if="!loading" class="cards-grid flex-grow-1">
      <Card
        v-for="card in paginatedCards"
        :key="card.id"
        :card="card"
        :selectable="true"
        :selected="cardSelection.isSelected(card.id)"
        :clickable="true"
        size="sm"
        variant="compact"
        :show-description="true"
        :max-description-length="80"
        @click="handleCardClick(card.id)"
        @select="handleCardSelect"
      />
    </div>

    <div
      v-if="paginatedCards.length === 0 && !loading"
      class="d-flex flex-column align-center justify-center py-15 text-center"
    >
      <v-icon size="64" color="grey-lighten-1" class="mb-4">{{
        emptyIcon
      }}</v-icon>
      <h3 class="text-h6 mb-2 text-grey">Nenhuma carta encontrada</h3>
      <p class="text-body-2 text-grey" v-if="search.hasQuery.value">
        Tente ajustar sua busca
      </p>
      <p class="text-body-2 text-grey" v-else>
        {{ emptyMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useCardSelection } from "../../../composables/useCardSelection";
import { useSearch } from "../../../composables/useSearch";
import SearchWithPagination from "../../common/SearchWithPagination.vue";
import LoadingOverlay from "../../common/LoadingOverlay.vue";
import Card from "../../common/Card.vue";
import type { Card as CardType } from "../../../types";

interface Props {
  title: string;
  description: string;
  icon: string;
  emptyIcon: string;
  emptyMessage: string;
  searchPlaceholder: string;
  loadingMessage: string;
  cards: CardType[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  selectedCards: string[];
  searchQuery: string;
  onCardToggle: (cardId: string) => void;
  onCardSelect: (card: CardType, selected: boolean) => void;
  onPageChange: (page: number) => void;
  onSearchChange: (query: string) => void;
}

const props = defineProps<Props>();

const cardSelection = useCardSelection({
  initialSelection: props.selectedCards,
});

const search = useSearch({
  initialQuery: props.searchQuery,
  debounceMs: 500,
});

const filteredCards = computed(() => {
  return search.filterByQuery(
    props.cards,
    ["name", "description"],
    search.debouncedQuery.value
  );
});

const totalFilteredItems = computed(() => {
  return filteredCards.value.length;
});

const paginatedCards = computed(() => {
  const startIndex = (props.currentPage - 1) * props.itemsPerPage;
  const endIndex = startIndex + props.itemsPerPage;
  return filteredCards.value.slice(startIndex, endIndex);
});

const showPagination = computed(() => {
  return totalFilteredItems.value > props.itemsPerPage;
});

function handleCardClick(cardId: string) {
  props.onCardToggle(cardId);
}

function handleCardSelect(card: CardType, selected: boolean) {
  props.onCardSelect(card, selected);
}

function handlePageChange(page: number) {
  props.onPageChange(page);
}

watch(
  () => props.selectedCards,
  () => {
    cardSelection.selectedCards.value = [...props.selectedCards];
  },
  { deep: true }
);

watch(
  () => props.searchQuery,
  (newQuery) => {
    search.setQuery(newQuery);
  }
);

watch(cardSelection.selectedCards, () => {}, { deep: true });

watch(search.searchQuery, (newQuery) => {
  props.onSearchChange(newQuery);
});
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
</style>
