<template>
  <div class="marketplace-view">
    <Container>
      <PageHeader 
        title="Marketplace de Cartas"
        subtitle="Explore as trocas disponíveis e encontre as cartas que você procura"
      >
        <template #actions>
          <div v-if="isAuthenticated" class="header-actions">
            <BaseButton @click="goToCreateTrade" color="primary">
              Criar Nova Troca
            </BaseButton>
          </div>
        
          <div v-else class="header-actions">
            <BaseButton @click="goToLogin" color="primary">
              Fazer Login
            </BaseButton>
            <BaseButton @click="goToRegister" color="secondary">
              Cadastrar
            </BaseButton>
          </div>
        </template>
      </PageHeader>

      <div class="marketplace-content">
        <div class="stats-section">
          <StatCard
            :number="filteredTradesCount"
            label="Trocas Disponíveis"
          />
        </div>

        <div class="trades-section">
          <TradeFilters @filters-change="handleFiltersChange" />
          
          <TradeList
            :trades="filteredTradesList"
            :loading="loading"
            :error="error"
            :show-pagination="true"
            :pagination="pagination"
            @retry="fetchTrades"
            @load-more="loadMoreTrades"
            @delete="handleDeleteTrade"
          />
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTradesStore } from '../stores/trades';
import { useAuthStore } from '../stores/auth';
import { useMarketplaceFilters } from '../composables/useMarketplaceFilters';
import Container from '../components/common/Container.vue';
import BaseButton from '../components/common/BaseButton.vue';
import PageHeader from '../components/common/PageHeader.vue';
import TradeList from '../components/features/trades/TradeList.vue';
import TradeFilters from '../components/features/trades/TradeFilters.vue';
import StatCard from '../components/common/StatCard.vue';

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

async function loadMoreTrades() {
  const nextPage = pagination.value.page + 1;
  await tradesStore.fetchAllTrades(nextPage, pagination.value.rpp);
}

async function handleDeleteTrade(tradeId: string) {
  await tradesStore.deleteTrade(tradeId);
}

function handleFiltersChange(newFilters: any) {
  updateFilters(newFilters);
}

function goToCreateTrade() {
  router.push('/my-trades');
}

function goToLogin() {
  router.push('/login');
}

function goToRegister() {
  router.push('/register');
}
</script>

<style scoped lang="scss">
@use '../styles/_variables.scss' as *;

.marketplace-view {
  min-height: 100vh;
  background: $gray-50;
  padding: 24px 0;

  .marketplace-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .stats-section {
    display: flex;
    justify-content: center;
  }

  .trades-section {
    background: $white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .header-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: center;
      margin-top: 16px;
    }
  }
}

@media (max-width: 768px) {
  .marketplace-view {
    padding: 16px 0;

    .marketplace-content {
      gap: 16px;
    }

    .trades-section {
      padding: 16px;
    }
  }
}
</style> 
