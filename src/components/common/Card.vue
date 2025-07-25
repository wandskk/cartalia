<template>
  <v-card 
    class="card" 
    :class="[
      `card-${size}`,
      `card-${variant}`,
      { 
        'card-selectable': selectable,
        'card-selected': selected,
        'card-clickable': clickable,
        'card-disabled': disabled
      }
    ]"
    @click="handleClick"
    :elevation="selected ? 8 : 2"
  >
    <div class="card-image position-relative">
      <v-img 
        :src="card.imageUrl" 
        :alt="card.name" 
        @error="handleImageError"
        :height="imageHeight"
        cover
        class="card-image-content"
      >
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <LoadingSpinner />
          </div>
        </template>
      </v-img>
      
      <div v-if="selectable" class="card-selection position-absolute top-2 left-2">
        <v-checkbox 
          :model-value="selected" 
          @update:model-value="handleSelection"
          @click.stop
          color="primary"
          hide-details
        />
      </div>

      <div v-if="loading" class="card-loading-overlay position-absolute top-0 left-0 right-0 bottom-0 d-flex align-center justify-center">
        <LoadingSpinner size="32" />
      </div>
    </div>

    <v-card-text class="pa-3">
      <div class="card-header">
        <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ formattedName }}</h3>
      </div>
      
      <p v-if="showDescription" class="text-body-2 text-grey mb-3">
        {{ formattedDescription }}
      </p>

      <div v-if="showActions && $slots.actions" class="card-actions">
        <slot name="actions" :card="card" />
      </div>
    </v-card-text>

    <slot name="overlay" :card="card" />
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';
import { textFormatters } from '../../utils/formatters';
import type { Card as CardType } from '../../types';

interface Props {
  card: CardType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
  selectable?: boolean;
  selected?: boolean;
  clickable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  showDescription?: boolean;
  showActions?: boolean;
  maxDescriptionLength?: number;
}

interface Emits {
  (e: 'click', card: CardType): void;
  (e: 'select', card: CardType, selected: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default',
  selectable: false,
  selected: false,
  clickable: false,
  loading: false,
  disabled: false,
  showDescription: true,
  showActions: false,
  maxDescriptionLength: 100
});

const emit = defineEmits<Emits>();

const imageHeight = computed(() => {
  switch (props.size) {
    case 'sm': return 120;
    case 'lg': return 300;
    default: return 200;
  }
});

const formattedName = computed(() => {
  return textFormatters.capitalize(props.card.name);
});

const formattedDescription = computed(() => {
  if (!props.showDescription) return '';
  
  const description = props.card.description;
  return textFormatters.truncate(description, props.maxDescriptionLength);
});

function handleClick() {
  if (props.disabled || props.loading) return;
  
  if (props.clickable) {
    emit('click', props.card);
  }
}

function handleSelection(selected: boolean) {
  emit('select', props.card, selected);
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-card.jpg';
}
</script>

<style scoped>
.card {
  transition: all 0.3s ease;
  cursor: default;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.card-selectable {
  cursor: pointer;
}

.card-selected {
  border: 2px solid rgb(var(--v-theme-primary)) !important;
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

.card-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card-disabled:hover {
  transform: none !important;
}

.card-image {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.card-loading-overlay {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
}

.card-selection {
  z-index: 2;
}

/* Size variants */
.card-sm .card-image-content {
  height: 120px !important;
}

.card-md .card-image-content {
  height: 200px !important;
}

.card-lg .card-image-content {
  height: 300px !important;
}

/* Variant styles */
.card-compact .v-card-text {
  padding: 12px !important;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-compact .text-subtitle-1 {
  font-size: 14px !important;
  margin-bottom: 8px !important;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 2.4em;
}

.card-compact .text-body-2 {
  font-size: 12px !important;
  margin-bottom: 12px !important;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* Default variant styles */
.card .v-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card .text-subtitle-1 {
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 2.4em;
}

.card .text-body-2 {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style> 
