<template>
  <div class="marketplace-view">
    <Container>
      <PageHeader 
        title="Marketplace de Cartas"
        subtitle="Explore as trocas disponíveis e encontre as cartas que você procura"
      >
        <template #actions>
          <div v-if="isAuthenticated">
          <BaseButton @click="goToCreateTrade" color="primary">
            Criar Nova Troca
          </BaseButton>
        </div>
        
          <div v-else>
          <BaseButton @click="goToLogin" color="primary">
            Fazer Login
          </BaseButton>
          <BaseButton @click="goToRegister" color="secondary">
            Cadastrar
          </BaseButton>
        </div>
        </template>
      </PageHeader>

      <div class="stats">
        <StatCard
          :number="totalTrades"
          label="Trocas Disponíveis"
        />
      </div>

      <div class="trades-section">
        <TradeList
          :trades="trades"
          :loading="loading"
          :error="error"
          :show-pagination="true"
          :pagination="pagination"
          @retry="fetchTrades"
          @load-more="loadMoreTrades"
          @delete="handleDeleteTrade"
        />
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTradesStore } from '../stores/trades';
import { useAuthStore } from '../stores/auth';
import Container from '../components/common/Container.vue';
import BaseButton from '../components/common/BaseButton.vue';
import PageHeader from '../components/common/PageHeader.vue';
import TradeList from '../components/features/trades/TradeList.vue';
import StatCard from '../components/common/StatCard.vue';

const router = useRouter();
const tradesStore = useTradesStore();
const authStore = useAuthStore();

const loading = computed(() => tradesStore.loading);
const error = computed(() => tradesStore.error);
const trades = computed(() => tradesStore.allTrades);
const totalTrades = computed(() => tradesStore.totalTrades);
const pagination = computed(() => tradesStore.pagination);
const isAuthenticated = computed(() => authStore.isAuthenticated);

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

function goToCreateTrade() {
  // Funcionalidade movida para modal na tela de minhas trocas
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

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 24px;

    .header-content {
      flex: 1;

      h1 {
        margin: 0 0 8px 0;
        color: $black;
        font-size: 36px;
        font-weight: 700;
      }

      p {
        margin: 0;
        color: $gray-600;
        font-size: 18px;
        line-height: 1.5;
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
      align-items: stretch;

      .header-content {
        h1 {
          font-size: 28px;
        }

        p {
          font-size: 16px;
        }
      }
    }
  }

  .stats {
    margin-bottom: 32px;
  }

  .trades-section {
    background: $white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style> 
