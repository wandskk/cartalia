<template>
  <BaseModal
    v-model="isOpen"
    :title="card?.name || 'Detalhes da Carta'"
    size="md"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div v-if="card" class="card-detail-modal">
      <div class="d-flex flex-column flex-md-row align-center mb-6">
        <div class="d-flex justify-center mb-4 mb-md-0 mr-md-6">
          <v-img
            :src="card.imageUrl"
            :alt="card.name"
            width="250"
            height="350"
            class="rounded-lg elevation-3"
            @error="handleImageError"
            cover
          />
        </div>
        <div class="flex-grow-1">
          <h3 class="text-h5 font-weight-bold mb-2">{{ card.name }}</h3>
          <div class="mb-4">
            <h4 class="text-subtitle-1 font-weight-medium mb-1">Descrição</h4>
            <p class="text-body-2 mb-0">{{ card.description }}</p>
          </div>
          <v-sheet color="grey-lighten-4" rounded="lg" class="pa-3">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-caption font-weight-medium text-grey">ID:</span>
              <span class="text-caption font-mono bg-white px-2 py-1 rounded border">{{ card.id }}</span>
            </div>
          </v-sheet>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="d-flex flex-column align-center justify-center py-10 text-grey">
      <v-progress-circular indeterminate color="primary" size="32" class="mb-4" />
      <p>Carregando detalhes da carta...</p>
    </div>

    <div v-else class="text-center py-10 text-grey">
      <div class="mb-4" style="font-size: 48px;">⚠️</div>
      <h3 class="mb-2 font-weight-bold">Carta não encontrada</h3>
      <p class="mb-0">A carta solicitada não foi encontrada ou não existe.</p>
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

<style scoped>
.card-detail-modal {
  min-width: 250px;
}
</style> 