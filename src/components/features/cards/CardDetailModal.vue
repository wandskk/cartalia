<template>
  <BaseModal
    v-model="isOpen"
    :title="card?.name || 'Detalhes da Carta'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="card" class="card-detail-modal">
      <div class="card-image-section">
        <div class="card-image-container">
          <img 
            :src="card.imageUrl" 
            :alt="card.name" 
            @error="handleImageError"
            class="card-image"
          />
        </div>
      </div>

      <div class="card-info-section">
        <div class="card-header">
          <h3 class="card-name">{{ card.name }}</h3>
        </div>

        <div class="card-description">
          <h4>Descrição</h4>
          <p>{{ card.description }}</p>
        </div>

        <div class="card-metadata">
          <div class="metadata-item">
            <span class="metadata-label">ID:</span>
            <span class="metadata-value">{{ card.id }}</span>
          </div>

        </div>
      </div>
    </div>

    <div v-else-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando detalhes da carta...</p>
    </div>

    <div v-else class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Carta não encontrada</h3>
      <p>A carta solicitada não foi encontrada ou não existe.</p>
    </div>


  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCardsStore } from '../../../stores/cards';
import BaseModal from '../../common/BaseModal.vue';
import type { Card } from '../../../types';

interface Props {
  modelValue: boolean;
  cardId?: string;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const cardsStore = useCardsStore();
const loading = ref(false);
const card = ref<Card | null>(null);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});



watch(() => props.cardId, async (newCardId) => {
  if (newCardId && isOpen.value) {
    await fetchCardDetails(newCardId);
  }
});

watch(() => isOpen.value, async (isOpen) => {
  if (isOpen && props.cardId) {
    await fetchCardDetails(props.cardId);
  } else {
    card.value = null;
  }
});

async function fetchCardDetails(cardId: string) {
  loading.value = true;
  try {
    await cardsStore.fetchCardById(cardId);
    card.value = cardsStore.selectedCard;
  } catch (error) {
    console.error('Erro ao buscar detalhes da carta:', error);
    card.value = null;
  } finally {
    loading.value = false;
  }
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-card.jpg';
}


</script>

<style scoped lang="scss">
@use '../../../styles/_variables.scss' as *;

.card-detail-modal {
  .card-image-section {
    margin-bottom: 24px;
    text-align: center;

    .card-image-container {
      display: inline-block;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

      .card-image {
        width: 300px;
        height: 400px;
        object-fit: cover;
        display: block;
      }
    }
  }

  .card-info-section {
    .card-header {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid $gray-200;

      .card-name {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 700;
        color: $black;
        line-height: 1.2;
      }


    }

    .card-description {
      margin-bottom: 24px;

      h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: $black;
      }

      p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: $gray-700;
      }
    }

    .card-metadata {
      background: $gray-50;
      border-radius: 8px;
      padding: 16px;

      .metadata-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }

        .metadata-label {
          font-size: 14px;
          font-weight: 500;
          color: $gray-600;
        }

        .metadata-value {
          font-size: 14px;
          color: $black;
          font-family: monospace;
          background: $white;
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid $gray-200;
        }
      }
    }
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: $gray-600;

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid $gray-200;
    border-top: 3px solid $primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  p {
    margin: 0;
    font-size: 14px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}

.error-state {
  text-align: center;
  padding: 60px 20px;
  color: $gray-600;

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: $black;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .card-detail-modal {
    .card-image-section {
      .card-image-container {
        .card-image {
          width: 250px;
          height: 350px;
        }
      }
    }

    .card-info-section {
      .card-header {
        .card-name {
          font-size: 20px;
        }
      }
    }
  }
}
</style> 