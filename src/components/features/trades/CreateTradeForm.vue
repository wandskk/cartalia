<template>
  <div class="create-trade-form">
    <div class="form-sections">
      <div class="section offering-section">
        <div class="section-header">
          <h3>
            <span class="section-icon">📤</span>
            Cartas que você oferece
          </h3>
          <BaseButton @click="showCardSelector = 'offering'" color="primary" size="sm">
            <span class="btn-icon">+</span>
            Adicionar Carta
          </BaseButton>
    </div>

        <div class="selected-cards">
          <div 
            v-for="card in selectedOfferingCards" 
            :key="card.id"
            class="selected-card"
          >
            <img :src="card.imageUrl" :alt="card.name" />
            <div class="card-info">
              <span class="card-name">{{ card.name }}</span>
            </div>
            <button @click="removeOfferingCard(card)" class="remove-btn">
              <span class="remove-icon">×</span>
            </button>
        </div>

          <div v-if="selectedOfferingCards.length === 0" class="empty-state">
            <span class="empty-icon">🃏</span>
            <p>Nenhuma carta selecionada</p>
          </div>
        </div>
      </div>

      <div class="section receiving-section">
        <div class="section-header">
          <h3>
            <span class="section-icon">📥</span>
            Cartas que você quer receber
          </h3>
          <BaseButton @click="showCardSelector = 'receiving'" color="primary" size="sm">
            <span class="btn-icon">+</span>
            Adicionar Carta
          </BaseButton>
        </div>
        
        <div class="selected-cards">
          <div 
            v-for="card in selectedReceivingCards" 
            :key="card.id"
            class="selected-card"
          >
            <img :src="card.imageUrl" :alt="card.name" />
            <div class="card-info">
              <span class="card-name">{{ card.name }}</span>
            </div>
            <button @click="removeReceivingCard(card)" class="remove-btn">
              <span class="remove-icon">×</span>
            </button>
          </div>
          
          <div v-if="selectedReceivingCards.length === 0" class="empty-state">
            <span class="empty-icon">🃏</span>
            <p>Nenhuma carta selecionada</p>
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <BaseButton @click="cancel" color="secondary" variant="outline">
        Cancelar
      </BaseButton>
      <BaseButton 
        @click="createTrade" 
        color="primary" 
        :disabled="!canCreateTrade"
        :loading="creating"
      >
        Criar Troca
      </BaseButton>
    </div>

    <!-- Modal de Seleção de Cartas -->
    <BaseModal :model-value="!!showCardSelector" @update:model-value="showCardSelector = false" size="lg">
      <div class="card-selector-modal">
        <div class="modal-header">
          <h3>Selecionar Cartas</h3>
          <SearchInput
            v-model="searchTerm"
            placeholder="Buscar cartas..."
          />
        </div>
        
        <div class="cards-grid">
          <div 
            v-for="card in filteredCards" 
            :key="card.id"
            class="card-item"
            @click="selectCard(card)"
          >
            <img :src="card.imageUrl" :alt="card.name" />
            <div class="card-info">
              <span class="card-name">{{ card.name }}</span>
              <span class="card-description">{{ card.description }}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <BaseButton @click="showCardSelector = false" color="secondary" variant="outline">
            Fechar
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCardsStore } from '../../../stores/cards';
import { useTradesStore } from '../../../stores/trades';
import { useNotificationStore } from '../../../stores/notification';
import BaseButton from '../../common/BaseButton.vue';
import BaseModal from '../../common/BaseModal.vue';
import SearchInput from '../../common/SearchInput.vue';
import type { Card } from '../../../types';

interface Emits {
  (e: 'success'): void;
  (e: 'cancel'): void;
}

const emit = defineEmits<Emits>();

const cardsStore = useCardsStore();
const tradesStore = useTradesStore();
const notification = useNotificationStore();

const selectedOfferingCards = ref<Card[]>([]);
const selectedReceivingCards = ref<Card[]>([]);
const showCardSelector = ref<'offering' | 'receiving' | false>(false);
const searchTerm = ref('');
const creating = ref(false);

