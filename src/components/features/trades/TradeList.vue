<template>
  <div class="trade-list">
    <div v-if="loading && trades.length === 0" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando trocas...</p>
    </div>

    <div v-else-if="error && trades.length === 0" class="error-state">
      <p class="error-message">{{ error }}</p>
      <BaseButton @click="retry" color="primary">Tentar novamente</BaseButton>
    </div>

    <div v-else-if="trades.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">🃏</div>
        <h3>Nenhuma troca disponível</h3>
        <p>Seja o primeiro a criar uma troca no marketplace!</p>
        <BaseButton v-if="isAuthenticated" @click="goToCreateTrade" color="primary">
          Criar Primeira Troca
        </BaseButton>
        <BaseButton v-else @click="goToLogin" color="primary">
          Fazer Login para Criar Troca
        </BaseButton>
      </div>
    </div>

    <div v-else class="trades-content">
      <div class="trades-header">
        <h3>{{ trades.length }} troca{{ trades.length !== 1 ? 's' : '' }} encontrada{{ trades.length !== 1 ? 's' : '' }}</h3>
      </div>

      <div class="trades-grid">
        <TradeItem
          v-for="trade in trades"
          :key="trade.id"
          :trade="trade"
          :show-actions="false"
          :show-status="true"
          status="active"
          @delete="handleDeleteTrade"
        />
      </div>

      <div v-if="showPagination && pagination.more" class="pagination">
        <BaseButton 
          @click="loadMore" 
          :loading="loading"
          color="secondary"
        >
          Carregar mais trocas
        </BaseButton>
      </div>
    </div>

    <div v-if="loading && trades.length > 0" class="loading-more">
      <div class="loading-spinner"></div>
      <p>Carregando mais trocas...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { useNotificationStore } from '../../../stores/notification';
import BaseButton from '../../common/BaseButton.vue';
import TradeItem from './TradeItem.vue';
import type { Trade } from '../../../types';

interface Props {
  trades: Trade[];
  loading?: boolean;
  error?: string | null;
  showPagination?: boolean;
  pagination?: {
    page: number;
    rpp: number;
    more: boolean;
  };
}

interface Emits {
  (e: 'retry'): void;
  (e: 'load-more'): void;
  (e: 'delete', tradeId: string): void;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  showPagination: false,
  pagination: () => ({
    page: 1,
    rpp: 10,
    more: false
  })
});

const emit = defineEmits<Emits>();

const router = useRouter();
const authStore = useAuthStore();
const notification = useNotificationStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

function retry() {
  emit('retry');
}

function loadMore() {
  emit('load-more');
}

function goToCreateTrade() {
  router.push('/my-trades');
}

function goToLogin() {
  router.push('/login');
}

async function handleDeleteTrade(trade: Trade) {
  try {
    emit('delete', trade.id);
    notification.show('Troca deletada com sucesso!', 'success');
  } catch (err: any) {
    notification.show(
      err.message || 'Erro ao deletar troca',
      'error'
    );
  }
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.trade-list {
  width: 100%;

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: $gray-600;

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid $gray-200;
      border-top: 4px solid $primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }

  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;

    .error-message {
      color: $error;
      margin-bottom: 16px;
      font-size: 16px;
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;

    .empty-content {
      text-align: center;
      max-width: 400px;

      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      h3 {
        margin: 0 0 16px 0;
        color: $black;
        font-size: 24px;
        font-weight: 600;
      }

      p {
        margin: 0 0 24px 0;
        color: $gray-600;
        font-size: 16px;
        line-height: 1.5;
      }
    }
  }

  .trades-content {
    .trades-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid $gray-200;

      h3 {
        margin: 0;
        color: $gray-700;
        font-size: 18px;
        font-weight: 500;
      }
    }

    .trades-grid {
      display: grid;
      gap: 24px;
      margin-bottom: 32px;

      @media (min-width: 768px) {
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      }

      @media (min-width: 1200px) {
        grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      }

      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid $gray-200;
    }
  }

  .loading-more {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
    color: $gray-600;

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid $gray-200;
      border-top: 3px solid $primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 12px;
    }
  }
}

@media (max-width: 768px) {
  .trade-list {
    .trades-content {
      .trades-header {
        margin-bottom: 16px;
        padding-bottom: 12px;

        h3 {
          font-size: 16px;
        }
      }

      .trades-grid {
        gap: 12px;
      }
    }

    .empty-state {
      padding: 60px 16px;

      .empty-content {
        .empty-icon {
          font-size: 48px;
        }

        h3 {
          font-size: 20px;
        }

        p {
          font-size: 14px;
        }
      }
    }
  }
}
</style> 
