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
            <TradeFilters @filters-change="handleFiltersChange" />

            <TradeList
              :trades="filteredTradesList"
              :loading="loading"
              :error="error"
              :show-pagination="true"
              :pagination="pagination"
              @retry="fetchTrades"
              @page-change="handlePageChange"
              @delete="handleDeleteTrade"
            />
          </v-card-text>
        </v-card>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTradesStore } from "../stores/trades";
import { useAuthStore } from "../stores/auth";
import { useMarketplaceFilters } from "../composables/useMarketplaceFilters";
import Container from "../components/common/Container.vue";
import PageHeader from "../components/common/PageHeader.vue";
import TradeList from "../components/features/trades/TradeList.vue";
import TradeFilters from "../components/features/trades/TradeFilters.vue";
import StatCard from "../components/common/StatCard.vue";

const router = useRouter();
const tradesStore = useTradesStore();
const authStore = useAuthStore();
const { filteredTrades, updateFilters } = useMarketplaceFilters();

const loading = computed(() => tradesStore.loading);
const error = computed(() => tradesStore.error);
const trades = computed(() => tradesStore.allTrades);
const pagination = computed(() => tradesStore.pagination);
const isAuthenticated = computed(() => authStore.isAuthenticated);

const filteredTradesList = computed(() => {
  return filteredTrades.value(trades.value);
});

const filteredTradesCount = computed(() => {
  return filteredTradesList.value.length;
});

onMounted(() => {
  fetchTrades();
});

async function fetchTrades() {
  await tradesStore.fetchAllTrades();
}

async function handlePageChange(page: number) {
  await tradesStore.fetchAllTrades(page, pagination.value.rpp);
}

async function handleDeleteTrade(tradeId: string) {
  await tradesStore.deleteTrade(tradeId);
}

function handleFiltersChange(newFilters: any) {
  updateFilters(newFilters);
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
