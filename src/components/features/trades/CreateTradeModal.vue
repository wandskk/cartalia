<template>
  <v-dialog v-model="isOpen" max-width="1200" persistent>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center pa-6">
        <span class="text-h5 font-weight-bold">Criar Nova Troca</span>
        <v-btn icon variant="text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text class="pa-0">
        <div class="d-flex flex-column max-height-80vh">
          <!-- Step Progress -->
          <div class="step-progress pa-4">
            <div class="d-flex justify-center mb-4">
              <div class="d-flex align-center">
                <div
                  v-for="(step, index) in ['Oferecer', 'Receber', 'Revisar']"
                  :key="index"
                  class="d-flex align-center"
                >
                  <div
                    class="step-indicator d-flex align-center justify-center"
                    :class="{
                      'step-active': steps.currentStep.value === index,
                      'step-completed': steps.currentStep.value > index,
                      'step-pending': steps.currentStep.value < index
                    }"
                  >
                    <v-icon v-if="steps.currentStep.value > index" size="16" color="white">mdi-check</v-icon>
                    <span v-else class="text-caption">{{ index + 1 }}</span>
                  </div>
                  <span class="text-caption ml-2 mr-4">{{ step }}</span>
                  <v-icon v-if="index < 2" size="16" color="grey">mdi-chevron-right</v-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- Step Content -->
          <div class="step-content-container">
            <!-- Step 1: Select Offering Cards -->
            <TradeStepCardSelection
              v-if="steps.currentStep.value === 0"
              title="Cartas que você oferece"
              description="Selecione as cartas da sua coleção que deseja trocar"
              icon="mdi-export"
              empty-icon="mdi-cards"
              empty-message="Você precisa ter cartas na sua coleção para criar uma troca"
              search-placeholder="Buscar suas cartas..."
              loading-message="Carregando suas cartas..."
              :cards="userCards"
              :loading="cardsStore.loading"
              :current-page="userCardsPagination.page"
              :items-per-page="userCardsPagination.rpp"
              :total-items="totalFilteredOfferingCards"
              :selected-cards="selectedOfferingCards"
              :search-query="offeringSearchQuery"
              @card-toggle="toggleOfferingCard"
              @card-select="handleOfferingCardSelect"
              @page-change="handleOfferingPageChange"
              @search-change="handleOfferingSearchChange"
            />

            <!-- Step 2: Select Receiving Cards -->
            <TradeStepCardSelection
              v-if="steps.currentStep.value === 1"
              title="Cartas que você quer receber"
              description="Selecione as cartas que você deseja receber em troca"
              icon="mdi-import"
              empty-icon="mdi-cards"
              empty-message="Nenhuma carta disponível no sistema"
              search-placeholder="Buscar cartas disponíveis..."
              loading-message="Carregando cartas disponíveis..."
              :cards="allCards"
              :loading="cardsStore.loading"
              :current-page="allCardsPagination.page"
              :items-per-page="allCardsPagination.rpp"
              :total-items="totalFilteredReceivingCards"
              :selected-cards="selectedReceivingCards"
              :search-query="receivingSearchQuery"
              @card-toggle="toggleReceivingCard"
              @card-select="handleReceivingCardSelect"
              @page-change="handleReceivingPageChange"
              @search-change="handleReceivingSearchChange"
            />

            <!-- Step 3: Review Trade -->
            <TradePreviewStep
              v-if="steps.currentStep.value === 2"
              :offering-cards="selectedOfferingCardsData"
              :receiving-cards="selectedReceivingCardsData"
              @card-click="handleCardClick"
            />
          </div>
        </div>
      </v-card-text>

      <!-- Footer Actions -->
      <v-card-actions class="pa-6">
        <div class="d-flex justify-space-between w-100">
          <v-btn
            v-if="steps.canGoBack"
            @click="previousStep"
            variant="outlined"
            color="grey"
          >
            <v-icon class="mr-2">mdi-arrow-left</v-icon>
            Voltar
          </v-btn>
          <div v-else></div>

          <div class="d-flex gap-3">
            <v-btn
              @click="closeModal"
              variant="outlined"
              color="grey"
            >
              Cancelar
            </v-btn>
            
            <v-btn
              v-if="steps.canGoNext"
              @click="nextStep"
              color="primary"
              :disabled="!canProceedToNextStep"
            >
              Continuar
              <v-icon class="ml-2">mdi-arrow-right</v-icon>
            </v-btn>
            
            <v-btn
              v-else
              @click="createTrade"
              color="success"
              :loading="loadingStore.isLoading"
              :disabled="!canCreateTrade"
            >
              <span v-if="loadingStore.isLoading">Criando...</span>
              <span v-else>Criar Troca</span>
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCardsStore } from '../../../stores/cards';
import { useTradesStore } from '../../../stores/trades';
import { useLoadingStore } from '../../../stores/loading';
import { useNotificationStore } from '../../../stores/notification';
import { useSteps } from '../../../composables/useSteps';
import { useSearch } from '../../../composables/useSearch';

