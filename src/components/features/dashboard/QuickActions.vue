<template>
  <div class="quick-actions">
    <h3>Ações Rápidas</h3>
    
    <div class="actions-grid">
      <div class="action-card" @click="goToCards">
        <div class="action-icon">🃏</div>
        <div class="action-content">
          <h4>Minhas Cartas</h4>
          <p>Visualize e gerencie sua coleção de cartas</p>
          <div class="action-meta">
            <span class="card-count">{{ totalCards }} carta{{ totalCards !== 1 ? 's' : '' }}</span>
          </div>
        </div>
        <div class="action-arrow">→</div>
      </div>

      <div class="action-card" @click="goToMarketplace">
        <div class="action-icon">🏪</div>
        <div class="action-content">
          <h4>Marketplace</h4>
          <p>Explore trocas disponíveis no marketplace</p>
          <div class="action-meta">
            <span class="marketplace-count">{{ marketplaceTrades }} troca{{ marketplaceTrades !== 1 ? 's' : '' }} disponível{{ marketplaceTrades !== 1 ? 'eis' : '' }}</span>
          </div>
        </div>
        <div class="action-arrow">→</div>
      </div>

      <div class="action-card" @click="goToMyTrades">
        <div class="action-icon">📋</div>
        <div class="action-content">
          <h4>Minhas Trocas</h4>
          <p>Gerencie suas solicitações de troca</p>
          <div class="action-meta">
            <span class="trades-count">{{ userTrades }} troca{{ userTrades !== 1 ? 's' : '' }} ativa{{ userTrades !== 1 ? 's' : '' }}</span>
          </div>
        </div>
        <div class="action-arrow">→</div>
      </div>

      <div class="action-card" @click="goToCreateTrade">
        <div class="action-icon">➕</div>
        <div class="action-content">
          <h4>Nova Troca</h4>
          <p>Crie uma nova solicitação de troca</p>
          <div class="action-meta">
            <span class="create-hint">Criar agora</span>
          </div>
        </div>
        <div class="action-arrow">→</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Props {
  totalCards: number;
  userTrades: number;
  marketplaceTrades: number;
}

defineProps<Props>();

const router = useRouter();

function goToCards() {
  router.push('/cards');
}

function goToMarketplace() {
  router.push('/marketplace');
}

function goToMyTrades() {
  router.push('/my-trades');
}

function goToCreateTrade() {
  router.push('/create-trade');
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.quick-actions {
  margin-bottom: 32px;

  h3 {
    margin: 0 0 20px 0;
    color: $black;
    font-size: 20px;
    font-weight: 600;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }

          .action-card {
        background: $white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 16px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .action-icon {
        width: 52px;
        height: 52px;
        background: $gray-100;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
      }

      .action-content {
        flex: 1;
        min-width: 0;

        h4 {
          margin: 0 0 6px 0;
          color: $black;
          font-size: 18px;
          font-weight: 600;
        }

        p {
          margin: 0 0 10px 0;
          color: $gray-600;
          font-size: 15px;
          line-height: 1.4;
        }

        .action-meta {
          .card-count,
          .marketplace-count,
          .trades-count,
          .create-hint {
            font-size: 12px;
            color: $primary;
            font-weight: 500;
            background: rgba($primary, 0.1);
            padding: 2px 8px;
            border-radius: 12px;
          }
        }
      }

      .action-arrow {
        color: $gray-400;
        font-size: 18px;
        font-weight: bold;
        transition: transform 0.2s ease;
      }

      &:hover .action-arrow {
        transform: translateX(4px);
        color: $primary;
      }
    }
  }
}
</style> 