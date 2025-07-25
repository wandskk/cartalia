<template>
  <v-dialog v-model="isOpen" :max-width="isMobile ? '100%' : '1200'" persistent>
    <v-card class="create-trade-modal">
      <v-card-title class="modal-header">
        <span class="modal-title">Criar Troca</span>
        <v-btn icon variant="text" @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="modal-content pa-0">
        <div class="modal-body">
          <!-- Step Progress - Minimal -->
          <div class="step-progress">
            <div class="step-progress-content">
              <div
                v-for="(_, index) in ['Oferecer', 'Receber', 'Revisar']"
                :key="index"
                class="step-item"
              >
                <div
                  class="step-indicator"
                  :class="{
                    'step-active': steps.currentStep.value === index,
                    'step-completed': steps.currentStep.value > index,
                    'step-pending': steps.currentStep.value < index,
                  }"
                >
                  <v-icon
                    v-if="steps.currentStep.value > index"
                    size="16"
                    color="white"
                    >mdi-check</v-icon
                  >
                  <span v-else class="step-number">{{ index + 1 }}</span>
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

      <!-- Footer Actions - Minimal -->
      <v-card-actions class="modal-footer">
        <v-btn
          v-if="steps.canGoBack"
          @click="previousStep"
          variant="outlined"
          color="grey"
          class="footer-btn"
        >
          Voltar
        </v-btn>

        <v-btn
          v-if="steps.canGoNext && steps.currentStep.value < 2"
          @click="nextStep"
          color="primary"
          :disabled="!canProceedToNextStep"
          class="footer-btn"
        >
          Continuar
        </v-btn>

        <v-btn
          v-if="steps.currentStep.value === 2"
          @click="createTrade"
          color="success"
          :loading="loadingStore.isLoading"
          :disabled="!canCreateTrade"
          class="footer-btn"
        >
          <span v-if="loadingStore.isLoading">Criando...</span>
          <span v-else>Criar</span>
        </v-btn>

        <v-btn @click="closeModal" variant="outlined" color="grey" class="footer-btn">
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useCardsStore } from "../../../stores/cards";
import { useTradesStore } from "../../../stores/trades";
import { useLoadingStore } from "../../../stores/loading";
import { useNotificationStore } from "../../../stores/notification";
import { useSteps } from "../../../composables/useSteps";
import { useSearch } from "../../../composables/useSearch";

import TradeStepCardSelection from "./TradeStepCardSelection.vue";
import TradePreviewStep from "./TradePreviewStep.vue";
import type { Card } from "../../../types/cards";

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
const loadingStore = useLoadingStore();
const notificationStore = useNotificationStore();

const steps = useSteps({
  steps: [
    {
      id: 0,
      title: "Oferecer",
      description: "Selecione suas cartas",
      icon: "mdi-export",
    },
    {
      id: 1,
      title: "Receber",
      description: "Selecione cartas desejadas",
      icon: "mdi-import",
    },
    {
      id: 2,
      title: "Revisar",
      description: "Confirme a troca",
      icon: "mdi-eye",
    },
  ],
  validateStep: (step) => {
    if (step === 0) return selectedOfferingCards.value.length > 0;
    if (step === 1) return selectedReceivingCards.value.length > 0;
    return true;
  },
});

const offeringSearch = useSearch({ debounceMs: 500 });
const receivingSearch = useSearch({ debounceMs: 500 });

const selectedOfferingCards = ref<string[]>([]);
const selectedReceivingCards = ref<string[]>([]);
const offeringSearchQuery = ref("");
const receivingSearchQuery = ref("");

const userCardsPagination = ref({ page: 1, rpp: 12, total: 0 });
const allCardsPagination = ref({ page: 1, rpp: 12, total: 0 });

const isMobile = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const userCards = computed(() => cardsStore.userCards);
const allCards = computed(() => cardsStore.allCards);

const totalFilteredOfferingCards = computed(() => {
  return offeringSearch.filterByQuery(
    userCards.value,
    ["name", "description"],
    offeringSearch.debouncedQuery.value
  ).length;
});

