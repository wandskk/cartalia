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
        <div class="d-flex flex-column" style="max-height: 80vh">
          <!-- Step 1: Select Offering Cards -->
          <div
            v-if="currentStep === 0"
            class="step-content flex-grow-1 d-flex flex-column overflow-hidden pa-6"
          >
            <div class="step-header text-center mb-6">
              <h3 class="text-h5 mb-2">
                <v-icon color="primary" class="mr-2">mdi-export</v-icon>
                Cartas que você oferece
              </h3>
              <p class="text-body-2 text-grey">
                Selecione as cartas da sua coleção que deseja trocar
              </p>
            </div>

            <div class="search-section mb-4">
              <div class="d-flex align-center ga-4 flex-wrap">
                <div class="flex-grow-1" style="min-width: 250px">
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
            </div>

            <div
              v-if="cardsStore.loading"
              class="d-flex flex-column align-center justify-center py-15"
            >
              <v-progress-circular
                indeterminate
                color="primary"
                size="48"
                class="mb-4"
              />
              <p class="text-grey text-center">Carregando suas cartas...</p>
            </div>

            <div v-else class="cards-grid flex-grow-1">
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

            <div
              v-if="filteredOfferingCards.length === 0 && !cardsStore.loading"
              class="d-flex flex-column align-center justify-center py-15 text-center"
            >
              <v-icon size="64" color="grey-lighten-1" class="mb-4"
                >mdi-cards</v-icon
              >
              <h3 class="text-h6 mb-2 text-grey">Nenhuma carta encontrada</h3>
              <p class="text-body-2 text-grey" v-if="offeringSearchQuery">
                Tente ajustar sua busca
              </p>
              <p class="text-body-2 text-grey" v-else>
                Você precisa ter cartas na sua coleção para criar uma troca
              </p>
            </div>
          </div>

          <!-- Step 2: Select Receiving Cards -->
          <div
            v-if="currentStep === 1"
            class="step-content flex-grow-1 d-flex flex-column overflow-hidden pa-6"
          >
            <div class="step-header text-center mb-6">
              <h3 class="text-h5 mb-2">
                <v-icon color="primary" class="mr-2">mdi-import</v-icon>
                Cartas que você quer receber
              </h3>
              <p class="text-body-2 text-grey">
                Selecione as cartas que você deseja receber em troca
              </p>
            </div>

            <div class="search-section mb-4">
              <div class="d-flex align-center ga-4 flex-wrap">
                <div class="flex-grow-1" style="min-width: 250px">
                                      <SearchInput
                      v-model="receivingSearchQuery"
                      placeholder="Buscar cartas disponíveis..."
                      :disabled="cardsStore.loading"
                    />
                  </div>

                  <SimplePagination
                    v-if="filteredReceivingCards.length > allCardsPagination.rpp"
                    :total-items="filteredReceivingCards.length"
                    :items-per-page="allCardsPagination.rpp"
                    :current-page="allCardsPagination.page"
                    :loading="cardsStore.loading"
                    @page-change="handleReceivingPageChange"
                  />
              </div>
            </div>

            <div
              v-if="cardsStore.loading"
              class="d-flex flex-column align-center justify-center py-15"
            >
              <v-progress-circular
                indeterminate
                color="primary"
                size="48"
                class="mb-4"
              />
              <p class="text-grey text-center">Carregando cartas disponíveis...</p>
            </div>

            <div v-else class="cards-grid flex-grow-1">
              <Card
                v-for="card in filteredReceivingCards"
                :key="card.id"
                :card="card"
                :selectable="true"
                :selected="selectedReceivingCards.includes(card.id)"
                :clickable="true"
                size="sm"
                variant="compact"
                :show-description="true"
                :max-description-length="80"
                @click="toggleReceivingCard(card.id)"
                @select="handleReceivingCardSelect"
              />
            </div>

            <div
              v-if="filteredReceivingCards.length === 0 && !cardsStore.loading"
              class="d-flex flex-column align-center justify-center py-15 text-center"
            >
              <v-icon size="64" color="grey-lighten-1" class="mb-4"
                >mdi-cards</v-icon
              >
              <h3 class="text-h6 mb-2 text-grey">Nenhuma carta encontrada</h3>
              <p class="text-body-2 text-grey" v-if="receivingSearchQuery">
                Tente ajustar sua busca
              </p>
              <p class="text-body-2 text-grey" v-else>
                Não há cartas disponíveis no sistema
              </p>
            </div>
          </div>

          <!-- Step 3: Review and Confirm -->
          <div
            v-if="currentStep === 2"
            class="step-content flex-grow-1 d-flex flex-column overflow-hidden pa-6"
          >
            <div class="step-header text-center mb-6">
              <h3 class="text-h5 mb-2">
                <v-icon color="primary" class="mr-2">mdi-check-circle</v-icon>
                Revisar Troca
              </h3>
              <p class="text-body-2 text-grey">
                Confirme os detalhes da sua troca antes de criar
              </p>
            </div>

            <TradePreview
              :offering-cards="selectedOfferingCardsData"
              :receiving-cards="selectedReceivingCardsData"
              :loading="creating"
              @create="createTrade"
              @reset="resetForm"
            />
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <div class="d-flex justify-space-between align-center w-100">
          <div class="d-flex ga-2">
            <v-btn
              v-if="currentStep > 0"
              @click="previousStep"
              variant="outlined"
              :disabled="creating"
            >
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              Voltar
            </v-btn>
          </div>

          <div class="d-flex ga-2">
            <v-btn @click="closeModal" variant="outlined" :disabled="creating">
              Cancelar
            </v-btn>
            <v-btn
              v-if="currentStep < 2"
              @click="nextStep"
              color="primary"
              variant="elevated"
              :disabled="!canProceedToNextStep"
            >
              Próximo
              <v-icon class="ml-2">mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useCardsStore } from "../../../stores/cards";
