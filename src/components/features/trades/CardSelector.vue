<template>
  <div class="card-selector">
    <div class="d-flex justify-space-between align-center mb-4">
      <h3 class="text-h6 font-weight-bold">{{ title }}</h3>
      <v-chip color="primary" variant="tonal" size="small">
        {{ selectedCards.length }} carta{{ selectedCards.length !== 1 ? 's' : '' }} selecionada{{ selectedCards.length !== 1 ? 's' : '' }}
      </v-chip>
    </div>

    <div class="mb-4">
      <v-text-field
        v-model="searchTerm"
        :placeholder="searchPlaceholder"
        @input="handleSearch"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
      />
    </div>

    <div class="cards-section">
      <div v-if="loading" class="d-flex flex-column align-center justify-center py-10 text-grey">
        <LoadingSpinner text="Carregando cartas..." />
      </div>

      <div v-else-if="error" class="d-flex flex-column align-center justify-center py-10 text-center">
        <v-icon size="48" color="error" class="mb-4">mdi-alert-circle</v-icon>
        <p class="text-error text-body-1 mb-4">{{ error }}</p>
        <v-btn @click="retry" color="primary" variant="elevated">Tentar novamente</v-btn>
      </div>

      <div v-else-if="filteredCards.length === 0" class="d-flex flex-column align-center justify-center py-10 text-center">
        <v-icon size="48" color="grey-lighten-1" class="mb-4">mdi-cards</v-icon>
        <p class="text-body-1 text-grey">{{ emptyMessage }}</p>
      </div>

      <div v-else class="cards-grid">
        <v-card
          v-for="card in filteredCards"
          :key="card.id"
          class="card-item"
          :class="{ 'selected-card': isCardSelected(card) }"
          @click="toggleCard(card)"
          elevation="2"
        >
          <v-img
            :src="card.imageUrl"
            :alt="card.name"
            height="200"
            cover
            class="card-image"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <LoadingSpinner />
              </div>
            </template>
            
            <div v-if="isCardSelected(card)" class="selected-overlay d-flex align-center justify-center">
              <v-icon size="32" color="white">mdi-check-circle</v-icon>
            </div>
          </v-img>
          
          <v-card-text class="pa-3">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">{{ card.name }}</h4>
            <p class="text-body-2 text-grey">{{ truncatedDescription(card.description) }}</p>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div v-if="selectedCards.length > 0" class="selected-preview mt-6">
      <h4 class="text-h6 font-weight-bold mb-4">Cartas Selecionadas</h4>
      <div class="selected-cards">
        <v-card
          v-for="card in selectedCards"
          :key="card.id"
          class="selected-card d-flex align-center pa-3 mb-3"
          elevation="1"
        >
          <v-img
            :src="card.imageUrl"
            :alt="card.name"
            width="60"
            height="84"
            cover
            class="rounded mr-3"
          />
          <span class="text-body-2 font-weight-medium flex-grow-1">{{ card.name }}</span>
          <v-btn
            @click="removeCard(card)"
            icon
            variant="text"
            size="small"
            color="error"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LoadingSpinner from '../../common/LoadingSpinner.vue';
import type { Card } from '../../../types';

interface Props {
  cards: Card[];
  selectedCards: Card[];
  loading?: boolean;
  error?: string | null;
  title: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

interface Emits {
  (e: 'update:selectedCards', cards: Card[]): void;
  (e: 'retry'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  searchPlaceholder: 'Buscar cartas...',
  emptyMessage: 'Nenhuma carta encontrada'
});

const emit = defineEmits<Emits>();

const searchTerm = ref('');

const filteredCards = computed(() => {
  if (!searchTerm.value) return props.cards;
  
  const term = searchTerm.value.toLowerCase();
  return props.cards.filter(card => 
    card.name.toLowerCase().includes(term) ||
    card.description.toLowerCase().includes(term)
  );
});

function handleSearch() {
  // Search is handled by computed property
}

function toggleCard(card: Card) {
  const newSelectedCards = [...props.selectedCards];
  const index = newSelectedCards.findIndex(c => c.id === card.id);
  
  if (index > -1) {
    newSelectedCards.splice(index, 1);
  } else {
    newSelectedCards.push(card);
  }
  
  emit('update:selectedCards', newSelectedCards);
}

function removeCard(card: Card) {
  const newSelectedCards = props.selectedCards.filter(c => c.id !== card.id);
  emit('update:selectedCards', newSelectedCards);
}

function isCardSelected(card: Card) {
  return props.selectedCards.some(c => c.id === card.id);
}

function truncatedDescription(description: string) {
  return description.length > 100 ? description.substring(0, 100) + '...' : description;
}

function retry() {
  emit('retry');
}
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.card-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.selected-card {
  border-color: rgb(var(--v-theme-primary)) !important;
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

.selected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--v-theme-primary), 0.8);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.selected-card .selected-overlay {
  opacity: 1;
}

.selected-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }
}
</style> 
