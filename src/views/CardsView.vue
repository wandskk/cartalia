<template>
  <div class="cards-view">
    <Container>
      <CardsHeader @add-cards="showAddForm = true" />

      <CardStats 
        :total-cards="totalUserCards" 
        :recent-cards="recentCards" 
      />

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

        <CardsEmptyState 
          v-else-if="isEmpty" 
          @add-cards="showAddForm = true" 
        />

        <div v-else-if="!loading" class="cards-content">
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
        </div>
      </div>

      <AddCardModal 
        v-model="showAddForm" 
        @cards-added="fetchUserCards"
      />
      
      <CardDetailModal 
        v-model="showCardDetail" 
        :card-id="selectedCardId"
      />
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
import BaseButton from "../components/common/BaseButton.vue";
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
const selectedCardId = ref<string>('');
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
  setViewMode
} = useCardFilters(userCards);

const paginatedCards = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredCards.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
  return Math.ceil(filteredCards.value.length / itemsPerPage.value);
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

<style scoped lang="scss">
@use "../styles/_variables.scss" as *;

.cards-view {
  min-height: 100vh;
  background: linear-gradient(135deg, $gray-50 0%, $white 100%);
  padding: 24px 0;

  .user-cards-section {
    .cards-content {
      background: $white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(0, 0, 0, 0.05);

      @media (max-width: 768px) {
        padding: 16px;
        border-radius: 12px;
      }
    }
  }
}
</style>