import { useTradesStore } from "../../../stores/trades";
import { useNotificationStore } from "../../../stores/notification";

import Card from "../../common/Card.vue";
import SearchInput from "../../common/SearchInput.vue";
import SimplePagination from "../../common/SimplePagination.vue";
import TradePreview from "./TradePreview.vue";
import type { Card as CardType } from "../../../types";

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "trade-created"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const cardsStore = useCardsStore();
const tradesStore = useTradesStore();
const notification = useNotificationStore();

// Step management
const currentStep = ref(0);
const steps = [
  { id: "offering", label: "Cartas que oferece" },
  { id: "receiving", label: "Cartas que recebe" },
  { id: "review", label: "Revisar troca" },
];

// Search queries
const offeringSearchQuery = ref("");
const receivingSearchQuery = ref("");

// Selected cards
const selectedOfferingCards = ref<string[]>([]);
const selectedReceivingCards = ref<string[]>([]);

// Loading states
const creating = ref(false);

// Pagination states
const userCardsPagination = ref({
  page: 1,
  rpp: 12,
  total: 0,
});

const allCardsPagination = ref({
  page: 1,
  rpp: 12,
  total: 0,
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Computed properties
const userCards = computed(() => cardsStore.userCards);
const allCards = computed(() => cardsStore.allCards);

const filteredOfferingCards = computed(() => {
  let filtered = userCards.value;

  if (offeringSearchQuery.value) {
    const query = offeringSearchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (card) =>
        card.name.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query)
    );
  }

  const startIndex =
    (userCardsPagination.value.page - 1) * userCardsPagination.value.rpp;
  const endIndex = startIndex + userCardsPagination.value.rpp;

  return filtered.slice(startIndex, endIndex);
});

const filteredReceivingCards = computed(() => {
  let filtered = allCards.value;

  if (receivingSearchQuery.value) {
    const query = receivingSearchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (card) =>
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
    filtered = filtered.filter(
      (card) =>
        card.name.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query)
    );
  }

  return filtered.length;
});

