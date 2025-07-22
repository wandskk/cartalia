<template>
  <div class="card-selector">
    <div class="selector-header">
      <h3>{{ title }}</h3>
      <span class="card-count">{{ selectedCards.length }} carta{{ selectedCards.length !== 1 ? 's' : '' }} selecionada{{ selectedCards.length !== 1 ? 's' : '' }}</span>
    </div>

    <div class="search-section">
      <BaseInput
        v-model="searchTerm"
        :placeholder="searchPlaceholder"
        @input="handleSearch"
      />
    </div>

    <div class="cards-section">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Carregando cartas...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <BaseButton @click="retry" color="primary">Tentar novamente</BaseButton>
      </div>

      <div v-else-if="filteredCards.length === 0" class="empty-state">
        <p>{{ emptyMessage }}</p>
      </div>

      <div v-else class="cards-grid">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="card-item"
          :class="{ selected: isCardSelected(card) }"
          @click="toggleCard(card)"
        >
          <div class="card-image">
            <img :src="card.imageUrl" :alt="card.name" />
            <div v-if="isCardSelected(card)" class="selected-overlay">
              <span class="check-icon">✓</span>
            </div>
          </div>
          <div class="card-info">
            <h4 class="card-name">{{ card.name }}</h4>
            <p class="card-description">{{ truncatedDescription(card.description) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedCards.length > 0" class="selected-preview">
      <h4>Cartas Selecionadas</h4>
      <div class="selected-cards">
        <div
          v-for="card in selectedCards"
          :key="card.id"
          class="selected-card"
        >
          <img :src="card.imageUrl" :alt="card.name" />
          <span class="card-name">{{ card.name }}</span>
          <button
            @click="removeCard(card)"
            class="remove-btn"
            type="button"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseInput from '../../common/BaseInput.vue';
import BaseButton from '../../common/BaseButton.vue';
import type { Card } from '../../../types/card';

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
  emptyMessage: 'Nenhuma carta encontrada.'
});

const emit = defineEmits<Emits>();

const searchTerm = ref('');

const filteredCards = computed(() => {
  if (!searchTerm.value) {
    return props.cards;
  }
  
  const term = searchTerm.value.toLowerCase();
  return props.cards.filter(card => 
    card.name.toLowerCase().includes(term) ||
    card.description.toLowerCase().includes(term)
  );
});

function isCardSelected(card: Card): boolean {
  return props.selectedCards.some(selectedCard => selectedCard.id === card.id);
}

function toggleCard(card: Card) {
  const newSelectedCards = [...props.selectedCards];
  
  if (isCardSelected(card)) {
    const index = newSelectedCards.findIndex(c => c.id === card.id);
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

function truncatedDescription(description: string): string {
  if (description.length <= 60) {
    return description;
  }
  return description.substring(0, 60) + '...';
}

function handleSearch() {
  // Implementação futura: debounce para busca em tempo real
}

function retry() {
  emit('retry');
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;
@use 'sass:color';

.card-selector {
  .selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      color: $black;
      font-size: 18px;
      font-weight: 600;
    }

    .card-count {
      font-size: 14px;
      color: $gray-500;
    }
  }

  .search-section {
    margin-bottom: 20px;
  }

  .cards-section {
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: $gray-600;

      .loading-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid $gray-200;
        border-top: 3px solid $primary;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 12px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;

      .error-message {
        color: $error;
        margin-bottom: 12px;
        font-size: 14px;
      }
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: $gray-500;
      font-size: 14px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
      padding: 4px;

      .card-item {
        background: $white;
        border: 2px solid $gray-200;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
          border-color: $primary;
          transform: translateY(-2px);
        }

        &.selected {
          border-color: $primary;
          background: $primary;
          color: $white;

          .card-info {
            .card-name,
            .card-description {
              color: $white;
            }
          }
        }

        .card-image {
          position: relative;
          width: 100%;
          height: 120px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .selected-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba($primary, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;

            .check-icon {
              color: $white;
              font-size: 24px;
              font-weight: bold;
            }
          }
        }

        .card-info {
          padding: 12px;

          .card-name {
            margin: 0 0 4px 0;
            font-size: 14px;
            font-weight: 600;
            color: $black;
            line-height: 1.2;
          }

          .card-description {
            margin: 0;
            font-size: 12px;
            color: $gray-600;
            line-height: 1.3;
          }
        }
      }
    }
  }

  .selected-preview {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid $gray-200;

    h4 {
      margin: 0 0 12px 0;
      color: $black;
      font-size: 16px;
      font-weight: 600;
    }

    .selected-cards {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .selected-card {
        display: flex;
        align-items: center;
        gap: 8px;
        background: $gray-100;
        border-radius: 6px;
        padding: 8px 12px;

        img {
          width: 32px;
          height: 32px;
          object-fit: cover;
          border-radius: 4px;
        }

        .card-name {
          font-size: 12px;
          color: $black;
          font-weight: 500;
        }

        .remove-btn {
          background: $error;
          color: $white;
          border: none;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 10px;
          font-weight: bold;

          &:hover {
            background: color.scale($error, $lightness: -10%);
          }
        }
      }
    }
  }
}
</style> 