<template>
  <BaseModal
    v-model="isOpen"
    :title="modalTitle"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="card" class="card-detail-modal">
      <div class="d-flex flex-column flex-md-row align-start ga-8">
        <!-- Imagem da Carta -->
        <div class="card-image-section d-flex justify-center">
          <v-img
            :src="card.imageUrl"
            :alt="card.name"
            width="320"
            height="448"
            class="rounded-lg elevation-3"
            @error="handleImageError"
            cover
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <LoadingSpinner />
              </div>
            </template>
          </v-img>
        </div>
        
        <!-- Informações da Carta -->
        <div class="card-info-section flex-grow-1 d-flex flex-column">
          <h3 class="text-h4 font-weight-bold mb-6 text-primary">{{ card.name }}</h3>
          
          <div class="mb-8">
            <h4 class="text-h6 font-weight-medium mb-4 text-grey-darken-1">Descrição</h4>
            <p class="text-body-1 text-grey-darken-2 line-height-1-6">{{ card.description }}</p>
          </div>
          
          <v-sheet color="grey-lighten-4" rounded="lg" class="pa-6 mt-auto">
            <div class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between ga-3">
              <span class="text-subtitle-2 font-weight-medium text-grey-darken-1">ID da Carta:</span>
              <v-chip 
                variant="outlined" 
                size="small" 
                class="font-mono text-caption"
                color="primary"
              >
                {{ card.id }}
              </v-chip>
            </div>
          </v-sheet>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="d-flex flex-column align-center justify-center py-15 text-grey">
      <LoadingSpinner size="large" class="mb-4" />
      <p class="text-body-1">Carregando detalhes da carta...</p>
    </div>

    <div v-else class="d-flex flex-column align-center justify-center py-15 text-center">
      <v-icon size="64" color="warning" class="mb-4">mdi-alert-circle</v-icon>
      <h3 class="text-h5 font-weight-bold mb-3">Carta não encontrada</h3>
      <p class="text-body-1 text-grey">A carta solicitada não foi encontrada ou não existe.</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCardsStore } from '../../../stores/cards';
import BaseModal from '../../common/BaseModal.vue';
import LoadingSpinner from '../../common/LoadingSpinner.vue';
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

const modalTitle = computed(() => {
  if (!card.value?.name) return 'Detalhes da Carta';
  
  // Limita o título a 50 caracteres para evitar quebra de layout
  const title = card.value.name;
  return title.length > 50 ? title.substring(0, 47) + '...' : title;
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

<style scoped>
.card-detail-modal {
  min-width: 320px;
  max-width: 100%;
}

.card-image-section {
  flex-shrink: 0;
}

.card-info-section {
  min-width: 0;
  flex: 1;
}

.line-height-1-6 {
  line-height: 1.6;
}

/* Responsividade para telas menores */
@media (max-width: 1024px) {
  .card-detail-modal {
    min-width: 280px;
  }
}

@media (max-width: 768px) {
  .card-detail-modal {
    min-width: 250px;
  }
  
  .card-image-section {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .card-detail-modal {
    min-width: 200px;
  }
}
</style> 