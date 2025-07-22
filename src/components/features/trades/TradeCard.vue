<template>
  <Card class="trade-card">
    <div class="trade-header">
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-details">
          <h3 class="user-name">{{ trade.user.name }}</h3>
          <span class="trade-date">{{ formattedDate }}</span>
        </div>
      </div>
      
      <div v-if="isOwner" class="trade-actions">
        <BaseButton 
          @click="handleDelete"
          color="error"
          size="small"
        >
          Deletar
        </BaseButton>
      </div>
    </div>

    <div class="trade-content">
      <div class="cards-section">
        <div class="offering-section">
          <h4>Oferecendo</h4>
          <div class="cards-grid">
            <div 
              v-for="tradeCard in offeringCards" 
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
          <div class="cards-grid">
            <div 
              v-for="tradeCard in receivingCards" 
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
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import Card from '../../common/Card.vue';
import BaseButton from '../../common/BaseButton.vue';
import type { Trade } from '../../../types/trade';

interface Props {
  trade: Trade;
}

interface Emits {
  (e: 'delete', tradeId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const authStore = useAuthStore();

const userInitials = computed(() => {
  const name = props.trade.user.name;
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const formattedDate = computed(() => {
  return new Date(props.trade.createdAt).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const offeringCards = computed(() => {
  return props.trade.tradeCards.filter(tradeCard => tradeCard.type === 'OFFERING');
});

const receivingCards = computed(() => {
  return props.trade.tradeCards.filter(tradeCard => tradeCard.type === 'RECEIVING');
});

const isOwner = computed(() => {
  return authStore.user?.id === props.trade.userId;
});

function handleDelete() {
  if (confirm('Tem certeza que deseja deletar esta troca?')) {
    emit('delete', props.trade.id);
  }
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.trade-card {
  padding: 24px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .trade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .user-avatar {
        width: 40px;
        height: 40px;
        background: $primary;
        color: $white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 14px;
      }

      .user-details {
        .user-name {
          margin: 0 0 4px 0;
          color: $black;
          font-size: 16px;
          font-weight: 600;
        }

        .trade-date {
          font-size: 12px;
          color: $gray-500;
        }
      }
    }

    .trade-actions {
      .base-button {
        font-size: 12px;
        padding: 6px 12px;
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

        .cards-grid {
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
              width: 40px;
              height: 40px;
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
        font-size: 24px;
        color: $primary;
        font-weight: bold;

        @media (max-width: 768px) {
          transform: rotate(90deg);
        }
      }
    }
  }
}
</style> 