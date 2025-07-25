<template>
  <div class="trade-preview">
    <div class="d-flex justify-space-between align-center mb-6">
      <h3 class="text-h6 font-weight-bold">Preview da Troca</h3>
      <v-chip :color="statusColor" variant="tonal" size="small">
        {{ statusText }}
      </v-chip>
    </div>

    <div class="preview-content">
      <div class="trade-layout d-flex align-center justify-center ga-6 mb-6">
        <div class="offering-section flex-grow-1">
          <h4 class="text-subtitle-1 font-weight-bold mb-4 text-center">Você está oferecendo</h4>
          <div class="cards-list">
            <v-card
              v-for="card in offeringCards" 
              :key="card.id"
              class="card-item d-flex align-center pa-3 mb-3"
              elevation="1"
            >
              <v-img :src="card.imageUrl" :alt="card.name" width="60" height="84" cover class="rounded mr-3" />
              <div class="flex-grow-1">
                <span class="text-body-2 font-weight-medium">{{ card.name }}</span>
              </div>
            </v-card>
          </div>
          <div v-if="offeringCards.length === 0" class="d-flex flex-column align-center justify-center py-8 text-center">
            <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-cards</v-icon>
            <p class="text-body-2 text-grey">Nenhuma carta selecionada</p>
          </div>
        </div>

        <div class="trade-arrow d-flex align-center justify-center">
          <v-icon size="32" color="primary">mdi-swap-horizontal</v-icon>
        </div>

        <div class="receiving-section flex-grow-1">
          <h4 class="text-subtitle-1 font-weight-bold mb-4 text-center">Você quer receber</h4>
          <div class="cards-list">
            <v-card
              v-for="card in receivingCards" 
              :key="card.id"
              class="card-item d-flex align-center pa-3 mb-3"
              elevation="1"
            >
              <v-img :src="card.imageUrl" :alt="card.name" width="60" height="84" cover class="rounded mr-3" />
              <div class="flex-grow-1">
                <span class="text-body-2 font-weight-medium">{{ card.name }}</span>
              </div>
            </v-card>
          </div>
          <div v-if="receivingCards.length === 0" class="d-flex flex-column align-center justify-center py-8 text-center">
            <v-icon size="48" color="grey-lighten-1" class="mb-3">mdi-cards</v-icon>
            <p class="text-body-2 text-grey">Nenhuma carta selecionada</p>
          </div>
        </div>
      </div>

      <v-card class="trade-summary" elevation="2">
        <v-card-text class="pa-4">
          <div class="d-flex flex-column ga-3">
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-2 text-grey">Total oferecendo:</span>
              <span class="text-body-2 font-weight-medium">{{ offeringCards.length }} carta{{ offeringCards.length !== 1 ? 's' : '' }}</span>
            </div>
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-2 text-grey">Total recebendo:</span>
              <span class="text-body-2 font-weight-medium">{{ receivingCards.length }} carta{{ receivingCards.length !== 1 ? 's' : '' }}</span>
            </div>
            <div class="d-flex justify-space-between align-center">
              <span class="text-body-2 text-grey">Status:</span>
              <v-chip :color="statusColor" variant="tonal" size="small">
                {{ statusText }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="preview-actions d-flex justify-center ga-4 mt-6">
      <v-btn 
        @click="createTrade"
        :loading="loading"
        :disabled="!isValid"
        color="primary"
        variant="elevated"
        prepend-icon="mdi-plus"
      >
        Criar Troca
      </v-btn>
      
      <v-btn 
        @click="reset"
        color="secondary"
        variant="outlined"
        :disabled="loading"
        prepend-icon="mdi-refresh"
      >
        Limpar Seleção
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Card as CardType } from '../../../types';

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

const isValid = computed(() => 
  props.offeringCards.length > 0 && props.receivingCards.length > 0
);

const statusText = computed(() => {
  if (props.offeringCards.length === 0 && props.receivingCards.length === 0) {
    return 'Nenhuma carta selecionada';
  }
  if (props.offeringCards.length === 0) {
    return 'Selecione cartas para oferecer';
  }
  if (props.receivingCards.length === 0) {
    return 'Selecione cartas para receber';
  }
  return 'Pronto para criar';
});

const statusColor = computed(() => {
  if (isValid.value) return 'success';
  if (props.offeringCards.length > 0 || props.receivingCards.length > 0) return 'warning';
  return 'grey';
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

<style scoped>
.trade-preview {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.trade-layout {
  min-height: 200px;
}

.cards-list {
  max-height: 300px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .trade-layout {
    flex-direction: column;
  }
  
  .trade-arrow {
    transform: rotate(90deg);
  }
}
</style> 
