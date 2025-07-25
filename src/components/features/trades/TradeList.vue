<template>
  <div class="trade-list">
    <div v-if="loading && trades.length === 0" class="d-flex flex-column align-center justify-center py-10 text-grey">
      <v-progress-circular indeterminate color="primary" size="48" class="mb-4" />
      <p>Carregando trocas...</p>
    </div>

    <div v-else-if="error && trades.length === 0" class="d-flex flex-column align-center justify-center py-10 text-center">
      <div class="mb-4 text-error">{{ error }}</div>
      <v-btn @click="retry" color="primary" variant="elevated">Tentar novamente</v-btn>
    </div>

    <div v-else-if="trades.length === 0" class="d-flex align-center justify-center py-10">
      <div class="text-center" style="max-width: 400px;">
        <div class="mb-4" style="font-size: 48px; opacity: 0.5;">🃏</div>
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
      <v-row class="mb-6" dense>
        <v-col
          v-for="trade in trades"
          :key="trade.id"
          cols="12"
          md="6"
          lg="4"
          class="mb-2"
        >
          <TradeItem
            :trade="trade"
            :show-actions="false"
            :show-status="true"
            status="active"
            @delete="handleDeleteTrade"
          />
        </v-col>
      </v-row>
      <div v-if="showPagination && pagination.more" class="d-flex justify-center mt-6 pt-4 border-t">
        <v-btn 
          @click="loadMore" 
          :loading="loading"
          color="secondary"
          variant="elevated"
        >
          Carregar mais trocas
        </v-btn>
      </div>
    </div>

    <div v-if="loading && trades.length > 0" class="d-flex flex-column align-center justify-center py-6 text-grey">
      <v-progress-circular indeterminate color="primary" size="32" class="mb-2" />
      <p>Carregando mais trocas...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';
import { useNotificationStore } from '../../../stores/notification';
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
.trade-list {
  width: 100%;
}
</style> 
