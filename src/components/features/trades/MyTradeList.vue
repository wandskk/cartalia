<template>
  <div class="my-trade-list">
    <div class="list-header">
      <div class="filters">
        <BaseInput
          v-model="searchTerm"
          placeholder="Buscar minhas trocas..."
          @input="handleSearch"
        />
        
        <select v-model="sortBy" @change="handleSort" class="sort-select">
          <option value="createdAt">Mais recentes</option>
          <option value="createdAt-asc">Mais antigas</option>
          <option value="cards">Mais cartas</option>
        </select>
      </div>
      
      <div class="stats">
        <span class="stat">
          {{ filteredTrades.length }} troca{{ filteredTrades.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>

    <div v-if="loading && trades.length === 0" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando suas trocas...</p>
    </div>

    <div v-else-if="error && trades.length === 0" class="error-state">
      <p class="error-message">{{ error }}</p>
      <BaseButton @click="retry" color="primary">Tentar novamente</BaseButton>
    </div>

    <div v-else-if="filteredTrades.length === 0" class="empty-state">
      <div class="empty-content">
        <h3>{{ searchTerm ? 'Nenhuma troca encontrada' : 'Você ainda não tem trocas' }}</h3>
        <p v-if="!searchTerm">Crie sua primeira troca para começar a negociar!</p>
        <p v-else>Tente ajustar os filtros de busca.</p>
        <BaseButton v-if="!searchTerm" @click="goToCreateTrade" color="primary">
          Criar Primeira Troca
        </BaseButton>
      </div>
    </div>

    <div v-else class="trades-content">
      <div class="trades-grid">
        <div
          v-for="trade in filteredTrades"
          :key="trade.id"
          class="trade-item"
        >
          <div class="trade-header">
            <div class="trade-meta">
              <span class="trade-date">{{ formattedDate(trade.createdAt) }}</span>
              <span class="trade-id">#{{ trade.id.slice(0, 8) }}</span>
            </div>
            <TradeActions
              @edit="handleEdit(trade)"
              @delete="handleDelete(trade)"
            />
          </div>

          <div class="trade-content">
            <div class="cards-section">
              <div class="offering-section">
                <h4>Oferecendo</h4>
                <div class="cards-preview">
                  <div 
                    v-for="tradeCard in getOfferingCards(trade)" 
                    :key="tradeCard.id"
                    class="card-preview"
                  >
                    <img :src="tradeCard.card.imageUrl" :alt="tradeCard.card.name" />
                    <span class="card-name">{{ tradeCard.card.name }}</span>
                  </div>
                </div>
              </div>

              <div class="trade-arrow">
                <span>⇄</span>
              </div>

              <div class="receiving-section">
                <h4>Recebendo</h4>
                <div class="cards-preview">
                  <div 
                    v-for="tradeCard in getReceivingCards(trade)" 
                    :key="tradeCard.id"
                    class="card-preview"
                  >
                    <img :src="tradeCard.card.imageUrl" :alt="tradeCard.card.name" />
                    <span class="card-name">{{ tradeCard.card.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../../../stores/notification';
import BaseInput from '../../common/BaseInput.vue';
import BaseButton from '../../common/BaseButton.vue';
import TradeActions from './TradeActions.vue';
import type { Trade, TradeCard } from '../../../types/trade';

interface Props {
  trades: Trade[];
  loading?: boolean;
  error?: string | null;
}

interface Emits {
  (e: 'retry'): void;
  (e: 'delete', trade: Trade): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null
});

const emit = defineEmits<Emits>();

const router = useRouter();
const notification = useNotificationStore();

const searchTerm = ref('');
const sortBy = ref('createdAt');

const filteredTrades = computed(() => {
  let filtered = [...props.trades];

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(trade => {
      const offeringCards = getOfferingCards(trade);
      const receivingCards = getReceivingCards(trade);
      
      return offeringCards.some(card => 
        card.card.name.toLowerCase().includes(term) ||
        card.card.description.toLowerCase().includes(term)
      ) || receivingCards.some(card => 
        card.card.name.toLowerCase().includes(term) ||
        card.card.description.toLowerCase().includes(term)
      );
    });
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'createdAt-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'cards':
        return b.tradeCards.length - a.tradeCards.length;
      default:
        return 0;
    }
  });

  return filtered;
});

function getOfferingCards(trade: Trade): TradeCard[] {
  return trade.tradeCards.filter(tradeCard => tradeCard.type === 'OFFERING');
}

function getReceivingCards(trade: Trade): TradeCard[] {
  return trade.tradeCards.filter(tradeCard => tradeCard.type === 'RECEIVING');
}

function formattedDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function handleSearch() {
  // Implementação futura: debounce para busca em tempo real
}

function handleSort() {
  // A ordenação é feita automaticamente pelo computed
}

function retry() {
  emit('retry');
}

function goToCreateTrade() {
  router.push('/create-trade');
}

function handleEdit(_trade: Trade) {
  notification.show('Funcionalidade de edição em desenvolvimento', 'info');
}

async function handleDelete(trade: Trade) {
  try {
    emit('delete', trade);
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

.my-trade-list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;

    .filters {
      display: flex;
      gap: 12px;
      flex: 1;

      .sort-select {
        padding: 8px 12px;
        border: 1px solid $gray-300;
        border-radius: 6px;
        background: $white;
        font-size: 14px;
        color: $black;
        cursor: pointer;

        &:focus {
          outline: none;
          border-color: $primary;
        }
      }

      @media (max-width: 768px) {
        flex-direction: column;
        width: 100%;
      }
    }

    .stats {
      .stat {
        font-size: 14px;
        color: $gray-600;
        font-weight: 500;
      }
    }
  }

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
    .trades-grid {
      display: grid;
      gap: 20px;

      .trade-item {
        background: $white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }

        .trade-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          .trade-meta {
            display: flex;
            gap: 12px;
            align-items: center;

            .trade-date {
              font-size: 14px;
              color: $gray-600;
            }

            .trade-id {
              font-size: 12px;
              color: $gray-500;
              font-family: monospace;
              background: $gray-100;
              padding: 2px 6px;
              border-radius: 4px;
            }
          }
        }

        .trade-content {
          .cards-section {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 20px;
            align-items: center;

            @media (max-width: 768px) {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .offering-section,
            .receiving-section {
              h4 {
                margin: 0 0 12px 0;
                color: $black;
                font-size: 14px;
                font-weight: 600;
                text-align: center;
              }

              .cards-preview {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .card-preview {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  padding: 8px;
                  background: $gray-100;
                  border-radius: 6px;

                  img {
                    width: 32px;
                    height: 32px;
                    object-fit: cover;
                    border-radius: 4px;
                  }

                  .card-name {
                    font-size: 12px;
                    color: $black;
                    font-weight: 500;
                    flex: 1;
                  }
                }
              }
            }

            .trade-arrow {
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              color: $primary;
              font-weight: bold;

              @media (max-width: 768px) {
                transform: rotate(90deg);
              }
            }
          }
        }
      }
    }
  }
}
</style> 