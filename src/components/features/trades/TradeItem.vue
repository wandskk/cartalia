<template>
  <v-card class="trade-item" elevation="2">
    <v-card-text class="pa-6">
      <div class="d-flex justify-space-between align-start mb-5">
        <div class="trade-meta">
          <div class="d-flex align-center mb-2">
            <v-icon size="16" color="grey" class="mr-2">mdi-calendar</v-icon>
            <span class="text-caption text-grey">{{ formattedDate }}</span>
          </div>
          <div class="d-flex align-center">
            <v-icon size="16" color="grey" class="mr-2">mdi-identifier</v-icon>
            <span class="text-caption text-grey">#{{ trade.id.slice(0, 8) }}</span>
          </div>
        </div>
        
        <div v-if="showActions">
          <v-btn
            v-if="canDelete"
            @click="handleDelete"
            icon
            variant="text"
            size="small"
            color="error"
            title="Excluir"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>

      <div class="trade-content">
        <v-row class="align-start">
          <v-col cols="12" md="5">
            <div class="offering-section">
              <h4 class="d-flex align-center mb-4 text-subtitle-1 font-weight-medium">
                <v-icon color="primary" class="mr-2">mdi-export</v-icon>
                Oferecendo
              </h4>
              <div class="cards-preview">
                <v-card
                  v-for="tradeCard in offeringCards" 
                  :key="tradeCard.id"
                  class="card-preview mb-3"
                  variant="outlined"
                  hover
                  @click="handleCardClick(tradeCard.card)"
                  style="cursor: pointer;"
                >
                  <div class="d-flex align-center pa-3">
                    <div class="card-image mr-3">
                      <v-img
                        :src="tradeCard.card.imageUrl"
                        :alt="tradeCard.card.name"
                        width="48"
                        height="68"
                        class="rounded"
                        cover
                      />
                    </div>
                    <div class="flex-grow-1">
                      <div class="text-subtitle-2 font-weight-medium mb-1">
                        {{ tradeCard.card.name }}
                      </div>
                      <div class="text-caption text-grey line-clamp-2">
                        {{ tradeCard.card.description }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="2" class="d-flex justify-center align-center">
            <div class="trade-arrow">
              <v-avatar color="primary" size="48">
                <v-icon color="white" size="20">mdi-swap-horizontal</v-icon>
              </v-avatar>
            </div>
          </v-col>

          <v-col cols="12" md="5">
            <div class="receiving-section">
              <h4 class="d-flex align-center mb-4 text-subtitle-1 font-weight-medium">
                <v-icon color="primary" class="mr-2">mdi-import</v-icon>
                Recebendo
              </h4>
              <div class="cards-preview">
                <v-card
                  v-for="tradeCard in receivingCards" 
                  :key="tradeCard.id"
                  class="card-preview mb-3"
                  variant="outlined"
                  hover
                  @click="handleCardClick(tradeCard.card)"
                  style="cursor: pointer;"
                >
                  <div class="d-flex align-center pa-3">
                    <div class="card-image mr-3">
                      <v-img
                        :src="tradeCard.card.imageUrl"
                        :alt="tradeCard.card.name"
                        width="48"
                        height="68"
                        class="rounded"
                        cover
                      />
                    </div>
                    <div class="flex-grow-1">
                      <div class="text-subtitle-2 font-weight-medium mb-1">
                        {{ tradeCard.card.name }}
                      </div>
                      <div class="text-caption text-grey line-clamp-2">
                        {{ tradeCard.card.description }}
                      </div>
                    </div>
                  </div>
                </v-card>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="px-6 py-4">
      <div class="d-flex align-center">
        <div class="d-flex align-center mr-4">
          <v-icon size="16" color="grey" class="mr-1">mdi-cards</v-icon>
          <span class="text-caption text-grey">{{ trade.tradeCards.length }} cartas</span>
        </div>
        <div class="d-flex align-center">
          <v-icon size="16" color="grey" class="mr-1">mdi-account</v-icon>
          <span class="text-caption text-grey">{{ trade.user.name }}</span>
        </div>
      </div>
      
      <v-spacer />
      
      <div v-if="showStatus">
        <v-chip
          :color="statusColor"
          variant="tonal"
          size="small"
          class="text-uppercase"
        >
          {{ statusText }}
        </v-chip>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../../stores/auth';
import type { Trade } from '../../../types';
import type { Card } from '../../../types/cards';

interface Props {
  trade: Trade;
  showActions?: boolean;
  showStatus?: boolean;
  status?: 'active' | 'completed' | 'expired' | 'pending';
}

interface Emits {
  (e: 'delete', trade: Trade): void;
  (e: 'card-click', card: Card): void;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  showStatus: true,
  status: 'active'
});

const emit = defineEmits<Emits>();

const authStore = useAuthStore();

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

const canDelete = computed(() => {
  return isOwner.value;
});

const statusText = computed(() => {
  switch (props.status) {
    case 'active': return 'Ativa';
    case 'completed': return 'Concluída';
    case 'expired': return 'Expirada';
    case 'pending': return 'Pendente';
    default: return 'Ativa';
  }
});

const statusColor = computed(() => {
  switch (props.status) {
    case 'active': return 'success';
    case 'completed': return 'primary';
    case 'expired': return 'error';
    case 'pending': return 'warning';
    default: return 'success';
  }
});

function handleCardClick(card: Card) {
  emit('card-click', card);
}

function handleDelete() {
  emit('delete', props.trade);
}
</script>

<style scoped>
.trade-item {
  transition: transform 0.2s ease;
}

.trade-item:hover {
  transform: translateY(-2px);
}

.card-preview {
  transition: border-color 0.2s ease;
}

.card-preview:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.trade-arrow {
  padding: 16px 0;
}

@media (max-width: 960px) {
  .trade-arrow .v-avatar {
    transform: rotate(90deg);
  }
}
</style> 