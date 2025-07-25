<template>
  <div class="trade-list">
    <div v-if="loading && trades.length === 0" class="d-flex flex-column align-center justify-center py-10 text-grey">
      <LoadingSpinner text="Carregando trocas..." />
    </div>

    <div v-else-if="error && trades.length === 0" class="d-flex flex-column align-center justify-center py-10 text-center">
      <div class="mb-4 text-error">{{ error }}</div>
      <v-btn @click="retry" color="primary" variant="elevated">Tentar novamente</v-btn>
    </div>

    <div v-else-if="trades.length === 0" class="d-flex align-center justify-center py-10">
      <div class="text-center max-width-400">
        <div class="mb-4 text-h1 opacity-50">
          <v-icon size="64" color="grey">mdi-cards</v-icon>
        </div>
        <h3 class="mb-2 font-weight-bold">Nenhuma troca disponível</h3>
        <p class="mb-4 text-grey">Seja o primeiro a criar uma troca no marketplace!</p>
        <v-btn v-if="isAuthenticated" @click="goToCreateTrade" color="primary" variant="elevated" class="mb-2">
          Criar Primeira Troca
        </v-btn>
        <v-btn v-else @click="goToLogin" color="primary" variant="elevated">
          Fazer Login para Criar Troca
        </v-btn>
      </div>
    </div>

    <div v-else class="trades-content">
      <div class="d-flex align-center justify-space-between mb-4 pb-2 border-b">
        <h3 class="mb-0 text-grey-darken-2 text-h6">
          {{ trades.length }} troca{{ trades.length !== 1 ? 's' : '' }} encontrada{{ trades.length !== 1 ? 's' : '' }}
        </h3>
      </div>
      
      <div class="trades-list">
        <TradeItem
          v-for="trade in trades"
          :key="trade.id"
          :trade="trade"
          :show-actions="false"
          :show-status="true"
          status="active"
          class="mb-3"
          @delete="handleDeleteTrade"
          @card-click="handleCardClick"
        />
      </div>
      
      <SimplePagination
        v-if="showPagination && pagination.total > 0"
        :total-items="pagination.total"
        :items-per-page="pagination.rpp"
        :current-page="pagination.page"
        :loading="loading"
        @page-change="handlePageChange"
      />
    </div>

    <div v-if="loading && trades.length > 0" class="d-flex flex-column align-center justify-center py-6 text-grey">
      <LoadingSpinner text="Carregando mais trocas..." size="32" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { useNotificationStore } from '../../../stores/notification';
import TradeItem from './TradeItem.vue';
import SimplePagination from '../../common/SimplePagination.vue';
import LoadingSpinner from '../../common/LoadingSpinner.vue';
import type { Trade } from '../../../types';
import type { Card } from '../../../types/cards';

interface Props {
  trades: Trade[];
  loading?: boolean;
  error?: string | null;
  showPagination?: boolean;
  pagination?: {
    page: number;
    rpp: number;
    total: number;
    more: boolean;
  };
}

interface Emits {
  (e: 'retry'): void;
  (e: 'page-change', page: number): void;
  (e: 'delete', tradeId: string): void;
  (e: 'card-click', card: Card): void;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  showPagination: false,
  pagination: () => ({
    page: 1,
    rpp: 10,
    total: 0,
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

function handlePageChange(page: number) {
  emit('page-change', page);
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

function handleCardClick(card: Card) {
  emit('card-click', card);
}
</script>

<style scoped>
.trade-list {
  width: 100%;
}

.trades-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style> 
