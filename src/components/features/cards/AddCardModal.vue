<template>
  <BaseModal
    v-model="isOpen"
    :title="initialLoading ? 'Carregando...' : 'Adicionar cartas'"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="add-card-modal">
      <SearchWithPagination
        :search-query="search.searchQuery.value"
        placeholder="Buscar cartas..."
        :disabled="initialLoading"
        :show-pagination="
          cardsStore.pagination.total > itemsPerPage && !initialLoading
        "
        :total-items="cardsStore.pagination.total"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        :loading="loading"
        @update:search-query="search.setQuery"
        @page-change="handlePageChange"
      />

      <LoadingOverlay
        :loading="initialLoading || search.isSearching.value"
        :message="getLoadingMessage()"
        :size="32"
      />

      <div v-if="!loadingStore.isLoading && !loading" class="cards-grid">
        <Card
          v-for="card in allCards"
          :key="card.id"
          :card="card"
          :selectable="true"
          :selected="cardSelection.isSelected(card.id)"
          :clickable="true"
          size="sm"
          variant="compact"
          :show-description="true"
          :max-description-length="80"
          @click="handleCardClick(card.id)"
          @select="handleCardSelect"
        />
      </div>

      <div
        v-if="loading && !loadingStore.isLoading"
        class="d-flex flex-column align-center justify-center py-15"
      >
        <LoadingSpinner size="large" class="mb-4" />
        <p class="text-grey text-center">Carregando página...</p>
      </div>

      <div
        v-if="
          allCards.length === 0 &&
          !initialLoading &&
          !search.isSearching.value &&
          !search.hasQuery.value
        "
        class="d-flex flex-column align-center justify-center py-15 text-center"
      >
        <v-icon size="64" color="grey-lighten-1" class="mb-4"
          >mdi-magnify</v-icon
        >
        <h3 class="text-h6 mb-2 text-grey">Nenhuma carta encontrada</h3>
        <p class="text-body-2 text-grey">Nenhuma carta disponível no sistema</p>
      </div>

      <div
        v-if="
          allCards.length === 0 &&
          !initialLoading &&
          !search.isSearching.value &&
          search.hasQuery.value
        "
        class="d-flex flex-column align-center justify-center py-15 text-center"
      >
        <v-icon size="64" color="grey-lighten-1" class="mb-4"
          >mdi-magnify</v-icon
        >
        <h3 class="text-h6 mb-2 text-grey">Nenhuma carta encontrada</h3>
        <p class="text-body-2 text-grey">Tente ajustar sua busca</p>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer-content">
        <v-btn
          @click="$emit('update:modelValue', false)"
          variant="outlined"
          color="grey"
          class="footer-btn"
        >
          Cancelar
        </v-btn>
        <v-btn
          @click="handleAddCards"
          color="primary"
          :disabled="!cardSelection.hasSelection || loadingStore.isLoading"
          :loading="loadingStore.isLoading"
          class="footer-btn"
        >
          <span v-if="loadingStore.isLoading">Adicionando...</span>
          <span v-else>Adicionar {{ cardSelection.selectedCount.value }}</span>
        </v-btn>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useCardsStore } from "../../../stores/cards";
import { useLoadingStore } from "../../../stores/loading";
import { useNotificationStore } from "../../../stores/notification";
import { useCardSelection } from "../../../composables/useCardSelection";
import { useSearch } from "../../../composables/useSearch";
import BaseModal from "../../common/BaseModal.vue";
import Card from "../../common/Card.vue";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
import LoadingOverlay from "../../common/LoadingOverlay.vue";
import SearchWithPagination from "../../common/SearchWithPagination.vue";
import type { Card as CardType } from "../../../types";

interface Props {
  modelValue: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "cards-added"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const cardsStore = useCardsStore();
const loadingStore = useLoadingStore();
const notificationStore = useNotificationStore();

const cardSelection = useCardSelection();
const search = useSearch({ debounceMs: 500 });

const initialLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(12);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const loading = computed(() => cardsStore.loading);
const allCards = computed(() => cardsStore.allCards);

onMounted(() => {
  if (isOpen.value) {
    fetchAllCards();
  }
});

watch(
  () => isOpen.value,
  (isOpen) => {
    if (isOpen) {
      fetchAllCards();
    } else {
      currentPage.value = 1;
      search.clearQuery();
      cardSelection.clearSelection();
    }
  }
);

watch(
  () => search.debouncedQuery.value,
  async () => {
    currentPage.value = 1;
    await cardsStore.fetchAllCards(
      1,
      itemsPerPage.value,
      search.debouncedQuery.value || undefined
    );
  }
);

async function fetchAllCards() {
  initialLoading.value = true;
  try {
    await cardsStore.fetchAllCards(currentPage.value, itemsPerPage.value);
  } finally {
    initialLoading.value = false;
  }
}

async function handlePageChange(page: number) {
  currentPage.value = page;
  await cardsStore.fetchAllCards(
    page,
    itemsPerPage.value,
    search.debouncedQuery.value || undefined
  );
}

function handleCardClick(cardId: string) {
  cardSelection.toggleCard(cardId);
}

function handleCardSelect(card: CardType) {
  cardSelection.selectCard(card.id);
}

function getLoadingMessage(): string {
  if (initialLoading.value) return "Carregando cartas disponíveis...";
  if (search.isSearching.value) return "Buscando cartas...";
  return "Carregando página...";
}

async function handleAddCards() {
  if (!cardSelection.hasSelection.value) return;

  loadingStore.startLoading();

  try {
    await cardsStore.addCardsToUser(cardSelection.selectedCards.value);

    notificationStore.show(
      `${cardSelection.selectedCount.value} carta${cardSelection.selectedCount.value !== 1 ? "s" : ""} adicionada com sucesso!`,
      "success"
    );

    cardSelection.clearSelection();
    emit("cards-added");
    emit("update:modelValue", false);
  } catch (error: any) {
    console.error("Erro ao adicionar cartas:", error);
    notificationStore.show(
      error.message || "Erro ao adicionar cartas à sua coleção",
      "error"
    );
  } finally {
    loadingStore.stopLoading();
  }
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
}

.modal-footer-content {
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.footer-btn {
  min-width: 120px;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    max-height: 300px;
    margin-bottom: 16px;
  }
  
  .add-card-modal {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
  
  .modal-footer-content {
    flex-direction: column;
    gap: 8px;
  }
  
  .footer-btn {
    width: 100%;
    min-width: auto;
    height: 44px;
  }
}

@media (max-width: 480px) {
  .footer-btn {
    height: 44px;
    font-size: 14px;
  }
}
</style>