import TradeStepCardSelection from './TradeStepCardSelection.vue';
import TradePreviewStep from './TradePreviewStep.vue';
import type { Card } from '../../../types/cards';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'trade-created'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Stores
const cardsStore = useCardsStore();
const tradesStore = useTradesStore();
const loadingStore = useLoadingStore();
const notificationStore = useNotificationStore();

// Composables
const steps = useSteps({
  steps: [
    { id: 0, title: 'Oferecer', description: 'Selecione suas cartas', icon: 'mdi-export' },
    { id: 1, title: 'Receber', description: 'Selecione cartas desejadas', icon: 'mdi-import' },
    { id: 2, title: 'Revisar', description: 'Confirme a troca', icon: 'mdi-eye' }
  ],
  validateStep: (step) => {
    if (step === 0) return selectedOfferingCards.value.length > 0;
    if (step === 1) return selectedReceivingCards.value.length > 0;
    return true;
  }
});


const offeringSearch = useSearch({ debounceMs: 500 });
const receivingSearch = useSearch({ debounceMs: 500 });

// State
const selectedOfferingCards = ref<string[]>([]);
const selectedReceivingCards = ref<string[]>([]);
const offeringSearchQuery = ref('');
const receivingSearchQuery = ref('');

// Pagination
const userCardsPagination = ref({ page: 1, rpp: 12, total: 0 });
const allCardsPagination = ref({ page: 1, rpp: 12, total: 0 });

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const userCards = computed(() => cardsStore.userCards);
const allCards = computed(() => cardsStore.allCards);

const totalFilteredOfferingCards = computed(() => {
  return offeringSearch.filterByQuery(userCards.value, ['name', 'description'], offeringSearch.debouncedQuery.value).length;
});

const totalFilteredReceivingCards = computed(() => {
  return receivingSearch.filterByQuery(allCards.value, ['name', 'description'], receivingSearch.debouncedQuery.value).length;
});

const selectedOfferingCardsData = computed(() => {
  return userCards.value.filter(card => selectedOfferingCards.value.includes(card.id));
});

const selectedReceivingCardsData = computed(() => {
  return allCards.value.filter(card => selectedReceivingCards.value.includes(card.id));
});

const canProceedToNextStep = computed(() => {
  if (steps.currentStep.value === 0) return selectedOfferingCards.value.length > 0;
  if (steps.currentStep.value === 1) return selectedReceivingCards.value.length > 0;
  return true;
});

const canCreateTrade = computed(() => {
  return selectedOfferingCards.value.length > 0 && selectedReceivingCards.value.length > 0;
});

// Lifecycle
onMounted(() => {
  if (isOpen.value) {
    loadData();
  }
});

watch(() => isOpen.value, (isOpen) => {
  if (isOpen) {
    loadData();
  } else {
    resetForm();
  }
});

