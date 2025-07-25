<template>
  <BaseModal
    v-model="isOpen"
    :title="initialLoading ? 'Carregando...' : 'Adicionar cartas à sua coleção'"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="add-card-modal">
      <div class="d-flex align-center justify-center ga-4 flex-wrap search-section mb-6">
        <SearchInput
          v-model="searchQuery"
          placeholder="Buscar cartas..."
          :disabled="initialLoading"
        />

        <SimplePagination
          v-if="
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
      </div>

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
          :selectable="!isCardOwned(card.id)"
          :selected="selectedCards.includes(card.id)"
          :clickable="!isCardOwned(card.id)"
          size="sm"
          variant="compact"
          :show-description="true"
          :max-description-length="80"
          :class="{ 'owned-card': isCardOwned(card.id) }"
          @click="handleCardClick(card.id)"
          @select="handleCardSelect"
        >
          <template v-if="isCardOwned(card.id)" #overlay>
            <div class="owned-overlay">
              <v-chip
                color="success"
                size="x-small"
                variant="elevated"
                class="owned-badge"
              >
                ✓ Já possui
              </v-chip>
            </div>
          </template>
        </Card>
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
import SimplePagination from "../../common/SimplePagination.vue";
import type { Card as CardType } from "../../../types";
import SearchInput from "../../common/SearchInput.vue";

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
const userCards = computed(() => cardsStore.userCards);

const userCardIds = computed(() => userCards.value.map((card) => card.id));

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
    await cardsStore.fetchUserCards();
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

function isCardOwned(cardId: string): boolean {
  return userCardIds.value.includes(cardId);
}

function handleCardClick(cardId: string) {
  if (!isCardOwned(cardId)) {
    toggleCardSelection(cardId);
  }
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

.owned-card {
  opacity: 0.6;
  filter: grayscale(30%);
  pointer-events: none;
  position: relative;
}

.owned-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--v-theme-success), 0.1);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 8px;
  z-index: 10;
}

.owned-card:hover {
  transform: none !important;
  box-shadow: none !important;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
</style>
