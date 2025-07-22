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
  margin-bottom: 0;

  h3 {
    margin: 0 0 2rem 0;
    color: #1e293b;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.3;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 1.375rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.25rem;
      margin-bottom: 1.25rem;
    }
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    width: 100%;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    @media (max-width: 480px) {
      gap: 0.875rem;
    }

    .action-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 1.5rem;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      position: relative;
      overflow: hidden;

      @media (max-width: 768px) {
        padding: 1.5rem;
        gap: 1.25rem;
      }

      @media (max-width: 480px) {
        padding: 1.25rem;
        gap: 1rem;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-4px);
        background: rgba(255, 255, 255, 0.95);
        border-color: rgba(59, 130, 246, 0.2);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

        &::before {
          opacity: 1;
        }

        .action-arrow {
          transform: translateX(6px);
          color: #3b82f6;
        }
      }

      .action-icon {
        width: 4rem;
        height: 4rem;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        flex-shrink: 0;
        border: 1px solid rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;

        @media (max-width: 768px) {
          width: 3.5rem;
          height: 3.5rem;
          font-size: 1.5rem;
          border-radius: 0.875rem;
        }

        @media (max-width: 480px) {
          width: 3rem;
          height: 3rem;
          font-size: 1.25rem;
          border-radius: 0.75rem;
        }
      }

      .action-content {
        flex: 1;
        min-width: 0;

        h4 {
          margin: 0 0 0.5rem 0;
          color: #1e293b;
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.3;

          @media (max-width: 768px) {
            font-size: 1.125rem;
            margin-bottom: 0.375rem;
          }

          @media (max-width: 480px) {
            font-size: 1rem;
            margin-bottom: 0.25rem;
          }
        }

        p {
          margin: 0 0 0.75rem 0;
          color: #64748b;
          font-size: 0.9375rem;
          line-height: 1.5;

          @media (max-width: 768px) {
            font-size: 0.875rem;
            margin-bottom: 0.625rem;
          }

          @media (max-width: 480px) {
            font-size: 0.8125rem;
            margin-bottom: 0.5rem;
          }
        }

        .action-meta {
          .card-count,
          .marketplace-count,
          .trades-count,
          .create-hint {
            font-size: 0.75rem;
            color: #3b82f6;
            font-weight: 600;
            background: rgba(59, 130, 246, 0.1);
            padding: 0.375rem 0.75rem;
            border-radius: 1rem;
            display: inline-block;
            line-height: 1.2;

            @media (max-width: 480px) {
              font-size: 0.6875rem;
              padding: 0.25rem 0.5rem;
              border-radius: 0.75rem;
            }
          }
        }
      }

      .action-arrow {
        color: #94a3b8;
        font-size: 1.25rem;
        font-weight: 600;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        flex-shrink: 0;

        @media (max-width: 768px) {
          font-size: 1.125rem;
        }

        @media (max-width: 480px) {
          font-size: 1rem;
        }
      }
    }
  }
}
</style> 
