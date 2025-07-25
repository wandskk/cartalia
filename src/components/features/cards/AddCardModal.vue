<template>
  <BaseModal
    v-model="isOpen"
    :title="initialLoading ? 'Carregando...' : 'Adicionar cartas à sua coleção'"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="add-card-modal">
      <SearchWithPagination
        :search-query="search.searchQuery.value"
        placeholder="Buscar cartas..."
        :disabled="initialLoading"
        :show-pagination="
          filteredCards.length > 0 &&
          !initialLoading &&
          !search.isSearching.value &&
          !loadingStore.isLoading
        "
        :total-items="cardsStore.pagination.total || filteredCards.length"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        :loading="loading"
        @update:search-query="search.setQuery"
        @page-change="handlePageChange"
      />

      <LoadingOverlay 
        :loading="initialLoading || search.isSearching.value || loading"
        :message="getLoadingMessage()"
        :size="32"
      />

      <div v-if="!loadingStore.isLoading && !loading" class="cards-grid">
        <Card
          v-for="card in paginatedCards"
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
        v-if="loadingStore.isLoading"
        class="d-flex flex-column align-center justify-center py-15"
      >
        <LoadingSpinner size="large" class="mb-4" />
        <p class="text-grey text-center">Adicionando cartas à sua coleção...</p>
      </div>

              <div
          v-if="
            filteredCards.length === 0 &&
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
            filteredCards.length === 0 &&
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
      <div class="w-100">
        <div class="d-flex ga-3 justify-end mt-4">
          <v-btn
            @click="$emit('update:modelValue', false)"
            variant="outlined"
            color="grey"
          >
            Cancelar
          </v-btn>
          <v-btn
            @click="handleAddCards"
            color="primary"
            :disabled="!cardSelection.hasSelection || loadingStore.isLoading"
            :loading="loadingStore.isLoading"
          >
            <span v-if="loadingStore.isLoading">Adicionando...</span>
            <span v-else
              >Adicionar {{ arrayFormatters.formatCount(cardSelection.selectedCount.value, 'carta') }}</span
            >
          </v-btn>
        </div>
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
import { arrayFormatters } from "../../../utils/formatters";
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

// Composables
const cardSelection = useCardSelection();
const search = useSearch({ debounceMs: 500 });

// Estado local
const initialLoading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(12);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const loading = computed(() => cardsStore.loading);
const allCards = computed(() => cardsStore.allCards);

const paginatedCards = computed(() => {
  return filteredCards.value;
});

const filteredCards = computed(() => {
  return search.filterByQuery(allCards.value, ['name', 'description'], search.debouncedQuery.value);
});

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

    if (search.debouncedQuery.value) {
      await search.performSearch(async (query) => {
        await cardsStore.fetchAllCards(1, itemsPerPage.value, query);
        return allCards.value;
      });
    }
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
      `${arrayFormatters.formatCount(cardSelection.selectedCount.value, 'carta')} adicionada com sucesso!`,
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

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
</style>
