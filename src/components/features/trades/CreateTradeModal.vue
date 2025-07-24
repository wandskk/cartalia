<template>
  <BaseModal
    v-model="isOpen"
    title="Criar Nova Troca"
    size="xl"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="create-trade-modal">
      <!-- Progress Steps -->
      <div class="progress-steps">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id"
          :class="['step', { 
            'active': currentStep === index,
            'completed': currentStep > index,
            'pending': currentStep < index
          }]"
        >
          <div class="step-number">
            <span v-if="currentStep > index">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="step-label">{{ step.label }}</span>
        </div>
      </div>

      <!-- Step 1: Select Offering Cards -->
      <div v-if="currentStep === 0" class="step-content">
        <div class="step-header">
          <h3>📤 Cartas que você oferece</h3>
          <p>Selecione as cartas da sua coleção que deseja trocar</p>
        </div>

        <div class="search-section">
          <div class="search-box">
            <SearchInput
              v-model="offeringSearchQuery"
              placeholder="Buscar suas cartas..."
              :disabled="cardsStore.loading"
            />
          </div>
          
          <SimplePagination
            v-if="totalFilteredOfferingCards > userCardsPagination.rpp"
            :total-items="totalFilteredOfferingCards"
            :items-per-page="userCardsPagination.rpp"
            :current-page="userCardsPagination.page"
            :loading="cardsStore.loading"
            @page-change="handleOfferingPageChange"
          />
        </div>

        <div v-if="cardsStore.loading" class="cards-loading">
          <LoadingSpinner text="Carregando suas cartas..." />
        </div>

        <div v-else class="cards-grid">
          <Card
            v-for="card in filteredOfferingCards"
            :key="card.id"
            :card="card"
            :selectable="true"
            :selected="selectedOfferingCards.includes(card.id)"
            :clickable="true"
            size="sm"
            variant="compact"
            :show-description="true"
            :max-description-length="80"
            @click="toggleOfferingCard(card.id)"
            @select="handleOfferingCardSelect"
          />
        </div>

        <div v-if="filteredOfferingCards.length === 0 && !cardsStore.loading" class="no-results">
          <div class="no-results-icon">🃏</div>
          <h3>Nenhuma carta encontrada</h3>
          <p v-if="offeringSearchQuery">Tente ajustar sua busca</p>
          <p v-else>Você precisa ter cartas na sua coleção para criar uma troca</p>
        </div>
      </div>

      <!-- Step 2: Select Receiving Cards -->
      <div v-if="currentStep === 1" class="step-content">
        <div class="step-header">
          <h3>📥 Cartas que você quer receber</h3>
          <p>Selecione as cartas que deseja receber em troca</p>
        </div>

        <div class="search-section">
          <div class="search-box">
            <SearchInput
              v-model="receivingSearchQuery"
              placeholder="Buscar cartas disponíveis..."
              :disabled="cardsStore.loading"
            />
          </div>
          
          <SimplePagination
            v-if="allCardsPagination.total > allCardsPagination.rpp"
            :total-items="allCardsPagination.total"
            :items-per-page="allCardsPagination.rpp"
            :current-page="allCardsPagination.page"
            :loading="cardsStore.loading"
            @page-change="handleReceivingPageChange"
          />
        </div>

        <div v-if="cardsStore.loading" class="cards-loading">
          <LoadingSpinner text="Carregando cartas disponíveis..." />
        </div>

        <div v-else class="cards-grid">
          <div 
            v-for="card in filteredReceivingCards" 
            :key="card.id"
            class="card-wrapper"
          >
            <div v-if="isCardDisabled(card.id)" class="disabled-label">
              Não disponível
            </div>
            <Card
              :card="card"
              :selectable="!isCardDisabled(card.id)"
              :selected="selectedReceivingCards.includes(card.id)"
              :clickable="!isCardDisabled(card.id)"
              :disabled="isCardDisabled(card.id)"
              size="sm"
              variant="compact"
              :show-description="true"
              :max-description-length="80"
              @click="toggleReceivingCard(card.id)"
              @select="handleReceivingCardSelect"
            />
          </div>
        </div>

        <div v-if="filteredReceivingCards.length === 0 && !cardsStore.loading" class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>Nenhuma carta encontrada</h3>
          <p v-if="receivingSearchQuery">Tente ajustar sua busca</p>
          <p v-else>Nenhuma carta disponível no sistema</p>
        </div>
      </div>

      <!-- Step 3: Review and Confirm -->
      <div v-if="currentStep === 2" class="step-content">
        <div class="step-header">
          <h3>✅ Revisar Troca</h3>
          <p>Confirme os detalhes da sua troca antes de criar</p>
        </div>

        <div class="trade-summary">
          <div class="summary-section">
            <h4>📤 Você oferece ({{ selectedOfferingCards.length }})</h4>
            <div class="selected-cards">
              <div 
                v-for="cardId in selectedOfferingCards" 
                :key="cardId"
                class="selected-card"
              >
                <img :src="getCardById(cardId)?.imageUrl" :alt="getCardById(cardId)?.name" />
                <span class="card-name">{{ getCardById(cardId)?.name }}</span>
                <button 
                  @click="removeOfferingCard(cardId)"
                  class="remove-btn"
                  title="Remover carta"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <div class="trade-arrow">🔄</div>

          <div class="summary-section">
            <h4>📥 Você recebe ({{ selectedReceivingCards.length }})</h4>
            <div class="selected-cards">
              <div 
                v-for="cardId in selectedReceivingCards" 
                :key="cardId"
                class="selected-card"
              >
                <img :src="getCardById(cardId)?.imageUrl" :alt="getCardById(cardId)?.name" />
                <span class="card-name">{{ getCardById(cardId)?.name }}</span>
                <button 
                  @click="removeReceivingCard(cardId)"
                  class="remove-btn"
                  title="Remover carta"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isTradeValid" class="validation-error">
          <div class="error-icon">⚠️</div>
          <p>{{ validationMessage }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <div class="footer-content">
          <div class="step-indicator">
            <div class="step-progress">
              <div class="step-dots">
                <div 
                  v-for="(step, index) in steps" 
                  :key="step.id"
                  :class="['step-dot', { 
                    'active': currentStep === index,
                    'completed': currentStep > index
                  }]"
                />
              </div>
              <span class="step-text">Passo {{ currentStep + 1 }} de {{ steps.length }}</span>
            </div>
          </div>
          
          <div class="footer-actions">
            <BaseButton
              @click="$emit('update:modelValue', false)"
              color="secondary"
            >
              Cancelar
            </BaseButton>
            
            <BaseButton
              v-if="currentStep > 0"
              @click="previousStep"
              color="secondary"
            >
              ← Voltar
            </BaseButton>
            
            <BaseButton
              v-if="currentStep < steps.length - 1"
              @click="nextStep"
              color="primary"
              :disabled="!canProceedToNextStep"
            >
              Continuar →
            </BaseButton>
            
            <BaseButton
              v-if="currentStep === steps.length - 1"
              @click="createTrade"
              color="primary"
              :disabled="!isTradeValid || creating"
              :loading="creating"
            >
              <span v-if="creating">Criando troca...</span>
              <span v-else>Criar Troca</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useCardsStore } from '../../../stores/cards';
