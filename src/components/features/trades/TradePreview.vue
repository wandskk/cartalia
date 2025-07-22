<template>
  <Card class="trade-preview">
    <div class="preview-header">
      <h3>Preview da Troca</h3>
      <span class="trade-status" :class="statusClass">{{ statusText }}</span>
    </div>

    <div class="preview-content">
      <div class="trade-layout">
        <div class="offering-section">
          <h4>Você está oferecendo</h4>
          <div class="cards-list">
            <div 
              v-for="card in offeringCards" 
              :key="card.id"
              class="card-item"
            >
              <img :src="card.imageUrl" :alt="card.name" />
              <div class="card-info">
                <span class="card-name">{{ card.name }}</span>
              </div>
            </div>
          </div>
          <div v-if="offeringCards.length === 0" class="empty-cards">
            <p>Nenhuma carta selecionada</p>
          </div>
        </div>

        <div class="trade-arrow">
          <span>⇄</span>
        </div>

        <div class="receiving-section">
          <h4>Você quer receber</h4>
          <div class="cards-list">
            <div 
              v-for="card in receivingCards" 
              :key="card.id"
              class="card-item"
            >
              <img :src="card.imageUrl" :alt="card.name" />
              <div class="card-info">
                <span class="card-name">{{ card.name }}</span>
              </div>
            </div>
          </div>
          <div v-if="receivingCards.length === 0" class="empty-cards">
            <p>Nenhuma carta selecionada</p>
          </div>
        </div>
      </div>

      <div class="trade-summary">
        <div class="summary-item">
          <span class="label">Total oferecendo:</span>
          <span class="value">{{ offeringCards.length }} carta{{ offeringCards.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Total recebendo:</span>
          <span class="value">{{ receivingCards.length }} carta{{ receivingCards.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Status:</span>
          <span class="value" :class="statusClass">{{ statusText }}</span>
        </div>
      </div>
    </div>

    <div class="preview-actions">
      <BaseButton 
        @click="createTrade"
        :loading="loading"
        :disabled="!isValid"
        color="primary"
      >
        Criar Troca
      </BaseButton>
      
      <BaseButton 
        @click="reset"
        color="secondary"
        :disabled="loading"
      >
        Limpar Seleção
      </BaseButton>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from '../../common/Card.vue';
import BaseButton from '../../common/BaseButton.vue';
import type { Card as CardType } from '../../../types/card';

interface Props {
  offeringCards: CardType[];
  receivingCards: CardType[];
  loading?: boolean;
}

interface Emits {
  (e: 'create'): void;
  (e: 'reset'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

const isValid = computed(() => {
  return props.offeringCards.length > 0 && props.receivingCards.length > 0;
});

const statusText = computed(() => {
  if (props.offeringCards.length === 0 && props.receivingCards.length === 0) {
    return 'Selecione as cartas';
  }
  if (props.offeringCards.length === 0) {
    return 'Selecione cartas para oferecer';
  }
  if (props.receivingCards.length === 0) {
    return 'Selecione cartas para receber';
  }
  return 'Pronto para criar';
});

const statusClass = computed(() => {
  if (isValid.value) {
    return 'status-ready';
  }
  return 'status-pending';
});

function createTrade() {
  if (isValid.value) {
    emit('create');
  }
}

function reset() {
  emit('reset');
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.trade-preview {
  padding: 24px;

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h3 {
      margin: 0;
      color: $black;
      font-size: 20px;
      font-weight: 600;
    }

    .trade-status {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.status-ready {
        background: $success;
        color: $white;
      }

      &.status-pending {
        background: $warning;
        color: $black;
      }
    }
  }

  .preview-content {
    .trade-layout {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 24px;
      align-items: center;
      margin-bottom: 24px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .offering-section,
      .receiving-section {
        h4 {
          margin: 0 0 16px 0;
          color: $black;
          font-size: 16px;
          font-weight: 600;
          text-align: center;
        }

        .cards-list {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .card-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: $gray-100;
            border-radius: 8px;

            img {
              width: 48px;
              height: 48px;
              object-fit: cover;
              border-radius: 6px;
            }

            .card-info {
              flex: 1;

              .card-name {
                font-size: 14px;
                color: $black;
                font-weight: 500;
              }
            }
          }
        }

        .empty-cards {
          padding: 24px;
          text-align: center;
          color: $gray-500;
          font-size: 14px;
          background: $gray-100;
          border-radius: 8px;
        }
      }

      .trade-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        color: $primary;
        font-weight: bold;

        @media (max-width: 768px) {
          transform: rotate(90deg);
        }
      }
    }

    .trade-summary {
      background: $gray-50;
      border-radius: 8px;
      padding: 16px;

      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }

        .label {
          font-size: 14px;
          color: $gray-600;
        }

        .value {
          font-size: 14px;
          font-weight: 600;
          color: $black;

          &.status-ready {
            color: $success;
          }

          &.status-pending {
            color: $warning;
          }
        }
      }
    }
  }

  .preview-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }
}
</style> 