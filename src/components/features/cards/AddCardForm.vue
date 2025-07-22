<template>
  <Card class="add-card-form">
    <h2>Adicionar Cartas à Minha Coleção</h2>
    
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando cartas disponíveis...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <BaseButton @click="fetchAvailableCards" color="primary">Tentar novamente</BaseButton>
    </div>

    <div v-else class="form-content">
      <div class="search-section">
        <BaseInput
          v-model="searchTerm"
          placeholder="Buscar cartas..."
          @input="handleSearch"
        />
      </div>

      <div class="cards-section">
        <h3>Cartas Disponíveis</h3>
        <CardList
          :cards="filteredCards"
          :loading="loading"
          :error="error"
          :selectable="true"
          :clickable="false"
          :selected-cards="selectedCards"
          :show-pagination="true"
          :pagination="pagination"
          @card-select="handleCardSelect"
          @retry="fetchAvailableCards"
          @load-more="loadMoreCards"
        />
      </div>

      <div v-if="selectedCards.length > 0" class="selected-section">
        <h3>Cartas Selecionadas ({{ selectedCards.length }})</h3>
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
        
        <div class="form-actions">
          <BaseButton 
            @click="addSelectedCards"
            :loading="addingCards"
            color="primary"
            :disabled="selectedCards.length === 0"
          >
            Adicionar {{ selectedCards.length }} carta{{ selectedCards.length !== 1 ? 's' : '' }}
          </BaseButton>
          
          <BaseButton 
            @click="clearSelection"
            color="secondary"
            :disabled="selectedCards.length === 0"
          >
            Limpar Seleção
          </BaseButton>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCardsStore } from '../../../stores/cards';
import { useNotificationStore } from '../../../stores/notification';
import Card from '../../common/Card.vue';
import BaseInput from '../../common/BaseInput.vue';
import BaseButton from '../../common/BaseButton.vue';
import CardList from './CardList.vue';
import type { Card as CardType } from '../../../types/card';

const cardsStore = useCardsStore();
const notification = useNotificationStore();

const searchTerm = ref('');
const selectedCards = ref<CardType[]>([]);
const addingCards = ref(false);

const loading = computed(() => cardsStore.loading);
const error = computed(() => cardsStore.error);
const availableCards = computed(() => cardsStore.allCards);
const pagination = computed(() => cardsStore.pagination);

const filteredCards = computed(() => {
  if (!searchTerm.value) {
    return availableCards.value;
  }
  
  const term = searchTerm.value.toLowerCase();
  return availableCards.value.filter(card => 
    card.name.toLowerCase().includes(term) ||
    card.description.toLowerCase().includes(term)
  );
});

onMounted(() => {
  fetchAvailableCards();
});

async function fetchAvailableCards() {
  await cardsStore.fetchAllCards();
}

async function loadMoreCards() {
  const nextPage = pagination.value.page + 1;
  await cardsStore.fetchAllCards(nextPage, pagination.value.rpp);
}

function handleSearch() {
  // Implementação futura: debounce para busca em tempo real
}

function handleCardSelect(card: CardType, selected: boolean) {
  if (selected) {
    if (!selectedCards.value.find(c => c.id === card.id)) {
      selectedCards.value.push(card);
    }
  } else {
    selectedCards.value = selectedCards.value.filter(c => c.id !== card.id);
  }
}

function removeCard(card: CardType) {
  selectedCards.value = selectedCards.value.filter(c => c.id !== card.id);
}

function clearSelection() {
  selectedCards.value = [];
}

async function addSelectedCards() {
  if (selectedCards.value.length === 0) return;
  
  addingCards.value = true;
  
  try {
    const cardIds = selectedCards.value.map(card => card.id);
    await cardsStore.addCardsToUser(cardIds);
    
    notification.show(
      `${selectedCards.value.length} carta${selectedCards.value.length !== 1 ? 's' : ''} adicionada${selectedCards.value.length !== 1 ? 's' : ''} com sucesso!`,
      'success'
    );
    
    selectedCards.value = [];
  } catch (err: any) {
    notification.show(
      err.message || 'Erro ao adicionar cartas',
      'error'
    );
  } finally {
    addingCards.value = false;
  }
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;
@use 'sass:color';

.add-card-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  h2 {
    margin: 0 0 24px 0;
    color: $black;
    font-size: 24px;
    font-weight: 600;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: $gray-600;

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid $gray-200;
      border-top: 4px solid $primary;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
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
    padding: 40px;
    text-align: center;

    .error-message {
      color: $error;
      margin-bottom: 16px;
      font-size: 16px;
    }
  }

  .form-content {
    .search-section {
      margin-bottom: 24px;
    }

    .cards-section {
      margin-bottom: 32px;

      h3 {
        margin: 0 0 16px 0;
        color: $black;
        font-size: 18px;
        font-weight: 600;
      }
    }

    .selected-section {
      border-top: 1px solid $gray-200;
      padding-top: 24px;

      h3 {
        margin: 0 0 16px 0;
        color: $black;
        font-size: 18px;
        font-weight: 600;
      }

      .selected-cards {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 24px;

        .selected-card {
          display: flex;
          align-items: center;
          background: $gray-100;
          border-radius: 8px;
          padding: 8px 12px;
          gap: 8px;

          img {
            width: 40px;
            height: 40px;
            object-fit: cover;
            border-radius: 4px;
          }

          .card-name {
            font-size: 14px;
            color: $black;
            font-weight: 500;
          }

          .remove-btn {
            background: $error;
            color: $white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;

            &:hover {
              background: color.scale($error, $lightness: -10%);
            }
          }
        }
      }

      .form-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        @media (max-width: 480px) {
          flex-direction: column;
        }
      }
    }
  }
}
</style> 