import { useTradesStore } from '../../../stores/trades';
import { useNotificationStore } from '../../../stores/notification';

import BaseModal from '../../common/BaseModal.vue';
import BaseButton from '../../common/BaseButton.vue';
import Card from '../../common/Card.vue';
import LoadingSpinner from '../../common/LoadingSpinner.vue';
import SearchInput from '../../common/SearchInput.vue';
import SimplePagination from '../../common/SimplePagination.vue';
import type { Card as CardType } from '../../../types';

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'trade-created'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const cardsStore = useCardsStore();
const tradesStore = useTradesStore();
const notification = useNotificationStore();

// Step management
const currentStep = ref(0);
const steps = [
  { id: 'offering', label: 'Cartas que oferece' },
  { id: 'receiving', label: 'Cartas que recebe' },
  { id: 'review', label: 'Revisar troca' }
];

// Search queries
const offeringSearchQuery = ref('');
const receivingSearchQuery = ref('');

// Selected cards
const selectedOfferingCards = ref<string[]>([]);
const selectedReceivingCards = ref<string[]>([]);

// Loading states
const creating = ref(false);

// Pagination states
const userCardsPagination = ref({
  page: 1,
  rpp: 12,
  total: 0
});

const allCardsPagination = ref({
  page: 1,
  rpp: 12,
  total: 0
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Computed properties
const userCards = computed(() => cardsStore.userCards);
const allCards = computed(() => cardsStore.allCards);

const filteredOfferingCards = computed(() => {
  let filtered = userCards.value;
  
  if (offeringSearchQuery.value) {
    const query = offeringSearchQuery.value.toLowerCase();
    filtered = filtered.filter(card => 
      card.name.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
    );
  }
  
  const startIndex = (userCardsPagination.value.page - 1) * userCardsPagination.value.rpp;
  const endIndex = startIndex + userCardsPagination.value.rpp;
  
  return filtered.slice(startIndex, endIndex);
});

const filteredReceivingCards = computed(() => {
  let filtered = allCards.value;
  
  if (receivingSearchQuery.value) {
    const query = receivingSearchQuery.value.toLowerCase();
    filtered = filtered.filter(card => 
      card.name.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
    );
  }
  
  return filtered;
});

const totalFilteredOfferingCards = computed(() => {
  let filtered = userCards.value;
  
  if (offeringSearchQuery.value) {
    const query = offeringSearchQuery.value.toLowerCase();
    filtered = filtered.filter(card => 
      card.name.toLowerCase().includes(query) ||
      card.description.toLowerCase().includes(query)
    );
  }
  
  return filtered.length;
});

const disabledReceivingCards = computed(() => {
  const disabledIds = new Set<string>();
  
  // Adiciona IDs das cartas que o usuário já tem
  userCards.value.forEach(card => {
    disabledIds.add(card.id);
  });
  
  // Adiciona IDs das cartas que o usuário está oferecendo
  selectedOfferingCards.value.forEach(cardId => {
    disabledIds.add(cardId);
  });
  
  return disabledIds;
});

const isCardDisabled = (cardId: string) => {
  return disabledReceivingCards.value.has(cardId);
};

const canProceedToNextStep = computed(() => {
  if (currentStep.value === 0) {
    return selectedOfferingCards.value.length > 0;
  }
  if (currentStep.value === 1) {
    return selectedReceivingCards.value.length > 0;
  }
  return true;
});

const isTradeValid = computed(() => {
  return selectedOfferingCards.value.length > 0 && 
         selectedReceivingCards.value.length > 0;
});

const validationMessage = computed(() => {
  if (selectedOfferingCards.value.length === 0) {
    return 'Selecione pelo menos uma carta para oferecer';
  }
  if (selectedReceivingCards.value.length === 0) {
    return 'Selecione pelo menos uma carta para receber';
  }
  return '';
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

watch(offeringSearchQuery, () => {
  userCardsPagination.value.page = 1;
  userCardsPagination.value.total = totalFilteredOfferingCards.value;
});

// Methods
async function loadData() {
  try {
    await Promise.all([
      loadUserCards(),
      loadAllCards()
    ]);
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
    await cardsStore.fetchAllCards(allCardsPagination.value.page, allCardsPagination.value.rpp);
    allCardsPagination.value.total = cardsStore.pagination.total;
  } catch (error) {
    console.error('Erro ao carregar todas as cartas:', error);
  }
}

async function handleOfferingPageChange(page: number) {
  userCardsPagination.value.page = page;
  userCardsPagination.value.total = totalFilteredOfferingCards.value;
}

async function handleReceivingPageChange(page: number) {
  allCardsPagination.value.page = page;
  await loadAllCards();
}

function resetForm() {
  currentStep.value = 0;
  selectedOfferingCards.value = [];
  selectedReceivingCards.value = [];
  offeringSearchQuery.value = '';
  receivingSearchQuery.value = '';
  userCardsPagination.value.page = 1;
  allCardsPagination.value.page = 1;
}

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function toggleOfferingCard(cardId: string) {
  const index = selectedOfferingCards.value.indexOf(cardId);
  if (index > -1) {
    selectedOfferingCards.value.splice(index, 1);
  } else {
    selectedOfferingCards.value.push(cardId);
  }
}

function toggleReceivingCard(cardId: string) {
  if (isCardDisabled(cardId)) return;
  
  const index = selectedReceivingCards.value.indexOf(cardId);
  if (index > -1) {
    selectedReceivingCards.value.splice(index, 1);
  } else {
    selectedReceivingCards.value.push(cardId);
  }
}

function handleOfferingCardSelect(card: CardType, selected: boolean) {
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

function handleReceivingCardSelect(card: CardType, selected: boolean) {
  if (isCardDisabled(card.id)) return;
  
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

function removeOfferingCard(cardId: string) {
  const index = selectedOfferingCards.value.indexOf(cardId);
  if (index > -1) {
    selectedOfferingCards.value.splice(index, 1);
  }
}

function removeReceivingCard(cardId: string) {
  const index = selectedReceivingCards.value.indexOf(cardId);
  if (index > -1) {
    selectedReceivingCards.value.splice(index, 1);
  }
}

function getCardById(cardId: string): CardType | undefined {
  return [...userCards.value, ...allCards.value].find(card => card.id === cardId);
}

async function createTrade() {
  if (!isTradeValid.value) {
    return;
  }

  creating.value = true;
  
  try {
    const tradeData = {
      cards: [
        ...selectedOfferingCards.value.map(cardId => ({
          cardId,
          type: 'OFFERING' as const
        })),
        ...selectedReceivingCards.value.map(cardId => ({
          cardId,
          type: 'RECEIVING' as const
        }))
      ]
    };

    await tradesStore.createTrade(tradeData);
    
    notification.show('Troca criada com sucesso!', 'success');
    emit('trade-created');
    emit('update:modelValue', false);
    
  } catch (error: any) {
    console.error('Erro ao criar troca:', error);
    notification.show(
      error.message || 'Erro ao criar troca',
      'error'
    );
  } finally {
    creating.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.create-trade-modal {
  .progress-steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    padding: 0 20px;

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
      position: relative;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 20px;
        left: 50%;
        width: 100%;
        height: 2px;
        background: $gray-200;
        z-index: 1;
      }

      .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 16px;
        background: $gray-200;
        color: $gray-600;
        z-index: 2;
        transition: all 0.3s ease;

        &.active {
          background: $primary;
          color: $white;
        }

        &.completed {
          background: $success;
          color: $white;
        }
      }

      .step-label {
        font-size: 12px;
        font-weight: 500;
        color: $gray-600;
        text-align: center;
        max-width: 80px;
      }

      &.active {
        .step-number {
          background: $primary;
          color: $white;
        }

        .step-label {
          color: $primary;
          font-weight: 600;
        }
      }

      &.completed {
        .step-number {
          background: $success;
          color: $white;
        }

        .step-label {
          color: $success;
        }

        &:not(:last-child)::after {
          background: $success;
        }
      }
    }
  }

  .step-content {
    .step-header {
      margin-bottom: 24px;
      text-align: center;

      h3 {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        color: $black;
      }

      p {
        margin: 0;
        color: $gray-600;
        font-size: 14px;
      }
    }

    .search-section {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;

      .search-box {
        position: relative;
        flex: 1;
        min-width: 250px;
      }
    }



    .cards-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: $gray-600;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      max-height: 400px;
      overflow-y: auto;
      padding: 4px;

      .card-wrapper {
        position: relative;

        .disabled-label {
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          background: rgba($error, 0.9);
          color: $white;
          font-size: 11px;
          font-weight: 600;
          text-align: center;
          padding: 4px 8px;
          border-radius: 6px;
          z-index: 10;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: $gray-600;

      .no-results-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.6;
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 600;
      }

      p {
        margin: 0;
        font-size: 14px;
      }
    }

    .trade-summary {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;

      .summary-section {
        flex: 1;

        h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: $black;
        }

        .selected-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .selected-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: $gray-50;
            border-radius: 12px;
            border: 2px solid $gray-200;
            position: relative;

            img {
              width: 40px;
              height: 56px;
              object-fit: cover;
              border-radius: 8px;
            }

            .card-name {
              flex: 1;
              font-size: 14px;
              font-weight: 500;
              color: $black;
            }

            .remove-btn {
              width: 24px;
              height: 24px;
              border: none;
              background: $error;
              color: $white;
              border-radius: 50%;
              cursor: pointer;
              font-size: 16px;
              font-weight: bold;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s ease;

              &:hover {
                background: darken($error, 10%);
                transform: scale(1.1);
              }
            }
          }
        }
      }

      .trade-arrow {
        font-size: 32px;
        color: $primary;
        animation: pulse 2s infinite;
      }
    }

    .validation-error {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: rgba($error, 0.1);
      border: 1px solid rgba($error, 0.3);
      border-radius: 12px;
      color: $error;

      .error-icon {
        font-size: 20px;
      }

      p {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.modal-footer {
  width: 100%;
  border-top: 1px solid $gray-200;
  background: $gray-50;
  margin: 0 -24px -24px -24px;
  padding: 20px 24px;

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .step-indicator {
    .step-progress {
      display: flex;
      align-items: center;
      gap: 12px;

      .step-dots {
        display: flex;
        gap: 8px;

        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $gray-300;
          transition: all 0.3s ease;

          &.active {
            background: $primary;
            transform: scale(1.2);
          }

          &.completed {
            background: $success;
          }
        }
      }

      .step-text {
        font-size: 13px;
        color: $gray-600;
        font-weight: 500;
        white-space: nowrap;
      }
    }
  }

  .footer-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;

    :deep(.base-btn) {
      padding: 8px 16px;
      font-size: 14px;
      min-width: 80px;
      width: auto;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 768px) {
  .create-trade-modal {
    .progress-steps {
      padding: 0 10px;

      .step {
        .step-label {
          font-size: 10px;
          max-width: 60px;
        }
      }
    }

    .step-content {
      .search-section {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;

        .search-box {
          min-width: auto;
        }
      }



      .cards-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 12px;

        .card-wrapper {
          .disabled-label {
            font-size: 9px;
            padding: 3px 6px;
            top: 6px;
            left: 6px;
            right: 6px;
          }
        }
      }

      .trade-summary {
        flex-direction: column;
        gap: 16px;

        .trade-arrow {
          transform: rotate(90deg);
        }
      }
    }
  }

  .modal-footer {
    margin: 0 -16px -16px -16px;
    padding: 16px;

    .footer-content {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .step-indicator {
      .step-progress {
        justify-content: center;
      }
    }

    .footer-actions {
      justify-content: center;
      gap: 12px;

      :deep(.base-btn) {
        padding: 10px 20px;
        font-size: 15px;
        min-width: 90px;
      }
    }
  }
}
</style> 