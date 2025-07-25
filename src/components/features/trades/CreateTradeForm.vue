<template>
  <div class="create-trade-form">
    <div class="form-sections">
      <v-card class="section offering-section mb-6" elevation="2">
        <v-card-text class="pa-6">
          <div class="d-flex align-center ga-2 mb-4">
            <v-icon size="24" color="primary">mdi-upload</v-icon>
            <h3 class="text-h6 font-weight-bold">Cartas que você oferece</h3>
            <v-spacer></v-spacer>
            <v-btn @click="showCardSelector = 'offering'" color="primary" size="small" variant="elevated">
              <v-icon>mdi-plus</v-icon>
              Adicionar Carta
            </v-btn>
          </div>

          <div class="selected-cards">
            <div 
              v-for="card in selectedOfferingCards" 
              :key="card.id"
              class="selected-card d-flex align-center pa-3 mb-3 rounded-lg"
              style="background: rgba(var(--v-theme-primary), 0.05); border: 1px solid rgba(var(--v-theme-primary), 0.1);"
            >
              <v-img :src="card.imageUrl" :alt="card.name" width="60" height="84" class="rounded mr-3" cover />
              <div class="flex-grow-1">
                <span class="text-body-2 font-weight-medium">{{ card.name }}</span>
              </div>
              <v-btn @click="removeOfferingCard(card)" icon variant="text" size="small" color="error">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>

            <div v-if="selectedOfferingCards.length === 0" class="d-flex align-center justify-center py-8">
              <div class="text-center">
                <v-icon size="48" color="grey" class="mb-3">mdi-cards</v-icon>
                <p class="text-body-1 text-grey">Nenhuma carta selecionada</p>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="section receiving-section mb-6" elevation="2">
        <v-card-text class="pa-6">
          <div class="d-flex align-center ga-2 mb-4">
            <v-icon size="24" color="secondary">mdi-download</v-icon>
            <h3 class="text-h6 font-weight-bold">Cartas que você quer receber</h3>
            <v-spacer></v-spacer>
            <v-btn @click="showCardSelector = 'receiving'" color="primary" size="small" variant="elevated">
              <v-icon>mdi-plus</v-icon>
              Adicionar Carta
            </v-btn>
          </div>
          
          <div class="selected-cards">
            <div 
              v-for="card in selectedReceivingCards" 
              :key="card.id"
              class="selected-card d-flex align-center pa-3 mb-3 rounded-lg"
              style="background: rgba(var(--v-theme-secondary), 0.05); border: 1px solid rgba(var(--v-theme-secondary), 0.1);"
            >
              <v-img :src="card.imageUrl" :alt="card.name" width="60" height="84" class="rounded mr-3" cover />
              <div class="flex-grow-1">
                <span class="text-body-2 font-weight-medium">{{ card.name }}</span>
              </div>
              <v-btn @click="removeReceivingCard(card)" icon variant="text" size="small" color="error">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            
            <div v-if="selectedReceivingCards.length === 0" class="d-flex align-center justify-center py-8">
              <div class="text-center">
                <v-icon size="48" color="grey" class="mb-3">mdi-cards</v-icon>
                <p class="text-body-1 text-grey">Nenhuma carta selecionada</p>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <div class="form-actions d-flex justify-end ga-3">
      <v-btn @click="cancel" color="secondary" variant="outlined">
        Cancelar
      </v-btn>
      <v-btn 
        @click="createTrade" 
        color="primary" 
        variant="elevated"
        :disabled="!canCreateTrade"
        :loading="creating"
      >
        Criar Troca
      </v-btn>
    </div>

    <!-- Modal de Seleção de Cartas -->
    <BaseModal :model-value="!!showCardSelector" @update:model-value="showCardSelector = false" size="lg">
      <div class="card-selector-modal">
        <div class="modal-header">
          <h3>Selecionar Cartas</h3>
          <SearchInput
            v-model="searchTerm"
            placeholder="Buscar cartas..."
          />
        </div>
        
        <div class="cards-grid">
          <div 
            v-for="card in filteredCards" 
            :key="card.id"
            class="card-item"
            @click="selectCard(card)"
          >
            <img :src="card.imageUrl" :alt="card.name" />
            <div class="card-info">
              <span class="card-name">{{ card.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCardsStore } from '../../../stores/cards';
import { useNotificationStore } from '../../../stores/notification';
import BaseModal from '../../common/BaseModal.vue';
import SearchInput from '../../common/SearchInput.vue';
import type { Card } from '../../../types';

interface Props {
  creating?: boolean;
}

interface Emits {
  (e: 'cancel'): void;
  (e: 'create', tradeData: { offeringCards: Card[], receivingCards: Card[] }): void;
}

withDefaults(defineProps<Props>(), {
  creating: false
});

const emit = defineEmits<Emits>();

const cardsStore = useCardsStore();
const notification = useNotificationStore();

const selectedOfferingCards = ref<Card[]>([]);
const selectedReceivingCards = ref<Card[]>([]);
const showCardSelector = ref<'offering' | 'receiving' | false>(false);
const searchTerm = ref('');

const allCards = computed(() => cardsStore.allCards);
const filteredCards = computed(() => {
  if (!searchTerm.value) return allCards.value;
  
  return allCards.value.filter(card => 
    card.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const canCreateTrade = computed(() => 
  selectedOfferingCards.value.length > 0 && selectedReceivingCards.value.length > 0
);

function selectCard(card: Card) {
  if (showCardSelector.value === 'offering') {
    if (!selectedOfferingCards.value.find(c => c.id === card.id)) {
      selectedOfferingCards.value.push(card);
    }
  } else if (showCardSelector.value === 'receiving') {
    if (!selectedReceivingCards.value.find(c => c.id === card.id)) {
      selectedReceivingCards.value.push(card);
    }
  }
  
  showCardSelector.value = false;
  searchTerm.value = '';
}

function removeOfferingCard(card: Card) {
  const index = selectedOfferingCards.value.findIndex(c => c.id === card.id);
  if (index > -1) {
    selectedOfferingCards.value.splice(index, 1);
  }
}

function removeReceivingCard(card: Card) {
  const index = selectedReceivingCards.value.findIndex(c => c.id === card.id);
  if (index > -1) {
    selectedReceivingCards.value.splice(index, 1);
  }
}

function cancel() {
  emit('cancel');
}

function createTrade() {
  if (!canCreateTrade.value) return;
  
  emit('create', {
    offeringCards: selectedOfferingCards.value,
    receivingCards: selectedReceivingCards.value
  });
}
</script>

<style scoped>
.card-selector-modal {
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    
    .card-item {
      cursor: pointer;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
      }
      
      img {
        width: 100%;
        height: auto;
        display: block;
      }
      
      .card-info {
        padding: 8px;
        background: white;
        
        .card-name {
          font-size: 12px;
          font-weight: 500;
          color: #333;
          display: block;
          text-align: center;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .card-selector-modal {
    .modal-header {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }
    
    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px;
    }
  }
}
</style> 
