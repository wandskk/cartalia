<template>
  <div class="cards-view">
    <Container>
      <CardsHeader @add-cards="showAddForm = true" />

      <CardStats :total-cards="totalUserCards" :recent-cards="recentCards" />

      <div v-if="!showAddForm" class="user-cards-section">
        <CardsFilters
          :search-query="searchQuery"
          :current-filter="currentFilter"
          :view-mode="viewMode"
          @update:search-query="setSearchQuery"
          @update:current-filter="setFilter"
          @update:view-mode="setViewMode"
        />

        <CardsErrorState
          v-if="hasError"
          :error="error || ''"
          @retry="fetchUserCards"
        />

        <CardsEmptyState v-else-if="isEmpty" @add-cards="showAddForm = true" />

        <v-card v-else-if="!loading" class="cards-content" elevation="2">
          <v-card-text class="pa-6">
            <CardsNoResults v-if="filteredCards.length === 0" />

            <CardList
              v-else
              :cards="paginatedCards"
              :loading="loading"
              :error="error"
              :clickable="true"
              :view-mode="viewMode"
              @card-click="handleCardClick"
              @retry="fetchUserCards"
            />

            <Pagination
              v-if="filteredCards.length > 0"
              :total-items="filteredCards.length"
              :items-per-page="pagination.itemsPerPage.value"
              :current-page="pagination.currentPage.value"
              @page-change="handlePageChange"
            />
          </v-card-text>
        </v-card>
      </div>

      <AddCardModal v-model="showAddForm" @cards-added="fetchUserCards" />

      <CardDetailModal v-model="showCardDetail" :card-id="selectedCardId" />
    </Container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCardsStore } from "../stores/cards";
import { useAuthStore } from "../stores/auth";
import { useCardFilters } from "../composables/useCardFilters";
import { useCardStates } from "../composables/useCardStates";
import { usePagination } from "../composables/usePagination";
import { useLoadingState } from "../composables/useLoadingState";
import Container from "../components/common/Container.vue";
import Pagination from "../components/common/Pagination.vue";
import CardsHeader from "../components/features/cards/CardsHeader.vue";
import CardStats from "../components/features/cards/CardStats.vue";
import CardsFilters from "../components/features/cards/CardsFilters.vue";
import CardsErrorState from "../components/features/cards/CardsErrorState.vue";
import CardsEmptyState from "../components/features/cards/CardsEmptyState.vue";
import CardsNoResults from "../components/features/cards/CardsNoResults.vue";
import CardList from "../components/features/cards/CardList.vue";
import AddCardModal from "../components/features/cards/AddCardModal.vue";
import CardDetailModal from "../components/features/cards/CardDetailModal.vue";
import type { Card } from "../types";

const router = useRouter();
const cardsStore = useCardsStore();
const authStore = useAuthStore();

// Composables
const { isLoading: loading, withLoading } = useLoadingState();
const pagination = usePagination({
  initialItemsPerPage: 12
});

const showAddForm = ref(false);
const showCardDetail = ref(false);
const selectedCardId = ref<string>("");

// Store computed properties
const error = computed(() => cardsStore.error);
const userCards = computed(() => cardsStore.userCards);
const totalUserCards = computed(() => cardsStore.totalUserCards);

// Card filters
const {
  searchQuery,
  currentFilter,
  viewMode,
  recentCards,
  filteredCards,
  setFilter,
  setSearchQuery,
  setViewMode,
} = useCardFilters(userCards);

// Card states
const { hasError, isEmpty } = useCardStates(loading, error, userCards);

// Paginated cards
const paginatedCards = computed(() => {
  pagination.setTotalItems(filteredCards.value.length);
  return pagination.paginateItems(filteredCards.value);
});

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await fetchUserCards();
  } else {
    router.push("/login");
  }
});

watch([searchQuery, currentFilter], () => {
  pagination.firstPage();
});

async function fetchUserCards() {
  await withLoading(async () => {
    await cardsStore.fetchUserCards();
  }, "Carregando suas cartas...");
}

function handleCardClick(card: Card) {
  selectedCardId.value = card.id;
  showCardDetail.value = true;
}

function handlePageChange(page: number) {
  pagination.setPage(page);
}
</script>

<style scoped>
.cards-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.cards-content {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .cards-content {
    border-radius: 12px;
  }
}
</style>
