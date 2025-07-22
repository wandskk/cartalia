<template>
  <div class="my-trades-view">
    <Container>
      <div class="header">
        <div class="header-content">
          <h1>Minhas Trocas</h1>
          <p>Gerencie suas solicitações de troca</p>
        </div>
        
        <div class="header-actions">
          <BaseButton @click="goToCreateTrade" color="primary">
            Nova Troca
          </BaseButton>
        </div>
      </div>

      <div class="stats">
        <div class="stat-card">
          <span class="stat-number">{{ totalTrades }}</span>
          <span class="stat-label">Total de Trocas</span>
        </div>
        
        <div class="stat-card">
          <span class="stat-number">{{ activeTrades }}</span>
          <span class="stat-label">Trocas Ativas</span>
        </div>
      </div>

      <div class="trades-section">
        <MyTradeList
          :trades="userTrades"
          :loading="loading"
          :error="error"
          @retry="fetchUserTrades"
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
import MyTradeList from '../components/features/trades/MyTradeList.vue';
import type { Trade } from '../types';

const router = useRouter();
const tradesStore = useTradesStore();
const authStore = useAuthStore();

const loading = computed(() => tradesStore.loading);
const error = computed(() => tradesStore.error);
const userTrades = computed(() => tradesStore.userTrades);
const totalTrades = computed(() => tradesStore.totalUserTrades);

const activeTrades = computed(() => {
  return userTrades.value.length;
});

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchUserTrades();
  } else {
    router.push('/login');
  }
});

async function fetchUserTrades() {
  await tradesStore.fetchAllTrades();
}

async function handleDeleteTrade(trade: Trade) {
  await tradesStore.deleteTrade(trade.id);
}

function goToCreateTrade() {
  router.push('/create-trade');
}
</script>

<style scoped lang="scss">
@use '../styles/_variables.scss' as *;

.my-trades-view {
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
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
    flex-wrap: wrap;

    .stat-card {
      background: $white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      min-width: 150px;
      flex: 1;

      .stat-number {
        display: block;
        font-size: 36px;
        font-weight: 700;
        color: $primary;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: $gray-600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;

      .stat-card {
        min-width: auto;
      }
    }
  }

  .trades-section {
    background: $white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style> 