const disabledReceivingCards = computed(() => {
  const disabledIds = new Set<string>();

  // Adiciona IDs das cartas que o usuário já tem
  userCards.value.forEach((card) => {
    disabledIds.add(card.id);
  });

  // Adiciona IDs das cartas que o usuário está oferecendo
  selectedOfferingCards.value.forEach((cardId) => {
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
  return (
    selectedOfferingCards.value.length > 0 &&
    selectedReceivingCards.value.length > 0
  );
});

const validationMessage = computed(() => {
  if (selectedOfferingCards.value.length === 0) {
    return "Selecione pelo menos uma carta para oferecer";
  }
  if (selectedReceivingCards.value.length === 0) {
    return "Selecione pelo menos uma carta para receber";
  }
  return "";
});

const selectedOfferingCardsData = computed(() => {
  return selectedOfferingCards.value
    .map(id => getCardById(id))
    .filter((c): c is CardType => !!c);
});
const selectedReceivingCardsData = computed(() => {
  return selectedReceivingCards.value
    .map(id => getCardById(id))
    .filter((c): c is CardType => !!c);
});

// Lifecycle
onMounted(() => {
  if (isOpen.value) {
    loadData();
  }
});

watch(
  () => isOpen.value,
  (isOpen) => {
    if (isOpen) {
      loadData();
    } else {
      resetForm();
    }
  }
);

watch(offeringSearchQuery, () => {
  userCardsPagination.value.page = 1;
  userCardsPagination.value.total = totalFilteredOfferingCards.value;
});

// Methods
async function loadData() {
  try {
    await Promise.all([loadUserCards(), loadAllCards()]);
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

async function loadUserCards() {
  try {
    await cardsStore.fetchUserCards();
    userCardsPagination.value.total = totalFilteredOfferingCards.value;
  } catch (error) {
    console.error("Erro ao carregar cartas do usuário:", error);
  }
}

async function loadAllCards() {
  try {
    await cardsStore.fetchAllCards(
      allCardsPagination.value.page,
      allCardsPagination.value.rpp
    );
    allCardsPagination.value.total = cardsStore.pagination.total;
  } catch (error) {
    console.error("Erro ao carregar todas as cartas:", error);
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
  offeringSearchQuery.value = "";
  receivingSearchQuery.value = "";
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
  return [...userCards.value, ...allCards.value].find(
    (card) => card.id === cardId
  );
}

async function createTrade() {
  if (!isTradeValid.value) {
    return;
  }

  creating.value = true;

  try {
    const tradeData = {
      cards: [
        ...selectedOfferingCards.value.map((cardId) => ({
          cardId,
          type: "OFFERING" as const,
        })),
        ...selectedReceivingCards.value.map((cardId) => ({
          cardId,
          type: "RECEIVING" as const,
        })),
      ],
    };

    await tradesStore.createTrade(tradeData);

    notification.show("Troca criada com sucesso!", "success");
    emit("trade-created");
    emit("update:modelValue", false);
  } catch (error: any) {
    console.error("Erro ao criar troca:", error);
    notification.show(error.message || "Erro ao criar troca", "error");
  } finally {
    creating.value = false;
  }
}

function closeModal() {
  emit('update:modelValue', false);
}
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-primary), 0.3) transparent;
  min-height: 0;
}

.cards-grid::-webkit-scrollbar {
  width: 6px;
}

.cards-grid::-webkit-scrollbar-track {
  background: transparent;
}

.cards-grid::-webkit-scrollbar-thumb {
  background-color: rgba(var(--v-theme-primary), 0.3);
  border-radius: 3px;
}

.cards-grid::-webkit-scrollbar-thumb:hover {
  background-color: rgba(var(--v-theme-primary), 0.5);
}

.card-wrapper {
  position: relative;
}

.disabled-label {
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  z-index: 10;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.trade-summary {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.summary-section {
  flex: 1;
}

.selected-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-card {
  transition: border-color 0.2s ease;
}

.selected-card:hover {
  border-color: rgb(var(--v-theme-primary)) !important;
}

.trade-arrow {
  padding: 16px 0;
}

.step-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-grey-lighten-2));
  transition: all 0.3s ease;
  border: 1px solid #00000052;
  transform: scale(1.2);
}

.step-dot.active {
  background: rgb(var(--v-theme-primary));
  border: none;
}

.step-dot.completed {
  background: rgb(var(--v-theme-success));
}

.modal-footer {
  width: 100%;
  border-top: 1px solid rgb(var(--v-theme-grey-lighten-2));
  background: rgb(var(--v-theme-grey-lighten-5));
  margin: 0 -24px -24px -24px;
  padding: 20px 24px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.footer-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .search-section .d-flex {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    max-height: 300px;
    margin-bottom: 16px;
  }

  .card-wrapper .disabled-label {
    font-size: 9px;
    padding: 3px 6px;
    top: 6px;
    left: 6px;
    right: 6px;
  }

  .trade-summary {
    flex-direction: column;
    gap: 16px;
  }

  .trade-arrow .v-avatar {
    transform: rotate(90deg);
  }

  .modal-footer {
    margin: 0 -16px -16px -16px;
    padding: 16px;
    position: sticky;
    bottom: 0;
    background: rgb(var(--v-theme-grey-lighten-5));
    z-index: 10;
  }

  .footer-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .step-indicator .d-flex {
    justify-content: center;
  }

  .footer-actions {
    justify-content: center;
    gap: 12px;
  }
}
</style>