const filteredCards = computed(() => {
  if (!searchTerm.value) return cardsStore.allCards;
  
  const term = searchTerm.value.toLowerCase();
  return cardsStore.allCards.filter((card: Card) => 
    card.name.toLowerCase().includes(term) ||
    card.description.toLowerCase().includes(term)
  );
});

const canCreateTrade = computed(() => {
  return selectedOfferingCards.value.length > 0 && selectedReceivingCards.value.length > 0;
});

function selectCard(card: Card) {
  if (showCardSelector.value === 'offering') {
    if (!selectedOfferingCards.value.find(c => c.id === card.id)) {
      selectedOfferingCards.value.push(card);
}
  } else if (showCardSelector.value === 'receiving') {
    if (!selectedReceivingCards.value.find(c => c.id === card.id)) {
      selectedReceivingCards.value.push(card);
    }
  }
  showCardSelector.value = false;
}

function removeOfferingCard(card: Card) {
  const index = selectedOfferingCards.value.findIndex(c => c.id === card.id);
  if (index > -1) {
    selectedOfferingCards.value.splice(index, 1);
}
}

function removeReceivingCard(card: Card) {
  const index = selectedReceivingCards.value.findIndex(c => c.id === card.id);
  if (index > -1) {
    selectedReceivingCards.value.splice(index, 1);
  }
}

async function createTrade() {
  if (!canCreateTrade.value) return;
  
  creating.value = true;
  try {
    const tradeData = {
      cards: [
        ...selectedOfferingCards.value.map(card => ({
          cardId: card.id,
          type: 'OFFERING' as const
        })),
        ...selectedReceivingCards.value.map(card => ({
          cardId: card.id,
          type: 'RECEIVING' as const
        }))
      ]
    };

    await tradesStore.createTrade(tradeData);
    emit('success');
  } catch (err: any) {
    notification.show(
      err.message || 'Erro ao criar troca',
      'error'
    );
  } finally {
    creating.value = false;
  }
}

function cancel() {
  emit('cancel');
}
</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.create-trade-form {
  .form-sections {
    display: grid;
    gap: 24px;
    margin-bottom: 24px;

    .section {
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 {
          margin: 0;
          color: $black;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;

          .section-icon {
            font-size: 20px;
          }
        }

        .btn-icon {
          font-size: 16px;
          font-weight: bold;
        }
      }

      .selected-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
        min-height: 120px;

        .selected-card {
          position: relative;
          background: $gray-50;
          border: 2px solid $gray-200;
          border-radius: 12px;
          padding: 12px;
          transition: all 0.3s ease;

          &:hover {
            border-color: $primary;
            background: $gray-100;
          }

          img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 8px;
          }

          .card-info {
            .card-name {
              font-size: 14px;
              font-weight: 600;
      color: $black;
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .remove-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: $error;
            color: $white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;

            &:hover {
              background: color-mix(in srgb, $error 90%, black);
              transform: scale(1.1);
            }
          }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          border: 2px dashed $gray-300;
          border-radius: 12px;
          color: $gray-500;

          .empty-icon {
            font-size: 32px;
            margin-bottom: 8px;
    }

    p {
      margin: 0;
            font-size: 14px;
          }
        }
      }
    }
  }

  .form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding-top: 24px;
    border-top: 1px solid $gray-200;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }
      }

.card-selector-modal {
  padding: 24px;

  .modal-header {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 16px 0;
      color: $black;
      font-size: 20px;
      font-weight: 600;
    }

    .search-input {
      border-radius: 12px;
      border: 2px solid $gray-200;

      &:focus-within {
        border-color: $primary;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }

      .search-icon {
        font-size: 16px;
        color: $gray-500;
      }
      }
    }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 24px;

    .card-item {
      background: $white;
      border: 2px solid $gray-200;
      border-radius: 12px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: $primary;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($primary, 0.2);
      }

      img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 8px;
      }

      .card-info {
        .card-name {
          font-size: 14px;
          font-weight: 600;
          color: $black;
          display: block;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
    }

        .card-description {
          font-size: 12px;
          color: $gray-600;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.3;
        }
      }
    }
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style> 
