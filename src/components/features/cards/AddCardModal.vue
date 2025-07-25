<template>
  <BaseModal
    v-model="isOpen"
    :title="initialLoading ? 'Carregando...' : 'Adicionar cartas à sua coleção'"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="add-card-modal">
      <SearchWithPagination
        v-model:search-query="searchQuery"
        placeholder="Buscar cartas..."
        :disabled="initialLoading"
        :show-pagination="
          filteredCards.length > 0 &&
          !initialLoading &&
          !searchLoading &&
          !loadingStore.isLoading
        "
        :total-items="cardsStore.pagination.total || filteredCards.length"
        :items-per-page="itemsPerPage"
        :current-page="currentPage"
        :loading="loading"
        @page-change="handlePageChange"
      />

      <div
        v-if="initialLoading || searchLoading || loading"
        class="d-flex flex-column align-center justify-center py-15"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
          class="mb-4"
        />
        <p class="text-grey text-center">
          {{
            initialLoading
              ? "Carregando cartas disponíveis..."
              : searchLoading
              ? "Buscando cartas..."
              : "Carregando página..."
          }}
        </p>
      </div>

      <div v-else-if="!loadingStore.isLoading && !loading" class="cards-grid">
        <Card
          v-for="card in paginatedCards"
          :key="card.id"
          :card="card"
          :selectable="true"
          :selected="selectedCards.includes(card.id)"
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
        v-else-if="loadingStore.isLoading"
        class="d-flex flex-column align-center justify-center py-15"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
          class="mb-4"
        />
        <p class="text-grey text-center">Adicionando cartas à sua coleção...</p>
      </div>

      <div
        v-if="
          filteredCards.length === 0 &&
          !initialLoading &&
          !searchLoading &&
          !searchQuery
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
          !searchLoading &&
          searchQuery
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
            :disabled="selectedCards.length === 0 || loadingStore.isLoading"
            :loading="loadingStore.isLoading"
          >
            <span v-if="loadingStore.isLoading">Adicionando...</span>
            <span v-else
              >Adicionar {{ selectedCards.length }} Carta{{
                selectedCards.length !== 1 ? "s" : ""
              }}</span
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
import BaseModal from "../../common/BaseModal.vue";
import Card from "../../common/Card.vue";
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
const searchQuery = ref("");
const selectedCards = ref<string[]>([]);
const initialLoading = ref(false);

const currentPage = ref(1);
const itemsPerPage = ref(12);
const searchTimeout = ref<NodeJS.Timeout | null>(null);
const searchLoading = ref(false);

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
  let filtered = allCards.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (card) =>
        card.name.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query)
    );
  }

  return filtered;
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
      searchQuery.value = "";
    }
  }
);

watch(
  () => searchQuery.value,
  async () => {
    currentPage.value = 1;

    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value);
    }

    searchTimeout.value = setTimeout(async () => {
      if (searchQuery.value) {
        searchLoading.value = true;
        try {
          await cardsStore.fetchAllCards(
            1,
            itemsPerPage.value,
            searchQuery.value
          );
        } finally {
          searchLoading.value = false;
        }
      }
    }, 500);
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
    searchQuery.value || undefined
  );
}

function toggleCardSelection(cardId: string) {
  const index = selectedCards.value.indexOf(cardId);
  if (index > -1) {
    selectedCards.value.splice(index, 1);
  } else {
    selectedCards.value.push(cardId);
  }
}

function handleCardClick(cardId: string) {
  toggleCardSelection(cardId);
}

function handleCardSelect(card: CardType, selected: boolean) {
  if (selected) {
    if (!selectedCards.value.includes(card.id)) {
      selectedCards.value.push(card.id);
    }
  } else {
    const index = selectedCards.value.indexOf(card.id);
    if (index > -1) {
      selectedCards.value.splice(index, 1);
    }
  }
}

async function handleAddCards() {
  if (selectedCards.value.length === 0) return;

  loadingStore.startLoading();

  try {
    await cardsStore.addCardsToUser(selectedCards.value);

    notificationStore.show(
      `${selectedCards.value.length} carta${
        selectedCards.value.length !== 1 ? "s" : ""
      } adicionada${selectedCards.value.length !== 1 ? "s" : ""} com sucesso!`,
      "success"
    );

    selectedCards.value = [];
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
