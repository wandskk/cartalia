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
              :items-per-page="itemsPerPage"
              :current-page="currentPage"
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
import { useLoadingStore } from "../stores/loading";
import { useCardFilters } from "../composables/useCardFilters";
import { useCardStates } from "../composables/useCardStates";
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
const loadingStore = useLoadingStore();

const showAddForm = ref(false);
const showCardDetail = ref(false);
const selectedCardId = ref<string>("");
const currentPage = ref(1);
const itemsPerPage = ref(12);

const loading = computed(() => cardsStore.loading);
const error = computed(() => cardsStore.error);
const userCards = computed(() => cardsStore.userCards);
const totalUserCards = computed(() => cardsStore.totalUserCards);

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

const paginatedCards = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredCards.value.slice(startIndex, endIndex);
});

const { hasError, isEmpty } = useCardStates(loading, error, userCards);

onMounted(async () => {
  if (authStore.isAuthenticated) {
    loadingStore.startLoading();
    try {
      await fetchUserCards();
    } finally {
      loadingStore.stopLoading();
    }
  } else {
    router.push("/login");
  }
});

watch([searchQuery, currentFilter], () => {
  currentPage.value = 1;
});

async function fetchUserCards() {
  loadingStore.startLoading();
  try {
    await cardsStore.fetchUserCards();
  } finally {
    loadingStore.stopLoading();
  }
}

function handleCardClick(card: Card) {
  selectedCardId.value = card.id;
  showCardDetail.value = true;
}

function handlePageChange(page: number) {
  currentPage.value = page;
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
