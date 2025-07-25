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
            <span class="text-caption text-grey">{{ formattedId }}</span>
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
                <CardPreview
                  v-for="tradeCard in offeringCards" 
                  :key="tradeCard.id"
                  :card="tradeCard.card"
                  size="sm"
                  class="mb-3"
                  @click="handleCardClick"
                />
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
                <CardPreview
                  v-for="tradeCard in receivingCards" 
                  :key="tradeCard.id"
                  :card="tradeCard.card"
                  size="sm"
                  class="mb-3"
                  @click="handleCardClick"
                />
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
          <span class="text-caption text-grey">{{ cardsCountText }}</span>
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
import { formatDate, formatStatus } from '../../../utils/formatters';
import CardPreview from '../../common/CardPreview.vue';
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
  return formatDate(props.trade.createdAt);
});

const formattedId = computed(() => {
  return `#${props.trade.id.slice(0, 8)}`;
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
  return formatStatus(props.status);
});

const statusColor = computed(() => {
  const colorMap: Record<string, string> = {
    'active': 'success',
    'completed': 'primary',
    'expired': 'error',
    'pending': 'warning',
    'cancelled': 'grey'
  };
  return colorMap[props.status] || 'grey';
});

const cardsCountText = computed(() => {
  const count = props.trade.tradeCards.length;
  return `${count} carta${count !== 1 ? 's' : ''}`;
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

.trade-arrow {
  padding: 16px 0;
}

@media (max-width: 960px) {
  .trade-arrow .v-avatar {
    transform: rotate(90deg);
  }
}
</style> 