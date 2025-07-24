<template>
  <BaseModal
    v-model="isOpen"
    :title="initialLoading ? 'Carregando...' : 'Adicionar cartas à sua coleção'"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="add-card-modal">
      <div class="search-section">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar cartas..."
            class="search-input"
            :disabled="initialLoading"
          />
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <div
        v-if="initialLoading || searchLoading || loading"
        class="cards-loading"
      >
        <LoadingSpinner 
          :text="initialLoading
            ? 'Carregando cartas disponíveis...'
            : searchLoading
            ? 'Buscando cartas...'
            : 'Carregando página...'" 
        />
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
              <span class="owned-badge">✓ Já possui</span>
            </div>
          </template>
        </Card>
      </div>

      <div v-else-if="loadingStore.isLoading" class="cards-loading">
        <LoadingSpinner text="Adicionando cartas à sua coleção..." />
      </div>

      <div
        v-if="
          filteredCards.length === 0 &&
          !initialLoading &&
          !searchLoading &&
          !searchQuery
        "
        class="no-results"
      >
        <div class="no-results-icon">🔍</div>
        <h3>Nenhuma carta encontrada</h3>
        <p>Nenhuma carta disponível no sistema</p>
      </div>

      <div
        v-if="
          filteredCards.length === 0 &&
          !initialLoading &&
          !searchLoading &&
          searchQuery
        "
        class="no-results"
      >
        <div class="no-results-icon">🔍</div>
        <h3>Nenhuma carta encontrada</h3>
        <p>Tente ajustar sua busca</p>
      </div>
    </div>

    <template #footer>
      <div style="width: 100%">
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

        <div
          style="
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 16px;
          "
        >
          <BaseButton
            @click="$emit('update:modelValue', false)"
            color="secondary"
          >
            Cancelar
          </BaseButton>
          <BaseButton
            @click="handleAddCards"
            color="primary"
            :disabled="selectedCards.length === 0 || loadingStore.isLoading"
          >
            <span v-if="loadingStore.isLoading">Adicionando...</span>
            <span v-else
              >Adicionar {{ selectedCards.length }} Carta{{
                selectedCards.length !== 1 ? "s" : ""
              }}</span
            >
          </BaseButton>
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
import BaseButton from "../../common/BaseButton.vue";
import Card from "../../common/Card.vue";
import SimplePagination from "../../common/SimplePagination.vue";
import LoadingSpinner from "../../common/LoadingSpinner.vue";
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
const userCards = computed(() => cardsStore.userCards);

const userCardIds = computed(() => userCards.value.map((card) => card.id));

const availableCardsCount = computed(() => {
  return filteredCards.value.filter((card) => !isCardOwned(card.id)).length;
});

const paginatedCards = computed(() => {
  return filteredCards.value;
});

const totalPages = computed(() => {
  return Math.ceil((cardsStore.pagination.total || 0) / itemsPerPage.value);
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
      `${selectedCards.value.length} carta${selectedCards.value.length !== 1 ? 's' : ''} adicionada${selectedCards.value.length !== 1 ? 's' : ''} com sucesso!`,
      'success'
    );
    
    selectedCards.value = [];
    emit("cards-added");
    emit("update:modelValue", false);
  } catch (error: any) {
    console.error("Erro ao adicionar cartas:", error);
    notificationStore.show(
      error.message || 'Erro ao adicionar cartas à sua coleção',
      'error'
    );
  } finally {
    loadingStore.stopLoading();
  }
}
</script>

<style scoped lang="scss">
@use "../../../styles/_variables.scss" as *;

.add-card-modal {
  .search-section {
    margin-bottom: 24px;

    .search-box {
      position: relative;

      .search-input {
        width: 100%;
        padding: 12px 16px 12px 44px;
        border: 2px solid $gray-200;
        border-radius: 12px;
        font-size: 14px;
        background: $white;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }

        &::placeholder {
          color: $gray-500;
        }

        &:disabled {
          background: $gray-100;
          color: $gray-500;
          cursor: not-allowed;
          opacity: 0.7;
        }
      }

      .search-icon {
        position: absolute;
        left: 16px;
        top: 50%;
        transform: translateY(-50%);
        color: $gray-500;
        font-size: 16px;
      }
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
  }

  .owned-card {
    opacity: 0.6;
    filter: grayscale(30%);
    pointer-events: none;
    position: relative;

    .owned-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba($success, 0.1);
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      padding: 8px;
      z-index: 10;

      .owned-badge {
        background: $success;
        color: $white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
    }

    &:hover {
      transform: none !important;
      box-shadow: none !important;
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


}

@media (max-width: 768px) {
  .add-card-modal {
    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }
  }
}
</style>