const totalFilteredReceivingCards = computed(() => {
  return receivingSearch.filterByQuery(
    allCards.value,
    ["name", "description"],
    receivingSearch.debouncedQuery.value
  ).length;
});

const selectedOfferingCardsData = computed(() => {
  return userCards.value.filter((card) =>
    selectedOfferingCards.value.includes(card.id)
  );
});

const selectedReceivingCardsData = computed(() => {
  return allCards.value.filter((card) =>
    selectedReceivingCards.value.includes(card.id)
  );
});

const canProceedToNextStep = computed(() => {
  if (steps.currentStep.value === 0)
    return selectedOfferingCards.value.length > 0;
  if (steps.currentStep.value === 1)
    return selectedReceivingCards.value.length > 0;
  return true;
});

const canCreateTrade = computed(() => {
  return (
    selectedOfferingCards.value.length > 0 &&
    selectedReceivingCards.value.length > 0
  );
});

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
  if (isOpen.value) {
    loadData();
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
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
    await cardsStore.fetchAllCards(1, 1000);
    allCardsPagination.value.total = totalFilteredReceivingCards.value;
  } catch (error) {
    console.error("Erro ao carregar todas as cartas:", error);
  }
}

function resetForm() {
  steps.reset();
  selectedOfferingCards.value = [];
  selectedReceivingCards.value = [];
  offeringSearchQuery.value = "";
  receivingSearchQuery.value = "";
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
  emit("update:modelValue", false);
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

function handleOfferingSearchChange(query: string) {
  offeringSearchQuery.value = query;
  userCardsPagination.value.page = 1;
}

function handleReceivingSearchChange(query: string) {
  receivingSearchQuery.value = query;
  allCardsPagination.value.page = 1;
}

async function handleOfferingPageChange(page: number) {
  userCardsPagination.value.page = page;
}

async function handleReceivingPageChange(page: number) {
  allCardsPagination.value.page = page;
}

function handleCardClick(_: Card) {
}

async function createTrade() {
  if (!canCreateTrade.value) return;

  loadingStore.startLoading();

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

    notificationStore.show("Troca criada com sucesso!", "success");

    emit("trade-created");
    closeModal();
  } catch (error: any) {
    console.error("Erro ao criar troca:", error);
    notificationStore.show(error.message || "Erro ao criar troca", "error");
  } finally {
    loadingStore.stopLoading();
  }
}
</script>

<style scoped>
.create-trade-modal {
  border-radius: 16px;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
}

.modal-content {
  flex: 1;
  overflow: hidden;
}

.modal-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 180px);
}

.step-progress {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background: #f9fafb;
}

.step-progress-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: center;
}

.step-indicator {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.step-number {
  font-size: 12px;
  font-weight: 600;
}

.step-indicator.step-active {
  background: #3b82f6;
  color: white;
}

.step-indicator.step-completed {
  background: #10b981;
  color: white;
}

.step-indicator.step-pending {
  background: #e5e7eb;
  color: #6b7280;
}

.step-content-container {
  flex: 1;
  overflow: hidden;
  padding: 20px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.footer-btn {
  min-width: 100px;
}

@media (max-width: 768px) {
  .create-trade-modal {
    border-radius: 0;
    height: 100vh;
    max-height: 100vh;
  }

  .modal-header {
    padding: 16px 20px 0 20px;
  }

  .modal-title {
    font-size: 16px;
  }

  .modal-body {
    max-height: calc(100vh - 120px);
  }

  .step-progress {
    padding: 12px 20px;
  }

  .step-progress-content {
    gap: 12px;
  }

  .step-indicator {
    width: 24px;
    height: 24px;
  }

  .step-number {
    font-size: 10px;
  }

  .step-content-container {
    padding: 16px 20px;
    overflow-y: auto;
  }

  .modal-footer {
    padding: 12px 20px;
    flex-direction: column;
    gap: 8px;
  }

  .footer-btn {
    width: 100%;
    min-width: auto;
    height: 40px;
  }
}
</style>
