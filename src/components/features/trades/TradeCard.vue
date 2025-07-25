<template>
  <v-card class="trade-card" elevation="2">
    <v-card-text class="pa-6">
      <div class="d-flex justify-space-between align-start mb-6">
        <div class="d-flex align-center">
          <v-avatar size="40" color="primary" class="mr-4">
            <span class="text-white font-weight-bold">{{ userInitials }}</span>
          </v-avatar>
          <div>
            <h3 class="text-subtitle-1 font-weight-bold mb-1">{{ trade.user.name }}</h3>
            <span class="text-caption text-grey">{{ formattedDate }}</span>
          </div>
        </div>
        
        <div v-if="isOwner">
          <v-btn 
            @click="handleDelete"
            color="error"
            size="small"
            variant="outlined"
            prepend-icon="mdi-delete"
          >
            Deletar
          </v-btn>
        </div>
      </div>

      <div class="cards-section">
        <div class="d-flex align-center justify-center ga-6">
          <div class="offering-section flex-grow-1">
            <h4 class="text-subtitle-2 font-weight-bold mb-3 text-center">Oferecendo</h4>
            <div class="cards-grid">
              <v-card
                v-for="tradeCard in offeringCards" 
                :key="tradeCard.id"
                class="card-preview d-flex flex-column align-center pa-3 mb-3"
                elevation="1"
              >
                <v-img 
                  :src="tradeCard.card.imageUrl" 
                  :alt="tradeCard.card.name" 
                  width="80" 
                  height="112" 
                  cover 
                  class="rounded mb-2" 
                />
                <span class="text-body-2 font-weight-medium text-center">{{ tradeCard.card.name }}</span>
              </v-card>
            </div>
          </div>

          <div class="trade-arrow d-flex align-center justify-center">
            <v-icon size="24" color="primary">mdi-swap-horizontal</v-icon>
          </div>

          <div class="receiving-section flex-grow-1">
            <h4 class="text-subtitle-2 font-weight-bold mb-3 text-center">Recebendo</h4>
            <div class="cards-grid">
              <v-card
                v-for="tradeCard in receivingCards" 
                :key="tradeCard.id"
                class="card-preview d-flex flex-column align-center pa-3 mb-3"
                elevation="1"
              >
                <v-img 
                  :src="tradeCard.card.imageUrl" 
                  :alt="tradeCard.card.name" 
                  width="80" 
                  height="112" 
                  cover 
                  class="rounded mb-2" 
                />
                <span class="text-body-2 font-weight-medium text-center">{{ tradeCard.card.name }}</span>
              </v-card>
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import type { Trade } from '../../../types';

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
  emit('delete', props.trade.id);
}
</script>

<style scoped>
.trade-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.trade-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 8px;
}

@media (max-width: 768px) {
  .cards-section .d-flex {
    flex-direction: column;
  }
  
  .trade-arrow {
    transform: rotate(90deg);
  }
}
</style> 
