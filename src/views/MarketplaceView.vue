<template>
  <div class="marketplace-view">
    <Container>
      <PageHeader
        title="Marketplace de Cartas"
        subtitle="Explore as trocas disponíveis e encontre as cartas que você procura"
      >
        <template #actions>
          <div v-if="isAuthenticated" class="header-actions">
            <v-btn @click="goToCreateTrade" color="primary" variant="elevated">
              Criar Nova Troca
            </v-btn>
          </div>

          <div v-else class="header-actions">
            <v-btn @click="goToLogin" color="primary" variant="elevated">
              Fazer Login
            </v-btn>
            <v-btn @click="goToRegister" variant="outlined" color="grey">
              Cadastrar
            </v-btn>
          </div>
        </template>
      </PageHeader>

      <div class="marketplace-content">
        <div class="stats-section">
          <StatCard :number="filteredTradesCount" label="Trocas Disponíveis" />
        </div>

        <v-card class="trades-section" elevation="2">
          <v-card-text class="pa-6">
            <TradeFilters 
              @filters-change="handleFiltersChange"
              @page-change="handleLocalPageChange"
              :loading="loading"
              :show-pagination="showLocalPagination"
              :total-items="totalFilteredTrades"
              :items-per-page="pagination.itemsPerPage.value"
              :current-page="pagination.currentPage.value"
            />

            <TradeList
              :trades="paginatedTradesList"
              :loading="loading"
              :error="error"
              :show-pagination="false"
              :pagination="storePagination"
              @retry="fetchTrades"
              @page-change="handlePageChange"
              @delete="handleDeleteTrade"
              @card-click="handleCardClick"
            />
          </v-card-text>
        </v-card>
      </div>
    </Container>

    <!-- Modal de Detalhes da Carta -->
    <CardDetailModal
      v-model="showCardDetailModal"
      :card-id="selectedCardId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useTradesStore } from "../stores/trades";
import { useAuthStore } from "../stores/auth";
import { useMarketplaceFilters } from "../composables/useMarketplaceFilters";
import { usePagination } from "../composables/usePagination";
import { useLoadingState } from "../composables/useLoadingState";
import Container from "../components/common/Container.vue";
import PageHeader from "../components/common/PageHeader.vue";
import TradeList from "../components/features/trades/TradeList.vue";
import TradeFilters from "../components/features/trades/TradeFilters.vue";
import StatCard from "../components/common/StatCard.vue";
import CardDetailModal from "../components/features/cards/CardDetailModal.vue";
import type { Card } from "../types/cards";

const router = useRouter();
const tradesStore = useTradesStore();
const authStore = useAuthStore();

// Composables
const { isLoading: loading, withLoading } = useLoadingState();
const pagination = usePagination({
  initialItemsPerPage: 12
});

const { filteredTrades, updateFilters } = useMarketplaceFilters();

// Modal de detalhes da carta
const showCardDetailModal = ref(false);
const selectedCardId = ref<string>("");

// Store computed properties
const error = computed(() => tradesStore.error);
const trades = computed(() => tradesStore.allTrades);
const storePagination = computed(() => tradesStore.pagination);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const filteredTradesList = computed(() => {
  return filteredTrades.value(trades.value);
});

const totalFilteredTrades = computed(() => {
  return filteredTradesList.value.length;
});

const showLocalPagination = computed(() => {
  return totalFilteredTrades.value > pagination.itemsPerPage.value;
});

const paginatedTradesList = computed(() => {
  pagination.setTotalItems(filteredTradesList.value.length);
  return pagination.paginateItems(filteredTradesList.value);
});

const filteredTradesCount = computed(() => {
  return totalFilteredTrades.value;
});

onMounted(() => {
  fetchTrades();
});

async function fetchTrades() {
  await withLoading(async () => {
    // Carregar mais trades da API para ter dados suficientes para filtragem
    await tradesStore.fetchAllTrades(1, 50, true); // Carregar 50 trades de uma vez
  }, "Carregando trades...");
}

async function handlePageChange(page: number) {
  // Carregar mais trades da API se necessário
  if (page > Math.ceil(trades.value.length / storePagination.value.rpp)) {
    const nextPage = Math.ceil(trades.value.length / storePagination.value.rpp) + 1;
    await tradesStore.fetchAllTrades(nextPage, storePagination.value.rpp, false);
  }
}

function handleLocalPageChange(page: number) {
  pagination.setPage(page);
}

async function handleDeleteTrade(tradeId: string) {
  await tradesStore.deleteTrade(tradeId);
}

function handleFiltersChange(newFilters: any) {
  updateFilters(newFilters);
  // Reset para primeira página quando filtrar
  pagination.firstPage();
}

function handleCardClick(card: Card) {
  selectedCardId.value = card.id;
  showCardDetailModal.value = true;
}

function goToCreateTrade() {
  router.push("/my-trades");
}

function goToLogin() {
  router.push("/login");
}

function goToRegister() {
  router.push("/register");
}
</script>

<style scoped>
.marketplace-view {
  min-height: 100vh;
  background: #f8fafc;
}

.marketplace-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-section {
  display: flex;
}

.trades-section {
  border-radius: 12px;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .marketplace-content {
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
    margin-top: 16px;
  }
}
</style>
