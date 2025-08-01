<template>
  <div class="cards-view">
    <Container>
      <CardsHeader @add-cards="showAddCardModal = true" />

      <!-- Filtros e Search -->
      <CardsFilters
        v-model:search-query="searchQuery"
        v-model:current-filter="currentFilter"
        v-model:view-mode="viewMode"
        :filters="filters"
        :view-modes="viewModes"
      />

      <div class="cards-content">
        <CardsErrorState v-if="cardsStore.error" :error="cardsStore.error" />
        <CardsEmptyState
          v-else-if="!cardsStore.loading && filteredCards.length === 0"
          @clear-filters="clearAllFilters"
        />
        <CardList v-else :cards="paginatedCards" :view-mode="viewMode" />
      </div>

      <!-- Paginação inferior -->
      <SimplePagination
        v-if="showPagination && totalFilteredCards > itemsPerPage"
        :total-items="totalFilteredCards"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        :loading="cardsStore.loading"
        @page-change="handlePageChange"
        class="mt-6"
      />
    </Container>

    <!-- Modal de Adicionar Cartas -->
    <AddCardModal
      v-model="showAddCardModal"
      @cards-added="cardsStore.fetchUserCards()"
    />

    <!-- Back to Top Button -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useCardsStore } from "../stores/cards";
import { useLoadingStore } from "../stores/loading";
import { useCardFilters } from "../composables/useCardFilters";
import { usePagination } from "../composables/usePagination";
import Container from "../components/common/Container.vue";
import CardsHeader from "../components/features/cards/CardsHeader.vue";
import CardsFilters from "../components/features/cards/CardsFilters.vue";
import CardsErrorState from "../components/features/cards/CardsErrorState.vue";
import CardsEmptyState from "../components/features/cards/CardsEmptyState.vue";
import CardList from "../components/features/cards/CardList.vue";
import SimplePagination from "../components/common/SimplePagination.vue";
import AddCardModal from "../components/features/cards/AddCardModal.vue";


const cardsStore = useCardsStore();
const loadingStore = useLoadingStore();
const showAddCardModal = ref(false);

// Filtros
const {
  searchQuery,
  currentFilter,
  viewMode,
  filteredCards
} = useCardFilters(computed(() => cardsStore.userCards));

// Paginação
const itemsPerPage = 12;
const {
  currentPage,
  setPage,
  setTotalItems,
  paginateItems
} = usePagination({
  initialItemsPerPage: itemsPerPage,
  totalItems: 0
});

// Computed properties
const totalFilteredCards = computed(() => filteredCards.value.length);
const showPagination = computed(() => totalFilteredCards.value > itemsPerPage);
const paginatedCards = computed(() => {
  setTotalItems(totalFilteredCards.value);
  return paginateItems(filteredCards.value);
});

// Filtros disponíveis
const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'recent', label: 'Recentes' }
];

// Modos de visualização
const viewModes = [
  { value: 'grid' as const, icon: 'mdi-view-grid', title: 'Visualização em grade' },
  { value: 'list' as const, icon: 'mdi-view-list', title: 'Visualização em lista' }
];

// Event handlers
function handlePageChange(page: number) {
  setPage(page);
}

function clearAllFilters() {
  searchQuery.value = '';
  currentFilter.value = 'all';
  setPage(1);
}

onMounted(async () => {
  loadingStore.startLoading();
  await cardsStore.fetchUserCards();
  loadingStore.stopLoading();
});
</script>

<style scoped>
.cards-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  overflow-x: hidden;
}

.cards-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .cards-view {
    padding: 1rem 0;
  }
  
  .cards-content {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .cards-view {
    padding: 0.75rem 0;
  }
  
  .cards-content {
    gap: 0.5rem;
  }
}

/* Ensure proper spacing for mobile */
@media (max-width: 768px) {
  :deep(.container) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 480px) {
  :deep(.container) {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