// Methods
async function loadData() {
  try {
    await Promise.all([loadUserCards(), loadAllCards()]);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

async function loadUserCards() {
  try {
    await cardsStore.fetchUserCards();
    userCardsPagination.value.total = totalFilteredOfferingCards.value;
  } catch (error) {
    console.error('Erro ao carregar cartas do usuário:', error);
  }
}

async function loadAllCards() {
  try {
    await cardsStore.fetchAllCards(1, 1000);
    allCardsPagination.value.total = totalFilteredReceivingCards.value;
  } catch (error) {
    console.error('Erro ao carregar todas as cartas:', error);
  }
}

function resetForm() {
  steps.reset();
  selectedOfferingCards.value = [];
  selectedReceivingCards.value = [];
  offeringSearchQuery.value = '';
  receivingSearchQuery.value = '';
  userCardsPagination.value.page = 1;
  allCardsPagination.value.page = 1;
}

function nextStep() {
  steps.nextStep();
}

function previousStep() {
  steps.previousStep();
}

function closeModal() {
  emit('update:modelValue', false);
}

// Card selection handlers
function toggleOfferingCard(cardId: string) {
  const index = selectedOfferingCards.value.indexOf(cardId);
  if (index > -1) {
    selectedOfferingCards.value.splice(index, 1);
  } else {
    selectedOfferingCards.value.push(cardId);
  }
}

function toggleReceivingCard(cardId: string) {
  const index = selectedReceivingCards.value.indexOf(cardId);
  if (index > -1) {
    selectedReceivingCards.value.splice(index, 1);
  } else {
    selectedReceivingCards.value.push(cardId);
  }
}

function handleOfferingCardSelect(card: Card, selected: boolean) {
  if (selected) {
    if (!selectedOfferingCards.value.includes(card.id)) {
      selectedOfferingCards.value.push(card.id);
    }
  } else {
    const index = selectedOfferingCards.value.indexOf(card.id);
    if (index > -1) {
      selectedOfferingCards.value.splice(index, 1);
    }
  }
}

function handleReceivingCardSelect(card: Card, selected: boolean) {
  if (selected) {
    if (!selectedReceivingCards.value.includes(card.id)) {
      selectedReceivingCards.value.push(card.id);
    }
  } else {
    const index = selectedReceivingCards.value.indexOf(card.id);
    if (index > -1) {
      selectedReceivingCards.value.splice(index, 1);
    }
  }
}

// Search handlers
function handleOfferingSearchChange(query: string) {
  offeringSearchQuery.value = query;
  userCardsPagination.value.page = 1; // Reset para primeira página
}

function handleReceivingSearchChange(query: string) {
  receivingSearchQuery.value = query;
  allCardsPagination.value.page = 1; // Reset para primeira página
}

// Pagination handlers
async function handleOfferingPageChange(page: number) {
  userCardsPagination.value.page = page;
}

async function handleReceivingPageChange(page: number) {
  allCardsPagination.value.page = page;
}

function handleCardClick(card: Card) {
  // Optional: Open card detail modal
  console.log('Card clicked:', card);
}

// Create trade
async function createTrade() {
  if (!canCreateTrade.value) return;

  loadingStore.startLoading();

  try {
    const tradeData = {
      cards: [
        ...selectedOfferingCards.value.map(cardId => ({ cardId, type: 'OFFERING' as const })),
        ...selectedReceivingCards.value.map(cardId => ({ cardId, type: 'RECEIVING' as const }))
      ]
    };

    await tradesStore.createTrade(tradeData);

    notificationStore.show(
      'Troca criada com sucesso!',
      'success'
    );

    emit('trade-created');
    closeModal();
  } catch (error: any) {
    console.error('Erro ao criar troca:', error);
    notificationStore.show(
      error.message || 'Erro ao criar troca',
      'error'
    );
  } finally {
    loadingStore.stopLoading();
  }
}
</script>

<style scoped>
.max-height-80vh {
  max-height: 80vh;
}

.step-progress {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.step-content-container {
  flex-grow: 1;
  overflow: hidden;
}

.step-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgb(var(--v-theme-grey-lighten-2));
  color: rgb(var(--v-theme-grey-darken-1));
  transition: all 0.3s ease;
}

.step-indicator.step-active {
  background: rgb(var(--v-theme-primary));
  color: white;
}

.step-indicator.step-completed {
  background: rgb(var(--v-theme-success));
  color: white;
}

.step-indicator.step-pending {
  background: rgb(var(--v-theme-grey-lighten-2));
  color: rgb(var(--v-theme-grey-darken-1));
}
</style>
